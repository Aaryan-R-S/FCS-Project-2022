const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Expert = require('../models/Expert');
const Uploadeddoc = require('../models/Uploadeddoc');
const Claim = require('../models/Claim');
const Order = require('../models/Order');
const OTP = require('../models/OTP');
const Log = require('../models/Log');
const checkAuth = require('../middlewares/authorize');
const upload = require('../utils/uploadFile');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs')
const { promisify } = require('util');
const Medicine = require('../models/Medicine');
const Insurance = require('../models/Insurance');
const { sendMail } = require('../utils/sendMail');
const { pattern, pattern_empty } = require('../utils/regex');
const unlinkAsync = promisify(fs.unlink)
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// ROUTE 1: create a patient using: POST "/patient/addPatient"; No login required
router.post('/addPatient', upload, [
    body('healthid', 'Enter a valid healthid of length 10 with all numeric characters.').isLength({min:10, max:10}).isNumeric(),
    body('password', 'Enter a strong password of minimum length 8 with atleast one lowercase, one uppercase, one number and one symbol or special character.').isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        returnScore: false,
        pointsPerUnique: 1,
        pointsPerRepeat: 0.5,
        pointsForContainingLower: 10,
        pointsForContainingUpper: 10,
        pointsForContainingNumber: 10,
        pointsForContainingSymbol: 10,
      }),
      body('name','Enter a valid name of minimum length 3.').matches(pattern).isLength({min:3}),
      body('dob','Enter a valid date of birth.').isISO8601('yyyy-mm-dd'),
      body('address','Enter a valid address of minimum length 3.').matches(pattern).isLength({min:3}),
      body('email','Enter a valid email address.').isEmail(),
      body('phoneno','Enter a valid phone number.').isMobilePhone(),
      body('doctype','Enter a valid document type.').matches(pattern).isLength({min:3})
], async (req, res)=>{

    let verdict = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    
    if(req.file===undefined){
        return res.status(400).json({ verdict, messages: ["Bad Request! Only .jpg/.jpeg/.png/pdf/.txt/.doc/.docx files are allowed with size less than a mb."] });
    }

    try{
        // Check with the user with this username exist already
        let user = await Patient.findOne({healthid: req.body.healthid});
        if (user){ 
            await unlinkAsync(req.file.path);
            return res.status(400).json({ verdict, messages: ["Bad Request! A person with this health ID is already registered."]});
        }

        req.body.licensenos = [];

        await Uploadeddoc.create({
            healthid: req.body.healthid,
            licensenos: req.body.licensenos,
            documentid: req.file.path,
            doctype: req.body.doctype,
            suspicious: "no"
        })
        
        const salt = await bcrypt.genSalt(10);
        const secPwd = await bcrypt.hash(req.body.password, salt);

        // create a new user
        user = await Patient.create({
            healthid: req.body.healthid,
            password: secPwd,
            name: req.body.name,
            dob: req.body.dob,
            address: req.body.address,
            documentid: req.file.path,
            email: req.body.email,
            phoneno: req.body.phoneno,
            verificationstatus: "pending",
            wallet: 1000
        })
        
        const data = {
            id: user.id
        }
        
        const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        
        verdict = true;
        res.cookie("access_token", authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "prod",
            sameSite: 'strict'
          }).status(200).json({verdict, messages:["Success! You have signed up successfully."]});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 2: authenticate a patient using: POST "/patient/login"; No login required
router.post('/login', [
        body('healthid', 'Enter a valid healthid of minimum length 10 with all numeric characters.').isLength({min:10}).isNumeric(),
        body('password', 'Enter your password having minimum length 8.').isLength({min:8})
    ], async (req, res)=>{

    verdict = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {        
        return res.status(400).json({ verdict, messages: errors.array() });
    }

    const {healthid, password} = req.body;

    try{
        // Check with the user with this email exist already
        let user = await Patient.findOne({healthid});
        if (!user){ return res.status(400).json({verdict, messages: ["Authentication failed! Invalid username or password."]});}
        
        const passwordCompare = await bcrypt.compare(password, user.password);

        if(!passwordCompare){
            return res.status(400).json({verdict, messages: ["Authentication failed! Invalid username or password."]});
        }

        const data = {
            id: user.id
        }

        const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        verdict = true;
        res.cookie("access_token", authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "prod",
            sameSite: 'strict'
          }).status(200).json({verdict, messages:["Success! You have logged in successfully."]});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 3: get logged in patient details: POST "/patient/patientDetails"; Login required
router.post('/patientDetails', checkAuth, async (req, res)=>{
    verdict = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {        
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    try{
        const userId = req.userId;
        let user = await Patient.findById(userId).select("-password");
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
    
        verdict = true;
        res.status(200).json({verdict, messages:["Success! User details fetched."], "data":user});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 4: delete a patient using: POST "/patient/deletePatient"; Login required
router.post('/deletePatient', checkAuth, async (req, res)=>{
    verdict = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {        
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    try{
        const userId = req.userId;
        let user = await Patient.findById(userId);
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}

        user = await Patient.findByIdAndDelete(user._id);
        let healthid = user.healthid;

        let allMatches = await Uploadeddoc.find({healthid});
        for (let i = 0; i < allMatches.length; i++) {
            const e = allMatches[i];
            await Uploadeddoc.findByIdAndDelete(e._id);
            await unlinkAsync(e.documentid);
        }
        allMatches = await Claim.find({healthid});
        for (let i = 0; i < allMatches.length; i++) {
            const e = allMatches[i];
            await Claim.findByIdAndDelete(e._id);
            await unlinkAsync(e.documentid);
        }
        allMatches = await Order.find({healthid});
        for (let i = 0; i < allMatches.length; i++) {
            const e = allMatches[i];
            await Order.findByIdAndDelete(e._id);
            await unlinkAsync(e.documentid);
        }
        allMatches = await OTP.find({healthid});
        for (let i = 0; i < allMatches.length; i++) {
            const e = allMatches[i];
            await OTP.findByIdAndDelete(e._id);
        }

        verdict = true;
        res.clearCookie("access_token").status(200).json({verdict, messages:["Success! User removed successfully."]});
    }
    catch(error){        
        console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 5: logout patient: POST "/patient/logout"; Login required
router.post('/logout', checkAuth, async (req, res)=>{
    verdict = false;

    try{
        const userId = req.userId;
        let user = await Patient.findById(userId);
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}

        verdict = true;
        return res.clearCookie("access_token").status(200).json({verdict, messages:["Success! You have logged out successfully."]});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 6: modify logged in patient details: POST "/patient/modifyDetails"; Login required
router.post('/modifyDetails',[
    body('password', 'Enter a strong password of minimum length 8 with atleast one lowercase, one uppercase, one number and one symbol or special character.').isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        returnScore: false,
        pointsPerUnique: 1,
        pointsPerRepeat: 0.5,
        pointsForContainingLower: 10,
        pointsForContainingUpper: 10,
        pointsForContainingNumber: 10,
        pointsForContainingSymbol: 10,
      }),
      body('name','Enter a valid name of minimum length 3.').matches(pattern).isLength({min:3}),
      body('dob','Enter a valid date of birth.').isISO8601('yyyy-mm-dd'),
      body('address','Enter a valid address of minimum length 3.').matches(pattern).isLength({min:3}),
      body('email','Enter a valid email address.').isEmail(),
      body('phoneno','Enter a valid phone number.').isMobilePhone(),
], checkAuth, async (req, res)=>{
    verdict = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {        
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    
    try{
        const userId = req.userId;
        let user = await Patient.findById(userId).select("-password");
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot edit profile, you are banned."]});}
    
        const salt = await bcrypt.genSalt(10);
        const secPwd = await bcrypt.hash(req.body.password, salt);

        // create a new user
        user = await Patient.findByIdAndUpdate(userId, {
            password: secPwd,
            name: req.body.name,
            dob: req.body.dob,
            address: req.body.address,
            email: req.body.email,
            phoneno: req.body.phoneno
        })
        
        const data = {
            id: user.id
        }
        
        const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        
        verdict = true;
        res.cookie("access_token", authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "prod",
            sameSite: 'strict'
          }).status(200).json({verdict, messages:["Success! User details modified."]});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 7: verify a patient again using: POST "/patient/verifyPatientAgain"; Login required
router.post('/verifyPatientAgain', upload, [
    body('healthid', 'Enter a valid healthid of minimum length 10 with all numeric characters.').isLength({min:10}).isNumeric(),
], checkAuth, async (req, res)=>{
    let verdict = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    
    if(req.file===undefined){
        return res.status(400).json({ verdict, messages: ["Bad Request! Only .jpg/.jpeg/.png/pdf/.txt/.doc/.docx files are allowed with size less than a mb."] });
    }

    try{
        // Check with the user with this username exist already
        let user = await Patient.findById(req.userId);
        if(!user){ 
            await unlinkAsync(req.file.path);
            return res.status(404).json({verdict, messages:["Not found! User not found."]});
        }
        if(user.verificationstatus!='failure' || user.healthid!=req.body.healthid){ 
            await unlinkAsync(req.file.path);
            return res.status(403).json({verdict, messages:["Bad request! Cannot apply for verification again."]});
        }

        req.body.licensenos = [];

        await Uploadeddoc.create({
            healthid: req.body.healthid,
            licensenos: req.body.licensenos,
            documentid: req.file.path,
            doctype: 'healthid',
            suspicious: "no"
        });

        let doc = await Uploadeddoc.findOneAndDelete({
            documentid: user.documentid
        });
        await unlinkAsync(doc.documentid);


        user = await Patient.findByIdAndUpdate(user.id, {
            documentid: req.file.path,
            verificationstatus: "pending"
        });
        
        verdict = true;
        res.status(200).json({verdict, messages:["Success! You have applied for verification successfully."]});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 8: filter expert by (who, name, location): POST "/patient/filterExperts"; Login required
router.post('/filterExperts', [
    body('who','Enter a valid expert type.').matches(pattern_empty),
    body('name','Enter a valid expert name.').matches(pattern_empty),
    body('location','Enter a valid expert location.').matches(pattern_empty)
], checkAuth, async (req, res)=>{
    verdict = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {        
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    try{
        const userId = req.userId;
        let user = await Patient.findById(userId).select("-password");
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending'){ return res.status(403).json({verdict, messages:["Bad request! Cannot list experts, you are not verified yet."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot list experts, you are banned."]});}

        let experts = await Expert.find({
            $or: [
                {who: req.body.who}, 
                {name: req.body.name}, 
                {location: req.body.location}
            ]
        }).select(["-password","-signatures","-documentid","-verificationstatus","-wallet"]);
        verdict = true;
        res.status(200).json({verdict, messages:["Success! Queried experts fetched."], experts});
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 9: list user docs (except healthid): POST "/patient/listDocs"; Login required
router.post('/listDocs', checkAuth, async (req, res)=>{
    verdict = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {        
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    try{
        const userId = req.userId;
        let user = await Patient.findById(userId).select("-password");
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending'){ return res.status(403).json({verdict, messages:["Bad request! Cannot list docs, you are not verified yet."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot list docs, you are banned."]});}

        let docs = await Uploadeddoc.find({
            $and: [
                {healthid: user.healthid}, 
                {doctype: {$ne:"healthid"} }
            ]
        }).select(["-suspicious"]);
        verdict = true;
        res.status(200).json({verdict, messages:["Success! User documents fetched."], docs});
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 10: delete patient's doc using: POST "/patient/deleteDoc"; Login required
router.post('/deleteDoc', [
    body('documentid', 'Enter a valid document id of minimum length 10.').matches(pattern).isLength({min:10}),
], checkAuth, async (req, res)=>{
    let verdict = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    
    try{
        // Check with the user with this username exist already
        let user = await Patient.findById(req.userId);
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending'){ return res.status(403).json({verdict, messages:["Bad request! Cannot delete doc, you are not verified yet."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot delete doc, you are banned."]});}

        let doc = await Uploadeddoc.findOneAndDelete({
            documentid: req.body.documentid
        });
        await unlinkAsync(doc.documentid);
        
        verdict = true;
        res.status(200).json({verdict, messages:["Success! Document deleted successfully."]});
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 11: upload a document using: POST "/patient/uploadDoc"; Login required
router.post('/uploadDoc', upload, [
    body('healthid', 'Enter a valid healthid of minimum length 10 with all numeric characters.').isLength({min:10}).isNumeric(),
    body('doctype','Enter a valid document type.').matches(pattern).isLength({min:3})
], checkAuth, async (req, res)=>{
    let verdict = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    
    if(req.file===undefined){
        return res.status(400).json({ verdict, messages: ["Bad Request! Only .jpg/.jpeg/.png/pdf/.txt/.doc/.docx files are allowed with size less than a mb."] });
    }

    try{
        // Check with the user with this username exist already
        let user = await Patient.findById(req.userId);
        if(!user){ 
            await unlinkAsync(req.file.path);
            return res.status(404).json({verdict, messages:["Not found! User not found."]});
        }
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending' || user.healthid!=req.body.healthid){ 
            await unlinkAsync(req.file.path);
            return res.status(403).json({verdict, messages:["Bad request! Cannot upload doc, you are not verified yet."]});
        }
        if(user.verificationstatus=='banned'){ 
            await unlinkAsync(req.file.path);
            return res.status(403).json({verdict, messages:["Bad request! Cannot upload doc, you are banned."]});
        }

        
        req.body.licensenos = [];
        
        await Uploadeddoc.create({
            healthid: req.body.healthid,
            licensenos: req.body.licensenos,
            documentid: req.file.path,
            doctype: req.body.doctype,
            suspicious: "no"
        });

        let docs = await Uploadeddoc.find({
            $and: [
                {healthid: user.healthid}, 
                {doctype: {$ne:"healthid"} }
            ]
        }).select(["-suspicious"]);
        
        let limit_exceeded = (docs.length > 2 ? true : false);

        if(limit_exceeded){
            await Patient.findByIdAndUpdate(user.id, {verificationstatus: 'banned'});
            return res.status(200).json({verdict, messages:["Failure! You have exceeded the upper limit of 2 file uploads, so you are banned now."]});
        }

        verdict = true;
        res.status(200).json({verdict, messages:["Success! You have uploaded the doc successfully."], uploadsLeft:2-docs.length});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 12: share patient's doc using: POST "/patient/shareDoc"; Login required
router.post('/shareDoc', [
    body('licenseno', 'Enter a valid licenseno of length 10 with all numeric characters.').isLength({min:10, max:10}).isNumeric(),
    body('documentid', 'Enter a valid document id of minimum length 10.').matches(pattern).isLength({min:10})
], checkAuth, async (req, res)=>{
    let verdict = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    
    try{
        // Check with the user with this username exist already
        let user = await Patient.findById(req.userId);
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending'){ return res.status(403).json({verdict, messages:["Bad request! Cannot share doc, you are not verified yet."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot share doc, you are banned."]});}

        let expert = Expert.find({licenseno: req.body.licenseno})
        if(!expert){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}

        let doc = await Uploadeddoc.findOneAndUpdate({
            documentid: req.body.documentid
        }, { $push: { licensenos: req.body.licenseno } });
        
        verdict = true;
        res.status(200).json({verdict, messages:["Success! Document shared successfully."]});
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 13: list medicines: POST "/patient/listMedicines"; Login required
router.post('/listMedicines', checkAuth, async (req, res)=>{
    verdict = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {        
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    try{
        const userId = req.userId;
        let user = await Patient.findById(userId).select("-password");
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending'){ return res.status(403).json({verdict, messages:["Bad request! Cannot list medicines, you are not verified yet."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot list medicines, you are banned."]});}

        let med = await Medicine.find();

        verdict = true;
        res.status(200).json({verdict, messages:["Success! All medicines listed successfully."], medicines:med});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 14: make medicine order requst: POST "/patient/requestMedicine"; Login required
router.post('/requestMedicine',[    
    body('medicine','Enter a valid medicine name of minimum length 3.').matches(pattern).isLength({min:3}),
    body('documentid', 'Enter a valid document id of minimum length 10.').matches(pattern).isLength({min:10})
], checkAuth, async (req, res)=>{
    verdict = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {        
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    try{
        const userId = req.userId;
        let user = await Patient.findById(userId).select("-password");
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending'){ return res.status(403).json({verdict, messages:["Bad request! Cannot buy medicine, you are not verified yet."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot buy medicine, you are banned."]});}

        let doc = await Uploadeddoc.findOne({documentid: req.body.documentid})
        if(!doc){ return res.status(404).json({verdict, messages:["Not found! Prescription attached not found."]});}
        if(doc.doctype!='prescription'){ return res.status(400).json({verdict, messages:["Bad request! Method not allowed."]});}

        let med = await Medicine.findOne({name: req.body.medicine})
        if(!med){ return res.status(404).json({verdict, messages:["Not found! Medicine not found."]});}

        await Order.create({
            healthid: user.healthid,
            licenseno: med.licenseno,
            medicineid: req.body.medicine,
            prescriptionid: req.body.documentid,
            documentid: "null",
            status: 'requested'
        });

        verdict = true;
        res.status(200).json({verdict, messages:["Success! You have requested for a medicine purchase successfully."]});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 15: list billed order using: POST "/patient/listBilledOrder"; Login required
router.post('/listBilledOrders', checkAuth, async (req, res)=>{
    let verdict = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    
    try{
        // Check with the user with this username exist already
        let user = await Patient.findById(req.userId);
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending'){ return res.status(403).json({verdict, messages:["Bad request! Cannot list billed orders, you are not verified yet."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot list billed orders, you are banned."]});}
        
        let orders = [];
        let allOrders = await Order.find({healthid: user.healthid});
        for (let idx = 0; idx < allOrders.length; idx++) {
            const o = allOrders[idx];
            if(o.status == 'billed'){
                orders.push(o);
            }
        }
        
        verdict = true;
        res.status(200).json({verdict, messages:["Success! Billed orders listed successfully."], orders});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 16: pay patient's medicine order using: POST "/patient/payBilledOrder"; Login required
router.post('/payBilledOrder', [
    body('orderid', 'Enter a valid order id of minimum length 3.').matches(pattern).isLength({min:3}),
    body('otp','Enter a valid OTP of length 8.').matches(pattern).isLength({min:8, max:8})
], checkAuth, async (req, res)=>{
    let verdict = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    
    try{
        // Check with the user with this username exist already
        let user = await Patient.findById(req.userId);
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending'){ return res.status(403).json({verdict, messages:["Bad request! Cannot pay the billed order, you are not verified yet."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot pay the billed order, you are banned."]});}

        let order = await Order.findById(req.body.orderid);
        
        if(!order || order.healthid != user.healthid){
            return res.status(403).json({verdict, messages:["Bad request! Cannot pay the billed order, you have no access to it."]});
        }

        let med = await Medicine.findOne({name: order.medicineid});
        if(user.wallet < med.price){
            return res.status(400).json({verdict, messages:["Bad request! Cannot pay the billed order, you do not have enough funds in your wallet."]});
        }

        let pharm = await Expert.findOne({licenseno: med.licenseno});
        if(!pharm){ return res.status(404).json({verdict, messages:["Not found! Pharmacy not found."]});}

        
        let otp = await OTP.findOne({pin: req.body.otp});
        if(!otp){ return res.status(404).json({verdict, messages:["Not found! OTP not found."]});}

        if(otp.licenseno!=order.licenseno || otp.healthid!=user.healthid){
            return res.status(400).json({verdict, messages:["Bad request! Invalid OTP provided."]});
        }

        await OTP.findOneAndDelete({pin: req.body.otp});

        user.wallet -= med.price;
        pharm.wallet += med.price;
        user.save();
        pharm.save();

        await Log.create({
            details: `${user.name} paid ${pharm.name} an amount of ${med.price} for purchase of medicine.`
        });

        order = await Order.findByIdAndUpdate(req.body.orderid, {$set: {status: "paid"}});
        
        verdict = true;
        res.status(200).json({verdict, messages:["Success! Billed order paid successfully."]});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 17: request health insurance using: POST "/patient/requestInsurance"; Login required
router.post('/requestInsurance',[    
    body('licenseno', 'Enter a valid licenseno of length 10 with all numeric characters.').isLength({min:10, max:10}).isNumeric(),
    body('amount', 'Enter a valid price').isNumeric({min:1}),
], checkAuth, async (req, res)=>{
    verdict = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {        
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    try{
        const userId = req.userId;
        let user = await Patient.findById(userId).select("-password");
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending'){ return res.status(403).json({verdict, messages:["Bad request! Cannot apply for insurance, you are not verified yet."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot apply for insurance, you are banned."]});}

        let insuranceFirm = await Expert.findOne({licenseno: req.body.licenseno});
        if(insuranceFirm.who!='insurancefirm'){ return res.status(403).json({verdict, messages:["Bad request! Method not allowed."]});}

        if(user.wallet<req.body.amount){ return res.status(403).json({verdict, messages:["Bad request! You do not have enough funds to apply for insurance."]});}

        let insurance = await Insurance.findOne({healthid: user.healthid, licenseno: req.body.licenseno})
        if(insurance){ return res.status(403).json({verdict, messages:["Bad request! Method not allowed, you already have an existing insurance with this firm."]}); }

        await Insurance.create({
            healthid: user.healthid,
            licenseno: req.body.licenseno,
            amountLeft: req.body.amount,
            status: 'pending'
        });

        verdict = true;
        res.status(200).json({verdict, messages:["Success! You have applied for a medical insurance successfully."]});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 18: list all insurance schemes using: POST "/patient/listInsurances"; Login required
router.post('/listInsurances', checkAuth, async (req, res)=>{
    let verdict = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    
    try{
        // Check with the user with this username exist already
        let user = await Patient.findById(req.userId);
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending'){ return res.status(403).json({verdict, messages:["Bad request! Cannot list insurances, you are not verified yet."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot list insurances, you are banned."]});}
        
        let insurances = [];
        let allInsurances = await Insurance.find({healthid: user.healthid});
        for (let idx = 0; idx < allInsurances.length; idx++) {
            const o = allInsurances[idx];
            if(o.status=='approved'){
                insurances.push(o);
            }
        }
        
        verdict = true;
        res.status(200).json({verdict, messages:["Success! Insurances listed successfully."], insurances});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 19: make insurance claim: POST "/patient/makeInsuranceClaim"; Login required
router.post('/makeInsuranceClaim',[
    body('licenseno', 'Enter a valid licenseno of length 10 with all numeric characters.').isLength({min:10, max:10}).isNumeric(),
    body('documentid', 'Enter a valid document id of minimum length 10.').matches(pattern).isLength({min:10})
], checkAuth, async (req, res)=>{
    verdict = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {        
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    try{
        const userId = req.userId;
        let user = await Patient.findById(userId).select("-password");
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending'){ return res.status(403).json({verdict, messages:["Bad request! Cannot make insurance claim, you are not verified yet."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot make insurance claim, you are banned."]});}

        let doc = await Uploadeddoc.findOne({documentid: req.body.documentid})
        if(!doc){ return res.status(404).json({verdict, messages:["Not found! Bill attached not found."]});}
        if(doc.doctype!='bill'){ return res.status(404).json({verdict, messages:["Bad request! Method not allowed."]});}

        let insurance = await Insurance.findOne({healthid: user.healthid, licenseno: req.body.licenseno});
        if(!insurance || insurance.status!='approved'){ return res.status(404).json({verdict, messages:["Not found! Insurance not found."]});}

        await Claim.create({
            healthid: user.healthid,
            licenseno: req.body.licenseno,
            documentid: req.body.documentid,
            status: 'pending'
        });

        verdict = true;
        res.status(200).json({verdict, messages:["Success! You have applied for insurance claim successfully."]});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 20: get OTP mail: POST "/patient/sendOTPMail"; Login required
router.post('/sendOTPMail', [
    body('licenseno', 'Enter a valid licenseno of length 10 with all numeric characters.').isLength({min:10, max:10}).isNumeric(),
], checkAuth, async (req, res)=>{
    let verdict = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    
    try{
        // Check with the user with this username exist already
        let user = await Patient.findById(req.userId);
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending'){ return res.status(403).json({verdict, messages:["Bad request! Cannot send OTP over mail, you are not verified yet."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot send OTP over mail, you are banned."]});}

        let otpex = await OTP.findOne({licenseno: req.body.licenseno, healthid: user.healthid});
        if(otpex){ 
            await OTP.findOneAndDelete({licenseno: req.body.licenseno, healthid: user.healthid});
        }

        let purpose = "payment";
        let otp = crypto.randomInt(10000000, 100000000);
        sendMail(user.email, otp, purpose);
        
        await OTP.create({
            healthid: user.healthid,
            licenseno: req.body.licenseno,
            pin: otp
        });
        
        verdict = true;
        res.status(200).json({verdict, messages:["Success! OTP for the transaction has been mailed successfully."]});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

module.exports = router;