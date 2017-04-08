/* *******************************************
 * Copyright (c) 2016-2017
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : treasures
 * File         : Data.js
 * Created      : 2017-02-27
 * Author       : lee
 * *******************************************/

class Data {

    /**
     * Data model `new Data()`.
     *
     * @constructor
     * @param {Array<Array<object>>} data
     */
    constructor(data) {
        console.log('Data constructor');
        const fields = {};
        data[1].forEach(function (i, k) {
            fields[i] = k;
        });
        data.splice(0, 2);

        const result = {};
        const ids = [];
        let item;
        data.forEach(function (k) {
            item = Data._mapData(fields, k);
            result[item.id] = item;
            ids.push(item.id);
        });

        /** @private */ this.data = result;
        this.ids = ids;
    }

    /**
     * Find items by attribute.
     *
     * @public
     * @param {string} attr - Name.
     * @param {string|number} value - The value of the attribute.
     * @return {Array} result
     */
    findBy(attr, value) {
        const result = [];
        let i, item;
        for (i in this.data) {
            item = this.data[i];
            if (item[attr] == value) {
                result.push(item);
            }
        }
        return result;
    }

    /**
     * Find item by id.
     *
     * @public
     * @param {string|number} id
     * @return {object}
     */
    findById(id) {
        return this.data[id];
    }

    random() {
        const length = this.ids.length;
        const rid = this.ids[Math.floor(Math.random() * length)];
        return this.data[rid];
    }

    /**
     * Find all item.
     *
     * @public
     * @return {Array}
     */
    all() {
        return this.data;
    }

    /**
     * Map the array data to object.
     *
     * @private
     * @param {object} fields
     * @param {Array} item
     * @return {object} result
     */
    static _mapData(fields, item) {
        let obj = {};
        for (let k in fields) {
            obj[k] = item[fields[k]];
        }
        return obj;
    }
}

module.exports = Data;