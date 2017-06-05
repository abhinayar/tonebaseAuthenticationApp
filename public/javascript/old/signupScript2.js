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
  keyboardJS.setContext('stepTwo');
  keyboardJS.withContext('stepTwo', function() {
    // these will execute in the bar context
    keyboardJS.bind('enter', function(e) {
      if ($('#signup-form-2').form('validate form')) {
        $("#signup-form-2 .form-button").trigger('click');
      }
    });
  });
  keyboardJS.withContext('stepThree', function() {
    // these will execute in the bar context
    keyboardJS.bind('enter', function(e) {
      if ($('#signup-form-3').form('validate form')) {
        $("#signup-form-3 .form-button").trigger('click');
      }
    });
  });

  // form variables
  var email,
      f_name,
      l_name,
      birthyear,
      gender,
      fav_performer,
      fav_composer,
      guitar_owned,
      guitar_owned_model,
      preffered_music_period,
      user_professional_status;

  // Signup Form click function
  $("#signup-form-2 .form-button").on('click', function(){
    // get vals
    email = $("#signup-form-2 .form-input.email").val();
    f_name = $("#signup-form-2 .form-input.f_name").val();
    l_name = $("#signup-form-2 .form-input.l_name").val();
    birthyear = $("#signup-form-2 .form-input.birthyear").val();
    gender = $("#signup-form-2 .form-input.gender").val();

    $("#signup-form-2").fadeOut("500");
    $("#signup-form-3").fadeIn("300");
    $("#signup-form-2").addClass("hidden");
    $("#signup-form-3").removeClass("hidden");

    $(".logo-sub-text span").text("Step 2 of 2")
    $("title").text("Signup (Step 2 of 2) | tonebase");
    keyboardJS.setContext('stepThree');
  });

  // Signup Form (last) click function
  $("#signup-form-3 .form-button").on('click', function(){
    // get vals
    fav_performer = $("#signup-form-3 .form-input.fav_artist").val();
    fav_composer = $("#signup-form-3 .form-input.fav_composer").val();
    guitar_owned = $('.checkbox.guitar-owned-checkbox-wrapper').hasClass('checked');
    guitar_owned_model = $("#signup-form-3 .form-input.guitar_owned_model").val();
    preffered_music_period = $("#signup-form-3 .form-dropdown.preffered_music_period").val();
    user_professional_status = $("#signup-form-3 .form-dropdown.user_professional_status").val();

    var postData = {
      'email' : email,
      'meta_data' : {
        'f_name' : f_name,
        'l_name' : l_name,
        'birthyear' : birthyear,
        'gender' : gender,
        'fav_performer' : fav_performer,
        'fav_composer' : fav_composer,
        'guitar_owned' : guitar_owned,
        'guitar_owned_model' : guitar_owned_model,
        'preffered_music_period' : [],
        'user_professional_status' : []
      },
      'payment_status' : {
        'level' : 2,
        'started_on' : ''
      }
    }

    // Split the result string from the input box
    var prefferedMusicPeriods = preffered_music_period.split(',');
    var userProfessionalStatus = user_professional_status.split(',');

    for (var i = 0; i < prefferedMusicPeriods.length; i++) {
      postData.meta_data.preffered_music_period.push(prefferedMusicPeriods[i]);
    }
    for (var i = 0; i < userProfessionalStatus.length; i++) {
      postData.meta_data.user_professional_status.push(userProfessionalStatus[i]);
    }

    // POST the data
    $.ajax({
      url: "/auth/signup/update/" + email,
      type: 'POST',
      contentType:'application/json',
      data: JSON.stringify(postData),
      dataType:'json',
      success: function(data) {
        alert('complete!');
        window.location.replace('/signup/complete');
      },
      error: function(xhr, ajaxOptions, thrownError) {
        window.location.replace('/auth/signup/error');
      }
    });
  });
});
