/* *******************************************
 * Copyright (c) 2016-2017
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : treasures
 * File         : IdentifierDao.js
 * Created      : 2017-03-13
 * Author       : lee
 * *******************************************/

const mongodbClient = require('./mongodb/mongodbClient');
const ObjectId = require('mongodb').ObjectId;
const COLLECTION = 'identifiers';

/**
 * Class to operate identifier.
 */
module.exports = class IdentifierDao {

    static async init() {
        const db = await mongodbClient.acquire();
        const collection = db.collection(COLLECTION);
        const doc = await collection.findOne({name: 'player'});
        if (!doc) {
            await collection.insertOne({name: 'player', maxIdentifier: 10}, {safe: true});
        }
        await mongodbClient.release(db);
    }

    /**
     * Create a player identifier.
     * If not exist, return -1.
     *
     * @return {Promise.<number>}
     */
    static async createPlayerIdentifier() {
        const db = await mongodbClient.acquire();
        const collection = db.collection(COLLECTION);
        const result = await collection.findOneAndUpdate({name: 'player'}, {$inc: {maxIdentifier: 1}});
        await mongodbClient.release(db);
        if (!result.value) {
            return -1;
        }
        return result.value.maxIdentifier;
    }

};