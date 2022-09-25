const User = require('../model/User');

/**
 * Vr�t� seznam v�ech u�ivatel� 
 * @param {any} req
 * @param {any} res
 */
exports.getAllUsers = async function (req, res) {

    try {
        let data = await User.find({}, { login: 1 });
        res.json(data);

    } catch (err) {
        res.status(500).json(err);
    }
};
// TODO https://auth0.com/docs