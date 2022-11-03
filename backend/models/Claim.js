const mongoose = require('mongoose');
const { Schema } = mongoose;

const ClaimSchema = new Schema({
    healthid:{
        type: String, 
        required: true
    }, 
    licenseno:{
        type: String,
        required: true,
    }, 
    documentid:{
        type: String,
        required: true
    },
    claimdate:{
        type: Date,
        default: Date.now,
        required: true
    }, 
    status:{
        type: String,
        enum : ['approved','rejected','pending'],
        required: true
    }
});

module.exports = mongoose.model('claim', ClaimSchema);