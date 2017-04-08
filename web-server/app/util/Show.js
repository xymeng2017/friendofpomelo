/* *******************************************
 * Copyright (c) 2016-2017
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : Task
 * File         : Show.js
 * Created      : 2017-02-22
 * Author       : lee
 * *******************************************/

/**
 * Class to show number with appropriate unit.
 */
module.exports = class Show {

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
};