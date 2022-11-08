const mongoose = require('mongoose');
const { Schema } = mongoose;

const UploadeddocSchema = new Schema({
    healthid: {
        type: String, 
        required: true
    },
    licensenos:{
        type: Array,
        items: { type: String }
    },
    documentid:{
        type: String,
        required: true,
        unique: true
    },
    doctype:{
        type: String,
        enum : ['licenseno','view','healthid','prescription','dischargesummaries','testresults', 'bill'],
        required: true
    },
    uploaddate:{
        type: Date,
        default: Date.now,
        required: true
    }, 
    suspicious:{
        type: String,
        enum : ['yes','no'],
        required: true
    },
});

module.exports = mongoose.model('uploadeddoc', UploadeddocSchema);