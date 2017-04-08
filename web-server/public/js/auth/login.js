/* *******************************************
 * Copyright (c) 2016
 * Huawei Technologies Co.,Ltd. All rights reserved.
 * Project      : Task
 * File         : login.js
 * Created      : 2016-11-15
 * Author		: lee
 * *******************************************/

const formFields = [$('#user-input'), $('#pass-input')];

const errorMsg = [
    /* 00 */['Username cannot be empty'],
    /* 01 */['Username must be between 6~16 characters, and cannot contain special characters'],
    /* 02 */['Password cannot be empty'],
    /* 03 */['Password must be between 6~16 characters, and cannot contain special characters'],
    /* 04 */['Username does not exist'],
    /* 05 */['Incorrect username or password'],
    /* 06 */['Unknown error'],
    /* 07 */['Illegal parameter']
];

const normalMsg = [
    /* 00 */['Logout success'],
    /* 01 */['Login success, page will jump']
];

const code = {
    FA_IMPOSSIBLE_ERROR: 20201,
    FA_UNKNOWN_ERROR: 20202,
    FA_PARAMS_INVALID: 20203,
    FA_USER_NOT_EXIST: 20204,
    FA_PASSWORD_INVALID: 20205
};

$(document).ready(function () {

    $('#login-form').ajaxForm({
        beforeSubmit: function (formData, jqForm, options) {
            if (formFields[0].val().trim() === '') {
                Message.showError(errorMsg[0][window.langType]);
                return false;
            } else if (!Validater.validateUsername(formFields[0].val())) {
                Message.showError(errorMsg[1][window.langType]);
                return false;
            } else if (formFields[1].val().trim() === '') {
                Message.showError(errorMsg[2][window.langType]);
                return false;
            } else if (!Validater.validatePassword(formFields[1].val())) {
                Message.showError(errorMsg[3][window.langType]);
                return false;
            }
            return true;
        },
        success: function (data, statusText, xhr, $form) {
            if (statusText === 'success') {
                console.log('data type: ' + typeof data);
                console.log('data: ');
                console.log(data);
                sessionStorage.uid = data.uid;
                sessionStorage.token = data.token;
                window.location.href = '/home';
            }
        },
        error: function (err) {
            console.log('err.responseText type: ' + typeof err.responseText);
            console.log('err.responseText: ');
            console.log(err.responseText);
            let json = JSON.parse(err.responseText);
            console.log(json.code);
            switch (json.code) {
                case code.FA_USER_NOT_EXIST:
                    Message.showError(errorMsg[4][window.langType]);
                    break;
                case code.FA_PASSWORD_INVALID:
                    Message.showError(errorMsg[5][window.langType]);
                    break;
                case code.FA_PARAMS_INVALID:
                    Message.showError(errorMsg[7][window.langType]);
                    break;
                default:
                    Message.showError(errorMsg[6][window.langType]);
                    break;
            }
        }
    });
    formFields[0].focus();
});