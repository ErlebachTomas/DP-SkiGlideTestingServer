﻿const Ski = require('../model/Ski');
const debug = require('debug')('myApp');

/**
 * Vrátí všechny lyže daného uživatele 
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

/**
 * Vloží lyži z body 
 * */
exports.insertSki = async function (req, res) {

    const { skijson } = req.body.ski;

    try {
        let ski = await new Ski(skijson).save();
        res.json(ski);

    } catch (err) {
        res.status(500).json(err);
    }
}

/** načte z db konkrétní lyži uživatele
 * @param {String} userID
 * @param {String} SkiName
 * @returns Ski  
 * @throws Exception
 * */
exports.loadSki = async function (userID, skiName) {
    return await Ski.find({ ownerUserID: userID, name: skiName  });
}

/**
 * 
 * Pokud neexistuje vloží nový
 * @param {String} userID
 * @param {Json object} Ski
 * @returns {Ski} vložená nebo existující lyže
 * @throws {Exception} err
 */
exports.addSkiIfNotExist = async function (userID, ski) {
          
    let result = await this.loadSki(userID, ski.name);
    
    if (Object.keys(result).length > 0) {
        debug(ski.name + " již existuje, nepřidávám");
        return result[0];
    } else {
        return await new Ski(ski).save();
    } 
   
}
/**
 * Vymaže záznam lyže z db
 * @param {String} userID
 * @param {String} SkiName
 * @returns {Ski} vymazaná lyže
 * @throws {Exception} err
 * */
exports.deleteSki = async function (userID, skiName) {
    return await Ski.findOneAndRemove({ ownerUserID: userID, name: skiName });
    
}
