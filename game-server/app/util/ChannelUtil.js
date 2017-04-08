/* *******************************************
 * Copyright (c) 2016-2017
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : treasures
 * File         : ChannelUtil.js
 * Created      : 2017-03-01
 * Author       : lee
 * *******************************************/

const GLOBAL_CHANNEL_NAME = 'pomelo';
const AREA_CHANNEL_PREFIX = 'area_';
const TEAM_CHANNEL_PREFIX = 'team_';

module.exports = class ChannelUtil {

    static getGlobalChannelName() {
        return GLOBAL_CHANNEL_NAME;
    }

    static getAreaChannelName(areaId) {
        return AREA_CHANNEL_PREFIX + areaId;
    }

    static getTeamChannelName(teamId) {
        return TEAM_CHANNEL_PREFIX + teamId;
    }
};
