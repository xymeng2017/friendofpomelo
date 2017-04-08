module.exports = {
    OK: 200,
    FAIL: 500,

    GATE: {
        FA_NO_SERVER_AVAILABLE: 2001,

        CE_UID_INVALID: 	2101,
    },

    CHAT: {
        FA_CHANNEL_CREATE: 		3001,
        FA_CHANNEL_NOT_EXIST: 	3002,
        FA_UNKNOWN_CONNECTOR: 	3003,
        FA_USER_NOT_ONLINE: 	3004
    },

    AUTH: {
        FA_TOKEN_EXPIRE: 	4001,
        FA_USER_NOT_EXIST: 4002,

        CE_TOKEN_INVALID: 	4101,
    },

    CONNECTOR: {
        FA_PLAYER_NOT_INIT: 5001,
        FA_ADD_PLAYER_SENT: 5002, // add player request has sent
        FA_SESSION_BIND: 5004,
        FA_SESSION_NOT_BIND: 5005,

        CE_INPUT_INVALID: 5101,
        CE_MYSELF_NOT_INIT: 5102,
        CE_PLAYER_NOT_INIT: 5103,
        CE_TOKEN_INVALID: 5104,
        CE_NO_REQUEST: 5105,
        CE_NO_FRIEND: 5106,
        CE_HAVE_BEEN_FRIENDS: 5107, // we have been friends

        SE_UNKNOWN_ERROR: 5201
    }
};