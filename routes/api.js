'use strict';
var express = require('express');
var router = express.Router();

/* GET */
router.get('/', function (req, res) {
    res.send(req.body);
});
/* POST */
router.post('/', function (req, res) {
    res.send({ "req.body": req.body }); //pro kontrolu
});

/* todo remove test */
router.get('/data', function (req, res) {
    res.json({ data: 'test' });
});

module.exports = router;
