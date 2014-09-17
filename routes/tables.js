var express = require('express');
var path = require('path');
var _ = require('lodash');
var router = express.Router();

var tablePages = require('./table-pages');

router.get('/:type', function(req, res) {
  var tablePage = _.find(tablePages, function(p) {
    return p[0] == req.params['type'];
  });
  if (tablePage) {
    res.render('tables', { title: tablePage[1], type: req.params['type'] });
  } else {
    res.render('tables', { title: 'table not found' })
  }
});

module.exports = router;
