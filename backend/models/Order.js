const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema({
    healthid:{
        type: String,
        required: true
    }, 
    licenseno:{
        type: String,
        required: true
    }, 
    medicinesid:{
        type: Array,
        items: { type: String },
        required: true
    },
    medicinesquantity:{
        type: Array,
        items: { type: Number },
        required: true
    },
    totalprice:{
        type: Number,
        required: true
    }, 
    prescriptionid:{
        type: String,
        required: true
    },
    documentid:{
        type: String,
        required: true
    },
    orderdate:{
        type: Date,
        default: Date.now,
        required: true
    }, 
    status:{
        type: String,
        enum : ['requested','cancelled','billed','paid'],
        required: true
    }
});

module.exports = mongoose.model('order', OrderSchema);