var svcRunning=[], html, table, tdArr, checkbox, label, detailLink, popWidth=null, popHeight=null, goToScreen; //TODO Remove the reserved word final from variable

$(function () {
    // FORM JAVASCRIPT
    // Loop through checkboxes
    $('span.checkbox').each(function () {
        $input = $(this).children('input[type="hidden"]');
        // If pre-checked, mark as checked
        if (1 == $input.val()) {
            $(this).addClass('checked');
        }
    });
    // Set click event for checkboxes
    $('span.checkbox').click(function () {
        $input = $(this).children('input[type="hidden"]');
        // If currently checked, uncheck (and vice-versa)
        if (1 == $input.val()) {
            $input.val(0);
            $(this).removeClass('checked');
        } else {
            $input.val(1);
            $(this).addClass('checked');
        }
    });

    // PATCH: Properly display dropdown menus in Safari
    var UA = $.uaMatch(navigator.userAgent).browser;
    var chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    if ((UA == 'webkit') && !chrome) {
        var patchWidth, patchPadLeft = 5;
        $('span.dropdown').css({ 'padding': '2px 0 2px ' + patchPadLeft + 'px' }).each(function () {
            patchWidth = $(this).css('width');
            patchWidth = patchWidth.replace(/[^0-9]/g, '');
            patchWidth = parseInt(patchWidth) - patchPadLeft;
            $(this).css({ 'width': patchWidth + 'px' });
        });
    }

    // PATCH: Fix missing "indexOf" in IE
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement /*, fromIndex */) {
            "use strict";
            if (this == null) {
                throw new TypeError();
            }
            var t = Object(this);
            var len = t.length >>> 0;
            if (len === 0) {
                return -1;
            }
            var n = 0;
            if (arguments.length > 1) {
                n = Number(arguments[1]);
                if (n != n) { // shortcut for verifying if it's NaN
                    n = 0;
                } else if (n != 0 && n != Infinity && n != -Infinity) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }
            if (n >= len) {
                return -1;
            }
            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
            for (; k < len; k++) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }
            return -1;
        }
    }

    $("textarea[maxlength]").bind("keyup input paste", function () {
        var limit = parseInt($(this).attr('maxlength'));
        var text = $(this).val();
        var chars = text.length;
        if (chars > limit) {
            var new_text = text.substr(0, limit);
            $(this).val(new_text);
        }
    });

    $('label.checkbox').keydown(function (e) {
        if (32 == e.which) {
            e.preventDefault();
            var labelFor = $(this).attr('for');
            var labelSpan = $(this).children('span.checkbox');
            var inputId = $('input[id="' + labelFor + '"]');
            if (labelFor && labelSpan && inputId) {
                labelSpan.trigger('click');
            }
        }
    });

    $('label.radio').focus(function (e) {
        //alert('focus');
        var labelFor = $(this).attr('for');
        var inputId = $('input[id="' + labelFor + '"]');
        var inputName = inputId.attr('name');
        var inputChecked = $('input[name="' + inputName + '"]:radio:checked');
        if (inputChecked) {
            var labelCheckedFor = $('label[for="' + inputChecked.attr('id') + '"]');
            if (labelFor != inputChecked.attr('id')) {
                labelCheckedFor.focus();
            }
        }
    });

    $('label.radio').keydown(function (e) {
        if (e.shiftKey && 9 == e.which || 9 == e.which || 32 == e.which || 37 == e.which || 38 == e.which || 39 == e.which || 40 == e.which) {
            e.preventDefault();
            var labelFor = $(this).attr('for');
            var labelTabIndex = parseInt($(this).attr('tabindex'), 10);
            var inputId = $('input[id=' + labelFor + ']');
            var inputName = inputId.attr('name');
            var inputFirstTabIndex = parseInt($('input[name$="' + inputName + '"]+label').first().attr('tabindex'), 10);
            var inputLastTabIndex = parseInt($('input[name$="' + inputName + '"]+label').last().attr('tabindex'), 10);
            if (32 == e.which) {
                if (labelFor && inputId) {
                    inputId.trigger('click');
                }
            }
            else if (e.shiftKey && 9 == e.which) {
                var safetyCount = 0;
                var inputPrevTabIndex = inputFirstTabIndex - 1;
                while (!$('[tabindex=' + inputPrevTabIndex + ']').is(':visible') && safetyCount < 10) {
                    inputPrevTabIndex--;
                    safetyCount++;
                }
                $('[tabindex=' + inputPrevTabIndex + ']').focus();
            }
            else if (9 == e.which) {
                var safetyCount = 0;
                var inputNextTabIndex = inputLastTabIndex + 1;
                while (!$('[tabindex=' + inputNextTabIndex + ']').is(':visible') && safetyCount < 10) {
                    inputNextTabIndex++;
                    safetyCount++;
                }
                $('[tabindex=' + inputNextTabIndex + ']').focus();
            }
            else if (37 == e.which || 38 == e.which) {
                var labelPrevTabIndex = labelTabIndex - 1;
                if (labelPrevTabIndex < inputFirstTabIndex) {
                    labelPrevTabIndex = inputLastTabIndex;
                }
                var labelPrevFor = $('[tabindex=' + labelPrevTabIndex + ']');
                var inputPrevId = $('input[id="' + labelPrevFor.attr('for') + '"]');
                if (labelPrevFor && inputPrevId) {
                    labelPrevFor.focus();
                    inputPrevId.trigger('click');
                }
            }
            else if (39 == e.which || 40 == e.which) {
                var labelNextTabIndex = labelTabIndex + 1;
                if (labelNextTabIndex > inputLastTabIndex) {
                    labelNextTabIndex = inputFirstTabIndex;
                }
                var labelNextFor = $('[tabindex=' + labelNextTabIndex + ']');
                var inputNextId = $('input[id="' + labelNextFor.attr('for') + '"]');
                if (labelNextFor && inputNextId) {
                    labelNextFor.focus();
                    inputNextId.trigger('click');
                }
            }
        }
    });
});

