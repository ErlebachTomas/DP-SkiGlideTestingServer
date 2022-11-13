const Ski = require('../model/Ski');
const debug = require('debug')('myApp');

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

exports.getSki = async function (req, res) {

    try {
        let ski = loadSki(req.userID, req.skiName)
        res.json(ski);

    } catch (err) {
        res.status(500).json(err);
    }
}

// TODO test funkc�
exports.insertSki = async function (req, res) {

    const { Ski } = req.body.ski;

    try {
        let ski = addSki(Ski)
        res.json(ski);

    } catch (err) {
        res.status(500).json(err);
    }
}


exports.addSki = async function (ski) { 
    let newSki = new Ski({ ski });
    return await newSki.save();           
}


/** na�te z db konkr�tn� ly�i u�ivatele */
exports.loadSki = async function (userID, skiName) {
    return await Ski.find({ ownerUserID: userID, name: skiName  });
}

/**
 * Pokud neexistuje vlo�� nov�
 * @param String userID
 * @param Ski Ski
 */
exports.addSki = async function (userID, Ski) {
    
    console.log("...")
}


