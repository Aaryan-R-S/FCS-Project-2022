const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema({
    patientid:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'patient',
        required: true
    }, 
    sellerid:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'expert',
        required: true
    }, 
    medicinesid:{
        type: Array,
        items: { type: mongoose.Schema.Types.ObjectId, ref: 'medicine' },
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
    orderdate:{
        type: Date,
        default: Date.now,
        required: true
    }, 
    documentid:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum : ['requested','billed','paid'],
        required: true
    }
});

module.exports = mongoose.model('order', OrderSchema);