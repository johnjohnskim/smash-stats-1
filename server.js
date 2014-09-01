// SETUP
var express = require('express');
var bodyParser = require('body-parser');
var sql = require('./sql');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
var port = process.env.PORT || 8080;

var api = require('./api');

// RUN
app.use('/api', api);
app.listen(port);
