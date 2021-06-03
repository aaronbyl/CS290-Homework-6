var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 5635);
app.use('/public',express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res, next) {
  res.render('home');
});

app.get('/workouts', function(req, res, next) {
  var workoutObj = {};
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    workoutObj.results = JSON.stringify(rows);
    workoutObj.rows = rows;
    //console.log(workoutObj.results);
    res.send(workoutObj);
  });
});

app.post('/addworkout',function(req, res, next){
  var context = {};
  var sqlCmd = "INSERT INTO workouts(name, reps, weight, date, lbs) VALUES (?, ?, ?, ?, ?)";
  mysql.pool.query(sqlCmd, [req.body.name, req.body.reps, req.body.weight, req.body.date, 
  req.body.lbsFlag], function(err, result){
    if(err){
      next(err);
      return;
    }
    //context.results = "Inserted id " + result.insertId;
    //if no errors, select new id and return to client
    console.log('result.insertId = ' + result.insertId);
    
    var newRow = {};
    mysql.pool.query('SELECT * FROM workouts WHERE id=?', [result.insertId], function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      newRow.results = JSON.stringify(rows);
      newRow.rows = rows;
      //console.log(newRow.results);
      res.send(newRow);
    });
  });
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
  var sql = "INSERT INTO workouts(`name`, `reps`, `weight`, `date`, `lbs`) VALUES ('Aaron', 2, 205, '2021-05-29', 0)";
  mysql.pool.query(sql, function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Inserted id " + result.insertId;
    console.log('result.insertId = ' + result.insertId);
    
    var newRow = {};
    mysql.pool.query('SELECT * FROM workouts WHERE id=?', [result.insertId], function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      newRow.results = JSON.stringify(rows);
      newRow.rows = rows;
      console.log(newRow.results);
    
      res.send(context);
    });
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
