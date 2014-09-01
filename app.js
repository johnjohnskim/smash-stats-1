var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var api = require('./routes/api');
var tables = require('./routes/tables');
var index = require('./routes/index');

var app = express();

// views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/api', api);
app.use('/tables', tables);
app.use('/', index);

// error handlers
// 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// dev error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.end('Status: ' + err.status + '\n' + err.stack);
  });
}
// prod error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.end(err.message);
});

// module.exports = app;

app.set('port', process.env.PORT || 8080);
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
