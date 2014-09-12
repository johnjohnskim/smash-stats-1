var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/', function(req, res) {
  // res.sendFile('table.html', { root: path.join(__dirname, '../public/html') });
  res.render('table');
});

module.exports = router;
