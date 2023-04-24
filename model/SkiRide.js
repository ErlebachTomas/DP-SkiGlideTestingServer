// @ts-check
const mongoose = require('mongoose');


let SkiRide = new mongoose.Schema({

    UUID: {
        type: String,
        required: true,
        unique: true
    },
    testSessionID: {
        type: String,
        required: true
    },
    skiID: {
        type: String,
        required: true,        
    },
    result: {
        type: Number,
        require: true,
    },
    note: {
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

}, { toObject: { virtuals: true }, toJSON: { virtuals: true } });

SkiRide.virtual('value').get(function () {
    return this.result;
});

SkiRide.virtual('ski', {
    ref: 'Ski',
    localField: 'skiID',
    foreignField: 'UUID',
    justOne: true
});

module.exports = mongoose.model('SkiRide', SkiRide);