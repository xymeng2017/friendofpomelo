/* *******************************************
 * Copyright (c) 2016-2017
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : treasures
 * File         : User.js
 * Created      : 2017-02-28
 * Author       : lee
 * *******************************************/

const Entity = require('./Entity');

/**
 * Class to describe user.
 */
module.exports = class User extends Entity {

    /**
     * Constructor.
     *
     * @constructor
     * @param {{_id: ObjectId=, username: string=, password: string=}} opts
     */
    constructor(opts) {
        super(opts);
        this.username = opts.username || null;
        this.password = opts.password || null;
    }
};