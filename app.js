var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var thisweek = require('./routes/thisweek');
var search = require('./routes/search');
var albumdetails = require('./routes/albumdetails');

// Connecting my database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb://joshua:roofuzz@ds263948.mlab.com:63948/music-tags');

// Use this to see when the database is connected
// db.then(() => {
//   console.log('Connected correctly to database server')
// })

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Making my DB accessable to the router
app.use(function(req,res,next){
	req.db = db;
	next();
});


app.use('/', index);
app.use('/thisweek', thisweek);
app.use('/search', search);
app.use('/albumdetails', albumdetails);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
