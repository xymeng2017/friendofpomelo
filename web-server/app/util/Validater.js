/* *******************************************
 * Copyright (c) 2016-2017
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : PHC
 * File         : Validater.js
 * Created      : 2016-12-28
 * Author       : lee
 * *******************************************/

/**
 * Class used to validate if the input is valid.
 */
module.exports = class Validater {

    /**
     * Test if the string is a valid username.
     * Valid username: first character letter, only with letter number and underline, 6~16 characters.
     *
     * @param {string} s - Username.
     * @return {boolean} If a valid username.
     */
    static validateUsername(s) {
        if (typeof s != 'string')
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
        if (typeof s != 'string')
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
        if (typeof s != 'string')
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
        if (typeof s != 'string')
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
        if (typeof s != 'string')
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
        if (typeof s != 'string')
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
        if (typeof s != 'string')
            return false;
        let format = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        return format.test(s);
    }
};