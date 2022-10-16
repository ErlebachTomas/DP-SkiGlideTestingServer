/* server pro spousteni testu */
const express = require('express');
const mongoose = require('mongoose');

const routes = require('../routes/index');
const apiRouter = require('../routes/api');

/** server pro spousteni testu */
const server = express();
server.use(express.json());


server.use('/', routes); // web client
server.use('/api', apiRouter); // api


// dbs conn
let mongoDBUrl = "mongodb://localhost:27017/DP";
mongoose.connect(mongoDBUrl);
mongoose.Promise = global.Promise;


module.exports = server; 