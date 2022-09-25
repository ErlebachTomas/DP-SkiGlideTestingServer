const mongoose = require('mongoose');

let Ski = new mongoose.Schema({

    id: {
        type: String,
        required: true
    },
    ownerUserID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: String

});

module.exports = mongoose.model('Ski', Ski);

