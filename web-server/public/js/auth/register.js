/* *******************************************
 * Copyright (c) 2016
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : treasures
 * File         : register.js
 * Created      : 2016-11-15
 * Author		: lee
 * *******************************************/

const formFields = [$('#user-input'), $('#pass-input')];

const errorMsg = [
    /* 00 */['Phone number cannot be empty'],
    /* 01 */['Invalid phone number'],
    /* 02 */['Phone verification code cannot be empty'],
    /* 03 */['Phone verification code should be 6 numbers'],
    /* 04 */['Password cannot be empty'],
    /* 05 */['Password must be between 6~16 characters, and cannot contain special characters'],
    /* 06 */['This phone number has been registered'],
    /* 07 */['Phone verification code has expired'],
    /* 08 */['Phone verification code is wrong'],
    /* 09 */['Unknown error'],
    /* 10 */['Username should be at least 6 characters'],
    /* 11 */['Username cannot be empty'],
    /* 12 */['Illegal parameter'],
    /* 13 */['This username has been registered'],
    /* 14 */['Create user failed'],
    /* 15 */['Username must be between 6~16 characters, and cannot contain special characters'],
    /* 16 */['Username cannot be empty'],
];

const normalMsg = [
    /* 00 */['Register success, page will jump'],
    /* 01 */['Get Code']
];

const code = {
    FA_IMPOSSIBLE_ERROR: 20101,
    FA_UNKNOWN_ERROR: 20102,
    FA_PARAMS_INVALID: 20203,
    FA_USER_EXIST: 20104,
    FA_CREATE_USER_FAILED: 20105
};

$(document).ready(function() {
    $('#register-form').ajaxForm({
        beforeSubmit : function(formData, jqForm, options) {
            if (formFields[0].val().trim() === '') {
                Message.showError(errorMsg[16][window.langType]);
                return false;
            } else if (!Validater.validateUsername(formFields[0].val())) {
                Message.showError(errorMsg[15][window.langType]);
                return false;
            } else if (formFields[1].val().trim() === '') {
                Message.showError(errorMsg[4][window.langType]);
                return false;
            } else if (!Validater.validatePassword(formFields[1].val())) {
                Message.showError(errorMsg[5][window.langType]);
                return false;
            }
            return true;
        },
        success	: function(data, statusText, xhr, $form) {
            if (statusText === 'success') {
                Message.showSuccess(normalMsg[0][window.langType]);
                setTimeout(function(){window.location.href = '/auth/login';}, 2000);
            }
        },
        error: function (err) {
            let json = JSON.parse(err.responseText);
            console.log(json.code);
            switch (json.code) {
                case code.FA_USER_EXIST:
                    Message.showError(errorMsg[13][window.langType]);
                    break;
                case code.FA_CREATE_USER_FAILED:
                    Message.showError(errorMsg[14][window.langType]);
                    break;
                case code.FA_PARAMS_INVALID:
                    Message.showError(errorMsg[12][window.langType]);
                    break;
                default:
                    Message.showError(errorMsg[9][window.langType]);
                    break;
            }
        }
    });
    formFields[0].focus();
});