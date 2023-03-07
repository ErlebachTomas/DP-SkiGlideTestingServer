const mongoose = require('mongoose');

let Ski = new mongoose.Schema({

    UUID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    ownerUserID: {
        type: String,
        required: true
    },
    description: {       
        type: String,
        require: false,
    },
    status: {
        type: String,
        require: false,
    },
    updated_at: {
        type: String,
        require: false,
    }

});

module.exports = mongoose.model('Ski', Ski);