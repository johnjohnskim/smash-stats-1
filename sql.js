var pg = require('pg');
***REMOVED***

var sql = {};

function makeQuery(query, args, callback) {
  if (!args || !args.length) { args = null; }
  pg.connect(conn, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query(query, args, function(err, result) {
      done();
      if (err) {
        return console.error('error running query', err);
      } else {
        callback(err, result);
      }
    });
  });
}
sql.query = makeQuery;

sql.getRows = function(query, args, callback) {
  makeQuery(query, args, function(err, result) {
    callback(err, result.rows);
  })
}

sql.insert = function(query, args, callback) {
  if (!query.match(/RETURNING/i)) {
    query += ' RETURNING id';
  }
  makeQuery(query, args, function(err, result) {
    callback(err, result.rows[0]);
  })
}

module.exports = sql;
