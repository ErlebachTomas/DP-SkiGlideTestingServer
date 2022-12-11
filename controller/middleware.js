const Ski = require('../model/Ski');
const User = require('../model/User');
const TestSession = require('../model/TestSession');

const debug = require('debug')('myApp');


/* Bussines logika */
//https://www.mongodb.com/docs/manual/reference/sql-comparison/

/**
 * zkontroluje jestli v db existuje u�ivatelsk� ��et a pokud ne, rovnou ho zalo��
 * porovn� �as  
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
            // do crud operace user, porovnat �as a updatovat p��padn�
            // kontrola verze aplikace a nab�dnout update

        }

    } catch (err) {
        res.status(500).json(err);
    }

}
/**
 * Porovn� dva UTC �asy, jestli�e je prvn� �as v�t�� vr�t� true  
 * @param String clientUpdateTime UTC time string
 * @param String serverUpdateTime UTC time string
 */
exports.isServerOutDateted = function (clientUpdateTime, serverUpdateTime) {

    client = new Date(clientUpdateTime);
    server = new Date(serverUpdateTime);
    return client > server; 

}
/**
 * Vr�t� akut�ln� �as
 * */
exports.currentTimeString = function () {

    return new Date().toISOString();
} 