/* *******************************************
 * Copyright (c) 2016-2017
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : treasures
 * File         : Player.js
 * Created      : 2017-03-05
 * Author       : lee
 * *******************************************/

module.exports = class Player {

    /**
     * Create player.
     *
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