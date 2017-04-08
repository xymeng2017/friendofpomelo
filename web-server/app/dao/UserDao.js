/* *******************************************
 * Copyright (c) 2016-2017
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : treasures
 * File         : UserDao.js
 * Created      : 2017-02-25
 * Author       : lee
 * *******************************************/

const crypto = require('crypto');
const mongodbClient = require('./mongodb/mongodbClient');
const User = require('../entity/User');
const Random = require('../util/Random');
const Validater = require('../util/Validater');
const CODE = require('../../const/code');
const ObjectId = require('mongodb').ObjectId;
const COLLECTION = 'users';

/**
 * Class to operate user.
 */
module.exports = class UserDao {

    /** @typedef {{username:string, password:string}} UserData */

    /**
     * Create a new account. It doesn't check username and password.
     *
     * @param {UserData} opts
     * @return {Promise<User|number>}
     */
    static async createNewAccount(opts) {
        if (!Validater.validateUsername(opts.username) || !Validater.validatePassword(opts.password)) {
            return CODE.AUTH.REGISTER.FA_PARAMS_INVALID;
        }
        const options = {
            username: opts.username,
            password: opts.password
        };
        const db = await mongodbClient.acquire();
        const collection = db.collection(COLLECTION);
        const doc = await collection.findOne({username: options.username});
        if (doc) {
            await mongodbClient.release(db);
            return CODE.AUTH.REGISTER.FA_USER_EXIST;
        }
        const userData = {
            username: options.username,
            password: UserDao._saltAndHash(options.password)
        };
        const user = new User(userData);
        const result = await collection.insertOne(user, {safe: true});
        await mongodbClient.release(db);
        user._id = result.insertedId;
        return user;
    }

    /**
     * Auto login.
     *
     * @param {UserData} opts
     * @return {Promise<?User>}
     */
    static async autoLogin(opts) {
        if (!Validater.validateUsername(opts.username) || !Validater.validatePassword(opts.password)) {
            return null;
        }
        const options = {
            username: opts.username,
            password: opts.password
        };
        const db = await mongodbClient.acquire();
        const collection = db.collection(COLLECTION);
        const doc = await collection.findOne({username: options.username});
        await mongodbClient.release(db);
        if (!doc) {
            return null;
        }
        if (doc.password === options.password) {
            return new User(doc);
        } else {
            return null;
        }
    }

    /**
     * Manual login.
     *
     * @param {UserData} opts
     * @return {Promise<User|number>}
     */
    static async manualLogin(opts) {
        if (!Validater.validateUsername(opts.username) || !Validater.validatePassword(opts.password)) {
            return CODE.AUTH.LOGIN.FA_PARAMS_INVALID;
        }
        const options = {
            username: opts.username,
            password: opts.password
        };
        const db = await mongodbClient.acquire();
        const collection = db.collection(COLLECTION);
        const doc = await collection.findOne({username: options.username});
        await mongodbClient.release(db);
        if (!doc) {
            return CODE.AUTH.LOGIN.FA_USER_NOT_EXIST;
        }
        if (UserDao._validatePassword(options.password, doc.password)) {
            return new User(doc);
        } else {
            return CODE.AUTH.LOGIN.FA_PASSWORD_INVALID;
        }
    }

    /**
     * Validate password.
     *
     * @private
     * @param {string} plainPass - Plain password.
     * @param {string} hashedPass - Hashed password.
     * @return {boolean} If equal.
     */
    static _validatePassword(plainPass, hashedPass) {
        const salt = hashedPass.substr(0, 10);
        const validHash = salt + UserDao._md5(plainPass + salt);
        return hashedPass === validHash;
    }

    /**
     * Salt and hash.
     *
     * @private
     * @param {string} pass - Password to hash.
     * @return {string} Hashed password.
     */
    static _saltAndHash(pass) {
        const salt = UserDao._generateSalt();
        return salt + UserDao._md5(pass + salt);
    }

    /**
     * Generate a salt.
     *
     * @private
     * @return {string} Random string of 10 characters.
     */
    static _generateSalt() {
        return Random.randomString(10);
    }

    /**
     * Calculate md5 value of a string.
     *
     * @private
     * @param {string} str - String to md5.
     * @return {string} Md5 value.
     */
    static _md5(str) {
        return crypto.createHash('md5').update(str).digest('hex');
    }
};