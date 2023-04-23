// @ts-check
const mongoose = require('mongoose');

let TestSession = new mongoose.Schema({

    UUID: {
        type: String,
        required: true
    },  
    datetime: {
        type: String,
        required: true,
    },    
    ownerUserID: {
        type: String,
        required: true
    },
    airTemperature: {
        type: Number,
        required: true
    },
    snowTemperature: {
        type: Number,
        required: true
    },
    snowType: {
        type: Number,
        required: true
    },
    testType: {
        type: Number,
        required: true
    },
    humidity: {
        type: Number,
        required: false
    },
    note: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false
     },
    updated_at: {
        type: String,
        require: false,
    }
});

module.exports = mongoose.model('TestSession', TestSession);