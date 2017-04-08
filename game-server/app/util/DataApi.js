// require json files
const area = require('../../config/data/area');
const role = require('../../config/data/role');
const treasure = require('../../config/data/treasure');
const Data = require('./Data');

module.exports = class DataApi {

    constructor() {
        this._area = new Data(area);
        this._role = new Data(role);
        this._treasure = new Data(treasure);
    }

    get area() {
        return this._area;
    }

    get role() {
        return this._role;
    }

    get treasure() {
        return this._treasure;
    }
};