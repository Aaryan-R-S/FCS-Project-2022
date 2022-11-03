const mongoose = require('mongoose');
const { Schema } = mongoose;

const PatientSchema = new Schema({
    healthid:{
        type: String,
        required: true,
        unique: true
    }, 
    password:{
        type: String,
        required: true
    }, 
    name:{
        type: String,
        required: true
    }, 
    dob:{
        type: Date,
        required: true
    }, 
    address:{
        type: String,
        required: true
    }, 
    documentid:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    }, 
    phoneno:{
        type: String,
        required: true
    }, 
    verificationstatus:{
        type: String,
        enum : ['success','failure','pending','banned'],
        required: true
    },
    wallet:{
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('patient', PatientSchema);