// app/models/user.js
var bcrypt = require('bcrypt-nodejs');

// create user schema
exports.createUser = function() {
  var user = {
    id : '',
    email : '',
    password : '',
    meta_data : {
      f_name : '',
      l_name : '',
      nickname : '',
      birthyear : '',
      oauth: '',
      oauth_complete: '',
      oauth_id : '',
      oauth_provider : '',
      created_at : '',
      fav_composer : '',
      fav_performer : '',
      guitar_owned : '',
      image_url : '',
      preffered_music_period : '',
      user_professional_status : ''
    },
    payment_status : {
      level : '',
      started_on : ''
    }
  }

  return user;
}

// populate user props
exports.populateUser = function(req, user) {
  user.id = authHelpers.objectLength(users) + 1;
  user.email = req.body.email;
  user.password = this.generateHash(req.body.password.toString());
  user.meta_data = req.body.meta_data;
  user.meta_data.created_at = Date.now();
  user.meta_data.oauth_complete = false;

  return user;
}

// social user create
exports.populateSocialUser = function(profile, user) {
  user.id = authHelpers.objectLength(users) + 1;
  user.email = profile.emails[0].value;
  if (profile.name.givenName) {
    user.meta_data.f_name = profile.name.givenName;
  }
  if (profile.name.familyName) {
    user.meta_data.l_name = profile.name.familyName;
  }
  if (profile.displayName) {
    user.meta_data.nickname = profile.displayName;
  }
  if (profile.gender) {
    user.meta_data.gender = profile.gender;
  }
  if (profile._json.birthday) {
    user.meta_data.birthyear = profile._json.birthday.substring(6, profile._json.birthday.length);
  }
  if (profile.provider == 'google') {
    var image_url = profile.photos[0].value;
    image_url = image_url.substring(0, image_url.length - 2) + '200';
    user.meta_data.image_url = image_url;

  } else {
    user.meta_data.image_url = 'http://graph.facebook.com/' + profile.id + '/picture?type=large';
  }
  user.meta_data.oauth = true;
  user.meta_data.oauth_id = profile.id;
  user.meta_data.oauth_provider = profile.provider;
  user.meta_data.created_at = Date.now();
  user.meta_data.oauth_complete = true;

  return user;
}

// social user update
exports.updateSocialUser = function(req, user) {
  user.email = req.body.email;
  user.password = this.generateHash(req.body.password.toString());
  user.meta_data.fav_performer = req.body.meta_data.fav_performer;
  user.meta_data.fav_composer = req.body.meta_data.fav_composer;
  user.meta_data.preffered_music_period = req.body.meta_data.preffered_music_period;
  user.meta_data.user_professional_status = req.body.meta_data.user_professional_status;
  user.meta_data.guitar_owned = req.body.meta_data.guitar_owned;
  user.meta_data.guitar_owned_model = req.body.meta_data.guitar_owned_model;
  user.meta_data.oauth_complete = true;

  return user;
}

// define functions
exports.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// check is password is valid
exports.validPassword = function(user, password) {
  return bcrypt.compareSync(password.toString(), user.password);
}

// check if user is valid
exports.validUser = function(email) {
  return users[email];
}
