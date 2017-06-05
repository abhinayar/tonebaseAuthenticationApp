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

  // Semantic form setup
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
      },
      confirm_password : {
        identifier : 'confirm_password',
        rules : [
          {
            type: 'empty',
            prompt : 'This field is required'
          },
          {
            type : 'match[password]',
            prompt : 'Passwords do not match'
          }
        ]
      }
    }
  });
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

  // Keyboard JS set up
  keyboardJS.setContext('stepOne');
  keyboardJS.withContext('stepOne', function() {
    // these will execute in the bar context
    keyboardJS.bind('enter', function(e) {
      registerStepOne();
    });
  });
  keyboardJS.withContext('stepTwo', function() {
    // these will execute in the bar context
    keyboardJS.bind('enter', function(e) {
      registerStepTwo();
    });
  });

  // Form dynamic ui
  $(".checkbox.guitar-owned-checkbox-wrapper").on('click', function(){
    $(this).hasClass('checked') ? $(".guitar_owned_model").removeClass("hidden") : $(".guitar_owned_model").addClass("hidden");
  });
});

var email,
  password,
  f_name, l_name,
  birthyear,
  gender,
  fav_performer,
  fav_composer,
  preffered_music_period,
  user_professional_status,
  guitar_owned,
  guitar_owned_model;

function registerStepOne() {
  if ($("#signup-form").form('validate form')) {
    $("title").text("Signup (Step 1 of 2) | tonebase")

    email = $("#signup-form .form-input.email").val();
    password = $("#signup-form .form-input.password").val();

    $("#signup-form-2 .form-input.email").val(email)
    $("#signup-form-2 .form-input.password").val(password).attr('disabled');

    fadeOutIn('#signup-form', '#signup-form-2');
    $('.logo-sub-text span').html("Welcome! Step 1 of 2");
    keyboardJS.setContext('stepTwo');
  }
}

function registerStepTwo() {
  if ($("#signup-form-2").form('validate form')) {
    f_name = $("#signup-form-2 .form-input.f_name").val();
    l_name = $("#signup-form-2 .form-input.l_name").val();
    birthyear = $("#signup-form-2 .form-input.birthyear").val();
    gender = $("#signup-form-2 .form-input.gender").val();

    fadeOutIn('#signup-form-2', '#signup-form-3');
    $('.logo-sub-text').html("Step 2 of 2<br>These are optional but will help us make tonebase even better for you!");
    keyboardJS.setContext('none');
  }
}

function registerStepThree() {
  $("title").text("Signup (Step 2 of 2) | tonebase")

  fav_performer = $("#signup-form-3 .form-input.fav_performer").val();
  fav_composer = $("#signup-form-3 .form-input.fav_composer").val();
  preffered_music_period = $("#signup-form-3 .form-input.preffered_music_period").val();
  user_professional_status = $("#signup-form-3 .form-input.user_professional_status").val();
  guitar_owned = $('.checkbox.guitar-owned-checkbox-wrapper').hasClass('checked'),
  guitar_owned_model = $("#signup-form-3 .form-input.guitar_owned_model").val();

  var postData = {
    "email" : email,
    "password" : password,
    "meta_data" : {
      "f_name" : f_name,
      "l_name" : l_name,
      "birthyear" : birthyear,
      "gender" : gender,
      "fav_performer" : fav_performer,
      "fav_composer" : fav_composer,
      "preffered_music_period" : preffered_music_period,
      "user_professional_status" : user_professional_status,
      "guitar_owned" : guitar_owned,
      "guitar_owned_model" : guitar_owned_model,
      "created_at" : ''
    }
  }

  $.ajax({
    type: "POST",
    dataType: 'json',
    data: postData,
    url: "/auth/signup",
    success: function (data) {
      console.log(data);
      window.location.href = '/home';
    },
    error: function (xhr, ajaxOptions, thrownError) {
      console.log(xhr.status);
      console.log(thrownError);
      window.location.href = '/auth/signup/error';
    }
  });
}

function fadeOutIn(id1, id2) {
  $(id1).fadeOut("500");
  $(id2).fadeIn("300");
  $(id1).addClass("hidden");
  $(id2).removeClass("hidden");
}
