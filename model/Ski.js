const mongoose = require('mongoose');

let Ski = new mongoose.Schema({

    id: {
        type: Number,
        required: false
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
    updated_at: {
        type: String,
        require: false,
    }

});

module.exports = mongoose.model('Ski', Ski);