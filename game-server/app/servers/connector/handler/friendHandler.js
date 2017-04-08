/* *******************************************
 * Copyright (c) 2016-2017
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : treasures
 * File         : friendHandler.js
 * Created      : 2017-04-02
 * Author       : lee
 * *******************************************/

const logger = require('pomelo-logger').getLogger(__filename);
const CODE = require('../../../const/code');
const CONST = require('../../../const/const');
const PlayerDao = require('../../../dao/PlayerDao');
const Player = require('../../../entity/Player');
const UserDao = require('../../../dao/UserDao');
const User = require('../../../entity/User');
const ChannelUtil = require('../../../util/ChannelUtil');

module.exports = function (app) {
    return new Handler(app);
};

class Handler {

    constructor(app) {
        this.app = app;
        this.serverId = app.get('serverId').split('-')[2];
    }

    /**
     * Search player.
     *
     * @param {{identifier: number}} msg
     * @param {object} session
     * @param {function} next
     * @return {Promise.<void>}
     */
    async searchPlayer(msg, session, next) {

        // check if user input is valid
        const identifier = msg.identifier;
        if (typeof identifier !== 'number' || identifier < 0) {
            next(null, {code: CODE.CONNECTOR.CE_INPUT_INVALID});
            return;
        }

        // get and return searched player
        const searchedPlayer = await PlayerDao.getPlayer({identifier: identifier});
        if (!searchedPlayer || !searchedPlayer.init) {
            next(null, {code: CODE.CONNECTOR.FA_PLAYER_NOT_INIT});
        } else {
            next(null, {code: CODE.OK, player: searchedPlayer.toPublic()});
        }
    }

    /**
     * Send add friend request to the player.
     *
     * @param {{identifier: number}} msg
     * @param {object} session
     * @param {function} next
     * @return {Promise.<void>}
     */
    async addPlayer(msg, session, next) {

        // check if user input is valid, can't be myself
        const identifier = msg.identifier;
        if (typeof identifier !== 'number' || identifier < 0 || identifier === session.uid) {
            next(null, {code: CODE.CONNECTOR.CE_INPUT_INVALID});
            return;
        }

        // check if the player exist
        const friendPlayer = await PlayerDao.getPlayer({identifier: identifier});
        if (!friendPlayer || !friendPlayer.init) {
            next(null, {code: CODE.CONNECTOR.CE_PLAYER_NOT_INIT});
            return;
        }

        // check if we have been friends
        for (let friend of friendPlayer.friends) {
            if (friend.identifier === session.uid) {
                next(null, {code: CODE.CONNECTOR.CE_HAVE_BEEN_FRIENDS});
                return;
            }
        }

        // check if I have sent add player request
        for (let friendRequest of friendPlayer.friendRequests) {
            if (friendRequest.identifier === session.uid) {
                next(null, {code: CODE.CONNECTOR.FA_ADD_PLAYER_SENT});
                return;
            }
        }

        // store add player request to database
        const playerName = session.get('playerName');
        const player_id = session.get('player_id');
        await PlayerDao.updatePlayer({_id: friendPlayer._id}, {$push: {friendRequests: {_id: player_id, identifier: session.uid, name: playerName}}});

        next(null, {code: CODE.OK});

        // notify the player if it is online
        const statusService = this.app.get('statusService');
        statusService.pushByUids([friendPlayer.identifier], 'addPlayer',{name: playerName, identifier: session.uid}, null);
    }

