const mongoose = require('mongoose');

let SkiRide = new mongoose.Schema({

    id: {
        type: String,
        required: true
    },
    testSessionID: {
        type: String,
        required: true
    },
    skiID: {
        type: String,
        required: true
    },
    result: {
        type: Number,
        require: true,
    },
    note: {
        type: String,
        require: false,
    },
    updated_at: {
        type: String,
        require: false,
    }

});

module.exports = mongoose.model('SkiRide', SkiRide);