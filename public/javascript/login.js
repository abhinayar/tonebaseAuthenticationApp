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
      }
    }
  });

  // Keyboard JS set up
  keyboardJS.setContext('login');
  keyboardJS.withContext('login', function() {
    // these will execute in the bar context
    keyboardJS.bind('enter', function(e) {
      login();
    });
  });
});

var email,
  password;

function login() {
  if ($("#login-form").form('validate form')) {
    email = $("#login-form .form-input.email").val();
    password = $("#login-form .form-input.password").val();

    var postData = {
      "email" : email,
      "password" : password
    }

    $.ajax({
      type: "POST",
      dataType: 'json',
      data: postData,
      url: "/auth/login",
      success: function (data) {
        console.log(data);
        window.location.href = '/home';
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(xhr.status);
        console.log(thrownError);
        window.location.href = '/auth/login/error';
      }
    });
  }
}
