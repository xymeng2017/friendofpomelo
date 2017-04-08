const logger = require('pomelo-logger').getLogger(__filename);
const CODE = require('../../../const/code');
const CONST = require('../../../const/const');
const PlayerDao = require('../../../dao/PlayerDao');
const Player = require('../../../entity/Player');
const UserDao = require('../../../dao/UserDao');
const User = require('../../../entity/User');
const ChannelUtil = require('../../../util/ChannelUtil');

// generate playerId
let id = 1;

module.exports = function (app) {
    return new Handler(app);
};

class Handler {

    constructor(app) {
        this.app = app;
        this.serverId = app.get('serverId').split('-')[2];
    }

    /**
     * New client entry game server. Check token and bind user info into session.
     *
     * @param  {{token: string}} msg - Request message.
     * @param  {object} session - Current session object.
     * @param  {function} next - Next step callback.
     * @return {Promise<void>}
     */
    async entry(msg, session, next) {
        const token = msg.token;
        const self = this;

        if (!token) {
            next(null, {code: CODE.CONNECTOR.CE_TOKEN_INVALID});
            return;
        }

        self.app.rpc.auth.authRemote.auth(session, token, /** @type {{code: number, user: User=}} */ async authResult => {
            if (authResult.code !== CODE.OK) {
                next(null, {code: authResult.code});
                return;
            }

            const userId = 'native-' + authResult.user._id.toString();
            const player = await PlayerDao.getOrCreatePlayer({userId: userId});
            self.app.get('sessionService').kick(player.identifier, () => {
                session.bind(player.identifier, err => {
                    if (err) {
                        logger.error(err);
                    }
                    if (player.init) {
                        session.set('playerName', player.name);
                        session.set('player_id', player._id);
                        session.pushAll(err => {
                            if (err) {
                                logger.error(err);
                            }
                            next(null, {code: CODE.OK, player: player});
                        });
                    } else {
                        next(null, {code: CODE.CONNECTOR.FA_PLAYER_NOT_INIT});
                    }
                });
            });
        });
    }


    /**
     * Init player.
     *
     * @param {{name: string}} msg
     * @param {object} session
     * @param {function} next
     * @return {Promise<*>}
     */
    async initPlayer(msg, session, next) {
        const name = msg.name;
        if (!name || name.length > 6) {
            // TODO: check special character
            next(null, {code: CODE.CONNECTOR.CE_INPUT_INVALID});
            return;
        }
        const identifier = session.uid;
        const player = await PlayerDao.updatePlayer({identifier: identifier}, {$set: {init: true, name: name}});
        session.set('playerName', player.name);
        session.set('player_id', player._id);
        session.pushAll(err => {
            if (err) {
                logger.error(err);
            }
            next(null, {code: CODE.OK, player: player});
        });
    }


}


