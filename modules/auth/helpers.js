exports.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  //res.redirect('/auth');
  res.redirect('/signup');
}

exports.objectLength = function(obj) {
  var count = 0;
  if (typeof obj == "object") {
    if (Object.keys) {
        count = Object.keys(obj).length;
    } else if (window._) {
        count = _.keys(obj).length;
    } else if (window.$) {
        count = $.map(obj, function() { return 1; }).length;
    } else {
        for (var key in obj) if (obj.hasOwnProperty(key)) count++;
    }
  }
  return count;
}
