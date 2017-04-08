/* *******************************************
 * Copyright (c) 2016-2017
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : Task
 * File         : Token.js
 * Created      : 2017-02-08
 * Author       : lee
 * *******************************************/

const crypto = require('crypto');

/**
 * Class to create and parse token.
 */
module.exports = class Token {

    /**
     * Create token by uid. Encrypt uid and timestamp to get a token.
     *
     * @param  {string} uid - User id.
     * @param  {string|number} timestamp - Current time.
     * @param  {string} pwd - Encrypt password.
     * @return {string} Token string.
     */
    static create(uid, timestamp, pwd) {
        const msg = uid + '|' + timestamp;
        const cipher = crypto.createCipher('aes256', pwd);
        let enc = cipher.update(msg, 'utf8', 'hex');
        enc += cipher.final('hex');
        return enc;
    }

    /**
     * Parse token to validate it and get the uid and timestamp.
     *
     * @param  {string} token - Token string.
     * @param  {string} pwd - Decrypt password.
     * @return {?object} Uid and timestamp that exported from token. Null for illegal token.
     */
    static parse(token, pwd) {
        const decipher = crypto.createDecipher('aes256', pwd);
        let dec;
        try {
            dec = decipher.update(token, 'hex', 'utf8');
            dec += decipher.final('utf8');
        } catch (err) {
            console.error('[token] fail to decrypt token. %j', token);
            return null;
        }
        const ts = dec.split('|');
        if (ts.length !== 2) {
            // illegal token
            return null;
        }
        return {uid: ts[0], timestamp: Number(ts[1])};
    }
};


