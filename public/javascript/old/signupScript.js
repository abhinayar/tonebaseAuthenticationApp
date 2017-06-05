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
  
  // Keyboard JS set up
  keyboardJS.setContext('stepOne');
  keyboardJS.withContext('stepOne', function() {
    // these will execute in the bar context
    keyboardJS.bind('enter', function(e) {
      signUpStepOne();
    });
  });
});
// Signup Form click function
function signUpStepOne() {
  if ($('#signup-form').form('validate form')) {
    // get vals
    var email = $("#signup-form .form-input.email").val(),
        password = $("#signup-form .form-input.password").val();

    // construct post data
    var postData = {
      "email" : email,
      "password" : password
    }

    // make the ajax call
    $.ajax({
      url: '/auth/signup',
      type: 'POST',
      contentType: 'application/json',
      data : JSON.stringify(postData),
      dataType: 'json',
      success: function(data) {
        console.log(data);
        window.location.replace('/auth/signup/continue/' + email + '&' + 'false');
      },
      error: function(xhr, ajaxOptions, thrownError) {
        console.log(xhr, ajaxOptions, thrownError);
        window.location.replace('/auth/signup/error');
      }
    }) 
  }
}