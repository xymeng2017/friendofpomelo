/* *******************************************
 * Copyright (c) 2016-2017
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : treasures
 * File         : Global.js
 * Created      : 2017-03-10
 * Author       : lee
 * *******************************************/

/**
 * Class for global info of 'Cat and Mouse'.
 *
 * @type {Global}
 */
module.exports = class Global {

    /**
     * Create global info.
     *
     * @constructor
     * @param opts
     */
    constructor(opts) {
        this.id = opts._id;
        this.role = opts.role; // Mouse or Cat.
        this.name = opts.name; // Main player name.
        this.water = opts.water || 0;
        this.population = opts.population || 0;
    }
};