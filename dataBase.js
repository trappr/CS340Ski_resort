var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_mccoymil',
  password        : '5817',
  database        : 'cs340_mccoymil'
});

app.use(express.static('public'));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 8585);


/*app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workout", function(err){
    var createString = "CREATE TABLE workout(" +
        "id INT PRIMARY KEY AUTO_INCREMENT,"+
        "name VARCHAR(255) NOT NULL,"+
        "reps INT,"+
        "weight INT,"+
        "date DATE,"+
        "lbs BOOLEAN)";
    pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});*/

app.get('/',function(req,res,next){
  var context = {};
  res.render('home', context);
});

app.post('/',function(req,res,next){
  var context = {};
  res.render('home', context);
});

app.get('/resortAddress',function(req,res,next){
    var context = {};
    res.render('resortAddress', context);
});

app.post('/resortAddress',function(req,res,next){
    var context = {};
    res.render('resortAddress', context);
});

app.get('/resort',function(req,res,next){
    var context = {};
    res.render('resort', context);
});

app.post('/resort',function(req,res,next){
    var context = {};
    res.render('resort', context);
});

app.get('/run',function(req,res,next){
    var context = {};
    res.render('run', context);
});

app.post('/run',function(req,res,next){
    var context = {};
    res.render('run', context);
});

app.get('/lift',function(req,res,next){
    var context = {};
    res.render('lift', context);
});

app.post('/lift',function(req,res,next){
    var context = {};
    res.render('lift', context);
});


app.get('/resortAddress/getvalue', function(req,res,next) {

  pool.query('SELECT * FROM skiRes_address WHERE `id`=?',[req.query.id], function (err, rows, fields) {
    if (err) {
      next(err);
      return;
    }
    res.send(JSON.stringify({"status": 200, "error": null, "response": rows}))
  });
});

app.get('/resort/getAddress', function(req,res,next) {

    pool.query('SELECT `id`,`street` FROM skiRes_address', function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        res.send(JSON.stringify({"status": 200, "error": null, "response": rows}))
    });
});

app.get('/resort/getAllResortName', function(req,res,next) {

    pool.query('SELECT `id`,`name` FROM skiRes_resort', function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        res.send(JSON.stringify({"status": 200, "error": null, "response": rows}))
    });
});

app.post('/resortAddress/insert',function(req,res,next){

  pool.query("INSERT INTO skiRes_address SET `street`=?, `city`=?, `state`=?, `zip`=?",
      [req.body.street, req.body.city, req.body.state,req.body.zip]
      , function(err, result){
    if(err){
      next(err);
      return;
    }
        res.send(JSON.stringify({"status": 200, "error": null, "response": result}))
  });
});

app.post('/resortAddress/search',function(req,res,next){

  pool.query("SELECT * FROM skiRes_address WHERE `street`=? OR `city`=? OR `state`=? OR `zip`=?",
      [req.body.street, req.body.city, req.body.state,req.body.zip]
      , function(err, result){
        if(err){
          next(err);
          return;
        }
        console.log(result);
        res.send(JSON.stringify({"status": 200, "error": null, "response": result}))
      });
});

app.post('/resortAddress/simple-update',function(req,res,next){

  let item = parseInt(req.body.id,10);
  pool.query("UPDATE skiRes_address Set `street`= ?, `city`=?, `state`=?, `zip`=? WHERE `id`=? ",
      [req.body.street, req.body.city, req.body.state ,req.body.zip , item],
      function(err, result){
        if(err){
          next(err);
          return;
        }
        res.send(JSON.stringify({"status": 200, "error": null, "response": result}))
      });
});

app.post('/resortAddress/simple-delete',function(req,res,next){

  let item = parseInt(req.body.id,10);
  pool.query("DELETE FROM skiRes_address WHERE `id`=?",
      [item],
      function(err, result){
        if(err){
          next(err);
          return;
        }
        res.send(JSON.stringify({"status": 200, "error": null, "response": result}))
      });
});

