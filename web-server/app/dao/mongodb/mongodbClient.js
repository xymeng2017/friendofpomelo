/* *******************************************
 * Copyright (c) 2016-2017
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : treasures
 * File         : mongodb.js
 * Created      : 2017-02-06
 * Author       : lee
 * *******************************************/

const MongodbPool = require('./MongodbPool');

/**
 * Class mongodb client.
 *
 * @type {MongodbClient}
 */
class MongodbClient {

    /**
     * @constructor
     */
    constructor() {
        this._pool = null;
    }

    /**
     * Init database.
     */
    init() {
        if (!this._pool) {
            this._pool = MongodbPool.createMongodbPool();
        }
    }

    /**
     * Shutdown database.
     */
    async shutdown() {
        await this._pool.drain();
        return this._pool.clear();
    }

    /**
     * Acquire database.
     *
     * @return {Promise<Db>}
     */
    async acquire() {
        return this._pool.acquire(1);
    }

    /**
     * Release database.
     *
     * @param {Db} db
     * @return {Promise<*>}
     */
    async release(db) {
        return this._pool.release(db);
    }
}

module.exports = new MongodbClient();