// Lock screen from further action
function screenLock() {
    $('#modal-overlay').show();
    $('#modal-container').show();
    $('#modal-processing').show();
    $('html,body').animate({scrollTop:0},'slow');
    setTimeout(function () {
        if ($('#modal-processing').is(':visible')) {
            screenUnlock();
            alert('Unable to complete action.');
        }
    }, (60 * 1000)); // Abort after 60 seconds
}
// Unlock screen
function screenUnlock() {
    $('#modal-overlay').hide();
    $('#modal-container').hide();
    $('#modal-processing').hide();
}

// ================================================ //
// == SERVICE CALLS =============================== //

// User
function login() {
    svc('userLogin', {
        "username": $('input#login-username').val(),
        "password": $('input#login-password').val()
    }, function (data) {
        userGetSummary();
    });
}
function logout() {
    svc('userLogout', {}, function (data) {
        window.top.location = "login.cshtml";
    });
}

// ================================================ //
// == OTHER FUNCTIONS ============================= //

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

// Build a dropdown menu
function buildDropdown(name, optArr, active, assoc) {
    $span = $(document.createElement('span')).addClass('dropdown');
    $menu = $(document.createElement('select')).attr({id:name, name:name});
    $.each(optArr, function(key, value) {
        if (undefined == value) {value = '';}
        $option = $(document.createElement('option')).text(value);
        $option.val(assoc ? key : value);
        if (active && (active == value)) {
            $option.attr({selected:'selected'});
        }
        $menu.append($option);
    });
    return $span.append($menu);
}

// Switch between multiple screens
function switchScreen(newScreen, modal) {
    if (modal) {
        scope = 'div#modal';
    } else {
        scope = 'div#content';
    }
    $('div.sub-content',scope).hide();
    $('div.screen-'+newScreen,scope).show();
    $('div#bond-subheader span',scope).removeClass('current');
    $('div#bond-subheader span.screen-'+newScreen,scope).addClass('current');
}

// Force value to be an array
function forceArray(v) {
    if (null === v) {
        return [];
    }
    switch (typeof v) {
        case 'number':
        case 'string':
        case 'boolean':
            return [v];
        case 'object':
            return v;
        case 'undefined':
            return [];
            break;
    }
}

// ======================================================================== //
//   FIELD PARSING AND VALIDATION                                           //

