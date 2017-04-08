/* *******************************************
 * Copyright (c) 2016-2017
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : PHC
 * File         : Random.js
 * Created      : 2017-01-02
 * Author       : lee
 * *******************************************/

/**
 * Class used to random a string or number.
 */
module.exports = class Random {

    /**
     * Generate a random string.
     *
     * @param {number} n - Random string length.
     * @return {string} Random string.
     */
    static randomString(n) {
        const text = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
        let randomStr = '';
        for (let i = 0; i < n; i++) {
            randomStr += text.charAt(Math.floor(Math.random() * text.length));
        }
        return randomStr;
    }

    /**
     * Generate a random lower case string.
     *
     * @param {number} n - Random string length.
     * @return {string} Random lower case string.
     */
    static randomLowerCaseString(n) {
        const text = '0123456789abcdefghijklmnopqurstuvwxyz';
        let randomLowerCaseStr = '';
        for (let i = 0; i < n; i++) {
            randomLowerCaseStr += text.charAt(Math.floor(Math.random() * text.length));
        }
        return randomLowerCaseStr;
    }

    /**
     * Generate a random number.
     *
     * @param {number} min - Min number.
     * @param {number} max - Max number(not include).
     * @return {number} Random number.
     */
    static randomNumber(min, max) {
        return Math.floor(min + Math.random() * (max - min));
    }

    /**
     * Generate a random pure number string.
     *
     * @param {number} n - Random string length.
     * @return {string} Random pure number string.
     */
    static randomNumberString(n) {
        const text = '0123456789';
        let randomNumberStr = '';
        for (let i = 0; i < n; i++) {
            randomNumberStr += text.charAt(Math.floor(Math.random() * text.length));
        }
        return randomNumberStr;
    }
};