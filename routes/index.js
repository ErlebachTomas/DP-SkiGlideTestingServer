'use strict';
var express = require('express');
var router = express.Router();

/** GET home page. */
router.get('/', function (req, res) {
    res.render('index');
});

/** info page */
router.get('/info', function (req, res) {
    res.render('info', { title: 'Express' });
});


/**
 * Provide Auth configuration file
 */
router.get('/auth_config.json', function (req, res) {

    res.json({
        domain: process.env.Auth_domain,
        clientId: process.env.Auth_clientId,
        audience: process.env.API_IDENTIFIER
    });
});

module.exports = router;
