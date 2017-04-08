const crc = require('crc');

module.exports = class Dispatcher {

    /**
     * Select server by random algorithm.
     *
     * @public
     * @param {string} uid
     * @param {Array<object>} connectors
     * @return {object} Remote server.
     */
    static dispatch(uid, connectors) {
        const index = Math.abs(parseInt(crc.crc32(uid), 16)) % connectors.length;
        return connectors[index];
    };
};
