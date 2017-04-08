const Dispatcher = require('../../../util/Dispatcher');
const CODE = require('../../../const/code');

/**
 * Gate handler that dispatch user to connectors.
 */

module.exports = function(app) {
    return new Handler(app);
};

class Handler {

	constructor(app) {
        this.app = app;
	}

    /**
     * Query entry.
     *
     * @param {{uid: string}} msg
     * @param {object} session
     * @param {function} next
     */
    queryEntry(msg, session, next) {
        const uid = msg.uid;
        if (!uid) {
            next(null, {code: CODE.GATE.CE_UID_INVALID});
            return;
        }

        const connectors = this.app.getServersByType('connector');
        if (!connectors || connectors.length === 0) {
            next(null, {code: CODE.GATE.FA_NO_SERVER_AVAILABLE});
            return;
        }

        const connector = Dispatcher.dispatch(uid, connectors);
        next(null, {code: CODE.OK, host: connector.host, port: connector.clientPort});
    };
}
