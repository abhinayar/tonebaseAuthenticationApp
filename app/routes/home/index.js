// app/routes/auth/index.js
var express = require('express'),
router = express.Router(),
passport = require('passport');

// ==================================
// HOME
// ==================================
router.get('/', isLoggedIn, function(req, res) {
  console.log('user home', req.user);

  res.render('home/index', {
    user : req.user
  });
})

module.exports = router;

// Helpers ============================
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  //res.redirect('/auth');
  res.redirect('/auth');
}

/*
// Test data
var data = {
  {
    "blockType" : "video",
    "blockName" : "",
    "blockBg" : "",
    "video" : {
      "videoName" : "",
      "videoLength" : "",
      "videoPart" : "",
      "videoSeriesCount" : "",
      "videoPlayerSrc" : "",
      "videoPrevLink" : "",
      "videoNextLink" : "",
      "artistName" : "Eliot Fisk",
      "artistLink" : ""
    },
    "news" : {
      "newsTitle" : "",
      "newsSubtitle" : "",
      "newsContent" : "",
      "newsLink" : ""
    },
    "ad" : {
        "adLink" : "",
        "adName" : "",
        "adSponsorName" : "",
    }
  }
}
*/