app.get('/resortAddress/table', function(req,res,next) {

  pool.query('SELECT * FROM skiRes_address', function (err, rows, fields) {
    if (err) {
      next(err);
      return;
    }
    res.send(JSON.stringify({"status": 200, "error": null, "response": rows}))
  });
});

app.get('/resort/getvalue', function(req,res,next) {

    pool.query('SELECT * FROM skiRes_resort WHERE `id`=?',[req.query.id], function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        res.send(JSON.stringify({"status": 200, "error": null, "response": rows}))
    });
});

app.post('/resort/insert',function(req,res,next){

    //let item = parseInt(req.body.address,10);
    pool.query("INSERT INTO skiRes_resort SET `name`=?, `elevation`=?, `snowfall`=?",
        [req.body.name, req.body.elevation, req.body.snowfall]
        , function(err, result){
            if(err){
                next(err);
                return;
            }
            res.send(JSON.stringify({"status": 200, "error": null, "response": result}))
        });
});


app.post('/resort/simple-update',function(req,res,next){

    let item = parseInt(req.body.id,10);
    pool.query("UPDATE skiRes_resort Set `name`= ?, `elevation`=?, `snowfall`=? WHERE `id`=? ",
        [req.body.name, req.body.elevation, req.body.snowfall , item],
        function(err, result){
            if(err){
                next(err);
                return;
            }
            res.send(JSON.stringify({"status": 200, "error": null, "response": result}))
        });
});

app.post('/resort/simple-delete',function(req,res,next){

    let item = parseInt(req.body.id,10);
    pool.query("DELETE FROM skiRes_resort WHERE `id`=?",
        [item],
        function(err, result){
            if(err){
                next(err);
                return;
            }
            res.send(JSON.stringify({"status": 200, "error": null, "response": result}))
        });
});

app.get('/resort/table', function(req,res,next) {

    pool.query('SELECT * FROM skiRes_resort', function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        res.send(JSON.stringify({"status": 200, "error": null, "response": rows}))
    });
});

app.post('/resort/addressUpdate',function(req,res,next){
    console.log(req.body);
    let item = parseInt(req.body.resort,10);
    let item2 = parseInt(req.body.address, 10);
    pool.query("UPDATE skiRes_resort Set `address_ID` =? WHERE `id`=? ",
        [item2, item],
        function(err, result){
            if(err){
                next(err);
                return;
            }
            res.send(JSON.stringify({"status": 200, "error": null, "response": result}))
        });
});

app.get('/runResort/getvalue', function(req,res,next) {

  pool.query('SELECT `name` FROM skiRes_resort WHERE `id`=?',[req.query.id], function (err, rows, fields) {
    if (err) {
      next(err);
      return;
    }
    res.send(JSON.stringify({"status": 200, "error": null, "response": rows}))
  });
});

app.get('/run/getAllRunName', function(req,res,next) {

  pool.query('SELECT `id`,`name` FROM skiRes_run', function (err, rows, fields) {
      if (err) {
          next(err);
          return;
      }
      res.send(JSON.stringify({"status": 200, "error": null, "response": rows}))
  });
});

app.get('/run/getvalue', function(req,res,next) {

  pool.query('SELECT * FROM skiRes_run WHERE `id`=?',[req.query.id], function (err, rows, fields) {
      if (err) {
          next(err);
          return;
      }
      res.send(JSON.stringify({"status": 200, "error": null, "response": rows}))
  });
});

app.post('/run/insert',function(req,res,next){

  //let item = parseInt(req.body.address,10);
  pool.query("INSERT INTO skiRes_run SET `name`=?, `class`=?, `groomed`=?",
      [req.body.name, req.body.class, req.body.groomed]
      , function(err, result){
          if(err){
              next(err);
              return;
          }
          res.send(JSON.stringify({"status": 200, "error": null, "response": result}))
      });
});

app.post('/run/simple-update',function(req,res,next){

  let item = parseInt(req.body.id,10);
  pool.query("UPDATE skiRes_run Set `name`= ?, `class`=?, `groomed`=? WHERE `id`=? ",
      [req.body.name, req.body.class, req.body.groomed, item],
      function(err, result){
          if(err){
              next(err);
              return;
          }
          res.send(JSON.stringify({"status": 200, "error": null, "response": result}))
      });
});

