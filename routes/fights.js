var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('fights', { title: 'Fights' });
});

module.exports = router;
