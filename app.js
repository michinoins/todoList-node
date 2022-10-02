require('dotenv').config();

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
const { Firestore } = require('@google-cloud/firestore');

const { FirestoreStore } = require('@google-cloud/connect-firestore');

const ses_opt = {
  store: new FirestoreStore({
    dataset: new Firestore(),
    kind: 'express-sessions',
    projectId: 'semiotic-axis-363920',
  }),
  secret: 'my-secret',
  resave: false,
  saveUninitialized: true,
  expires: new Date(Date.now() + 60 * 60 * 1000),
};

// cors setting
var frontOrigin = '';
if (process.env.NODE_ENV === 'production') {
  frontOrigin =
    'https://frontend-react-dot-semiotic-axis-363920.de.r.appspot.com';
} else {
  frontOrigin = 'http://localhost:3001';
}

console.log('front_origin ' + frontOrigin);
app.use(
  cors({
    origin: frontOrigin,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.enable('trust proxy');
app.use(session(ses_opt));

// common processing
app.use((req, res, next) => {
  // exclude login API for authentication  common processing
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
