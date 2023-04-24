const TestSession = require('../model/TestSession');
const debug = require('debug')('myApp');
const middleware = require('./generalController');
const SkiRide = require('../model/SkiRide')

exports.insertTestSession = async function (req, res) {
    /**
     * #swagger.tags = ['TestSession']
     * #swagger.security = [{
                  "apiKeyAuth": []
              }]  
     * #swagger.summary = = Vložení nové testSession
     * #swagger.parameters['data'] = {
     *     in: 'body',
     *     description: 'Data obsahující informace o TestSession, která má být vložena.',
     *     required: true,
     *     type: 'object',
     *     schema: { $ref: "#/definitions/DataBody" }
     * }
     * #swagger.responses[201] = {
     *     description: 'Test úspěšně vložen' *    
     * }
     * #swagger.responses[500] = {
     *     description: 'Interní chyba serveru' *    
     * }
     */
    debug(req.body.data)

    middleware.try(res, async function () {
        new TestSession(req.body.data).save();
    }, 201);
}

exports.updateTestSession = async function (req, res) {
    /**
     * #swagger.tags = ['TestSession']
     * #swagger.security = [{
                  "apiKeyAuth": []
              }] 
     * #swagger.summary = Aktualizace existujícího testu
     * #swagger.parameters['data'] = {
     *     in: 'body',
     *     description: 'Data testu',
     *     required: true,
     *     type: 'object',
     *     schema: { $ref: "#/definitions/DataBody" }
     * }
     * #swagger.responses[200] = {
     *     description: 'úspěšně aktualizováno',    
     * }
     * #swagger.responses[500] = {
     *     description: 'Interní chyba serveru', *    
     * }
     */
    middleware.try(res, async function () {

        const filter = { "UUID:": req.body.data.UUID, "ownerUserID": req.body.userID };
        let updateDoc = req.body.data;
        TestSession.updateOne(filter, updateDoc, { upsert: true });

    });
}

exports.deleteTestSession = async function (req, res) {
    /**
    * #swagger.tags = ['TestSession'] 
    * #swagger.security = [{
    *     "apiKeyAuth": []
    * }] 
    * #swagger.summary =  Vymaže všechny testy včetně všech souvisejících lyžařských jízd
    * #swagger.responses[200] = {
    *     description: TestSession a přidružené SkiRides úspěšně odstraněny. *  
    * }
    * #swagger.responses[404] = {
    *     description: TestSession nebyl nalezen    
    * }
    * #swagger.responses[500] = { 
    *  description: Vnitřní chyba serveru.
    * }
    * */

    try {
        const testSession = await TestSession.findOneAndRemove({ UUID: req.body.data.UUID, ownerUserID: req.body.userID });

        if (testSession) {
            await SkiRide.deleteMany({ testSessionID: testSession.UUID });
            res.status(200).json({ message: "TestSession and associated SkiRides deleted successfully." });
        } else {
            res.status(404).json({ message: "TestSession not found." });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.syncTestSession = async function (req, res) {
    /**
    * #swagger.tags = ['TestSession']
    * #swagger.security = [{
    *     "apiKeyAuth": []
    * }] */
    middleware.try(res, async function () {
        let result = await TestSession.find({ ownerUserID: req.body.userID, UUID: req.body.data.UUID });
        if (Object.keys(result).length == 0) {
            new TestSession(req.body.data).save();
        }

    });
}

exports.getAllUserTests = async function (req, res) {
    /**
    * #swagger.tags = ['TestSession']
    * #swagger.security = [{
    *     "apiKeyAuth": []
    * }] */
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