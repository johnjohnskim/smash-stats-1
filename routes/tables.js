var express = require('express');
var http = require('http');
var bl = require('bl');
var _ = require('lodash');
var router = express.Router();


var getOptions = {host: 'localhost', port: 8080};

function addEndpoint(path, api, template, extra) {
  router.get(path, function(req, res) {
    getOptions.path = '/api/' + api;
    http.get(getOptions, function(result) {
      result.pipe(bl(function(err, data) {
        data = JSON.parse(data);
        data = _.sortBy(data, 'winpct').reverse();
        data.forEach(function(d) {
          d.winpct = Math.round(d.winpct * 100) + '%';
        });
        if (!extra) {extra = {};}
        extra.data = data;
        res.render(template, extra);
      }));
    });  
  });
}

addEndpoint('/leaderboards/players', 'playermeta', 'leaderboards', {title: 'Leaderboards'});
addEndpoint('/leaderboards/characters', 'charactermeta', 'leaderboards', {title: 'Character Leaderboards'});

addEndpoint('/bestas/characters', 'characterwins', 'bestas', {title: 'Best Characters', type: 'Character'});
addEndpoint('/bestas/stages', 'stagewins', 'bestas', {title: 'Best Stages', type: 'Stage'});

addEndpoint('/matchups/players', 'playervs', 'matchups', {title: 'Player vs Player', type: 'Player'});
addEndpoint('/matchups/characters', 'charactervs', 'matchups', {title: 'Character vs Character', type: 'Character'});


module.exports = router;