    /**
     * Reply if I agree the player's add request.
     *
     * @param {{identifier: number, reply: number}} msg
     * @param {object} session
     * @param {function} next
     * @return {Promise.<void>}
     */
    async replyAddPlayer(msg, session, next) {

        // check if user input is valid
        const identifier = msg.identifier;
        const reply = msg.reply;
        if (typeof identifier !== 'number' || identifier < 0 ||
            typeof reply !== 'number' || !Object.values(CONST.ReplyAddPlayer).includes(reply)) {
            next(null, {code: CODE.CONNECTOR.CE_INPUT_INVALID});
            return;
        }

        // check has player request
        const myPlayer_id = session.get('player_id');
        const myPlayerName = session.get('playerName');
        const myPlayer = await PlayerDao.getPlayer({_id: myPlayer_id});
        for (let i = 0; i < myPlayer.friendRequests.length; i++) {
            let friendRequest = myPlayer.friendRequests[i];
            if (friendRequest.identifier === identifier) {

                // rely on add player
                switch (reply) {
                    case CONST.ReplyAddPlayer.Agree:
                        myPlayer.friends.push(friendRequest);
                        myPlayer.friendRequests.splice(i, 1);
                        await PlayerDao.updatePlayer({_id: myPlayer_id}, {$set: {friendRequests: myPlayer.friendRequests, friends: myPlayer.friends}});
                        await PlayerDao.updatePlayer({_id: friendRequest._id}, {$push: {friends: {_id: myPlayer_id, identifier: session.uid, name: myPlayerName}}});

                        // notify the player if it is online
                        const statusService = this.app.get('statusService');
                        statusService.pushByUids([friendRequest.identifier], 'replyAddPlayer', {name: myPlayerName, identifier: session.uid, reply: CONST.ReplyAddPlayer.Agree}, null);
                        break;
                    case CONST.ReplyAddPlayer.Refuse:
                        myPlayer.friendRequests.splice(i, 1);
                        await PlayerDao.updatePlayer({_id: myPlayer_id}, {$set: {friendRequests: myPlayer.friendRequests}});
                        break;
                }
                next(null, {code: CODE.OK});
                return;
            }
        }
        next(null, {code: CODE.CONNECTOR.CE_NO_REQUEST});
    }

    /**
     * Remove the player from my friend list and remove myself from the player's friend list.
     *
     * @param {{identifier: number}} msg
     * @param {object} session
     * @param {function} next
     * @return {Promise.<void>}
     */
    async removePlayer(msg, session, next) {

        // check if user input is valid
        const identifier = msg.identifier;
        if (typeof identifier !== 'number' || identifier < 0) {
            next(null, {code: CODE.CONNECTOR.CE_INPUT_INVALID});
            return;
        }

        // check if I have this friend
        const myPlayer_id = session.get('player_id');
        const myPlayer = await PlayerDao.getPlayer({_id: myPlayer_id});
        for (let i = 0; i < myPlayer.friends.length; i++) {
            let friend = myPlayer.friends[i];
            if (friend.identifier === identifier) {
                myPlayer.friends.splice(i, 1);
                await PlayerDao.updatePlayer({_id: myPlayer._id}, {$set: {friends: myPlayer.friends}});

                // check if player exist, if not exist, give warning
                const friendPlayer = await PlayerDao.getPlayer({_id: friend._id});
                if (!friendPlayer) {
                    logger.warn('removePlayer warn: player not exist');
                    next(null, {code: CODE.OK});
                    return;
                }

                // remove myself from this friend's friend list
                const myIdentifier = session.uid;
                for (let i = 0; i < friendPlayer.friends.length; i++) {
                    let friend = friendPlayer.friends[i];
                    if (friend.identifier === myIdentifier) {
                        friendPlayer.friends.splice(i, 1);
                        await PlayerDao.updatePlayer({_id: friendPlayer._id}, {$set: {friends: friendPlayer.friends}});

                        next(null, {code: CODE.OK});

                        // notify the player if it is online
                        const statusService = this.app.get('statusService');
                        statusService.pushByUids([identifier], 'removePlayer', {identifier: myIdentifier}, null);
                        return;
                    }
                }
                logger.warn('removePlayer warn: friendPlayer\'s friend list does not have myself');
                next(null, {code: CODE.OK});
                return;
            }
        }
        next(null, {code: CODE.CONNECTOR.CE_NO_FRIEND});
    }
}