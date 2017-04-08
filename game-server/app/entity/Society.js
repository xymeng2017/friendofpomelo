/* *******************************************
 * Copyright (c) 2016-2017
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : treasures
 * File         : Society.js
 * Created      : 2017-03-07
 * Author       : lee
 * *******************************************/

const Const = require('../const/const');
/**
 * Class player for global info
 */
module.exports = class Society {

    /**
     * Constructor
     */
    constructor() {
        this._id = '';
        this.name = '';
        this.bossPlayer_id = null;
        this.underbossPlayer_ids = [];
        this.elderPlayer_ids = [];
        this.memberPlayer_ids = [];
        this.policy = Const.Society.Policy.EverybodyIn;
        this.needScore = -1;
        this.notice = '';
    }

};