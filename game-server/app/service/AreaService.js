const logger = require('pomelo-logger').getLogger('bearcat-treasures', 'AreaService');
const pomelo = require('pomelo');

module.exports = class AreaService {

    constructor() {
        this.id = 0;
        this.width = 0;
        this.height = 0;
        this.tickCount = 0; // player score rank
        this.treasureCount = 0;
        this.added = []; // the added entities in one tick
        this.reduced = []; // the reduced entities in one tick
        this.players = {};
        this.entities = {};
        this.channel = null;
        this.actionManagerService = null;
        this.consts = null;
    }

    /**
     * Init areas.
     *
     * @public
     * @param {object} opts
     * @param {ActionManagerService} actionManagerService
     */
    init(opts, actionManagerService) {
        this.id = opts.id;
        this.width = opts.width;
        this.height = opts.height;
        this.actionManagerService = actionManagerService;
        ////this.generateTreasures(40);

        this.run();
    }

    run() {
        setInterval(this.tick, 100);
    }

    tick() {
        //run all the action
        this.actionManagerService.update();
        this.entityUpdate();
        this.rankUpdate();
    }

    addAction (action) {
        return this.actionManager().addAction(action);
    }

    abortAction(type, id) {
        return this.actionManager().abortAction(type, id);
    }

    abortAllAction(id) {
        return this.actionManager().abortAllAction(id);
    }

    getChannel() {
        if (this.channel) {
            return this.channel;
        }
        this.channel = pomelo.app.get('channelService').getChannel('area_' + this.id, true);
        return this.channel;
    }

    addEvent(player) {
        const self = this;
        player.on('pickItem', function(args) {
            const player = self.getEntity(args.entityId);
            const treasure = self.getEntity(args.target);
            player.target = null;
            if (treasure) {
                player.addScore(treasure.score);
                self.removeEntity(args.target);
                self.getChannel().pushMessage({
                    route: 'onPickItem',
                    entityId: args.entityId,
                    target: args.target,
                    score: treasure.score
                });
            }
        });
    }

    entityUpdate() {
        if (this.reduced.length > 0) {
            this.getChannel().pushMessage({
                route: 'removeEntities',
                entities: this.reduced
            });
            this.reduced = [];
        }
        if (this.added.length > 0) {
            const added = this.added;
            const r = [];
            for (let i = 0; i < added.length; i++) {
                r.push(added[i].toJSON());
            }

            this.getChannel().pushMessage({
                route: 'addEntities',
                entities: r
            });
            this.added = [];
        }
    }

    /**
     * Add entity to area.
     *
     * @param {object} e - Entity to add to the area.
     */
    addEntity(e) {
        if (!e || !e.entityId) {
            return false;
        }
        this.entities[e.entityId] = e;
        if (e.type === this.consts.EntityType.PLAYER) {
            this.getChannel().add(e.id, e.serverId);
            this.addEvent(e);

            if (!!this.players[e.id]) {
                logger.error('add player twice! player : %j', e);
            }
            this.players[e.id] = e.entityId;
        } else if (e.type === this.consts.EntityType.TREASURE) {
            this.treasureCount++;
        }
        this.added.push(e);
        return true;
    }

    rankUpdate() {
        this.tickCount++;
        if (this.tickCount >= 10) {
            this.tickCount = 0;
            const players = this.getAllPlayers();
            players.sort(function(a, b) {
                return a.score < b.score;
            });
            const ids = players.slice(0, 10).map(function(a) {
                return a.entityId;
            });
            this.getChannel().pushMessage({
                route: 'rankUpdate',
                entities: ids
            });
        }
    }

    /**
     * Remove Entity form area.
     *
     * @param {number} entityId - The entityId to remove.
     * @return {boolean} Remove result.
     */
    removeEntity(entityId) {
        const e = this.entities[entityId];
        if (!e) {
            return true;
        }
        if (e.type === this.consts.EntityType.PLAYER) {
            this.getChannel().leave(e.id, e.serverId);
            this.actionManagerService.abortAllAction(entityId);
            delete this.players[e.id];
        } else if (e.type === this.consts.EntityType.TREASURE) {
            this.treasureCount--;
            if (this.treasureCount < 25) {
                this.generateTreasures(15);
            }
        }
        delete this.entities[entityId];
        this.reduced.push(entityId);
        return true;
    }

    /**
     * Get entity from area
     * @param {number} entityId.
     */
    getEntity(entityId) {
        return this.entities[entityId];
    }

    /**
     * Get entities by given id list.
     *
     * @param {Array} ids - The given entities' list.
     */
    getEntities(ids) {
        const result = [];
        for (let i = 0; i < ids.length; i++) {
            let entity = this.entities[ids[i]];
            if (entity) {
                result.push(entity);
            }
        }
        return result;
    }

    getAllPlayers() {
        const _players = [];
        const players = this.players;
        for (let id in players) {
            _players.push(this.entities[players[id]]);
        }
        return _players;
    }

    generateTreasures(n) {
        if (!n) {
            return;
        }
        for (let i = 0; i < n; i++) {
            var d = this.app.get('dataApi').treasure.random();
            var t = bearcat.getBean('treasure', {
                kindId: d.id,
                kindName: d.name,
                imgId: d.imgId,
                score: parseInt(d.heroLevel, 10)
            });
            this.addEntity(t);
        }
    }

    getAllEntities() {
        const r = {};
        const entities = this.entities;
        for (let id in entities) {
            r[id] = entities[id].toJSON();
        }
        return r;
    }

    getPlayer(playerId) {
        const entityId = this.players[playerId];
        return this.entities[entityId];
    }

    removePlayer(playerId) {
        const entityId = this.players[playerId];
        if (entityId) {
            delete this.players[playerId];
            this.removeEntity(entityId);
        }
    }

    /**
     * Get area entities for given postion and range.
     */
    getAreaInfo() {
        const entities = this.getAllEntities();
        return {
            id: this.id,
            entities: entities,
            width: this.width,
            height: this.height
        };
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    entities() {
        return this.entities;
    }

    actionManager() {
        return this.actionManagerService;
    }

};