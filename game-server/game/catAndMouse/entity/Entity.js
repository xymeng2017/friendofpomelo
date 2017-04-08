const EventEmitter = require('events').EventEmitter;
const DataApi = require('../../../app/util/DataApi');

let id = 1;

module.exports = class Entity extends EventEmitter {

    /**
     * Initialize a new 'Entity' with the given 'opts'.
     * Entity inherits EventEmitter.
     *
     * @constructor
     * @param {object} opts
     */
    constructor(opts) {
        super();
        this.opts = opts || {};
        this.entityId = id++;
        this.kindId = opts.kindId;
        this.kindName = opts.kindName;
        this.areaId = opts.areaId || 1;
        this.x = 0;
        this.y = 0;
    }

    _init() {
        const opts = this.opts;
        if (opts.x === undefined || opts.y === undefined) {
            this.randPos();
        } else {
            this.x = opts.x;
            this.y = opts.y;
        }
    }

    _toJSON() {
        return {
            x: this.x,
            y: this.y,
            entityId: this.entityId,
            kindId: this.kindId,
            kindName: this.kindName,
            areaId: this.areaId
        }
    }

    randPos() {
        const area = DataApi.area.findById(this.areaId);
        this.x = this.utils.rand(50, area.width - 50);
        this.y = this.utils.rand(50, area.height - 50);
    }

    /**
     * Get state.
     *
     * @public
     * @return {{x: number, y: number}}
     */
    getPos() {
        return {
            x: this.x,
            y: this.y
        };
    }

    /**
     * Set positon of this entityId.
     *
     * @public
     * @param {number} x
     * @param {number} y
     */
    setPos(x, y) {
        this.x = x;
        this.y = y;
    }
};