'use strict';
var express = require('express');
var router = express.Router();
const debug = require('debug')('myApp');

/* Middleware */
const similarity = require('../middleware/similarity');

/* Controllers */
const controller = require('../controller/generalController');
const userController = require('../controller/userController');
const skiController = require('../controller/skiController');
const testSessionController = require('../controller/testSessionController');
const skiRideController = require('../controller/skiRideController');

/* auth */
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');
/* Model */
const User = require('../model/User');
const Ski = require('../model/Ski');
const TestSession = require('../model/TestSession');
const SkiRide = require('../model/SkiRide');



const { v4: uuidv4 } = require('uuid');


// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: process.env.API_IDENTIFIER,
  issuerBaseURL: 'https://' + process.env.Auth_domain
});


//  This routes doesn't need authentication 

/** GET test */
router.get('/', function (req, res) {
  res.send(req.body);
});
/** POST test */
router.post('/', function (req, res) {
  res.send(req.body);
});

/** verze api */
router.get('/version', function (req, res) {
  res.json({ version: 0.2, info: "Je dostupná nová verze aplikace" });
});


router.post('/checkUser', controller.checkUser);

/* UŽIVATELE */
/**  vrátí seznam všech registrovaných uživatelů */
router.get('/getAllUsers', checkJwt, userController.getAllUsers);
router.get('/getUser', checkJwt, userController.getUser);



/* Lyže */
router.get('/getAllUsersSki', checkJwt, skiController.getAllUsersSki);

router.post('/addSki', checkJwt, skiController.insertSki);


router.post('/deleteSki', checkJwt, async function (req, res) {
/* 
 /*
   #swagger.tags = ['Ski']
   #swagger.summary =  Vymaže lyži
  #swagger.security = [{
    "apiKeyAuth": []
}] 
*/
  try {
    await skiController.deleteSki(req.body.userID, req.body.ski.UUID);
    res.sendStatus(200);
  } catch (err) {
    debug(err)
    res.status(500).json(err);
  }
});

router.post('/updateSki', checkJwt, async function (req, res) {
  /*
   #swagger.tags = ['Ski']
   #swagger.summary =  Aktualizuje lyži
  #swagger.security = [{
    "apiKeyAuth": []
}] 
  #swagger.parameters = [{
    name: "user",
    in: "query",
    description: "ID uživatele",
    required: true,
    type: "string"
  }]
  */
  try {   

    const filter = { "UUID": req.body.ski.UUID, "ownerUserID": req.body.userID };
    const options = { upsert: true };

    let updateDoc = req.body.ski;
    updateDoc["ownerUserID"] = req.body.userID;

    const result = await Ski.updateOne(filter, updateDoc, options);
    debug(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    );

    res.sendStatus(200);

  } catch (err) {
    debug(err)
    res.status(500).json(err);
  }

});

router.get('/deleteAllUsersSkis', checkJwt, async function (req, res) {
   /*
   #swagger.tags = ['Ski']
   #swagger.summary = Vymaže všechny lyže uživatele
  #swagger.security = [{
    "apiKeyAuth": []
}] 
  #swagger.parameters = [{
    name: "user",
    in: "query",
    description: "ID uživatele",
    required: true,
    type: "string"
  }]
  */
  try {
    debug("mažu " + req.query.user);

    await Ski.deleteMany({ "ownerUserID": req.query.user });
    res.sendStatus(200);

  } catch (err) {
    debug(err)
    res.status(500).json(err);
  }
});


router.post('/syncSki', checkJwt, async function (req, res) {
  /*
   #swagger.tags = ['Ski']
   #swagger.summary = Vloží lyži pokud ještě na serveru není
  #swagger.security = [{
    "apiKeyAuth": []
}] 
  */
  try {
    debug("sync" + req.body.ski.name);

    let json = req.body.ski
    json["ownerUserID"] = req.body.userID;

    skiController.addSkiIfNotExist(req.body.userID, json);
    res.sendStatus(200);
  } catch (err) {
    debug(err);
    res.status(500).json(err);
  }

});

/* ============ TESTY =================  */
// TODO token
router.get('/getAllUserTests', testSessionController.getAllUserTests)

router.post('/addTestSession', checkJwt, controller.processDataBody, testSessionController.insertTestSession)
router.post('/updateTestSession', checkJwt, controller.processDataBody, testSessionController.updateTestSession)
router.post('/deleteTestSession', checkJwt, controller.processDataBody, testSessionController.deleteTestSession)
router.post('/syncTestSession', checkJwt, controller.processDataBody, testSessionController.syncTestSession)

/* jizdy */

router.get('/getAllSkiRide', checkJwt, skiRideController.getAllSkiRides);
router.get('/getAllSkiRideWithSki', checkJwt, skiRideController.getAllSkiRidesWithSki);

router.post('/addSkiRide', checkJwt, controller.processDataBody, skiRideController.insertSkiRide)
router.post('/updateSkiRide', checkJwt, controller.processDataBody, skiRideController.updateSkiRide)
router.post('/deleteSkiRide', checkJwt, controller.processDataBody, skiRideController.deleteSkiRide)
router.post('/syncSkiRide', checkJwt, controller.processDataBody, skiRideController.syncSkiRide)



