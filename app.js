var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var todosRouter = require('./routes/todos');

var app = express();
var cors = require('cors');

var session = require('express-session');

app.use(
  cors({
    origin: 'http://localhost:3001',
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const ses_opt = {
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  expires: new Date(Date.now() + 60 * 60 * 1000),
};

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(ses_opt));

app.use((req, res, next) => {
  // exclude login API
  if (req.path === '/users/login' || req.path === '/users') return next();
  console.log('common Processing');
  console.log('user is' + req.session.login);
  const currentUser = req.session.login;
  if (currentUser === undefined) {
    res.setHeader('Content-Type', 'application/json');
    res.sendStatus(401);
    res.end(JSON.stringify({ errorCode: 401 }));
    return;
  }
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/todos', todosRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
