/* *******************************************
 * Copyright (c) 2016-2017
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : treasures
 * File         : mongodbPool.js
 * Created      : 2017-02-06
 * Author       : lee
 * *******************************************/

const mongodb = require('mongodb');
const genericPool = require('generic-pool');

/**
 * Class mongodb pool.
 *
 * @type {MongodbPool}
 */
module.exports = class MongodbPool {

    constructor(){}

    /**
     * Create mongodb connection pool.
     *
     * @param {Application} app
     */
    static createMongodbPool(app) {
        const mongodbConfig = app.get('mongodb');
        const factory = {
            create:  () => {
                const server = new mongodb.Server(mongodbConfig.host, mongodbConfig.port, {auto_reconnect: false, poolSize: 2});
                const db = new mongodb.Db(mongodbConfig.database, server, {w: -1});
                return db.open();
            },
            destroy: db => db.close()
        };
        const config = {
            max: 10,
            min: 2,
            priorityRange: 3,
            idleTimeoutMillis : 30000,
            log : true
        };
        return genericPool.createPool(factory, config);
    }
};