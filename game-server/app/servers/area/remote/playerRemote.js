const CONST = require('../../../const/const');


module.exports = function(app) {
    return new Remote(app);
};

class Remote {

    constructor(app) {
        this.app = app;
        this.utils = null;
        this.consts = null;
        this.areaService = null;
    }

    /**
     * Player exits. It will persistent player's state in the database.
     *
     * @public
     * @param {object} args
     * @return {Promise<void>}
     */
    playerLeave(args) {
        const areaId = args.areaId;
        const playerId = args.playerId;
        const player = this.areaService.getPlayer(playerId);
        if (!player) {
            return null;
        }
        this.areaService.removePlayer(playerId);
        this.areaService.getChannel().pushMessage({
            route: 'onUserLeave',
            code: CONST.MESSAGE.RES,
            playerId: playerId
        });
    }
}