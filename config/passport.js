// config/passport.js
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../app/models/user');
var configAuth = require('./auth');

module.exports = function(passport) {
  // serialize user for session
  passport.serializeUser(function(user, done) {
    console.log('Serializing: ', user);

    var email = user.email || user.emails[0].value;

    done(null, email);
  });
  // deserialize user for session
  passport.deserializeUser(function(email, done) {
    console.log('Deserializing: ', email)
    if (users[email]) {
      console.log('deserialized');
      return done(null, users[email]);
    } else {
      console.log('error deserializing');
      return done(null, false);
    }
  });

  // Local Sign Up =========================
  // Local Sign Up Strategy for PassportJS
  passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {
    console.log('Registering user: ', email);
    if (users[email]) {
      //console.log('User already exists');
      return done(null, false);
    } else {
      var newUser = User.createUser();
      //console.log('newUser ', newUser);
      newUser = User.populateUser(req, newUser);
      //console.log('populated ', newUser);
      users[email] = newUser;
      console.log(users);
      //console.log('this', users[email]);
      return done(null, newUser);
    }
  }));

  // Local Sign In =========================
  // Local Sign In Strategy for PassportJS
  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {
    // if the user is not in DB
    //console.log("first log: ", req.body, email, password)
    //console.log('users', users[email]);
    var user = users[email];

    if (!user) {
      return done(null, false);
    }
    // Check correct password
    //console.log('checking password');
    if (User.validPassword(user, password)) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  }))

  // Facebook Strategy =========================
  // Facebook Strat PassportJS
  passport.use('facebook', new FacebookStrategy({
    profileFields : ['id', 'displayName', 'first_name', 'last_name', 'gender', 'email', 'birthday'],
    clientID : configAuth.facebookAuth.clientID,
    clientSecret : configAuth.facebookAuth.clientSecret,
  },
  function(token, refreshToken, profile, done) {
    process.nextTick(function() {
      //console.log(profile);
      var email = profile.emails[0].value;
      if (users[email]) {
        // user exists, return user
        return done(null, users[email]);
      } else {
        // insert user skeleton into memory store
        var newUser = User.createUser();
        newUser = User.populateSocialUser(profile, newUser);
        users[email] = newUser;

        console.log(users);

        return done(null, profile);
      }
    })
  }))

  // Google Strategy =========================
  // Google Oauth2.0 Strat PassportJS
  passport.use('google', new GoogleStrategy({
    clientID : configAuth.googleAuth.clientID,
    clientSecret : configAuth.googleAuth.clientSecret,
  },
  function(token, refreshToken, profile, done) {
    console.log(profile);
    var email = profile.emails[0].value;
    if (users[email]) {
      // user exists, return user
      return done(null, users[email]);
    } else {
      // insert user skeleton into memory store
      var newUser = User.createUser();
      newUser = User.populateSocialUser(profile, newUser);
      users[email] = newUser;

      console.log(users);

      return done(null, profile);
    }
  }))

  // Social Sign Up Strategy =========================
  // Because we are only PARTIALLY done when we oauth
  // We need a second passport strategy to finish authentication
  passport.use('social-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {
    var user = users[email];
    if (!user) {
      //user dne, something went wrong with first social auth
      return done(null, false);
    } else {
      user = User.updateSocialUser(req, user);
      users[email] = user;

      console.log(users);

      return done(null, user);
    }
  }));
}