app.post('/run/simple-delete',function(req,res,next){

  let item = parseInt(req.body.id,10);
  pool.query("DELETE FROM skiRes_run WHERE `id`=?",
      [item],
      function(err, result){
          if(err){
              next(err);
              return;
          }
          res.send(JSON.stringify({"status": 200, "error": null, "response": result}))
      });
});

app.get('/run/table', function(req,res,next) {

  pool.query('SELECT * FROM skiRes_run', function (err, rows, fields) {
      if (err) {
          next(err);
          return;
      }
      res.send(JSON.stringify({"status": 200, "error": null, "response": rows}))
  });
});

app.post('/run/resortUpdate',function(req,res,next){
  console.log(req.body);
  let item = parseInt(req.body.run,10);
  let item2 = parseInt(req.body.resort, 10);
  pool.query("UPDATE skiRes_run Set `resort_ID` =? WHERE `id`=? ",
      [item2, item],
      function(err, result){
          if(err){
              next(err);
              return;
          }
          res.send(JSON.stringify({"status": 200, "error": null, "response": result}))
      });
});

app.get('/liftResort/getvalue', function(req,res,next) {

  pool.query('SELECT `name` FROM skiRes_resort WHERE `id`=?',[req.query.id], function (err, rows, fields) {
    if (err) {
      next(err);
      return;
    }
    res.send(JSON.stringify({"status": 200, "error": null, "response": rows}))
  });
});

app.get('/lift/getAllLiftName', function(req,res,next) {

  pool.query('SELECT `id`,`name` FROM skiRes_lift', function (err, rows, fields) {
      if (err) {
          next(err);
          return;
      }
      res.send(JSON.stringify({"status": 200, "error": null, "response": rows}))
  });
});

app.get('/lift/getvalue', function(req,res,next) {

  pool.query('SELECT * FROM skiRes_lift WHERE `id`=?',[req.query.id], function (err, rows, fields) {
      if (err) {
          next(err);
          return;
      }
      res.send(JSON.stringify({"status": 200, "error": null, "response": rows}))
  });
});

app.post('/lift/insert',function(req,res,next){

  //let item = parseInt(req.body.address,10);
  pool.query("INSERT INTO skiRes_lift SET `name`=?, `chairs`=?, `top`=?",
      [req.body.name, req.body.chairs, req.body.top]
      , function(err, result){
          if(err){
              next(err);
              return;
          }
          res.send(JSON.stringify({"status": 200, "error": null, "response": result}))
      });
});


app.post('/lift/simple-update',function(req,res,next){

  let item = parseInt(req.body.id,10);
  pool.query("UPDATE skiRes_lift Set `name`= ?, `chairs`=?, `top`=? WHERE `id`=? ",
      [req.body.name, req.body.chairs, req.body.top, item],
      function(err, result){
          if(err){
              next(err);
              return;
          }
          res.send(JSON.stringify({"status": 200, "error": null, "response": result}))
      });
});

app.post('/lift/simple-delete',function(req,res,next){

  let item = parseInt(req.body.id,10);
  pool.query("DELETE FROM skiRes_lift WHERE `id`=?",
      [item],
      function(err, result){
          if(err){
              next(err);
              return;
          }
          res.send(JSON.stringify({"status": 200, "error": null, "response": result}))
      });
});

app.get('/lift/table', function(req,res,next) {

  pool.query('SELECT * FROM skiRes_lift', function (err, rows, fields) {
      if (err) {
          next(err);
          return;
      }
      res.send(JSON.stringify({"status": 200, "error": null, "response": rows}))
  });
});

app.post('/lift/resortUpdate',function(req,res,next){
  console.log(req.body);
  let item = parseInt(req.body.lift,10);
  let item2 = parseInt(req.body.resort, 10);
  pool.query("UPDATE skiRes_lift Set `resort_ID` =? WHERE `id`=? ",
      [item2, item],
      function(err, result){
          if(err){
              next(err);
              return;
          }
          res.send(JSON.stringify({"status": 200, "error": null, "response": result}))
      });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});
