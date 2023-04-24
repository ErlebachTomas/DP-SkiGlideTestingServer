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
   
    try {
        let user = loadUserByID(req.body.user_id);

        /** 
        #swagger.tags = ['User']
        #swagger.summary = vrátí objekt uživatele
        #swagger.description = obsahuje všechna data o uživateli
        #swagger.responses[200] = {
              description: 'Uživatelská data',
              schema: { $ref: '#/definitions/User' }
        #swagger.security = [{
                "apiKeyAuth": []
            }] 
       } */

        res.status(200).json(user);

       

    } catch (err) {
        res.status(500).json(err);
    }

}
/**
 * Načte uživatele z dababáze
 * @param String user_id
 */
exports.loadUserByID = async function (id) {

    return await User.find({ user_id: id });
}
/**
 * 
 * Pokud neexistuje vloží * 
 * @param {Json object} email, name, sub = id 
 * @returns {User}
 * @throws {Exception} err
 */
exports.addIfNotExist = async function (userJson) {

    let result = await this.loadUserByID(userJson.sub); 
    if (Object.keys(result).length > 0) {
        debug(userJson.name + " již existuje, nepřidávám");
        return result[0];
    } else {      
        const user = {
            user_id: userJson.sub,
            email: userJson.email,
            name: userJson.name,
            updated_at: userJson.updated_at
        }        
        return await new User(user).save();
    } 

}
// todo funkce, ověření a update 


/* === ? ==== */


 /**
 * Aktualizuje uživatele v db
 * @param User auktualizované parametry, id musí být stejné
 */
exports.updateUser = async function (user) {

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
 
 
