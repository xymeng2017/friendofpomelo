/* *******************************************
 * Copyright (c) 2016-2017
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : treasures
 * File         : player.js
 * Created      : 2017-02-04
 * Author       : lee
 * *******************************************/

const Entity = require('./Entity');

/**
 * Class player.
 */
module.exports = class Player extends Entity {

    /**
     * Constructor.
     *
     * @param {{_id: ObjectId=, identifier: number, userId: string, init: boolean, name: string=, coin: number=, gem: number=, level: number=,
     *         friendRequests: Array<{_id: ObjectId, identifier: number, name: string}>=,
     *         friends: Array<{_id: ObjectId, identifier: number, name: string}>=,
     *         societyRequest_id: ObjectId=, society_id: ObjectId=}} opts
     */
    constructor(opts) {
        super(opts);
        /** @type {number} */ this.identifier = opts.identifier || -1;
        /** @type {string} */ this.userId = opts.userId || 'tencent-' + 'uid'; // tencent 360 xiaomi
        /** @type {boolean} */ this.init = opts.init || false;
        /** @type {string} */ this.name = opts.name || '';
        /** @type {number} */ this.coin = opts.coin || 0;
        /** @type {number} */ this.gem = opts.gem || 0;
        /** @type {number} */ this.level = opts.level || 1;
        /** @type {Array<{_id: ObjectId, identifier: number, name: string}>} */ this.friendRequests = opts.friendRequests || []; // Friend requests
        /** @type {Array<{_id: ObjectId, identifier: number, name: string}>} */ this.friends = opts.friends || []; // Friends
        /** @type {ObjectId} */ this.societyRequest_id = opts.societyRequest_id || null;
        /** @type {ObjectId} */ this.society_id = opts.society_id || null;
    }

    toPublic() {
        return {
            identifier: this.identifier,
            name: this.name,
            level: this.level,
            society_id: this.society_id
        };
    }

};