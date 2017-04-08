/* *******************************************
 * Copyright (c) 2016-2017
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : treasures
 * File         : UserDao.js
 * Created      : 2017-02-28
 * Author       : lee
 * *******************************************/

const mongodbClient = require('./mongodb/mongodbClient');
const User = require('../entity/User');
const ObjectId = require('mongodb').ObjectId;
const COLLECTION = 'users';

/**
 * Class to operate user.
 */
module.exports = class UserDao {

    /**
     * Get User.
     *
     * @param {{_id: ObjectId}} opts
     * @return {Promise<?User>}
     */
    static async getUser(opts) {
        const db = await mongodbClient.acquire();
        const collection = db.collection(COLLECTION);
        const doc = await collection.findOne({_id: opts._id});
        await mongodbClient.release(db);
        if (doc === null) {
            return null;
        } else {
            return new User(doc);
        }
    }
};