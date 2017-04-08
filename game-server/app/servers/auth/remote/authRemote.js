/* *******************************************
 * Copyright (c) 2016-2017
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : treasures
 * File         : authRemote.js
 * Created      : 2017-02-28
 * Author       : lee
 * *******************************************/

const Token = require('../../../util/Token');
const UserDao = require('../../../dao/UserDao');
const User = require('../../../entity/User');
const CODE = require('../../../const/code');
const ObjectId = require('mongodb').ObjectId;

const DEFAULT_SECRET = 'pomelo_session_secret';
const DEFAULT_EXPIRE = 60 * 60 * 1000; // default session expire time: 1 hours

module.exports = function(app) {
    return new Remote(app);
    // console.info(Remote.prototype === remote.__proto__);
    // console.info(typeof Remote.prototype);
    // console.info(typeof Remote.prototype.constructor);
    // console.info(typeof Remote.prototype.auth);
    // console.info(typeof remote.__proto__.constructor);
    // console.info(typeof remote.__proto__.auth);
    // //console.dir(Remote);
    // //console.info('remote.__proto__: ');
    // console.dir(remote.__proto__);
};

const Remote = function (app) {
    this.app = app;
    const session = app.get('session') || {};
    this.secret = session.secret || DEFAULT_SECRET;
    this.expire = session.expire || DEFAULT_EXPIRE;
};
//
// var pro = Remote.prototype;
//
// /**
//  * Auth token and check whether expire.
//  *
//  * @param  {String}   token token string
//  * @param  {Function} cb
//  */
// pro.auth = function(token, cb) {
//     console.log('This is auth');
//     cb({code: CODE.OK});
// };

// class Remote {
//
//     /**
//      * Constructor.
//      *
//      * @constructor
//      * @param {object} app - Pomelo app.
//      */
//     constructor(app) {
//         this.app = app;
//         const session = app.get('session') || {};
//         this.secret = session.secret || DEFAULT_SECRET;
//         this.expire = session.expire || DEFAULT_EXPIRE;
//     }
//
//
// }

/**
 * Auth token and check whether expire.
 *
 * @public
 * @param  {string} token - Token string.
 * @param {function} cb - Return function ({code: number, user: User=}).
 */
Remote.prototype.auth = function(token, cb) {
    const res = Token.parse(token, this.secret);
    if (!res) {
        cb({code: CODE.AUTH.CE_TOKEN_INVALID});
        return;
    }

    if (!Remote._checkExpire(res, this.expire)) {
        cb({code: CODE.AUTH.FA_TOKEN_EXPIRE});
        return;
    }

    UserDao.getUser({_id: ObjectId(res.uid)}).then( user => {
        if (!user) {
            cb({code: CODE.AUTH.FA_USER_NOT_EXIST});
        } else {
            cb({code: CODE.OK, user: user});
        }
    });

};

/**
 * Check the token whether expire.
 *
 * @private
 * @param  {object} token - Token info.
 * @param  {number} expire - Expire time.
 * @return {boolean} True for not expire and false for expire.
 */
Remote._checkExpire = function (token, expire) {
    if (expire < 0) {
        // negative expire means never expire
        return true;
    }
    return (Date.now() - token.timestamp) < expire;
};


