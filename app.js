//为集成socket.io而写
var io=require('socket.io')();
//end
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var exphbs = require('express-handlebars');



var index = require('./routes/index');
var pcrecord=require('./routes/pcrecord')(io);

var app = express();

//视图引擎设置
var hbs = exphbs.create({
  layoutsDir: 'views/layouts',
  defaultLayout: 'f7layouts',
  extname: '.html'
})
//视图引擎设置结束

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.engine('.html', hbs.engine);
app.set('view engine', '.html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/pcrecord',pcrecord);

console.log("服务器启动完成")

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

//为集成socket.io而写
app.io=io;
//io.on('connection',function(socket){
//  console.log('连接成功'); 
//})
//end

module.exports = app;
