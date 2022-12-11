const Ski = require('../model/Ski');
const User = require('../model/User');
const TestSession = require('../model/TestSession');

const debug = require('debug')('myApp');


/* Bussines logika */
//https://www.mongodb.com/docs/manual/reference/sql-comparison/

/**
 * zkontroluje jestli v db existuje uživatelský úèet a pokud ne, rovnou ho založí
 * porovná èas  
 * @param {any} req
 * @param {any} res
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
 * @param String clientUpdateTime UTC time string
 * @param String serverUpdateTime UTC time string
 */
exports.isServerOutDateted = function (clientUpdateTime, serverUpdateTime) {

    client = new Date(clientUpdateTime);
    server = new Date(serverUpdateTime);
    return client > server; 

}
/**
 * Vrátí akutální èas
 * */
exports.currentTimeString = function () {

    return new Date().toISOString();
} 