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
  $('#signup-social-form').form({
    inline : true,
    on     : 'blur',
    keyboardShortcuts : false,
    fields : {
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

  // Form dynamic ui
  $(".checkbox.guitar-owned-checkbox-wrapper").on('click', function(){
    $(this).hasClass('checked') ? $(".guitar_owned_model").removeClass("hidden") : $(".guitar_owned_model").addClass("hidden");
  });
});

var email,
  password,
  fav_performer,
  fav_composer,
  preffered_music_period,
  user_professional_status,
  guitar_owned,
  guitar_owned_model;

function registerSocial() {
  if ($("#signup-social-form").form('validate form')) {
    $("title").text("Signup (Step 1 of 2) | tonebase")

    email = $("#signup-social-form .form-input.email").val();
    password = $("#signup-social-form .form-input.password").val();
    fav_performer = $("#signup-social-form .form-input.fav_performer").val();
    fav_composer = $("#signup-social-form .form-input.fav_composer").val();
    preffered_music_period = $("#signup-social-form .form-input.preffered_music_period").val();
    user_professional_status = $("#signup-social-form .form-input.user_professional_status").val();
    guitar_owned = $('.checkbox.guitar-owned-checkbox-wrapper').hasClass('checked'),
    guitar_owned_model = $("#signup-social-form .form-input.guitar_owned_model").val();

    var postData = {
      "email" : email,
      "password" : password,
      "meta_data" : {
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
      url: "/auth/signup/continue",
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
}
