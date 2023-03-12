const TestSession = require('../model/TestSession');
const debug = require('debug')('myApp');
const middleware = require('./middleware');


exports.insertTestSession = async function (req, res) {

    debug(req.body.data)

    middleware.try(res, async function () {
        new TestSession(req.body.data).save();
    }, 201);
}

exports.updateTestSession = async function (req, res) {
    middleware.try(res, async function () {

        const filter = { "UUID:": req.body.data.UUID, "ownerUserID": req.body.userID };
        let updateDoc = req.body.data;
        TestSession.updateOne(filter, updateDoc, { upsert: true });

    });
}

exports.deleteTestSession = async function (req, res) {
    middleware.try(res, async function () {
        TestSession.findOneAndRemove({ UUID: req.body.data.UUID, ownerUserID: req.body.userID });
    });
}

exports.syncTestSession = async function (req, res) {
    middleware.try(res, async function () {
      let result =  await TestSession.find({ ownerUserID: req.body.userID, UUID: req.body.data.UUID });
      if (Object.keys(result).length == 0) {
          new TestSession(req.body.data).save();
      }

    });
}

exports.getAllUserTests = async function (req, res) {

    debug("nacitam data testu pro " + req.query.userID)

    try {      
        let result = await TestSession.find({ ownerUserID: req.query.userID });       
        res.json(result);

    } catch (err) {
        debug(err)
        res.status(500).json(err);
    }
  
   
}


/*
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
*/