var express = require('express');
var path = require('path');
var mysql = require('./dbcon.js');

var app = express();
app.set('port', 5635);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      if(err){
        next(err);
        return;
      }
      context.results = "Table reset";
      res.send(context);
    })
  });
});

app.get('/insert-test',function(req,res,next){
  var context = {};
  var sql = "INSERT INTO workouts ('name', 'reps', 'weight', 'date', 'lbs') VALUES ('Aaron', 5, 200, '2021-05-28', 1)";
  mysql.pool.query(sql, function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Inserted id " + result.insertId;
    res.send(context);
  });
});

app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
