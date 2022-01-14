var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

var authen_author = require('./components/authen_author'); 
var usersRouter = require('./components/users');
var classesRouter = require('./components/classes');
var adminsRouter = require('./components/admins');
const AuthMiddleWare = require("./middlewares/auth_middleware.mdw");
const { DOMAIN_FE } = require('./config/const.config')
const s_or_not = DOMAIN_FE[4]=='s'? 'https' : 'http';

var app = express();

const server = require(s_or_not).createServer(app);
const io = require("socket.io")(server);
require('./socket/index')(io);
// const io_router = require('./socket/index')(io);
// app.use(io_router);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use('/', authen_author);
app.use(AuthMiddleWare.isAuthor);
app.use('/users', usersRouter);
app.use('/classes', classesRouter);
app.use('/admins', AuthMiddleWare.isAdmin, adminsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
