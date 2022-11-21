const User = require('../model/User');
const debug = require('debug')('myApp');

/**
 * Vrátí seznam všech uživatelů 
 * @param {any} req
 * @param {any} res
 */
exports.getAllUsers = async function (req, res) {

    try {
        let users = await User.find({}, { name: 1 });
        res.json(users);

    } catch (err) {
        res.status(500).json(err);
    }
};
/**
 * Pro user_id vrátí informace o uživatelském účtu v databázi 
 * @param {any} req
 * @param {any} res
 */
exports.getUser = async function (req, res) {

    let id = req.body.user_id 

    try {
        let user = loadUserByID(user_id);

        res.json(user);

    } catch (err) {
        res.status(500).json(err);
    }

}
/**
 * Aktualizuje uživatele v db 
 * @param User auktualizované parametry, id musí být stejné  
 */
exports.updateUser =  async function(user) {

    return user.updateOne(
        { user_id: user.user_id },
        { $set: { user } }
    ), function (err, obj) {
        if (err) throw err;
        debug(user.user_id + " update!")
    };
}
/**
Smaže uživatele z db
@param User user
 */
exports.deleteUser = async function (user) {

    var query = { user_id: user.user_id }; //do přepsat na id? 

    user.deleteOne(query, function (err, obj) {
        if (err) throw err;
        debug(user.user_id + " delete!")
        return true;
    });
}
/**
 * Vloží uživatele do db
 * @param User user
 */
exports.insertUser = async function (user) {
    debug(user.user_id + " inserted!")
    return user.save();
}
/**
 * Načte uživatele z dababáze
 * @param String user_id
 */
exports.loadUserByID = async function (id) {

    return await User.find({ user_id: id });
}