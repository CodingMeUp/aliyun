var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
//console.log(crypto.getHashes()); 显示支持的加密
var fs = require('fs');
var cookieParser = require('cookie-parser');
var session = require('express-session'); //如果要使用session，需要单独包含这个模块
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var filterRoutes = require('./routes/filter');
var homeRoutes = require('./routes/home');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//设置成HTML格式替换EJS
//app.engine("html",require("ejs").__express); // or   app.engine("html",require("ejs").renderFile);
//app.set('view engine', 'html');
app.set('view engine', 'ejs');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//设置Cookie
app.use(cookieParser('mysecret_chenyunong'));
//设置Session
app.use(session({
  secret                :        'session-secret',   //cookie加密的session
  name                  :        'connect.chenyunong.session',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
  cookie                :        {maxAge: 60*30*10*60*1000 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
  resave                :        false,   //是指每次请求都重新设置session cookie
  saveUninitialized     :        false   //是指无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use('/', filterRoutes);
app.use('/', routes);
app.use('/home', homeRoutes);


var SinaCloud = require('scs-sdk');
SinaCloud.config.loadFromPath('./sinaYun.json');
var myBucket = new SinaCloud.S3({params: {Bucket: 'miaomiao'}});
myBucket.createBucket(function() {
  var data = {Key: 'firstInsert', Body: 'chenyunongdd'};
  myBucket.putObject(data, function(err, data) {
    if (err) {
      console.log("Error uploading data: ", err);
    } else {
      console.log("Successfully uploaded data to miaomiao/firstInsert");
    }
  });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(9999, '127.0.0.1', function() {
  });


module.exports = app;
