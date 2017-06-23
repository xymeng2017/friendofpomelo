/* *******************************************
 * Copyright (c) 2016-2017
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : treasures
 * File         : Entity.js
 * Created      : 2017-04-02
 * Author       : lee
 * *******************************************/

const ObjectId = require('mongodb').ObjectId;

/**
 * Class to describe user.
 *
 * @class {Entity}
 */
module.exports = class Entity {

    /**
     * Constructor.
     *
     * @constructor
     * @param {{_id: ObjectId=}} opts
     */
    constructor(opts) {
        opts = opts || {};
        const objectId = (typeof opts._id === 'string') ? ObjectId(opts._id) : opts._id;
        this._id = objectId;
    }
};
