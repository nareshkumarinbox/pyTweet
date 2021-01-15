$('#register_form').on('submit', function(e){
	    e.preventDefault();
        data = $(this).serialize()
	    ajaxCallRequest('POST', 'register', data, renderRegisterSuccess, renderError);
        return false;
});

 function renderRegisterSuccess(response) {
        $('#error-msg').html('');
        $('#error-msg').append('<h6> User is Active, Please login with user '+ response.name +'!</h6>');
     load_login_page();
}

