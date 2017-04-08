/* *******************************************
 * Copyright (c) 2016-2017
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : Task
 * File         : code.js
 * Created      : 2017-02-07
 * Author       : lee
 * *******************************************/

module.exports = {
    OK: 200,
    FAIL: 500,
    CLIENT: {
        // [01] global
        GLOBAL: {
            FA_IMPOSSIBLE_ERROR: 4101,
            FA_UNKNOWN_ERROR: 4102
        },
        NETWORK: {
            FA_NO_SESSION: 4201
        }
    },
    SERVER: {
        // [01] global
        GLOBAL: {
            FA_IMPOSSIBLE_ERROR: 5101,
            FA_UNKNOWN_ERROR: 5102
        }
    },
    AUTH: {
        // [01] register
        REGISTER: {
            FA_IMPOSSIBLE_ERROR: 20101,
            FA_UNKNOWN_ERROR: 20102,
            FA_PARAMS_INVALID: 20203,
            FA_USER_EXIST: 20104,
            FA_CREATE_USER_FAILED: 20105
        },
        // [02] login
        LOGIN: {
            FA_IMPOSSIBLE_ERROR: 20201,
            FA_UNKNOWN_ERROR: 20202,
            FA_PARAMS_INVALID: 20203,
            FA_USER_NOT_EXIST: 20204,
            FA_PASSWORD_INVALID: 20205
        }
    },
    CTRL: {
        // [01] id
        ID: {
        },
        // [02] download
        DOWNLOAD: {
            FA_IMPOSSIBLE_ERROR: 30201,
            FA_UNKNOWN_ERROR: 30202,
            FA_FILENAME_INVALID: 30203,
            FA_FILE_NOT_EXIST: 30204
        }
    }
};