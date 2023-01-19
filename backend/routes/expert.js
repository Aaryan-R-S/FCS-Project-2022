const express = require('express');
const router = express.Router();
const Expert = require('../models/Expert');
const Uploadeddoc = require('../models/Uploadeddoc');
const Claim = require('../models/Claim');
const Medicine = require('../models/Medicine');
const Order = require('../models/Order');
const OTP = require('../models/OTP');
const checkAuth = require('../middlewares/authorize');
const upload = require('../utils/uploadFile');
const uploadi = require('../utils/uploadFileImage');
// const uploads = require('../utils/uploadFiles');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const Patient = require('../models/Patient');
const Insurance = require('../models/Insurance');
const Log = require('../models/Log');
const { sendMail } = require('../utils/sendMail');
const { pattern } = require('../utils/regex');
const blockChain = require('..');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// ROUTE 1: create an expert using: POST "/expert/addExpert"; No login required
router.post('/addExpert', upload, [
    body('licenseno', 'Enter a valid licenseno of length 10 with all numeric characters.').isLength({min:10, max:10}).isNumeric(),
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
      body('who','Enter a valid expert type.').matches(pattern).isLength({min:3}),
      body('name','Enter a valid name of minimum length 3.').matches(pattern).isLength({min:3}),
      body('dob','Enter a valid date of birth.').isISO8601('yyyy-mm-dd'),
      body('location','Enter a valid location of minimum length 3.').matches(pattern).isLength({min:3}),
    body('description','Enter a valid description of minimum length 100.').matches(pattern).isLength({min:100}),
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
        let user = await Expert.findOne({licenseno: req.body.licenseno});
        if (user){ 
            await unlinkAsync(req.file.path);
            return res.status(400).json({ verdict, messages: ["Bad Request! An expert with this license no is already registered."]});
        }

        req.body.licensenos = [];
        req.body.signatures = [];

        await Uploadeddoc.create({
            healthid: req.body.licenseno,
            licensenos: req.body.licensenos,
            documentid: req.file.path,
            // documentid: req.files[0].path,
            doctype: req.body.doctype,
            suspicious: "no"
        })

        let imgPathArr = []
        // for (let idx = 1; idx < req.files.length; idx++) {
        //     const pth = req.files[idx].path;
        //     imgPathArr.push(pth);
        //     await Uploadeddoc.create({
        //         healthid: req.body.licenseno,
        //         licensenos: req.body.licensenos,
        //         documentid: pth,
        //         doctype: 'view',
        //         suspicious: "no"
        //     })
        // }

        // Handle errors and use the generated key pair.
        const salt = await bcrypt.genSalt(10);
        const secPwd = await bcrypt.hash(req.body.password, salt);

        // create a new user
        user = await Expert.create({
            licenseno: req.body.licenseno,
            password: secPwd,
            signatures: req.body.signatures,
            who: req.body.who,
            name: req.body.name,
            dob: req.body.dob,
            location: req.body.location,
            images: imgPathArr,
            documentid: req.file.path,
            description: req.body.description,
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
        console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 1.0: upload image for added expert using: POST "/expert/uploadImage"; Login required
router.post('/uploadImage', uploadi, [
    body('licenseno', 'Enter a valid licenseno of length 10 with all numeric characters.').isLength({min:10, max:10}).isNumeric()
], async (req, res)=>{

    let verdict = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    
    if(req.file===undefined){
        return res.status(400).json({ verdict, messages: ["Bad Request! Only .jpg/.jpeg/.png files are allowed with size less than a mb."] });
    }

    try{
        // Check with the user with this username exist already
        let user = await Expert.findOne({licenseno: req.body.licenseno});
        if (!user){ 
            await unlinkAsync(req.file.path);
            return res.status(404).json({verdict, messages:["Not found! User not found."]});
        }
        if(user.images.length>=5){
            await unlinkAsync(req.file.path);
            return res.status(400).json({verdict, messages:["Bad Request! Exceeded upper limit of five images."]});
        }

        await Uploadeddoc.create({
            healthid: req.body.licenseno,
            licensenos: req.body.licensenos,
            documentid: req.file.path,
            // documentid: req.files[0].path,
            doctype: "view",
            suspicious: "no"
        })

        user.images = [...user.images, req.file.path];
        user.save();

        verdict = true;
        res.status(200).json({verdict, messages:["Success! Image uploaded successfully."]});

    }
    catch(error){
        console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 2: authenticate an expert using: POST "/expert/login"; No login required
router.post('/login', [
        body('licenseno', 'Enter a valid licenseno of minimum length 10 with all numeric characters.').isLength({min:10}).isNumeric(),
        body('password', 'Enter your password having minimum length 8.').isLength({min:8})
    ], async (req, res)=>{

    verdict = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {        
        return res.status(400).json({ verdict, messages: errors.array() });
    }

    const {licenseno, password} = req.body;

    try{
        // Check with the user with this email exist already
        let user = await Expert.findOne({licenseno});
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

// ROUTE 3: Get logged in expert details: POST "/expert/expertDetails"; Login required
router.post('/expertDetails', checkAuth, async (req, res)=>{
    verdict = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {        
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    try{
        const userId = req.userId;
        let user = await Expert.findById(userId).select("-password");
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
    
        verdict = true;
        res.status(200).json({verdict, messages:["Success! User details fetched."], "data":user});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 4: delete an expert using: POST "/expert/deleteExpert"; Login required
router.post('/deleteExpert', checkAuth, async (req, res)=>{
    verdict = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {        
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    try{
        const userId = req.userId;
        let user = await Expert.findById(userId);
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}

        user = await Expert.findByIdAndDelete(user._id);
        let licenseno = user.licenseno;

        let allMatches = await Uploadeddoc.find({healthid:licenseno});
        for (let i = 0; i < allMatches.length; i++) {
            const e = allMatches[i];
            await Uploadeddoc.findByIdAndDelete(e._id);
            await unlinkAsync(e.documentid);
        }
        allMatches = await Claim.find({licenseno});
        for (let i = 0; i < allMatches.length; i++) {
            const e = allMatches[i];
            await Claim.findByIdAndDelete(e._id);
            await unlinkAsync(e.documentid);
        }
        allMatches = await Order.find({licenseno});
        for (let i = 0; i < allMatches.length; i++) {
            const e = allMatches[i];
            await Order.findByIdAndDelete(e._id);
            await unlinkAsync(e.documentid);
        }
        allMatches = await OTP.find({licenseno});
        for (let i = 0; i < allMatches.length; i++) {
            const e = allMatches[i];
            await OTP.findByIdAndDelete(e._id);
        }
        allMatches = await Medicine.find({licenseno});
        for (let i = 0; i < allMatches.length; i++) {
            const e = allMatches[i];
            await Medicine.findByIdAndDelete(e._id);
        }

        verdict = true;
        res.clearCookie("access_token").status(200).json({verdict, messages:["Success! User removed successfully."]});
    }
    catch(error){        
        console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 5: Logout expert: POST "/expert/logout"; Login required
router.post('/logout', checkAuth, async (req, res)=>{
    verdict = false;

    try{
        const userId = req.userId;
        let user = await Expert.findById(userId);
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}

        verdict = true;
        return res.clearCookie("access_token").status(200).json({verdict, messages:["Success! You have logged out successfully."]});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 6: modify logged in expert details: POST "/expert/modifyDetails"; Login required
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
      body('name','Enter a valid name of minimum length 3.').isLength({min:3}),
      body('dob','Enter a valid date of birth.').isISO8601('yyyy-mm-dd'),
      body('location','Enter a valid location of minimum length 3.').isLength({min:3}),
      body('description','Enter a valid description of minimum length 100.').isLength({min:100}),
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
        let user = await Expert.findById(userId).select("-password");
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot edit profile, you are banned."]});}
    
        const salt = await bcrypt.genSalt(10);
        const secPwd = await bcrypt.hash(req.body.password, salt);

        // create a new user
        user = await Expert.findByIdAndUpdate(userId, {
            password: secPwd,
            name: req.body.name,
            dob: req.body.dob,
            location: req.body.location,
            description: req.body.description,
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

// ROUTE 7: verify an expert again using: POST "/expert/verifyExpertAgain"; login required
router.post('/verifyExpertAgain', upload, [
    body('licenseno', 'Enter a valid licenseno of minimum length 10 with all numeric characters.').isLength({min:10}).isNumeric(),
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
        let user = await Expert.findById(req.userId);
        if(!user){ 
            await unlinkAsync(req.file.path);
            return res.status(404).json({verdict, messages:["Not found! User not found."]});
        }
        if(user.verificationstatus!='failure' || user.licenseno!=req.body.licenseno){ 
            await unlinkAsync(req.file.path);
            return res.status(403).json({verdict, messages:["Bad request! Cannot apply for verification again."]});
        }

        req.body.licensenos = [];

        await Uploadeddoc.create({
            healthid: req.body.licenseno,
            licensenos: req.body.licensenos,
            documentid: req.file.path,
            doctype: 'licenseno',
            suspicious: "no"
        });

        let doc = await Uploadeddoc.findOneAndDelete({
            documentid: user.documentid
        });
        await unlinkAsync(doc.documentid);


        user = await Expert.findByIdAndUpdate(user.id, {
            documentid: req.file.path,
            verificationstatus: "pending"
        });
        
        verdict = true;
        res.status(200).json({verdict, messages:["Success! You have applied for verification successfully."]});
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 8: release a document using: POST "/expert/releaseDoc"; login required
router.post('/releaseDoc', upload, [
    body('healthid', 'Enter a valid healthid of length 10 with all numeric characters.').isLength({min:10, max:10}).isNumeric(),
    body('licenseno', 'Enter a valid licenseno of minimum length 10 with all numeric characters.').isLength({min:10}).isNumeric(),
    body('doctype','Enter a valid document type.').matches(pattern).isLength({min:3}),
    body('otp','Enter a valid OTP of length 8.').isLength({min:8, max:8}).isNumeric()
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
        let user = await Expert.findById(req.userId);
        let user1 = await Patient.findOne({healthid: req.body.healthid});
        if(!user || !user1){ 
            await unlinkAsync(req.file.path);
            return res.status(404).json({verdict, messages:["Not found! User not found."]});
        }
        if(user.verificationstatus!='success' || user1.verificationstatus!='success' || user.licenseno!=req.body.licenseno){ 
            await unlinkAsync(req.file.path);
            return res.status(403).json({verdict, messages:["Bad request! Cannot release document with this license no, get admin approval first."]});
        }

        let otp = await OTP.findOne({pin: req.body.otp});
        if(!otp){ 
            await unlinkAsync(req.file.path);
            return res.status(404).json({verdict, messages:["Not found! OTP not found."]});
        }

        if(otp.licenseno!=req.body.licenseno || otp.healthid!=req.body.healthid){
            await unlinkAsync(req.file.path);
            return res.status(400).json({verdict, messages:["Bad request! Invalid OTP provided."]});
        }

        await OTP.findOneAndDelete({pin: req.body.otp});

        let doc;

        if(user.who=='professional' || user.who=='hospital'){
            if(req.body.doctype=='prescription' || req.body.doctype=='dischargesummaries' || req.body.doctype=='testresults' || req.body.doctype=='bill'){
                doc = await Uploadeddoc.create({
                    healthid: req.body.healthid,
                    licensenos: [req.body.licenseno],
                    documentid: req.file.path,
                    doctype: req.body.doctype,
                    suspicious: "no"
                });
            }
            else{
                // error
                await unlinkAsync(req.file.path);
                return res.status(403).json({verdict, messages:["Bad request! Cannot release attached document with this license no."]});
            }
        }
        else if(user.who=='pharmacy'){
            if(req.body.doctype=='bill'){
                doc = await Uploadeddoc.create({
                    healthid: req.body.healthid,
                    licensenos: [req.body.licenseno],
                    documentid: req.file.path,
                    doctype: req.body.doctype,
                    suspicious: "no"
                });
            }
            else{
                // error
                await unlinkAsync(req.file.path);
                return res.status(403).json({verdict, messages:["Bad request! Cannot release attached document with this license no."]});
            }
        }
        else{
            // error
            await unlinkAsync(req.file.path);
            return res.status(403).json({verdict, messages:["Bad request! Cannot release attached document with this license no."]});
        }

        // Updating shasum with file content
        let filename = doc.documentid;
        let file_buffer = fs.readFileSync(filename);
        let sum = crypto.createHash('sha256');
        sum.update(file_buffer);
        const hex = sum.digest('hex');

        await Expert.findByIdAndUpdate(user.id, {signatures: [...user.signatures, hex]});
        blockChain.addToBlockChain(hex);
        
        verdict = true;
        res.status(200).json({verdict, messages:["Success! You have released document successfully."], doc});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 9: report patient's doc sus using: POST "/expert/reportSusDoc"; Login required
router.post('/reportSusDoc', [
    body('documentid', 'Enter a valid document id of minimum length 10.').matches(pattern).isLength({min:10}),
], checkAuth, async (req, res)=>{
    let verdict = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    
    try{
        // Check with the user with this username exist already
        let user = await Expert.findById(req.userId);
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending'){ return res.status(403).json({verdict, messages:["Bad request! Cannot report the doc suspicious, you are not verified yet."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot report the doc suspicious, you are banned."]});}

        let doc = await Uploadeddoc.findOne({
            documentid: req.body.documentid
        });
        
        if(!doc || !doc.licensenos.includes(user.licenseno)){
            return res.status(403).json({verdict, messages:["Bad request! Cannot report the doc suspicious, you have no access to it."]});
        }

        doc = await Uploadeddoc.findOneAndUpdate({
            documentid: req.body.documentid
        }, {$set: {suspicious: "yes"}});
        
        verdict = true;
        res.status(200).json({verdict, messages:["Success! Document reported as suspicious successfully."]});
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 10: list shared doc using: POST "/expert/listSharedDoc"; Login required
router.post('/listSharedDoc', checkAuth, async (req, res)=>{
    let verdict = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    
    try{
        // Check with the user with this username exist already
        let user = await Expert.findById(req.userId);
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending'){ return res.status(403).json({verdict, messages:["Bad request! Cannot list shared docs, you are not verified yet."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot list shared docs, you are banned."]});}
        
        if(!(user.who=='professional' || user.who=='hospital')){ return res.status(403).json({verdict, messages:["Bad request! Method not allowed."]});}

        let docs = [];
        let allDoc = await Uploadeddoc.find();
        for (let idx = 0; idx < allDoc.length; idx++) {
            const d = allDoc[idx];
            if(d.licensenos.includes(user.licenseno)){
                docs.push(d);
            }
        }
        
        verdict = true;
        res.status(200).json({verdict, messages:["Success! Shared documents listed successfully.", docs]});
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 11: verify patient's doc using: POST "/expert/verifyDoc"; Login required
router.post('/verifyDoc', [
    body('documentid', 'Enter a valid document id of minimum length 10.').matches(pattern).isLength({min:10}),
], checkAuth, async (req, res)=>{
    let verdict = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    
    try{
        // Check with the user with this username exist already
        let user = await Expert.findById(req.userId);
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending'){ return res.status(403).json({verdict, messages:["Bad request! Cannot verify the doc, you are not verified yet."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot verify the doc, you are banned."]});}

        let doc = await Uploadeddoc.findOne({
            documentid: req.body.documentid
        });
        
        if(!doc || !doc.licensenos.includes(user.licenseno)){
            return res.status(403).json({verdict, messages:["Bad request! Cannot verify the doc, you have no access to it."]});
        }

        // Updating shasum with file content
        let filename = doc.documentid;
        let file_buffer = fs.readFileSync(filename);
        let sum = crypto.createHash('sha256');
        sum.update(file_buffer);
        const hex = sum.digest('hex');

        let found = false;
        let experts = await Expert.find();
        for (let idx = 0; idx < experts.length; idx++) {
            const e = experts[idx];
            if(e.signatures.includes(hex)){
                found = true;
            }
        }
        if(!found){
            return res.status(200).json({verdict, messages:["Failure! Document verification failed."]});
        }

        // found = blockChain.verify(hex);        
        // if(!found){
        //     return res.status(200).json({verdict, messages:["Failure! Document verification failed."]});
        // }

        verdict = true;
        res.status(200).json({verdict, messages:["Success! Document verified successfully."]});
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 12: sign patient's doc using: POST "/expert/signDoc"; Login required
router.post('/signDoc', [
    body('documentid', 'Enter a valid document id of minimum length 10.').matches(pattern).isLength({min:10}),
    body('otp','Enter a valid OTP of length 8.').isLength({min:8, max:8}).isNumeric()
], checkAuth, async (req, res)=>{
    let verdict = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    
    try{
        // Check with the user with this username exist already
        let user = await Expert.findById(req.userId);
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending'){ return res.status(403).json({verdict, messages:["Bad request! Cannot sign the doc, you are not verified yet."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot sign the doc, you are banned."]});}

        let doc = await Uploadeddoc.findOne({
            documentid: req.body.documentid
        });
        
        if(!doc || !doc.licensenos.includes(user.licenseno)){
            return res.status(403).json({verdict, messages:["Bad request! Cannot sign the doc, you have no access to it."]});
        }

        let otp = await OTP.findOne({pin: req.body.otp});
        if(!otp){ return res.status(404).json({verdict, messages:["Not found! OTP not found."]});}

        if(otp.licenseno!=user.licenseno || otp.healthid!=doc.healthid){
            return res.status(400).json({verdict, messages:["Bad request! Invalid OTP provided."]});
        }

        await OTP.findOneAndDelete({pin: req.body.otp});

        if(user.who=='professional' || user.who=='hospital'){
            if(doc.doctype=='prescription' || doc.doctype=='dischargesummaries' || doc.doctype=='testresults' || req.body.doctype=='bill'){
            }
            else{
                // error
                return res.status(403).json({verdict, messages:["Bad request! Cannot sign the doc with this license no."]});
            }
        }
        else if(user.who=='pharmacy'){
            if(doc.doctype=='bill'){
            }
            else{
                // error
                return res.status(403).json({verdict, messages:["Bad request! Cannot sign the doc with this license no."]});
            }
        }
        else{
            // error
            return res.status(403).json({verdict, messages:["Bad request! Cannot sign the doc with this license no."]});
        }

        // Updating shasum with file content
        let filename = doc.documentid;
        let file_buffer = fs.readFileSync(filename);
        let sum = crypto.createHash('sha256');
        sum.update(file_buffer);
        const hex = sum.digest('hex');

        await Expert.findByIdAndUpdate(user.id, {signatures: [...user.signatures, hex]});
        blockChain.addToBlockChain(hex);
        
        verdict = true;
        res.status(200).json({verdict, messages:["Success! Document signed successfully."]});
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 13: add a medicine stock: POST "/expert/addMedicine"; Login required
router.post('/addMedicine',[
    body('name','Enter a valid medicine name of minimum length 3.').matches(pattern).isLength({min:3}),
    body('licenseno', 'Enter a valid licenseno of minimum length 10 with all numeric characters.').isLength({min:10}).isNumeric(),
    body('price', 'Enter a valid price').isNumeric({min:1}),
    body('quantity', 'Enter a valid price').isNumeric({min:1}),
], checkAuth, async (req, res)=>{
    verdict = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {        
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    try{
        const userId = req.userId;
        let user = await Expert.findById(userId).select("-password");
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending'){ return res.status(403).json({verdict, messages:["Bad request! Cannot add medicines, you are not verified yet."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot add medicines, you are banned."]});}
        
        if(!(user.who=='pharmacy') || (user.licenseno!=req.body.licenseno)){ return res.status(403).json({verdict, messages:["Bad request! Method not allowed."]});}

        await Medicine.create({
            name: req.body.name,
            licenseno: req.body.licenseno,
            price: req.body.price,
            quantity: req.body.quantity
        });

        verdict = true;
        res.status(200).json({verdict, messages:["Success! You have released a medicine successfully."]});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 14: list requested orders using: POST "/expert/listRequestedOrders"; Login required
router.post('/listRequestedOrders', checkAuth, async (req, res)=>{
    let verdict = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    
    try{
        // Check with the user with this username exist already
        let user = await Expert.findById(req.userId);
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending'){ return res.status(403).json({verdict, messages:["Bad request! Cannot list requested orders, you are not verified yet."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot list requested orders, you are banned."]});}
        
        if(!(user.who=='pharmacy')){ return res.status(403).json({verdict, messages:["Bad request! Method not allowed."]});}

        let orders = [];
        let allOrders = await Order.find({licenseno: user.licenseno});
        for (let idx = 0; idx < allOrders.length; idx++) {
            const o = allOrders[idx];
            if(o.status == 'requested'){
                orders.push(o);
            }
        }
        
        verdict = true;
        res.status(200).json({verdict, messages:["Success! Requested orders listed successfully."], orders});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 15: cancel patient's medicine request using: POST "/expert/cancelOrderRequest"; Login required
router.post('/cancelOrderRequest', [
    body('orderid', 'Enter a valid order id of minimum length 3.').matches(pattern).isLength({min:3}),
], checkAuth, async (req, res)=>{
    let verdict = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    
    try{
        // Check with the user with this username exist already
        let user = await Expert.findById(req.userId);
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending'){ return res.status(403).json({verdict, messages:["Bad request! Cannot cancel the order request, you are not verified yet."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot cancel the order request, you are banned."]});}

        if(user.who!='pharmacy'){ return res.status(403).json({verdict, messages:["Bad request! Method not allowed."]});}

        let order = await Order.findById(req.body.orderid);
        
        if(!order || order.licenseno != user.licenseno){
            return res.status(403).json({verdict, messages:["Bad request! Cannot cancel the order request, you have no access to it."]});
        }

        order = await Order.findByIdAndUpdate(req.body.orderid, {$set: {status: "cancelled"}});
        
        verdict = true;
        res.status(200).json({verdict, messages:["Success! Requested order cancelled successfully."]});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 16: billed patient's medicine request using: POST "/expert/billOrderRequest"; Login required
router.post('/billOrderRequest', [
    body('orderid', 'Enter a valid order id of minimum length 3.').matches(pattern).isLength({min:3}),
    body('documentid', 'Enter a valid document id of minimum length 10.').matches(pattern).isLength({min:10})
], checkAuth, async (req, res)=>{
    let verdict = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    
    try{
        // Check with the user with this username exist already
        let user = await Expert.findById(req.userId);
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending'){ return res.status(403).json({verdict, messages:["Bad request! Cannot bill the order, you are not verified yet."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot bill the order, you are banned."]});}

        if(!(user.who=='pharmacy')){ return res.status(403).json({verdict, messages:["Bad request! Method not allowed."]});}

        let order = await Order.findById(req.body.orderid);
        
        if(!order || order.licenseno != user.licenseno){
            return res.status(403).json({verdict, messages:["Bad request! Cannot bill the order, you have no access to it."]});
        }

        let doc = await Uploadeddoc.findOne({
            documentid: req.body.documentid
        });
        
        if(!doc || !doc.licensenos.includes(user.licenseno) || doc.doctype!='bill' || order.status != "requested"){
            return res.status(403).json({verdict, messages:["Bad request! Cannot attach the doc, method not allowed."]});
        }

        order = await Order.findByIdAndUpdate(req.body.orderid, {$set: {documentid: req.body.documentid, status: "billed"}});
        
        verdict = true;
        res.status(200).json({verdict, messages:["Success! Requested order billed successfully."]});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 17: list requested insurance application using: POST "/expert/listRequestedInsuranceApplication"; Login required
router.post('/listRequestedInsuranceApplication', checkAuth, async (req, res)=>{
    let verdict = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    
    try{
        // Check with the user with this username exist already
        let user = await Expert.findById(req.userId);
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending'){ return res.status(403).json({verdict, messages:["Bad request! Cannot list insurance application, you are not verified yet."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot list insurance application, you are banned."]});}
        
        if(user.who!='insurancefirm'){ return res.status(403).json({verdict, messages:["Bad request! Method not allowed."]});}

        let insurances = [];
        let allInsurances = await Insurance.find({licenseno: user.licenseno});
        for (let idx = 0; idx < allInsurances.length; idx++) {
            const o = allInsurances[idx];
            if(o.status == 'pending'){
                insurances.push(o);
            }
        }
        
        verdict = true;
        res.status(200).json({verdict, messages:["Success! Requested orders listed successfully."], insurances});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 18: approve patient's insurance application request using: POST "/expert/approveInsuranceRequest"; Login required
router.post('/approveInsuranceRequest', [
    body('insuranceid', 'Enter a valid order id of minimum length 3.').matches(pattern).isLength({min:3})
], checkAuth, async (req, res)=>{
    let verdict = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    
    try{
        // Check with the user with this username exist already
        let user = await Expert.findById(req.userId);
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending'){ return res.status(403).json({verdict, messages:["Bad request! Cannot appprove insurance request, you are not verified yet."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot appprove insurance request, you are banned."]});}

        let insurance = await Insurance.findById(req.body.insuranceid);
        
        if(user.who!='insurancefirm' || insurance.status!="pending"){ return res.status(403).json({verdict, messages:["Bad request! Method not allowed."]});}
        
        if(!insurance || insurance.licenseno != user.licenseno){
            return res.status(403).json({verdict, messages:["Bad request! Cannot approve insurance request, you have no access to it."]});
        }

        let patient = await Patient.findOne({healthid: insurance.healthid})
        if(!patient){return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(patient.wallet < insurance.amountLeft){return res.status(400).json({verdict, messages:["Bad request! Patient do not have enough funds for insurance."]});}

        patient.wallet -= insurance.amountLeft;
        user.wallet += insurance.amountLeft;
        patient.save(); 
        user.save(); 

        await Log.create({
            details: `${patient.name} paid ${user.name} an amount of ${insurance.amountLeft} for medical insurance.`
        });
        
        await Insurance.findByIdAndUpdate(req.body.insuranceid, {$set: {status: "approved"}});
        
        verdict = true;
        res.status(200).json({verdict, messages:["Success! Insurance request approved successfully."]});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 19: cancel patient's insurance application request using: POST "/expert/cancelInsuranceRequest"; Login required
router.post('/cancelInsuranceRequest', [
    body('insuranceid', 'Enter a valid order id of minimum length 3.').matches(pattern).isLength({min:3})
], checkAuth, async (req, res)=>{
    let verdict = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    
    try{
        // Check with the user with this username exist already
        let user = await Expert.findById(req.userId);
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending'){ return res.status(403).json({verdict, messages:["Bad request! Cannot reject insurance request, you are not verified yet."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot reject insurance request, you are banned."]});}

        let insurance = await Insurance.findById(req.body.insuranceid);
        
        if(user.who!='insurancefirm' || insurance.status!="pending"){ return res.status(403).json({verdict, messages:["Bad request! Method not allowed."]});}
        
        if(!insurance || insurance.licenseno != user.licenseno){
            return res.status(403).json({verdict, messages:["Bad request! Cannot reject insurance request, you have no access to it."]});
        }

        await Insurance.findByIdAndUpdate(req.body.insuranceid, {$set: {status: "rejected"}});
        
        verdict = true;
        res.status(200).json({verdict, messages:["Success! Insurance request rejected successfully."]});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 20: list insurance claims using: POST "/expert/listInsuranceClaims"; Login required
router.post('/listInsuranceClaims', checkAuth, async (req, res)=>{
    let verdict = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    
    try{
        // Check with the user with this username exist already
        let user = await Expert.findById(req.userId);
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending'){ return res.status(403).json({verdict, messages:["Bad request! Cannot list insurance application, you are not verified yet."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot list insurance application, you are banned."]});}
        
        if(user.who!='insurancefirm'){ return res.status(403).json({verdict, messages:["Bad request! Method not allowed."]});}

        let claims = [];
        let allClaims = await Claim.find({licenseno: user.licenseno});
        for (let idx = 0; idx < allClaims.length; idx++) {
            const o = allClaims[idx];
            if(o.status == 'pending'){
                claims.push(o);
            }
        }
        
        verdict = true;
        res.status(200).json({verdict, messages:["Success! Insurance claims listed successfully."], claims});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 21: approve patient's insurance application request using: POST "/expert/approveInsuranceClaim"; Login required
router.post('/approveInsuranceClaim', [
    body('claimid', 'Enter a valid claim id of minimum length 3.').matches(pattern).isLength({min:3}),
    body('amount', 'Enter a valid amount').isNumeric({min:1})
], checkAuth, async (req, res)=>{
    let verdict = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    
    try{
        // Check with the user with this username exist already
        let user = await Expert.findById(req.userId);
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending'){ return res.status(403).json({verdict, messages:["Bad request! Cannot appprove insurance claim, you are not verified yet."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot appprove insurance claim, you are banned."]});}

        let claim = await Claim.findById(req.body.claimid);
        
        if(user.who!='insurancefirm' || claim.status!="pending"){ return res.status(403).json({verdict, messages:["Bad request! Method not allowed."]});}
        
        if(!claim || claim.licenseno != user.licenseno){
            return res.status(403).json({verdict, messages:["Bad request! Cannot approve insurance claim, you have no access to it."]});
        }

        let insurance = await Insurance.findOne({healthid: claim.healthid, licenseno: claim.licenseno})
        if(!insurance){return res.status(404).json({verdict, messages:["Not found! Insurance not found."]});}
        
        let patient = await Patient.findOne({healthid: insurance.healthid})
        if(!patient){return res.status(404).json({verdict, messages:["Not found! User not found."]});}

        if(insurance.amountLeft < req.body.amount){return res.status(400).json({verdict, messages:["Bad request! Not enough funds left in insurance for the patient."]});}

        patient.wallet += req.body.amount;
        user.wallet -= req.body.amount;
        insurance.amountLeft -= req.body.amount;
        patient.save();
        user.save();
        insurance.save();

        await Log.create({
            details: `${user.name} paid ${patient.name} an amount of ${req.body.amount} for medical insurance claim.`
        });
        
        claim = await Claim.findByIdAndUpdate(req.body.claimid, {$set: {status: "approved"}});
        
        verdict = true;
        res.status(200).json({verdict, messages:["Success! Insurance claim approved successfully."]});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 22: reject patient's insurance claim  using: POST "/expert/rejectInsuranceClaim"; Login required
router.post('/rejectInsuranceClaim', [
    body('claimid', 'Enter a valid claim id of minimum length 3.').matches(pattern).isLength({min:3})
], checkAuth, async (req, res)=>{
    let verdict = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    
    try{
        // Check with the user with this username exist already
        let user = await Expert.findById(req.userId);
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending'){ return res.status(403).json({verdict, messages:["Bad request! Cannot reject insurance claim, you are not verified yet."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot reject insurance claim, you are banned."]});}

        if(user.who!='insurancefirm'){ return res.status(403).json({verdict, messages:["Bad request! Method not allowed."]});}

        let claim = await Claim.findById(req.body.claimid);
        
        if(!claim || claim.licenseno != user.licenseno){
            return res.status(403).json({verdict, messages:["Bad request! Cannot reject insurance claim, you have no access to it."]});
        }

        claim = await Claim.findByIdAndUpdate(req.body.claimid, {$set: {status: "rejected"}});
        
        verdict = true;
        res.status(200).json({verdict, messages:["Success! Insurance claim rejected successfully."]});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 23: get OTP mail: POST "/expert/sendOTPMail"; Login required
router.post('/sendOTPMail', [
    body('healthid', 'Enter a valid healthid of length 10 with all numeric characters.').isLength({min:10, max:10}).isNumeric()
], checkAuth, async (req, res)=>{
    let verdict = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    
    try{
        // Check with the user with this username exist already
        let user = await Expert.findById(req.userId);
        if(!user){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user.verificationstatus=='failure' || user.verificationstatus=='pending'){ return res.status(403).json({verdict, messages:["Bad request! Cannot send OTP over mail, you are not verified yet."]});}
        if(user.verificationstatus=='banned'){ return res.status(403).json({verdict, messages:["Bad request! Cannot send OTP over mail, you are banned."]});}
        
        let otpex = await OTP.findOne({licenseno: user.licenseno, healthid: req.body.healthid});
        if(otpex){ 
            await OTP.findOneAndDelete({licenseno: user.licenseno, healthid: req.body.healthid});
        }

        let purpose = "signing document";
        let otp = crypto.randomInt(10000000, 100000000);
        sendMail(user.email, otp, purpose);
        
        await OTP.create({
            healthid: req.body.healthid,
            licenseno: user.licenseno,
            pin: otp
        });
        
        verdict = true;
        res.status(200).json({verdict, messages:["Success! OTP for the signing document has been mailed successfully."]});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

module.exports = router;