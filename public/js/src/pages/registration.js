// ======================================================================== //
//   REGISTRATION MODAL                                                     //

var registerFirstName, registerLastName, registerEmail, registerMobile, registerYear, registerMajor, registerPassword;
// Verify Form
function verify(x) {
    switch (x.filter) {
        case 'RegisterPassword':
            field.pass(x, true, 'password');
            break;
        case 'RegisterConfirm':
            field.pass(x, true, 'match', $('input#RegisterPassword').val());
            break;
        case 'RegisterEmail':
            field.pass(x, true, 'uscemail');
            break;
        case 'RegisterMobile':
            field.pass(x, true, 'phone');
            break;
        case 'PaymentCardNumber':
            field.pass(x, true, 'creditcard');
            break;
        case 'PaymentCsc':
            field.pass(x, true, 'csc');
            break;
        //case 'ContactAddress': 
        //    field.pass(x, true, 'alphanumeric'); 
        //    break; 
        default:
            var simplyExist = [
                    'RegisterYear',
                    'RegisterFirstName',
                    'RegisterLastName',
                    'RegisterMajor',
                    'PaymentName',
                    'PaymentExpirationDate',
            //,'ContactGender',
            //,'ContactLanguagesKnown'
                ];
            if (simplyExist.indexOf(x.filter) > -1) {
                field.pass(x);
            } else {
                x.val;
            }
            break;
    }
}

/*
Stripe.setPublishableKey('YOUR_PUBLISHABLE_KEY');
var stripeResponseHandler = function (status, response) {
var $form = $('form#payment');
if (response.error) {
// Show the errors on the form
//$form.find('.payment-errors').text(response.error.message);
$('div#payment-error').html(response.error.message);
//$form.find('button').prop('disabled', false);
}
else {
// token contains id, last4, and card type
var token = response.id;
alert('token : ' + token);
// Insert the token into the form so it gets submitted to the server
$form.append($('<input type="hidden" name="stripeToken" />').val(token));
// and re-submit
$form.get(0).submit();
}
};
*/

$(document).ready(function () {
    $('#modal-registration-userinfo').show();
    $('#modal-registration-payment').hide();
    $('#modal-registration-thankyou').hide();

    $('#btn-register').click(function (event) {
        var alertString = '';
        event.preventDefault();
        allPass = field.checkAll('form#registration');
        registerFirstName = $('input[name=RegisterFirstName]').val().toUpperCase();
        alertString += 'First Name : ' + registerFirstName + '<br />';
        registerLastName = $('input[name=RegisterLastName]').val().toUpperCase();
        alertString += 'Last Name : ' + registerLastName + '<br />';
        $('span#ThankYouName').html(registerFirstName + ' ' + registerLastName);
        if ($('input[name=RegisterEmail]').val() != '') {
            registerEmail = $('input[name=RegisterEmail]').val().toLowerCase();
            alertString += 'Email : ' + registerEmail + '<br />';
            $('span#ThankYouEmail').html('(' + registerEmail + ')');
        }
        registerMobile = $('input[name=RegisterMobile]').val();
        alertString += 'Mobile : ' + registerMobile + '<br />';
        registerYear = $('select[name=RegisterYear] option:selected').val().toUpperCase();
        alertString += 'Year : ' + registerYear + '<br />';
        registerMajor = $('input[name=RegisterMajor]').val().toUpperCase();
        alertString += 'Major : ' + registerMajor + '<br />';
        if (allPass) {
            $('#modal-registration-userinfo').hide();
            $('#modal-registration-payment').hide();
            $('div#modal-loading').fadeIn(250);
            //$('#modal-registration-thankyou').show();
            //TODO add AJAX
            //alertString = '<label>' + alertString + '</label>';
            //$('div#user-info').html(alertString);
        }
    });

    $('#btn-submit').click(function (event) {
        var alertString = '';
        var $form = $('form#payment');
        event.preventDefault();
        allPass = field.checkAll('form#payment');
        // Disable the submit button to prevent repeated clicks
        //$form.find('button').prop('disabled', true);
        Stripe.createToken($form, stripeResponseHandler);
        alert('Test');
        // Prevent the form from submitting with the default action
        return false;
    });
});