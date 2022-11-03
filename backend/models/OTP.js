const mongoose = require('mongoose');
const { Schema } = mongoose;

const OtpSchema = new Schema({
    healthid:{
        type: String
    },
    licenseno:{
        type: String
    },
    pin:{
        type: Number,
        required: true
    }, 
    otptimestamp:{
        type: Date,
        default: Date.now,
        required: true
    }, 
});

module.exports = mongoose.model('otp', OtpSchema);