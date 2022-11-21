'use strict';
var express = require('express');
var router = express.Router();
const debug = require('debug')('myApp');

/* Controllers */
const middleware = require('../controller/middleware');
const userController = require('../controller/userController');
const skiController = require('../controller/skiController');
const testSessionController = require('../controller/testSessionController');

/* auth */
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');

const User = require('../model/User');
const Ski = require('../model/Ski');
const TestSession = require('../model/testSession');
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
    res.send( req.body);
});

router.post('/checkUpdate', middleware.checkUpdate);

/* UŽIVATELE */
/** vrátí seznam všech registrovaných uživatelů */
router.get('/getAllUsers', userController.getAllUsers);
router.get('/getUser', checkJwt, userController.getUser);




router.get('/getAllUsersSki', checkJwt, skiController.getAllUsersSki);



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

    res.json({ data: middleware.currentTimeString() }); //test data

});

router.post('/addTestSession', checkJwt, testSessionController.insertTestSession)

/**
 Hromadný import dat
 * */
router.post('/uploadData', checkJwt, async function (req, res) {

    //todo try + validace vstupů 

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
        updated_at: middleware.currentTimeString()
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
            updated_at: middleware.currentTimeString()
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
                updated_at: middleware.currentTimeString()
            }
            await new Ski(ski).save();
        } 

    })         
    res.json({ data: middleware.currentTimeString() }); 

});



// This route needs authentication
router.get('/private', checkJwt, function (req, res) {
    res.json({
        message: 'Hello from a private endpoint!'
    });
});


// You need to be authenticated and have a scope of read:messages to see this
const checkScopes = requiredScopes('read:ski');
router.get('/private-scoped', checkJwt, checkScopes, function (req, res) {
    res.json({
        message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
    });
});

module.exports = router;
