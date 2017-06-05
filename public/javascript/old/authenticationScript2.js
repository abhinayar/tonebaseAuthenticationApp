// Authentication local javascript for tonebase
// By Abhi Nayar

// set globals
var pageStatus = {
  signin : null,
  signup : null,
  signupContinue : 0
}
// check whether this is sign in page or not
if(window.location.href.indexOf("signin") == -1) {
  pageStatus.signin = false;
  pageStatus.signup = true;
  if (!window.location.href.indexOf('continue') == -1) {
    pageStatus.signupContinue = 1;
  }
} else {
  pageStatus.signin = true;
  pageStatus.signup = false;
}

// jQuery ready function
$(document).ready(function(){
  // Semantic function
  $('.ui.dropdown').dropdown();
  $('.ui.checkbox').checkbox();
  $('.message .close').on('click', function(){
    $(this).closest('.message').transition('fade');
  });

  // Semantic form validation
  $.fn.form.settings.onSuccess = function() {
    return true;
  };
  $.fn.form.settings.onFailure = function() {
    return false;
  };
  // Create Semantic validation rules
  if (pageStatus.signin) {
    $('#signin-form').form({
      inline : true,
      on     : 'blur',
      keyboardShortcuts : false,
      fields : {
        email: {
          identifier  : 'email',
          rules: [
            {
              type : 'empty',
              prompt : 'This field is required'
            },
            {
              type   : 'email',
              prompt : 'Please enter a valid email address'
            }
          ]
        },
        password: {
          identifier  : 'password',
          rules: [
            {
              type : 'empty',
              prompt : 'This field is required'
            },
            {
              type   : 'minLength[6]',
              prompt : 'Password must be 6 characters or longer'
            }
          ]
        }
      }
    });
  }
  if (pageStatus.signup && !pageStatus.signupContinue) {
    $('#signup-form').form({
      inline : true,
      on     : 'blur',
      keyboardShortcuts : false,
      fields : {
        email: {
          identifier  : 'email',
          rules: [
            {
              type : 'empty',
              prompt : 'This field is required'
            },
            {
              type   : 'email',
              prompt : 'Please enter a valid email address'
            }
          ]
        },
        password: {
          identifier  : 'password',
          rules: [
            {
              type : 'empty',
              prompt : 'This field is required'
            },
            {
              type   : 'minLength[6]',
              prompt : 'Password must be 6 characters or longer'
            }
          ]
        }
      }
    });
  }
  else if (pageStatus.signup && pageStatus.signupContinue) {
    $('#signup-form-2').form({
      inline : true,
      on     : 'blur',
      keyboardShortcuts : false,
      fields : {
        email: {
          identifier  : 'email',
          rules: [
            {
              type : 'empty',
              prompt : 'This field is required'
            },
            {
              type   : 'email',
              prompt : 'Please enter a valid email address'
            }
          ]
        },
        password: {
          identifier  : 'password',
          rules: [
            {
              type : 'empty',
              prompt : 'This field is required'
            },
            {
              type   : 'minLength[6]',
              prompt : 'Password must be 6 characters or longer'
            }
          ]
        },
        f_name: {
          identifier : 'f_name',
          rules : [
            {
              type : 'empty',
              prompt : 'This field is required'
            }
          ]
        },
        l_name : {
          identifier : 'l_name',
          rules : [
            {
              type : 'empty',
              prompt : 'This field is required'
            }
          ]
        },
        birthyear : {
          identifier : 'birthyear',
          rules : [
            {
              type : 'empty',
              prompt : 'This field is required'
            },
            {
              type : 'integer',
              prompt : 'Please enter a year'
            },
            {
              type : 'minLength[4]',
              prompt : 'Please enter a valid year'
            }
          ]
        },
        gender : {
          identifier : 'gender',
          rules : [
            {
              type : 'empty',
              prompt : 'This field is required'
            }
          ]
        }
      }
    });
    $('#signup-form-3').form({
      keyboardShortcuts : false
    });

    // Hide/unhide guitar_owned_model
    $(".checkbox.guitar-owned-checkbox-wrapper").on('click', function(){
      $(this).hasClass('checked') ? $(".guitar_owned_model").removeClass("hidden") : $(".guitar_owned_model").addClass("hidden");
    });
  }

  // Enter event keybinding
  // NOTE : No enter evet keybind on third ste pof userReg
  keyboardJS.setContext('stepOne');
  keyboardJS.withContext('stepOne', function() {
    // these will execute in the bar context
    keyboardJS.bind('enter', function(e) {
      if (pageStatus.signin) {
        if ($('#signin-form').form('validate form')) {
          $("#signin-form .form-button").trigger('click');
        }
      }
      else {
        if ($('#signup-form').form('validate form')) {
          $("#signup-form .form-button").trigger('click');
        }
      }
    });
  });

  $("#signin-form .form-button").on('click', function(){
    signInAuthenticate();
  });
});

