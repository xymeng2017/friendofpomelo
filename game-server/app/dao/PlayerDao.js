/* *******************************************
 * Copyright (c) 2016-2017
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : treasures
 * File         : PlayerDao.js
 * Created      : 2017-02-04
 * Author       : lee
 * *******************************************/

const mongodbClient = require('./mongodb/mongodbClient');
const Player = require('../entity/Player');
const IdentifierDao = require('./IdentifierDao');
const logger = require('pomelo-logger').getLogger(__filename);
const ObjectId = require('mongodb').ObjectId;
const COLLECTION = 'players';

class PlayerDao {


    /**
     * Get a player, if not exist, create one.
     *
     * @param {{userId: string}} opts
     * @return {Promise<Player>}
     */
    static async getOrCreatePlayer(opts) {
        const db = await mongodbClient.acquire();
        const collection = db.collection(COLLECTION);
        const doc = await collection.findOne({userId: opts.userId});
        await mongodbClient.release(db);
        if (!doc) {
            opts.identifier = await IdentifierDao.createPlayerIdentifier();
            opts.init = false;
            const player = new Player(opts);
            const db = await mongodbClient.acquire();
            const collection = db.collection(COLLECTION);
            const result = await collection.insertOne(player, {safe: true});
            await mongodbClient.release(db);
            player._id = result.insertedId;
            return player;
        } else {
            return new Player(doc);
        }
    }

    /**
     * Create a player.
     *
     * @deprecated
     * @param {{userId: string}} opts
     * @return {Promise<Player>}
     */
    static async createPlayer(opts) {
        opts.identifier = await IdentifierDao.createPlayerIdentifier();
        opts.init = false;
        const player = new Player(opts);
        const collection = await mongodb.collection(COLLECTION);
        const result = await collection.insertOne(player.toJson(), {safe: true});
        player._id = result.insertedId;
        return player;
    }

    /**
     * Get player.
     *
     * @param {{_id: ObjectId=, userId: string=, identifier: number=}} opts
     * @return {Promise<?Player>}
     */
    static async getPlayer(opts) {
        const db = await mongodbClient.acquire();
        const collection = db.collection(COLLECTION);
        const doc = await collection.findOne(opts);
        await mongodbClient.release(db);
        if (!doc) {
            return null;
        } else {
            return new Player(doc);
        }
    }

    /**
     * Update player.
     *
     * @param {object} filter
     * @param {object} update
     * @return {Promise<?Player>}
     */
    static async updatePlayer(filter, update) {
        const db = await mongodbClient.acquire();
        const collection = db.collection(COLLECTION);
        const result = await collection.findOneAndUpdate(filter, update, {returnOriginal: false});
        await mongodbClient.release(db);
        if (result.value) {
            return new Player(result.value);
        } else {
            return null;
        }
    }

}

module.exports = PlayerDao;