const mongoose = require('mongoose');

let TestSession = new mongoose.Schema({

    id: {
        type: String,
        required: true
    },
    //todo datatime
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
    humidity: Number

});

module.exports = mongoose.model('TestSession', TestSession);