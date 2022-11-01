const mongoose = require('mongoose');
const { Schema } = mongoose;

const MedicineSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    }, 
    sellerid:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'expert',
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