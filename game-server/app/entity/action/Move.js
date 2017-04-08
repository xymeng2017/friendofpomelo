const logger = require('pomelo-logger').getLogger('bearcat-treasures', 'Move');
const Action = require('./Action');

/**
 * Move action, which is used to preserve and update user position.
 */
module.exports = class Move extends Action {

    constructor(opts) {
        super(opts);
        this.opts = opts;
        opts.type = 'move';
        opts.id = opts.entity.entityId;
        opts.singleton = true;
        this.time = Date.now();
        this.entity = opts.entity;
        this.endPos = opts.endPos;
    }

    update() {
        const time = Date.now() - this.time;
        const speed = this.entity.walkSpeed;
        const moveLength = speed * time / 1000;
        const dis = Move.getDis(this.entity.getPos(), this.endPos);
        if (dis <= moveLength / 2) {
            this.finished = true;
            this.entity.setPos(this.endPos.x, this.endPos.y);
            return;
        } else if (dis < 55 && this.entity.target) {
            this.entity.emit('pickItem', {
                entityId: this.entity.entityId,
                target: this.entity.target
            });
        }
        const curPos = Move.getPos(this.entity.getPos(), this.endPos, moveLength, dis);
        this.entity.setPos(curPos.x, curPos.y);
        this.time = Date.now();
    }

    static getDis(pos1, pos2) {
        return Math.sqrt(Math.pow((pos1.x - pos2.x), 2) + Math.pow((pos1.y - pos2.y), 2));
    }

    static getPos(start, end, moveLength, dis) {
        if (!dis) {
            dis = Move.getDis(start, end);
        }
        const pos = {};
        pos.x = start.x + (end.x - start.x) * (moveLength / dis);
        pos.y = start.y + (end.y - start.y) * (moveLength / dis);
        return pos;
    }
};
