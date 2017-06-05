// app/routes/auth/index.js
var app = require('../../../app'),
express = require('express'),
router = express.Router(),
passport = require('passport'),
User = require('../../models/user');
// ==================================
// AUTH VIEW SHOWS login / sign up OPTIONS
// ==================================
router.get('/', function(req, res) {
  res.render('auth/authMain', {
    title : 'tonebase | Home'
  })
})

// ==================================
// LOGIN
// ==================================
// error catching
router.get('/login/error', function(req, res) {
  res.render('auth/login', {
    error : {
      title : 'The user could not be found',
      body : 'Please check your email and password and try again.'
    }
  })
})
router.get('/login', function(req, res) {
  res.render('auth/login', {
    title : 'Log In | tonebase'
  })
})
router.post('/login', function(req, res, next) {
  passport.authenticate('local-login', function(err, user, info) {
    if (err)  {
      console.log('err');
      return next(err);
    }
    if (!user) {
      console.log('!user');
      return res.status(401).send({"ok": false});
    }
    req.logIn(user, function(err) {
      if (err) {
        console.log('login error');
        return res.status(401).send({"ok": false});
      }

      return res.send({"ok": true});
    });
  })(req, res, next);
});

// Facebook login
app.get('/auth/login/facebook', passport.authenticate('facebook', { scope : ['email'], callbackURL: '/auth/login/facebook/callback' }));
// handle the callback after facebook has authenticated the user
app.get('/auth/login/facebook/callback',
passport.authenticate('facebook', {
  callbackURL: '/auth/login/facebook/callback',
  successRedirect : '/home',
  failureRedirect : '/auth/login/error'
}));

// Google login
app.get('/auth/login/google', passport.authenticate('google', { scope : ['profile', 'email'], callbackURL: '/auth/login/google/callback' }));
// handle the callback after facebook has authenticated the user
app.get('/auth/login/google/callback',
passport.authenticate('google', {
  callbackURL: '/auth/login/google/callback',
  successRedirect : '/home',
  failureRedirect : '/auth/login/error'
}));


// ==================================
// SIGN UP
// ==================================
// error catching
router.get('/signup/error', function(req, res) {
  // create error
  var errorMessage = {
    title: 'Sign up failed',
    body : 'An unexpected error occured while creating your account. Try logging in?'
  }
  res.render('auth/signup', {
    title : 'Signup Error | tonebase',
    error : errorMessage
  })
})
// signup step 1 (1st stage sign up)
router.get('/signup', function(req, res) {
  res.render('auth/signup', {
    title : 'Signup | tonebase'
  })
})
router.post('/signup', function(req, res, next) {
  passport.authenticate('local-signup', function(err, user, info) {
    if (err)  {
      console.log('err');
      return next(err);
    }
    if (!user) {
      console.log('!user');
      return res.status(401).send({"ok": false});
    }
    req.logIn(user, function(err) {
      if (err) {
        console.log('login error');
        return res.status(401).send({"ok": false});
      }

      console.log(users);
      return res.send({"ok": true});
    });
  })(req, res, next);
});

// signup continue (2nd stage sign up)
router.get('/signup/continue', function(req, res) {
  res.render('auth/signupContinue', {
    title : 'Signup (Step 1 of 2) | tonebase',
    social : true,
    user : req.user
  })
})
router.post('/signup/continue', function(req, res, next) {
  passport.authenticate('social-signup', function(err, user, info) {
    if (err)  {
      console.log('err');
      return next(err);
    }
    if (!user) {
      console.log('!user');
      return res.status(401).send({"ok": false});
    }
    req.logIn(user, function(err) {
      if (err) {
        console.log('login error');
        return res.status(401).send({"ok": false});
      }

      console.log(users);
      return res.send({"ok": true});
    });
  })(req, res, next);
});

// Facebook authentication
app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email', "user_birthday"], callbackURL: '/auth/facebook/callback'}));
// handle the callback after facebook has authenticated the user
app.get('/auth/facebook/callback',
passport.authenticate('facebook', {
  callbackURL: '/auth/facebook/callback',
  successRedirect : '/auth/signup/continue',
  failureRedirect : '/auth/signup/error'
}));

// Google authentication
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email', 'https://www.googleapis.com/auth/user.birthday.read'], callbackURL: '/auth/google/callback' }));
// handle the callback after facebook has authenticated the user
app.get('/auth/google/callback',
passport.authenticate('google', {
  callbackURL: '/auth/google/callback',
  successRedirect : '/auth/signup/continue',
  failureRedirect : '/auth/signup/error'
}));

// ==================================
// SIGN OUT
// ==================================
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/auth');
})

module.exports = router;
