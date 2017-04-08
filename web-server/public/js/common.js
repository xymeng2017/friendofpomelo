/* *******************************************
 * Copyright (c) 2016
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : Task
 * File         : common.js
 * Created      : 2016-11-15
 * Author		: lee
 * *******************************************/

/**
 * Class used to show message, based on html element <div id="alert-div"></div>.
 */
class Message {

    /**
     * Show error message, use red color.
     *
     * @param {string} message - Error message.
     */
    static showError(message) {
        $('#alert-div').html('<div class="alert alert-danger"><p>' + message + '</p></div>');
    }

    /**
     * Show success message, use green color.
     *
     * @param {string} message - Success message.
     */
    static showSuccess(message) {
        $('#alert-div').html('<div class="alert alert-success"><p>' + message + '</p></div>');
    }
}

/**
 * Class used to validate if the input is valid.
 */
class Validater {

    /**
     * Test if the string is a valid username.
     * Valid username: first character letter, only with letter number and underline, 6~16 characters.
     *
     * @param {string} s - Username.
     * @return {boolean} If a valid username.
     */
    static validateUsername(s) {
        if (typeof s !== 'string')
            return false;
        let format = /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/;
        return format.test(s);
    }

    /**
     * Test if the string is a valid password.
     * Valid password: only with letter number and underline, 6~16 characters.
     *
     * @param {string} s - Password.
     * @return {boolean} If a valid password.
     */
    static validatePassword(s) {
        if (typeof s !== 'string')
            return false;
        let format = /^[a-zA-Z0-9_]{6,16}$/;
        return format.test(s);
    }

    /**
     * Test if the string is a valid hashed password.
     * Valid hashed password: only with letter number and underline, total 42 characters(10 characters of salt, 32 characters of md5).
     *
     * @param {string} s - Hashed password.
     * @return {boolean} If a valid hashed password.
     */
    static validateHashedPassword(s) {
        if (typeof s !== 'string')
            return false;
        let format = /^[a-zA-Z0-9_]{42}$/;
        return format.test(s);
    }

    /**
     * Test if the string is a valid phone number.
     * Valid phone number: meet phone format.
     *
     * @param {string} s - Phone number.
     * @return {boolean} If a valid phone number.
     */
    static validatePhone(s) {
        if (typeof s !== 'string')
            return false;
        let format = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
        return format.test(s);
    }

    /**
     * Test if the string is a valid phone verification code.
     * Valid phone verification code: 6 numbers.
     *
     * @param {string} s - Phone verification code.
     * @return {boolean} If a valid phone verification code.
     */
    static validatePhoneVerificationCode(s) {
        if (typeof s !== 'string')
            return false;
        let format = /^[0-9]{6}$/;
        return format.test(s);
    }

    /**
     * Test if the string is a valid verification code.
     * Valid verification code: only with letter and number, 4 characters.
     *
     * @param {string} s - Verification code.
     * @return {boolean} If a valid verification code.
     */
    static validateVerificationCode(s) {
        if (typeof s !== 'string')
            return false;
        let format = /^[A-Za-z0-9]{4}$/;
        return format.test(s);
    }

    /**
     * Test string if a valid email.
     * Valid email: meet email format.
     *
     * @param {string} s - Email.
     * @return {boolean} If a valid email.
     */
    static validateEmail(s) {
        if (typeof s !== 'string')
            return false;
        let format = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        return format.test(s);
    }
}

function success(data, statusText) {
    console.log('data: ' + data);
    console.log('statusText: ' + statusText);
}
function error(xhr, statusText) {
    console.log('statusText: ' + statusText);
    alert("error:" + statusText);
}

/**
 * Class to show number with appropriate unit.
 */
class Show {

    /**
     * Show size.
     *
     * @param {number} n
     * @return {string} Size with appropriate unit.
     */
    static showSize(n) {
        let show;
        if (n < 0) {
            show = '(show_size) error input: ' + n;
        }
        else if (n < 1024) {
            show = n + 'B';
        } else if (n < 1024 * 1024) {
            show = (1.0 * n / 1024).toFixed(2) + 'KB';
        } else if (n < 1024 * 1024 * 1024) {
            show = (1.0 * n / (1024 * 1024)).toFixed(2) + 'MB';
        } else if (n < 1024 * 1024 * 1024 * 1024) {
            show = (1.0 * n / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
        } else {
            show = (1.0 * n / (1024 * 1024 * 1024 * 1024)).toFixed(2) + 'TB';
        }
        return show;
    }

    /**
     * Show a noun or several nouns.
     *
     * @param {number} n
     * @param {string} noun
     * @return {string} A noun or several nouns.
     */
    static showNoun(n, noun) {
        if (n <= 1) {
            return '' + n + ' ' + noun;
        } else {
            return '' + n + ' ' + noun + 's';
        }
    }

    /**
     * Second to date string.
     *
     * @param {number} s - Second.
     * @return {string} Date string.
     */
    static showDateFromSecond(s) {
        const date = new Date();
        date.setTime(s * 1000);
        return date.toLocaleString();
    }

    /**
     * Millisecond to date string.
     *
     * @param {number} s - Millisecond.
     * @return {string} Date string.
     */
    static showDateFromMillisecond(s) {
        const date = new Date();
        date.setTime(s);
        return date.toLocaleString();
    }

    /**
     * Second to duration string.
     *
     * @param {string|number} s - Second.
     * @return {string} Duration string.
     */
    static showDurationFromSecond(s) {
        let time = parseInt(s);
        if (null !== time && '' !== time) {
            if (time > 60 && time < 60 * 60) {
                time = parseInt(time / 60.0) + "m" + parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60) + "s";
            }
            else if (time >= 60 * 60 && time < 60 * 60 * 24) {
                time = parseInt(time / 3600.0) + "h" + parseInt((parseFloat(time / 3600.0) -
                        parseInt(time / 3600.0)) * 60) + "m" +
                    parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                        parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "s";
            }
            else {
                time = parseInt(time) + "s";
            }
        }
        return time;
    }
}
