﻿'use strict';
const dotenv = require('dotenv').config();
const debug = require('debug')('myApp');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


// dbs 
const mongoose = require('mongoose');
let mongoDBUrl = process.env.local == "true" ? process.env.DB_CONNECTION_LOCAL : process.env.DB_CONNECTION 
debug(mongoDBUrl)
mongoose.connect(mongoDBUrl);
mongoose.Promise = global.Promise;


var routes = require('./routes/index');
var api = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes); //web client
app.use('/api', api); //REST api

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./docAPI.json')
/**
 * Dokumentace api
 */
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {

    app.locals.pretty = true // jade pug "pretty-format" html

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
    
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
app.set('port', process.env.PORT || 3000);


var server = app.listen(app.get('port'), function () {

    console.log('server listening on port ' + server.address().port);   

    debug('server listening on port ' + server.address().port);

});
