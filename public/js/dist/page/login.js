var loginEmail;
// Verify Form
function verify(x) {
    switch (x.filter) {
        default:
            var simplyExist = [
                    'LoginEmail',
                    'LoginPassword',
                    'VerifyConfirmationCode'
                ];
            if (simplyExist.indexOf(x.filter) > -1) {
                field.pass(x);
            } else {
                x.val;
            }
            break;
    }
}

$(document).ready(function () {
    $('#modal-login-userinfo').show();
    $('#modal-login-verify').hide();
    $('#modal-login-thankyou').hide();

    $('#btn-login').click(function (event) {
        event.preventDefault();
        allPass = field.checkAll('form#login');
        registerEmail = $('input[name=LoginEmail]').val().toLowerCase();
        if (allPass) {
            //TODO
            $('#modal-login-userinfo').hide();
            $('#modal-login-verify').show();
            $('#modal-login-thankyou').hide();
        }
    });

    $('#btn-verify').click(function (event) {
        var alertString = '';
        event.preventDefault();
        allPass = field.checkAll('form#verify');
        if (allPass) {
            //TODO
            $('#modal-login-userinfo').hide();
            $('#modal-login-verify').hide();
            $('#modal-login-thankyou').show();
        }
    });
});