const mongoose = require('mongoose');
const { Schema } = mongoose;

const LogSchema = new Schema({
    details:{
        type: String,
        required: true
    }, 
    logtimestamp:{
        type: Date,
        default: Date.now,
        required: true
    }, 
});

module.exports = mongoose.model('log', LogSchema);