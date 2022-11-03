const mongoose = require('mongoose');
const { Schema } = mongoose;

const MedicineSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    }, 
    licenseno:{
        type: String,
        required: true
    }, 
    price:{
        type: Number,
        required: true
    }, 
    quantity:{
        type: String,
        required: true
    }, 
});

module.exports = mongoose.model('medicine', MedicineSchema);