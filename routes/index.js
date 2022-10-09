'use strict';
var express = require('express');
var router = express.Router();

/** GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

/** Login page */
router.get('/login', function (req, res) {
    res.render('login');
});


/**
 * Provide Auth configuration
 */
router.get('/auth_config.json', function (req, res) {

    res.json({
        domain: process.env.Auth_domain,
        clientId: process.env.Auth_clientId
    });
});

module.exports = router;
