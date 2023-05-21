// @ts-check
'use strict';

var express = require('express');
var router = express.Router();

/** GET home page. */
router.get('/', function (req, res) {
    res.render('index', { version: process.env.VERSION || 1.0 });
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

/**
 * Lokalizace
 */
router.get('/en.json', function (req, res) {

    res.json({       
        "server-version": "Server version:",
        "home-page": "Home page",
        "login": "Log in",
        "logout": "Log out",       
        "ErrMessage": "Connection is not secure, web panel functions are blocked, use Hypertext Transfer Protocol Secure to communicate with the server."
    });

});

router.get('/cs.json', function (req, res) {

    res.json({
        "server-version": "Verze serveru:",
        "home-page": "Ovládací panel",
        "login": "Přihlásit se",
        "logout": "Odhlásit se",        
        "ErrMessage": "Připojení není zabezpečené, funkce webového panelu jsou zablokovány, pro komunikaci se serverem použijte Hypertext Transfer Protocol Secure."
    
    });

});



module.exports = router;
