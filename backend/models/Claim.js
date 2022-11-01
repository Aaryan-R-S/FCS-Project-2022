const mongoose = require('mongoose');
const { Schema } = mongoose;

const ClaimSchema = new Schema({
    documentid:{
        type: String,
        required: true
    },
    insurancefirmid:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'expert',
        required: true,
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