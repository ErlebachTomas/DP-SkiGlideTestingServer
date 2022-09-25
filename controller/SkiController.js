const Ski = require('../model/Ski');
const debug = require('debug')('myApp');

//https://www.mongodb.com/docs/manual/reference/sql-comparison/

/**
 * Vr�t� v�echny ly�e dan�ho u�ivatele 
 * @param {any} req
 * @param {any} res
 */
exports.getAllUsersSki = async function (req, res) {

    debug("nacitam data pro " + req.query.user)

    try {
        let data = await Ski.find({ ownerUserID: req.user });
        res.json(data);

    } catch (err) {
        res.status(500).json(err);
    }

};