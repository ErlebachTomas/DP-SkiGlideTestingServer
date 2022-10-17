'use strict';
var express = require('express');
var router = express.Router();
const debug = require('debug')('myApp');


/* Controllers */
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

/** vrátí seznam všech registrovaných uživatelů */
router.get('/getAllUsers', userController.getAllUsers);

router.get('/getAllUsersSki', skiController.getAllUsersSki);



/* todo remove test */
router.get('/data', function (req, res) {   
    res.json({ data: 'test' });
});

router.post('/addTestSession', testSessionController.insertTestSession)


router.post('/addTests', function (req, res) {
    res.json({ data: 'test' }); //DO controller
});



// This route needs authentication
router.get('/private', checkJwt, function (req, res) {
    res.json({
        message: 'Hello from a private endpoint!'
    });
});

const checkScopes = requiredScopes('read:ski');

// You need to be authenticated and have a scope of read:messages to see this

router.get('/private-scoped', checkJwt, checkScopes, function (req, res) {
    res.json({
        message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
    });
});







module.exports = router;