// Field parsing functions
var field = {
    required: function (value) {
        if (!value) {
            return "Field required";
        } else {
            return false;
        }
    },
    error: function (x, message) {
        if ($(x.label).children('span.error').length == 0) {
            $(x.label).append('<span class="error">'+message+'</span>');
        }
    },
    // Check form field
    check: function (el) {
        id = $(el).attr('id');
        name = $(el).attr('name');
        type = $(el).get(0).tagName.toLowerCase();
        if ('input' == type) {
            type = $(el).attr('type');
        }
        if ('radio' == type) {
            filter = name;
            label = 'div#radio-' + name.replace('[', '').replace(']', '');
            val = $('input[name="'+name+'"]:checked').val();
            if (undefined == val) {val = '';}
        } else if ('checkbox' == type) {
            filter = name;
            label = 'div#checkbox-'+name;
            val = $('input[name="'+name+'"]:checked').val();
            if (undefined == val) {val = '';}
        } else {
            filter = id;
            label = 'label[for="'+id+'"]';
            val = $(el).val();
        }
        if ('textarea' == type && val) {
            val = val.replace(/\n/g, '<br />');
        }
        $(label).find('span.error').remove();
        verify({
            'el'     : el,
            'type'   : type,
            'id'     : id,
            'name'   : name,
            'filter' : filter,
            'label'  : label,
            'val'    : val
        });
    }
}
// Check validity of all fields
field.checkAll = function (form) {
    if (undefined == form) {
        form = 'form';
    }
    $(form).find('input,select,textarea').each(function () {
        field.check(this);
    });
    return ($('span.error', form).length == 0);
}
// Check if field passes required and/or validation test
field.pass = function (x, required, validation, matchVal) {
    var error = false;
    if (undefined == required) {
        required = true;
    }
    if (required) {
        error = field.required(x.val);
    }
    if (validation && !error) {
        error = validate[validation](x.val, matchVal);
    }
    if (error) {
        field.error(x, error);
        return;
    } else if (validation && x.val && ('match' != validation)) {
        formatted = format[validation](x.val);
        $(x.el).val(formatted);
        return formatted;
    } else {
        return x.val;
    }
}