/* undone remove test */
router.get('/data', async function (req, res) {

  //res.json({ data: 'test' });
  /*
  let userID = "123";
  let ski = {
      name: "lyze1",
      ownerUserID: userID,
      description: "testovaci lyže",
      updated_at: middleware.currentTimeString
  }

  debug(await skiController.deleteSki(userID, ski.name));
  */

  res.json({ data: controller.currentTimeString() }); //test data

});

/* undone remove test  
 */
router.post('/post-test', checkJwt, function (req, res) {

  debug(req.body.data);

  res.json({
    data: 'úspěch ' + req.body.data,

  });
});

/**
 Hromadný import dat
 * */
router.post('/uploadData', checkJwt, async function (req, res) {

  /*
  #swagger.tags = ['Tools']
      #swagger.summary = Hromadný import dat
  #swagger.security = [{
                "apiKeyAuth": []
            }] 
  */

  try {
    let userID = req.body.user.sub;

    userController.addIfNotExist(req.body.user);

    const testID = uuidv4();
    let test = {
      id: testID,
      datatime: req.body.datetime,
      ownerUserID: userID,
      airTemperature: req.body.airTemperature,
      snowTemperature: req.body.snowTemperature,
      snowType: req.body.snowType,
      testType: req.body.testType,
      note: req.body.note,
      updated_at: controller.currentTimeString()
    }

    let testSession = new TestSession(test);
    testSession.save();

    let rides = JSON.parse(req.body.skiRide);

    const skiNamesSet = new Set()

    rides.forEach(async function (arrayItem) {

      skiNamesSet.add(arrayItem.Ski);

      const skiRide = {
        id: uuidv4(),
        testSessionID: testID,
        skiID: arrayItem.Ski,
        result: arrayItem.Val,
        updated_at: controller.currentTimeString()
      }

      let r = new SkiRide(skiRide);
      r.save();

    });

    skiNamesSet.forEach(async function (item) {

      let result = await skiController.loadSki(userID, item);

      if (Object.keys(result).length == 0) {
        let ski = {
          name: item,
          ownerUserID: userID,
          description: "",
          updated_at: controller.currentTimeString()
        }
        await new Ski(ski).save();
      }

    })
  } catch (err) {
    res.status(500).json(err);
  }

  res.json({ data: controller.currentTimeString() });

});

router.get('/export', checkJwt, async function (req, res) {
   /*
   
  #swagger.tags = ['Tools']
  #swagger.summary = Export všech uživatelských dat 
  #swagger.parameters = [{
    name: "user",
    in: "query",
    description: "ID uživatele",
    required: true,
    type: "string"
  }]
 #swagger.security = [{
                "apiKeyAuth": []
            }] 
  #swagger.responses = {
    "200": {
      "description": "Úspěšný export dat",
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "properties": {
              "skiRides": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/SkiRide"
                }
              },
              "skis": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/Ski"
                }
              },
              "testSessions": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/TestSession"
                }
              }
            }
          }
        }
      }
    },
    "500": {
      "description": "Chyba serveru při exportu dat"
    }
  }
  */
      try {
        let skiRides = await SkiRide.find({ ownerUserID: req.query.user });
        let skis = await Ski.find({ ownerUserID: req.query.user });
        let testSessions = await TestSession.find({ ownerUserID: req.query.user });       
        
        res.json({
          skiRides: skiRides,
          skis : skis,
          testSessions: testSessions 
          });    
    
      } catch (err) {
        debug(err);
        res.status(500).json(err);
    }     
})


// This route needs authentication
router.get('/private', checkJwt, function (req, res) {

  console.log(req.method + ' ' + req.url + ' HTTP/' + req.httpVersion);
  for (var property in req.headers) {
    if (req.headers.hasOwnProperty(property)) {
      console.log(property + ': ' + req.headers[property])
    }
  }
  res.json({
    message: 'Hello from a private endpoint!',
    token: req.header('authorization')
  });
});


// You need to be authenticated and have a scope of read:messages to see this
const checkScopes = requiredScopes('read:ski');
router.get('/private-scoped', checkJwt, checkScopes, function (req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
  });
});


router.post('/recomendacion', checkJwt, controller.processDataBody, async function (req, res) {
  /*
    #swagger.tags = ['Recomendacion']
      #swagger.summary = Doporučí nejlepší lyže pro dané podmínky
      #swagger.responses[200] = {
          {
          skiResults: {
              differenceFromBest: number;
              score: number;
              skiUUID: string;
              skiName: string;
              skiDescription: string | undefined;
              results: number[];
              mean: number;
          }[];
          id: number;
          testData: {
                  UUID: string;
                  ownerUserID: string;
                  datetime: string;
                  airTemperature: number;
                  snowTemperature: number;
                  snowType: number;
                  testType: number;
                  status?: string | undefined;
                  updated_at?: string | undefined;
                  humidity?: number | undefined;
                  note?: string | undefined;
              }
          vector: number[];
          distance: number;
          angle: number;
      }[]           
      }
      #swagger.security = [{
              "apiKeyAuth": []
          }] 
  */
  try {    

    let r = await controller.recomendation(req.body.data) 
    debug(r)
    if(r.length > 0) {
      res.status(200).json(r)
    } else {
        /* #swagger.responses[210] = {
        description: 'Chybějící tréningová data (nedostatek testů pro predikci)' }*/
        res.status(210).json(r)
    }  
  } catch (err) {
    debug(err);
    /* #swagger.responses[500] = {
        description: 'Server error' }*/

    res.status(500).json(err);
  }
});

module.exports = router;
