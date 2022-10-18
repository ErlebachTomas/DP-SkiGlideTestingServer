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
router.get('/data', function (req, res) {   
   //... test
    res.json({ data: 'test' });
});

router.post('/addTestSession', checkJwt, testSessionController.insertTestSession)

/**
 Hromadný import dat
 * */
router.post('/uploadData', checkJwt, function (req, res) {

        res.json(req); //DO controller

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