// Validate values
var validate = {
    alpha: function (alpha) {
        if (!alpha) { return false; }
        invalid = alpha.match(/[^a-z\s]/gi);
        if (invalid) {
            return "Alphabets only";
        } else {
            return false;
        }
    },
    alphanumeric: function (alphanumeric) {
        if (!alphanumeric) { return false; }
        invalid = alphanumeric.match(/[^a-z0-9\s]/gim);
        if (invalid) {
            return "Alphanumeric only";
        } else {
            return false;
        }
    },
    numeric: function (numeric) {
        if (!numeric) { return false; }
        numeric = numeric.toString().replace(/[^0-9]/g, '');
        if (!numeric) {
            return "Number must be numeric";
        } else {
            return false;
        }
    },
    percent: function (percent) {
        if (!percent) { return false; }
        percent = percent.toString().replace(/[^0-9]/g, '');
        if (!percent) {
            return "Percentage must be numeric";
        } else {
            return false;
        }
    },
    money: function (money) {
        if (!money) { return false; }
        money = money.toString().replace(/[^0-9.]/g, '');
        if (!money) {
            return "Value must be numeric";
        } else {
            return false;
        }
    },
    phone: function (phone) {
        if (!phone) { return false; }
        phone = phone.toString().replace(/[^0-9]/g, '');
        if (!phone) {
            return "Number must be numeric";
        } else {
            if (phone.length != 10) {
                return "Must be a 10 digit number";
            } else {
                return false;
            }
        }
    },
    email: function (email) {
        if (!email) { return false; }
        valid = email.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i);
        if (!valid) {
            return "Invalid email address";
        } else {
            return false;
        }
    },
    uscemail: function (uscemail) {
        if (!uscemail) { return false; }
        valid = uscemail.match(/^[a-z0-9._%+-]+@usc\.edu/i);
        if (!valid) {
            return "Invalid USC email address";
        } else {
            return false;
        }
    },
    creditcard: function (card) {
        if (!card) { return false; }
        card = card.toString().replace(/[^0-9]/g, '');
        if (!card) {
            return "Numeric only";
        } else {
            if ((card.length < 13) || (16 < card.length)) {
                return "Invalid length";
            } else {
                return false;
            }
        }
    },
    csc: function (csc) {
        if (!csc) { return false; }
        csc = csc.toString().replace(/[^0-9]/g, '');
        if (!csc) {
            return "Numeric only";
        } else {
            if ((csc.length < 3) || (4 < csc.length)) {
                return "Invalid length";
            } else {
                return false;
            }
        }
    },
    zip: function (zip) {
        if (!zip) { return false; }
        zip = zip.toString().replace(/[^0-9]/g, '');
        if (!zip) {
            return "Numeric only";
        } else {
            if ((zip.length != 5) && (zip.length != 9)) {
                return "Invalid length";
            } else {
                return false;
            }
        }
    },
    date: function (dateUS) {
        if (!dateUS) { return false; }
        ts = format.timestamp(dateUS);
        if (isNaN(ts)) {
            return "Please enter a valid date";
        } else {
            return false;
        }
    },
    match: function (valOne, valTwo) {
        if (valOne !== valTwo) {
            return "Verification must match";
        } else {
            return false;
        }
    },
    password: function (password) {
        if (!password) { return false; }
        password = password.toString().replace(' ', '');
        if (!password) { return false; }
        if (password.length < 6 || password.length > 15) {
            return "Must be 6 to 15 characters";
        } else {
            return false;
        }
    }
}
// Format values
var format = {
    name: function (n) {
        if (n) {
            var out = '';
            if (n['FirstName'])  {out += n['FirstName'];}
            if (n['MiddleName']) {out += ' '+n['MiddleName'];}
            if (n['LastName'])   {out += ' '+n['LastName'];}
            if (n['Suffix'])     {out += ', '+n['Suffix'];}
            return out;
        }
    },
    address: function (a) {
        if (a) {
            var out = '';
            if (a['Address_1'])                   {out += a['Address_1'];}
            if (a['Address_1'] && a['Address_2']) {out += '<br />';}
            if (a['Address_2'])                   {out += a['Address_2'];}
            if (a['Address_1'] || a['Address_2']) {out += '<br />';}
            if (a['City'])                        {out += a['City'];}
            if (a['City'] && a['State'])          {out += ', ';}
            if (a['State'])                       {out += a['State'];}
            if (a['City'] || a['State'])          {out += ' ';}
            if (a['Zip'])                         {out += a['Zip'];}
            return out;
        }
    },
    alpha: function (alpha) {
        return alpha.toString();
    },
    alphanumeric: function (alphanumeric) {
        return alphanumeric.toString();
    },
    numeric: function (numeric) {
        return numeric.toString().replace(/[^0-9]/g,'');
    },
    percent: function (percent) {
        if (percent) {
            percent = percent.toString().replace(/[^0-9]/g,'');
            if (percent) {
                return percent + '%';
            }
        }
    },
    money: function (n, c) {
        n = n.toString().replace(/[^0-9.]/g,'');
        if (n) {
            if (undefined == c) {
                var c = 2; // Cents places
            }
            var s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
            return "$" + s + (j ? i.substr(0, j) + "," : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1,") + (c ? "." + Math.abs(n - i).toFixed(c).slice(2) : "");
        }
    },
    phone: function (phone) {
        if (phone) {
            phone = phone.toString().replace(/[^0-9]/g,'');
            if (phone) {
                return '('+phone.slice(0,3)+') '+phone.slice(3,6)+'-'+phone.slice(6,10);
            }
        }
    },
    email: function (email) {
        return email.toLowerCase();
    },
    uscemail: function (uscemail) {
        return uscemail.toLowerCase();
    },
    creditcard: function (card) {
        return card.toString().replace(/[^0-9]/g,'');
    },
    csc: function (csc) {
        return csc.toString().replace(/[^0-9]/g,'');
    },
    ssn: function (ssn) {
        if (ssn) {
            ssn = ssn.toString().replace(/[^0-9]/g,'');
            if (ssn) {
                return ssn.slice(0,3)+'-'+ssn.slice(3,5)+'-'+ssn.slice(5,9);
            }
        }
    },
    zip: function (zip) {
        if (zip) {
            zip = zip.toString().replace(/[^0-9]/g,'');
            if (5 == zip.length) {
                return zip;
            } else {
                return zip.slice(0,5)+'-'+zip.slice(5,9);
            }
        }
    },
    date: function (dateUS) {
        if (dateUS) {
            ts = new Date(format.timestamp(dateUS)*1000);
            month = ts.getMonth()+1;
            month = (month < 10) ? '0'+month : ''+month;
            day   = ts.getDate();
            day   = (day < 10)   ? '0'+day   : ''+day;
            year  = ts.getFullYear();
            //year  = ts.getFullYear()%100;
            //year  = (year < 10)  ? '0'+year  : ''+year;
            return month+'/'+day+'/'+year;
        }
    },
    time: function (timeUS) {
        if (timeUS) {
            ts = new Date(format.timestamp(timeUS)*1000);
            hours = ts.getHours();
            if (hours >= 12) {
                tod = 'PM';
                hours -= 12;
            } else {
                tod = 'AM';
            }
            if (hours == 0) {
                hours = 12;
            }
            hours = (hours < 10) ? '0'+hours : ''+hours;
            minutes = ts.getMinutes();
            minutes = (minutes < 10) ? '0'+minutes : ''+minutes;
            return hours+':'+minutes+' '+tod;
        }
    },
    username: function (username) {
        return username.toLowerCase();
    },
    password: function (password) {
        return password;
    }
}
// Convert date to timestamp
format.timestamp = function (dateUS) {
    if (dateUS) {
        return Date.parse(dateUS)/1000;
    }
}
// Calculate time elapsed
format.timeElapsed = function (timestamp) {
    if (timestamp) {
        elapsed = now - timestamp;
        if (elapsed >= 31536000) {
            span = Math.floor(elapsed/31536000);
            display = span+' Year';
        } else if (elapsed >= 86400) {
            span = Math.floor(elapsed/86400);
            display = span+' Day';
        } else if (elapsed >= 3600) {
            span = Math.floor(elapsed/3600);
            display = span+' Hour';
        } else if (elapsed >= 60) {
            span = Math.floor(elapsed/60);
            display = span+' Minute';
        } else {
            span = elapsed;
            display = span+' Second';
        }
        if (span > 1) {
            display += 's';
        }
        return display;
    }
}

// ======================================================================== //
//   MODAL                                                                  //

// Initialize modal
var modal = {
    // Load modal from external HTML file
    open: function (page, data, width, height, callback) {

        if (!data) {
            data = {};
        }
        if (!callback) {
            callback = function (html) { };
        }
        if ($.browser.webkit) {
            var vertPos = $('body').scrollTop();
        } else {
            var vertPos = $('html').scrollTop();
        }


        $('#modal-container').css({ 'top': (vertPos + 45) + 'px' });
        $('#modal-overlay').fadeIn(300, function () {
            $('#modal-container').fadeIn(200, function () {
                //alert(baseURL + page);
                $.ajax({
                    type: 'GET',
                    url: page,
                    data: data,
                    dataType: 'html',
                    success: function (content) {
                        $('#modal-content').html(content);
                        if (!width || isNaN(width) || width < 1) { width = 774; }                              // Default width (full width)
                        if (!height || isNaN(height) || height < 1) { height = $('#modal-content').height(); } // Default height (dynamic)
                        var resize = { 'width': width + 'px', 'height': height + 'px' };
                        $('#modal').animate(resize, 400, function () {
                            $('#modal-loading').fadeOut(150, function () {
                                $('#modal-content').fadeIn(200, function () {
                                    callback();
                                });
                            });
                        });
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert('Error executing: ' + jqXHR + "/" + textStatus + "/" + errorThrown);
                    }
                });
            });
        });
        return false;
    },
    // Close modal
    close: function (callback) {
        $('#modal-overlay').hide();
        $('#modal-container').hide();
        $('#modal-content').hide().html('');
        $('#modal-loading').show();
        $('#modal').css({ 'width': '500px', 'height': '275px' });
        if (callback) {
            callback();
        }
    }
}

// Registration popup
modal.registration = function () {
    modal.open('modal/registration.html', {}, 768, 352);
}
// Login popup
modal.login = function () {
    modal.open('modal/login.html', {}, 396, 236);
}