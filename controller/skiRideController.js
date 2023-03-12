const SkiRide = require('../model/SkiRide');
const debug = require('debug')('myApp');
const middleware = require('./middleware');

exports.insertSkiRide = async function (req, res) {
    middleware.try(res, async function () {
        new SkiRide(req.body.data).save();
    }, 201);
}

exports.updateSkiRide = async function (req, res) {
    middleware.try(res, async function () {
        const filter = { "UUID:": req.body.data.UUID, "ownerUserID": req.body.userID };
        let updateDoc = req.body.data;
        SkiRide.updateOne(filter, updateDoc, { upsert: true });
    });
}

exports.deleteSkiRide = async function (req, res) {
    middleware.try(res, async function () {
        SkiRide.findOneAndRemove({ UUID: req.body.data.UUID, ownerUserID: req.body.userID });
    });
}

exports.syncSkiRide = async function (req, res) {
    middleware.try(res, async function () {
        let result = await SkiRide.find({ ownerUserID: req.body.userID, UUID: req.body.data.UUID });
        if (Object.keys(result).length == 0) {
            new SkiRide(req.body.data).save();
        }
    });
}

exports.getAllSkiRides = async function (req, res) {
    debug("nacitam data jizd pro " + req.query.userID);
    try {
        let result = await SkiRide.find({ ownerUserID: req.query.userID });
        res.json(result);
    } catch (err) {
        debug(err);
        res.status(500).json(err);
    }
}