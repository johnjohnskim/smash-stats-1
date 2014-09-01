var express = require('express');
var bodyParser = require('body-parser');

var sql = require('./sql');

var router = express.Router();

router.use(function(req, res, next) {
  console.log('Something is happening.');
  next();
});

router.get('/', function(req, res) {
  res.end('api up in here');
});

// PLAYERS
router.route('/players')
  .get(function(req, res) {
    sql.getRows("SELECT * FROM players", null, function(err, rows) {
      res.json(rows);
    });
  })
  .post(function(req, res) {
    var name = req.body.name;
    if (!name) {
      return res.end('Need a name');
    }
    sql.insert("INSERT INTO players (name) VALUES ($1)", [req.body.name], function(err, id) {
      res.json(id);
    });
  })

router.route('/players/:pid')
  .get(function(req, res) {
    sql.getRows("SELECT * FROM players WHERE id=$1", [req.params.pid], function(err, rows) {
      res.json(rows[0]);
    });
  })
  .put(function(req, res) {
    var name = req.body.name;
    if (!name) {
      return res.end('Need a name');
    }
    sql.query("UPDATE players SET name=$1 WHERE id=$2", [req.body.name, req.params.pid], function(err, id) {
      res.end('ok');
    });
  })

// STAGES + CHARACTERS
var views = ['stages', 'stagewins', 
  'characters', 'characterwins', 'charactermeta', 'charactervs',
  'playermeta', 'playervs'];

views.forEach(function(v) {
  router.route('/' + v)
    .get(function(req, res) {
      sql.getRows("SELECT * FROM " + v, null, function(err, rows) {
        res.json(rows);
      });
    })
});

module.exports = router;
