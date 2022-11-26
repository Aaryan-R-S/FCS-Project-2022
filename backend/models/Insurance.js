const mongoose = require('mongoose');
const { Schema } = mongoose;

const InsuranceSchema = new Schema({
    healthid:{
        type: String,
        required: true
    }, 
    licenseno:{
        type: String,
        required: true
    }, 
    insurancedate:{
        type: Date,
        default: Date.now,
        required: true
    }, 
    amountLeft:{
        type: Number,
        required: true
    }, 
    status:{
        type: String,
        enum : ['approved','rejected','pending'],
        required: true
    }
});

module.exports = mongoose.model('insurance', InsuranceSchema);