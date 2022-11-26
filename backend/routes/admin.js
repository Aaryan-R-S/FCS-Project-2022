const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Patient = require('../models/Patient');
const Expert = require('../models/Expert');
const Uploadeddoc = require('../models/Uploadeddoc');
const checkAuth = require('../middlewares/authorize');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// ROUTE 1: create an admin using: POST "/admin/addAdmin"; Login required
router.post('/addAdmin', [
        body('username', 'Enter a valid username of minimum length 5 with all lowercase alphanumeric characters.').isLength({min:5}).isAlphanumeric(),
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
          })
    ], checkAuth, async (req, res)=>{

    verdict = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ verdict, messages: errors.array() });
    }

    try{
        const userId = req.userId;

        let user = await Admin.findById(userId);
        if(!user){ return res.status(401).json({verdict, messages:["Authorization failed! You are not authorized to add an admin."]});}

        // Check with the user with this username exist already
        user = await Admin.findOne({username: req.body.username});
        if (user){ return res.status(400).json({ verdict, messages: ["Bad Request! Cannot add admin with this username."]});}
        
        const salt = await bcrypt.genSalt(10);
        const secPwd = await bcrypt.hash(req.body.password, salt);

        // create a new user
        user = await Admin.create({
            username: req.body.username,
            password: secPwd,
        })

        verdict = true;
        res.status(200).json({verdict, messages:["Success! New admin added."]});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 2: authenticate an admin using: POST "/admin/login"; No login required
router.post('/login', [
        body('username', 'Enter your username having minimum length 5 and all characters being lowercase alphanumeric.').isLength({min:5}).isAlphanumeric(),
        body('password', 'Enter your password having minimum length 8.').isLength({min:8})
    ], async (req, res)=>{

    verdict = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {        
        return res.status(400).json({ verdict, messages: errors.array() });
    }

    const {username, password} = req.body;

    try{
        // Check with the user with this email exist already
        let user = await Admin.findOne({username});
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

// ROUTE 3: Get logged in admin details: POST "/admin/adminDetails"; Login required
router.post('/adminDetails', [
    body('username', 'Enter a valid username having minimum length 5 and all characters being lowercase alphanumeric.').isLength({min:5}).isAlphanumeric()
], checkAuth, async (req, res)=>{
    verdict = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {        
        return res.status(400).json({ verdict, messages: errors.array() });
    }

    try{
        const userId = req.userId;
        let user = await Admin.findById(userId);
        if(!user){ return res.status(401).json({verdict, messages:["Authorization failed! You are not authorized to get info of an admin."]});}

        user = await Admin.findOne({username: req.body.username}).select("-password");
        if(!user){ return res.status(404).json({verdict, messages:["Not found! Admin not found."]});}

        verdict = true;
        res.status(200).json({verdict, messages:["Success! Admin details fetched."], "data":user});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 4: delete an admin using: POST "/admin/deleteAdmin"; Login required
router.post('/deleteAdmin', [
        body('username', 'Enter a valid username having minimum length 5 and all characters being lowercase alphanumeric.').isLength({min:5}).isAlphanumeric()
    ], checkAuth, async (req, res)=>{
    verdict = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {        
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    try{
        const userId = req.userId;
        let user = await Admin.findById(userId);
        if(!user){ return res.status(401).json({verdict, messages:["Authorization failed! You are not authorized to remove an admin."]});}

        user = await Admin.findOne({username: req.body.username});
        if(!user){ return res.status(404).json({verdict, messages:["Not found! Admin not found."]});}

        user = await Admin.findByIdAndDelete(user._id);
        verdict = true;
        res.status(200).json({verdict, messages:["Success! Admin removed successfully."]});
    }
    catch(error){        
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 5: Logout admin: POST "/admin/logout"; Login required
router.post('/logout', checkAuth, async (req, res)=>{
    verdict = false;

    try{
        const userId = req.userId;
        let user = await Admin.findById(userId);
        if(!user){ return res.status(404).json({verdict, messages:["Not found! Admin not found."]});}

        verdict = true;
        return res.clearCookie("access_token").status(200).json({verdict, messages:["Success! You have logged out successfully."]});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 6: list pending verified user using: POST "/admin/listPendingUsers"; Login required
router.post('/listPendingUsers', checkAuth, async (req, res)=>{
    verdict = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {        
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    try{
        const userId = req.userId;
        let user = await Admin.findById(userId);
        if(!user){ return res.status(401).json({verdict, messages:["Authorization failed! You are not authorized to list pending users."]});}

        let patients = await Patient.find({verificationstatus: 'pending'}).select("-password");
        let experts = await Expert.find({verificationstatus: 'pending'}).select("-password");
        
        verdict = true;
        res.status(200).json({verdict, messages:["Success! Pending user listed successfully."], patients, experts});
    }
    catch(error){        
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 7: remove and ban a suspicious user using: POST "/admin/banUser"; Login required
router.post('/banUser', [
    body('id', 'Enter a valid healthid/licenseno of length 10 with all numeric characters.').isLength({min:10, max:10}).isNumeric(),
], checkAuth, async (req, res)=>{
    verdict = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {        
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    try{
        const userId = req.userId;
        let user = await Admin.findById(userId);
        if(!user){ return res.status(401).json({verdict, messages:["Authorization failed! You are not authorized to ban a user."]});}

        let user1 = await Patient.findOne({healthid: req.body.id});
        let user2 = await Expert.findOne({licenseno: req.body.id});
        if(!user1 && !user2){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user1){
            user1 = await Patient.findByIdAndUpdate(user1._id, {verificationstatus: 'banned'});
        }
        else{
            user2 = await Expert.findByIdAndUpdate(user2._id, {verificationstatus: 'banned'});
        }
        verdict = true;
        res.status(200).json({verdict, messages:["Success! User banned successfully."]});
    }
    catch(error){        
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 8: approve a user using: POST "/admin/approveUser"; Login required
router.post('/approveUser', [
    body('id', 'Enter a valid healthid/licenseno of length 10 with all numeric characters.').isLength({min:10, max:10}).isNumeric(),
], checkAuth, async (req, res)=>{
    verdict = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {        
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    try{
        const userId = req.userId;
        let user = await Admin.findById(userId);
        if(!user){ return res.status(401).json({verdict, messages:["Authorization failed! You are not authorized to remove a user."]});}

        let user1 = await Patient.findOne({healthid: req.body.id});
        let user2 = await Expert.findOne({licenseno: req.body.id});
        if(!user1 && !user2){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user1){
            user1 = await Patient.findByIdAndUpdate(user1._id, {verificationstatus: 'success'});
        }
        else{
            user2 = await Expert.findByIdAndUpdate(user2._id, {verificationstatus: 'success'});
        }
        verdict = true;
        res.status(200).json({verdict, messages:["Success! User approved successfully."]});
    }
    catch(error){        
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 9: verify again a user using: POST "/admin/verifyUserAgain"; Login required
router.post('/verifyUserAgain', [
    body('id', 'Enter a valid healthid/licenseno of length 10 with all numeric characters.').isLength({min:10, max:10}).isNumeric(),
], checkAuth, async (req, res)=>{
    verdict = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {        
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    try{
        const userId = req.userId;
        let user = await Admin.findById(userId);
        if(!user){ return res.status(401).json({verdict, messages:["Authorization failed! You are not authorized to remove a user."]});}

        let user1 = await Patient.findOne({healthid: req.body.id});
        let user2 = await Expert.findOne({licenseno: req.body.id});
        if(!user1 && !user2){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user1){
            user1 = await Patient.findByIdAndUpdate(user1._id, {verificationstatus: 'failure'});
        }
        else{
            user2 = await Expert.findByIdAndUpdate(user2._id, {verificationstatus: 'failure'});
        }
        verdict = true;
        res.status(200).json({verdict, messages:["Success! User has been asked to verify again."]});
    }
    catch(error){        
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 10: list suspicious uploaded docs using: POST "/admin/listSusDocs"; Login required
router.post('/listSusDocs', checkAuth, async (req, res)=>{
    verdict = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {        
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    try{
        const userId = req.userId;
        let user = await Admin.findById(userId);
        if(!user){ return res.status(401).json({verdict, messages:["Authorization failed! You are not authorized to remove a user."]});}

        let docs = await Uploadeddoc.find({suspicious: 'yes'});
        
        verdict = true;
        res.status(200).json({verdict, messages:["Success! Pending user listed successfully."], docs});
    }
    catch(error){        
        // console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

// ROUTE 11: remove and ban a suspicious user using: POST "/admin/removeUser"; Login required
router.post('/removeUser', [
    body('id', 'Enter a valid healthid/licenseno of length 10 with all numeric characters.').isLength({min:10, max:10}).isNumeric(),
], checkAuth, async (req, res)=>{
    verdict = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {        
        return res.status(400).json({ verdict, messages: errors.array() });
    }
    try{
        const userId = req.userId;
        let user = await Admin.findById(userId);
        if(!user){ return res.status(401).json({verdict, messages:["Authorization failed! You are not authorized to remove a user."]});}

        let user1 = await Patient.findOne({healthid: req.body.id});
        let user2 = await Expert.findOne({licenseno: req.body.id});
        if(!user1 && !user2){ return res.status(404).json({verdict, messages:["Not found! User not found."]});}
        if(user1){
            user1 = await Patient.findByIdAndUpdate(user1._id, {verificationstatus: 'banned'});
        }
        else{
            user2 = await Expert.findByIdAndUpdate(user2._id, {verificationstatus: 'banned'});
        }

        let doc = await Uploadeddoc.find({
            healthid: req.body.id
        });

        for (let index = 0; index < doc.length; index++) {
            const d = doc[index];
            if(d.doctype=='licenseno' || d.doctype=='view'){
                await Uploadeddoc.findByIdAndDelete(d.id);
                await unlinkAsync(d.documentid);
            }
        }

        verdict = true;
        res.status(200).json({verdict, messages:["Success! User data removed and banned successfully."]});
    }
    catch(error){        
        console.error(error.message);
        res.status(500).json({verdict, messages:["Internal server error! Please try again after sometime."]});
    }
})

module.exports = router;