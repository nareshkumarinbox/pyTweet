$('#login_form').on('submit', function(e){
	 e.preventDefault();
	 data = $(this).serialize()
	 ajaxCallRequest('POST', 'login', data, renderLoginSuccess, renderError);
    return false;
});
 function renderLoginSuccess(response) {
    $('#error-msg').html("");
     toggle_login_nav(true);
}