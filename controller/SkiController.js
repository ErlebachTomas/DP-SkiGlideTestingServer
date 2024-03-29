﻿const Ski = require('../model/Ski');
const debug = require('debug')('myApp');
const middleware = require('./generalController');
const SkiRide = require('../model/SkiRide');
/**
 * Vrátí všechny lyže daného uživatele 
 * @param {any} req
 * @param {any} res
 */
exports.getAllUsersSki = async function (req, res) {
 /**
 * #swagger.tags = ['Ski']
 * #swagger.security = [{
 *     "apiKeyAuth": []
 * }] */
    debug("nacitam data pro " + req.query.user)

    try {
        let data = await Ski.find({ ownerUserID: req.query.user });
        res.json(data);

    } catch (err) {
        res.status(500).json(err);
    }

};
/** Načte lyži z dbs */
exports.getSki = async function (req, res) {
 /**
 * #swagger.tags = ['Ski']
 * #swagger.security = [{
 *     "apiKeyAuth": []
 * }] */
    try {
        let ski = loadSki(req.userID, req.skiName)
        res.json(ski);

    } catch (err) {
        res.status(500).json(err);
    }
}
/**
 * Vloží lyži 
 **/
exports.insertSki = async function (req, res) {
 /**
 * #swagger.tags = ['Ski']
 * #swagger.security = [{
 *     "apiKeyAuth": []
 * }] */
    middleware.try(res, async function () {
        let json = req.body.ski
        json["ownerUserID"] = req.body.userID;
        debug("/addSki" + json)
        await new Ski(json).save(); 
    });
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
 * Vymaže záznam lyže společně se všemi záznamy SkiRide
 * @param {String} userID
 * @param {String} UUID
 * @returns {Ski} vymazaná lyže
 * @throws {Exception} err
 * */
exports.deleteSki = async function (userID, UUID) {  
     const ski = await Ski.findOneAndRemove({ UUID: UUID, ownerUserID: userID });
     if (ski) {
         await SkiRide.deleteMany({ skiID: ski.UUID });
     } 
     return ski;    
}
