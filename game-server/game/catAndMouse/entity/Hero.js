/* *******************************************
 * Copyright (c) 2016-2017
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : treasures
 * File         : Hero.js
 * Created      : 2017-03-06
 * Author       : lee
 * *******************************************/

module.exports = class Hero {

    /**
     * Create cat hero.
     *
     * @param opts
     */
    constructor(opts) {
        this.id = opts._id;
        this.name = opts.name; // Hero name.
        this.skill0 = opts.skill0;
        this.skill1 = opts.skill1;
        this.skill2 = opts.skill2;
        this.skill3 = opts.skill3;
    }
};