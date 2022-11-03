const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Uploadeddoc = require('../models/Uploadeddoc');
const Claim = require('../models/Claim');
const Order = require('../models/Order');
const OTP = require('../models/OTP');
const checkAuth = require('../middlewares/authorize');
const upload = require('../utils/uploadFile');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// ROUTE 1: create an patient using: POST "/patient/addPatient"; Login required
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
      body('name','Enter a valid name of minimum length 3.').isLength({min:3}),
      body('dob','Enter a valid date of birth.').isISO8601('yyyy-mm-dd'),
      body('address','Enter a valid address of minimum length 3.').isLength({min:3}),
      body('email','Enter a valid email address.').isEmail(),
      body('phoneno','Enter a valid phone number.').isMobilePhone(),
      body('doctype','Enter a valid document type.').isLength({min:3})
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
        if (user){ return res.status(400).json({ verdict, messages: ["Bad Request! A person with this health ID is already registered."]});}

        await Uploadeddoc.create({
            healthid: req.body.healthid,
            licensenos: req.body.licensenos,
            documentid: req.file.path,
            doctype: req.body.doctype,
            suspicious: "no"
        })
        
        const salt = await bcrypt.genSalt(10);
        const secPwd = await bcrypt.hash(req.body.password, salt);

        req.body.licensenos = [];
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

// ROUTE 2: authenticate an admin using: POST "/patient/login"; No login required
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

// ROUTE 3: Get logged in admin details: POST "/patient/patientDetails"; Login required
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
        res.status(200).json({verdict, messages:["Success! User removed successfully."]});
    }
    catch(error){        
        console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 5: Logout admin: POST "/patient/logout"; Login required
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

module.exports = router;