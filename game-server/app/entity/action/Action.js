/* *******************************************
 * Copyright (c) 2016-2017
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : treasures
 * File         : Action.js
 * Created      : 2017-03-01
 * Author       : lee
 * *******************************************/

let id = 1;

/**
 * Action class, used to excute the action in server.
 */
module.exports = class Action {

    constructor(opts) {
        this.data = opts.data;
        this.id = opts.id || id++;
        this.type = opts.type || 'defaultAction';

        this.finished = false;
        this.aborted = false;
        this.singleton = opts.singleton;
    }

    /**
     * Update interface, default update will do nothing, every tick the update will be invoked.
     *
     * @public
     */
    update() {}
};