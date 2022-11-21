const TestSession = require('../model/testSession');
const debug = require('debug')('myApp');


exports.getAll = async function (req, res) {

    debug("nacitam data testu pro " + req.query.user)

    try {
        let data = await TestSession.find({ ownerUserID: req.user });
        res.json(data);

    } catch (err) {
        res.status(500).json(err);
    }
};


exports.insertTestSession = async function (req, res)  {

    debug(req.body.testSession)

    const { testSession } = req.body.testSession;
   
    let test = new TestSession({testSession});
        
    try {
        let r = await test.save();
        res.json({ saved: r })
    } catch (err) {
        res.status(500).json(err);
    }

};