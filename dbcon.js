var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_byla',
  password        : '1964',
  database        : 'cs290_byla'
});

module.exports.pool = pool;