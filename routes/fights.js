var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/', function(req, res) {
  res.sendFile('fights.html', { root: path.join(__dirname, '../public/html') });
});

module.exports = router;
