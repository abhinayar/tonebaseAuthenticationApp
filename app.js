// NodeJS Authentication App for tonebase, inc.
// By Abhi Nayar, Summer 2017
// anayar2@gmail.com

// set up =======================
// get deps.
var express = require('express'),
app = module.exports = express(),
port = process.env.PORT || 3000,
path = require('path'),
passport = require('passport'),
flash = require('connect-flash'),
dotenv = require('dotenv'),
favicon = require('serve-favicon');

var morgan = require('morgan'),
cookieParser = require('cookie-parser'),
bodyParser = require('body-parser'),
session = require('express-session');

// local modules
authHelpers = require('./modules/auth/helpers.js');

// globals
users = {};

// config ======================
// connect to DB
// configure passport
require('./config/passport')(passport);
// load .env file
dotenv.load()

// set up express app
app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

// set view engine + dir.
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// static assets (css, js, imgs) in public/ folder
app.use(express.static(path.join(__dirname, 'public')));

// passport deps
app.use(session({
  secret: process.env.SECRET,
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false
}));
// init passport
app.use(passport.initialize());
// for persistent login sessions
app.use(passport.session());
// flash message displays (on errors/success)
app.use(flash());

// load routes ==================
var home = require('./app/routes/home'),
auth = require('./app/routes/auth');

app.use('/', home)
app.use('/home', home)
app.use('/auth', auth)

// launch app ===================
app.listen(port);
console.log('NodeJS Registration App Running on port ' + port);
