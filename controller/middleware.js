const Ski = require('../model/Ski');
const User = require('../model/User');
const TestSession = require('../model/TestSession');

const debug = require('debug')('myApp');


/* Bussines logika a pomocné funkce */
//https://www.mongodb.com/docs/manual/reference/sql-comparison/

/**
 * zkontroluje jestli v db existuje uživatelský úèet a pokud ne, rovnou ho založí
 * porovná èas  
 * @param {Request} req
 * @param {Response} res
 */
exports.checkUpdate = async function (req, res) {

    let user = req.body.user

    try {
        let serverAccount = await User.find({ user_id: user.id });

        if (serverAccount == null) {
          
            let newUser = new User({ data });
            await newUser.save();

        } else {
            // do crud operace user, porovnat èas a updatovat pøípadnì
            // kontrola verze aplikace a nabídnout update

        }

    } catch (err) {
        res.status(500).json(err);
    }

}
/**
 * Porovná dva UTC èasy, jestliže je první èas vìtší vrátí true  
 * @param {String} clientUpdateTime UTC time string
 * @param {String} serverUpdateTime UTC time string
 */
exports.isServerOutDateted = function (clientUpdateTime, serverUpdateTime) {

    client = new Date(clientUpdateTime);
    server = new Date(serverUpdateTime);
    return client > server; 

}
/**
 * Vrátí akutální èas v ISO formátu
 * */
exports.currentTimeString = function () {

    return new Date().toISOString();
} 

/** Wraper pro ošetøení api akcí
 * @param {Response} res  
 * @param {Function} lambdaFun lambda
 * @param {JSON} response odpovìd
 * @param {number} kod pro úspìch (500 pokud err) 
 * */
exports.try = async function (res, lambdaFun, status = 200) {

    try {          
        await lambdaFun();
        res.sendStatus(status);
            
    } catch (err) {
        debug(err)
        res.status(500).json(err);
    }
};

/**
 * Preprocesing dat
 * @param {Request} req
 * @param {Response} res 
 * @param {any} next 
 */
exports.processDataBody = async function (req, res, next) {

    req.body.data["ownerUserID"] = req.body.userID;   
    debug(req.body.data)
    next()   

}