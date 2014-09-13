var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/:type', function(req, res) {
  res.render('tables', {title: req.params['type'], type: req.params['type']});
});

module.exports = router;
