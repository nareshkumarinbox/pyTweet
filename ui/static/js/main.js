function toggle_login_nav(isLoggedIn) {
  $('#before_login').hide();
  $('#after_login').hide();
  if (isLoggedIn || (is_authenticated == "True")) {
    console.log("in after login");
    $('#before_login').hide();
    $('#after_login').show();
    load_userTweet_page();
  } else {
    console.log("before login");
    $('#before_login').show();
    $('#after_login').hide();
    $('#replaceMe').load("load_login_page");
  }
}

function load_login_page() {
  toggle_login_nav(false);
}

function load_register_page() {
  $('#error-msg').html('');
  $('#replaceMe').load("load_register_page");
}

function load_userTweet_page() {
  $('#error-msg').html('');
  $('#replaceMe').load("tweets/load_userTweet_page");
}

function logout() {
   ajaxCallRequest('GET', 'logout', {}, renderLogoutSuccess, renderError);
}
function renderLogoutSuccess(response) {
    is_authenticated = 'False';
    load_login_page();
}

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function renderError(response) {
  var errors = response.errors;
  if (response.responseJSON && response.responseJSON.errors) {
    errors = response.responseJSON.errors;
  } else if (response.responseJSON) {
    errors = response.responseJSON;
  }
  if (errors && typeof errors == 'object') {
    var list = Object.entries(errors);
    $('#error-msg').html('');
    for (const[key, value] of list) {
      $('#error-msg').append('<h6> ' + key + ' = ' + value + '</h6>');
    }
  } else if (errors) {
    $('#error-msg').html('<h6> ' + errors + '</h6>');
  } else {
    return false;
  }
  return true;
}


function ajaxFormDataCallRequest(type, url, data, successCallBack, errorCallBack) {
    ajaxRequest(type, url, data, true, successCallBack, errorCallBack)
}

function ajaxCallRequest(type, url, data, successCallBack, errorCallBack) {
    ajaxRequest(type, url, data, false, successCallBack, errorCallBack);
}

function ajaxRequest(type, url, data, isFormData, successCallBack, errorCallBack) {
   $('#error-msg').html('');
  var csrftoken = getCookie('csrftoken');
  $.ajax({
    data: data, // get the form data
    type: type,
    url: url,
     processData: !isFormData,
     contentType: isFormData? !isFormData: "application/x-www-form-urlencoded; charset=UTF-8",
    headers: {
      'X-CSRFToken': csrftoken
    },
    success: function(response) {
      successCallBack(response);
    },
    error: function(response) {
      errorCallBack(response);

    }
  });
}

$(document).ready(function() {
  load_login_page();
});


