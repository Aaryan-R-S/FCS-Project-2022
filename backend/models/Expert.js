const mongoose = require('mongoose');
const { Schema } = mongoose;

const ExpertSchema = new Schema({
    licenseno:{
        type: String,
        required: true,
        unique: true
    }, 
    password:{
        type: String,
        required: true
    }, 
    signatures:{
        type: Array,
        items: { type: String }
    },
    who:{
        type: String,
        enum : ['professional','hospital','pharmacy','insurancefirm'],
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
    location:{
        type: String,
        required: true
    }, 
    images:{
        type: Array,
        items: { type: String },
    },
    documentid:{
        type: String,
        required: true
    },
    description:{
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

module.exports = mongoose.model('expert', ExpertSchema);