// set up localstorageDB
var localStorageExists = window.localStorage || 0;
if (localStorageExists) {
  var userLib = new localStorageDB("userLib", localStorage);
  if (userLib.isNew()) {
    userLib.createTable("userInfo", ['id', 'f_name', 'l_name', 'email', 'password_hash', 'birthyear', 'gender', 'guitar_owned', 'guitar_owned_model', 'fav_performer', 'fav_composer', 'preffered_music_period', 'user_professional_status', 'created_at', 'oauth', 'oauth_provider', 'nickname', 'image_url']);

    userLib.insert("userInfo", {id : 1});
    userLib.commit();
  }
}

// register functions
function registerStepOne() {
  if ($("#signup-form").form('validate form')) {
    // Set variables
    var email = $("#signup-form .form-input.email").val(),
      password = $("#signup-form .form-input.password").val();

    // Insert into localStorage
    userLib.update("userInfo", {id : 1}, function(row) {
      console.log(row);
      row.email= email,
      row.password_hash= password;

      return row;
    });
    userLib.commit();

    // POST request the email and password
    // We want to test if the user exists and redirect appropriately
    $.ajax({
      url: "/auth/signup/stepOne",
      type: 'POST',
      contentType:'application/json',
      data: JSON.stringify(email),
      dataType:'json',
      success: function(data) {
        var url = JSON.parse(data).url;
        window.location.replace(url)
      },
      error: function(xhr, ajaxOptions, thrownError) {
        if (xhr.status == 409) {
          //window.location.replace('/auth/signin/);
        }
        window.location.replace('/auth/signup/error/' + xhr.status);
      }
    });
  }
}
function registerStepTwo() {
  // Validate form
  if ($('#signup-form-2').form('validate form')) {
    var email = $("#signup-form-2 .form-input.email").val(),
        password = $("#signup-form-2 .form-input.password").val(),
        f_name = $("#signup-form-2 .form-input.f_name").val(),
        l_name = $("#signup-form-2 .form-input.l_name").val(),
        birthyear = $("#signup-form-2 .form-input.birthyear").val(),
        gender = $("#signup-form-2 .form-input.gender").val();

    // Insert into localStorage
    userLib.update("userInfo", {id : 1}, function(row) {
      row.email= email,
      row.password_hash= password,
      row.f_name = f_name,
      row.l_name = l_name,
      row.birthyear = birthyear,
      row.gender = gender;

      return row;
    });
    userLib.commit();

    // Log Results to Console
    console.log("step two complete");

    // Hide this section ad show next
    $("#signup-form-2").fadeOut("500");
    $("#signup-form-3").fadeIn("300");
    $("#signup-form-2").addClass("hidden");
    $("#signup-form-3").removeClass("hidden");

    // Change logo-sub-text
    $(".logo-sub-text span").text("Step 2 of 2")

    // Set keyboard js context
    keyboardJS.setContext('stepThree');
  }
}
function registerStepThree() {
  // Validate form
  if ($('#signup-form-3').form('validate form')) {
    var fav_artist = $("#signup-form-3 .form-input.fav_artist").val(),
    fav_composer = $("#signup-form-3 .form-input.fav_composer").val(),
    preffered_music_period = $("#signup-form-3 .form-dropdown.preffered_music_period").val(),
    user_professional_status = $("#signup-form-3 .form-dropdown.user_professional_status").val(),
    guitar_owned = $('.checkbox.guitar-owned-checkbox-wrapper').hasClass('checked'),
    guitar_owned_model = $("#signup-form-3 .form-input.guitar_owned_model").val();

    // Insert into localStorage
    userLib.update("userInfo", {id : 1}, function(row) {
      row.fav_performer= fav_artist,
      row.guitar_owned= guitar_owned,
      row.guitar_owned_model = guitar_owned_model,
      row.fav_composer = fav_composer,
      row.preffered_music_period = preffered_music_period,
      row.user_professional_status = user_professional_status;

      return row;
    });
    userLib.commit();

    // Alert Success and show new updated query
    console.log("step three complete");
    // POST to server
    var userData = JSON.parse(userLib.serialize()).data.userInfo[1];
    // Construct POST data object
    var postData = {
      "email" : userData.email,
      "password_hash" : userData.password_hash,
      "meta_data" : {
        "f_name" : userData.f_name,
        "l_name" : userData.l_name,
        "nickname" : userData.nickname,
        "birthyear" : userData.birthyear,
        "oauth" : userData.oauth,
        "oauth_provider" : userData.oauth_provider,

        "created_at" : userData.created_at,
        "fav_composer" : userData.fav_composer,
        "fav_performer" : userData.fav_performer,
        "guitar_owned" : userData.guitar_owned,
        "image_url" : userData.image_url,
        "preffered_music_period" : [],
        "user_professional_status" : []
      },
      "payment_status" : {
        "level" : "free-month",
        "started_on" : ""
      }
    }

    var prefferedMusicPeriods = userData.preffered_music_period.split(",");
    var userProfessionalStatus = userData.user_professional_status.split(",");

    //Construct arrays in JSON
    for (var i = 0; i < prefferedMusicPeriods.length; i++) {
      postData.meta_data.preffered_music_period.push(prefferedMusicPeriods[i].toString());
    } for (var i = 0; i < userProfessionalStatus.length; i++) {
      postData.meta_data.user_professional_status.push(userProfessionalStatus[i].toString());
    }

    $.ajax({
      url: "/auth/signup",
      type: 'POST',
      contentType:'application/json',
      data: JSON.stringify(postData),
      dataType:'json',
      success: function(data) {
        alert('complete!');
        window.location.replace('/auth/signup/complete');
      },
      error: function(xhr, ajaxOptions, thrownError) {
        if (xhr.status == 200) {
          console.log(ajaxOptions);
        }
        else {
          console.log(xhr.status);
          console.log(thrownError);
        }
        window.location.replace('/auth/signup/error/' + xhr.status);
      }
    });
  }
}
function signInAuthenticate() {
  if ($('#signin-form').form('validate form')) {
    var email = $("#signin-form .form-input.email").val();
    var password = $("#signin-form .form-input.password").val();

    var postData = {
      "email" : email,
      "password_hash" : password
    }

    $.ajax({
      url: "/auth/signin",
      type: 'POST',
      contentType:'application/json',
      data: JSON.stringify(postData),
      dataType:'json',
      success: function(data) {
        console.log("complete", data);
        window.location.replace('/auth/signin/complete');
      },
      error: function(xhr, ajaxOptions, thrownError) {
        console.log("error");
        if (xhr.status == 200) {
          console.log(ajaxOptions);
        }
        else {
          console.log(xhr.status);
          console.log(thrownError);

          if (xhr.status == 409) {
            window.location.assign("/auth/signin/error/409")
          }

        }
      }
    });
  }
}
