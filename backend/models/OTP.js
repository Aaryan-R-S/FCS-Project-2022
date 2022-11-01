const mongoose = require('mongoose');
const { Schema } = mongoose;

const OtpSchema = new Schema({
    validforp:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'patient',
    },
    validfore:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'expert',
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