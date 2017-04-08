$(function () {
    const pomelo = window.pomelo;

    let gPlayer;

    initBtn();
    initMsgHandler();


    function initBtn() {
        $('#login-btn').click(function () {
            queryEntry(entry);
        });
        $('#initPlayer-btn').click(function () {
            initPlayer();
        });
        $('#searchPlayer-btn').click(function () {
            searchPlayer();
        });
        $('#addPlayer-btn').click(function () {
            addPlayer();
        });
        $('#agreeAddPlayer-btn').click(function () {
            replyAddPlayer(CONST.ReplyAddPlayer.Agree);
        });
        $('#refuseAddPlayer-btn').click(function () {
            replyAddPlayer(CONST.ReplyAddPlayer.Refuse);
        });
        $('#removePlayer-btn').click(function () {
            removePlayer();
        });
        $('#createSociety-btn').click(function () {
            // createSociety();
        });
    }

    function initMsgHandler() {
        /**
         * Handle kick out message, occurs when the current player is kicked out.
         */
        pomelo.on('addPlayer', function (data) {
            console.log('pomelo on addPlayer↓ ');
            console.log(data);
            //switchManager.selectView("loginPanel");
        });
        pomelo.on('replyAddPlayer', function (data) {
            console.log('pomelo on replyAddPlayer↓ ');
            console.log(data);
        });
        pomelo.on('removePlayer', function (data) {
            console.log('pomelo on removePlayer↓ ');
            console.log(data);
        });
    }

    /**
     * Query connector ip and port
     *
     * @param {function} callback
     */
    function queryEntry(callback) {
        console.log(`pomelo.init({host: ${config.GATE_HOST}, port: ${config.GATE_PORT}, log: true}, cb);`);
        pomelo.init({host: config.GATE_HOST, port: config.GATE_PORT, log: true}, function () {
            console.log(`pomelo.request('gate.gateHandler.queryEntry', {uid: ${sessionStorage.uid}}, cb(data))`);
            pomelo.request('gate.gateHandler.queryEntry', {uid: sessionStorage.uid}, function (data) {
                console.info(data);
                console.log("pomelo.disconnect()");
                pomelo.disconnect();
                if (data.code === CODE.GATE.FA_NO_SERVER_AVAILABLE) {
                    console.log('====> Dialog: no server available');
                    console.log('===========================================');
                    return;
                }
                if (data.code !== 200) {
                    alert('code: ' + data.code);
                    return;
                }
                if (callback) {
                    callback(data.host, data.port);
                }
            });
        });
    }

    function entry(host, port) {
        console.log(`pomelo.init({host: ${host}, port: ${port}, log: true}, cb);`);
        pomelo.init({host: host, port: port, log: true}, function () {
            console.log(`pomelo.request('connector.entryHandler.entry', {token: ${sessionStorage.token}}, cb(data))`);
            pomelo.request('connector.entryHandler.entry', {token: sessionStorage.token}, function (/** @type {{code: number, player: Player=}} */data) {
                console.info(data);
                if (data.code === CODE.AUTH.FA_TOKEN_EXPIRE) {
                    console.log('====> Dialog: token expire');
                    console.log('===========================================');
                    return;
                }
                if (data.code === CODE.AUTH.FA_USER_NOT_EXIST) {
                    console.log('====> Dialog: user not exist');
                    console.log('===========================================');
                    return;
                }
                if (data.code === CODE.CONNECTOR.FA_PLAYER_NOT_INIT) {
                    console.log('====> View: change to init player view');
                    console.log('===========================================');
                    return;
                }
                if (data.code !== 200) {
                    alert('code: ' + data.code);
                    return;
                }
                console.log('====> Variable: set player global var↓');
                gPlayer = data.player;
                console.log(gPlayer);
                console.log('====> View: change to main view');
                console.log('===========================================');
            });
        });
    }

    function initPlayer() {
        const name = $('#initPlayer-input').val();
        console.log(`pomelo.request('connector.entryHandler.initPlayer', {name: ${name}}, cb(data))`);
        pomelo.request("connector.entryHandler.initPlayer", {name: name}, function (/** @type {{code: number, player: Player=}} */data) {
            console.info(data);
            if (data.code !== CODE.OK) {
                alert('code: ' + data.code);
                return;
            }
            console.log('====> Variable: set player global var↓');
            gPlayer = data.player;
            console.log(gPlayer);
            console.log('====> View: change to main view ');
            console.log('===========================================');
        });
    }

    function searchPlayer() {
        const identifier = parseInt($('#searchPlayer-input').val(), 10);
        console.log(`pomelo.request('connector.friendHandler.searchPlayer', {identifier: ${identifier}}, cb(data))`);
        pomelo.request("connector.friendHandler.searchPlayer", {identifier: identifier}, function (/** @type {{code: number, player: Player=}} */data) {
            console.info(data);
            if (data.code === CODE.CONNECTOR.FA_PLAYER_NOT_INIT) {
                console.log('====> View: show the player does not exist');
                console.log('===========================================');
                return;
            }
            if (data.code !== CODE.OK) {
                alert('code: ' + data.code);
                return;
            }
            console.log('====> View: show the player id and name');
            console.log('===========================================');
        });
    }

    function addPlayer() {
        const identifier = parseInt($('#addPlayer-input').val(), 10);
        console.log(`pomelo.request('connector.friendHandler.addPlayer', {identifier: ${identifier}}, cb(data))`);
        pomelo.request("connector.friendHandler.addPlayer", {identifier: identifier}, function (/** @type {{code: number}} */data) {
            console.info(data);
            if (data.code === CODE.CONNECTOR.FA_ADD_PLAYER_SENT) {
                console.log('====> View: show is adding');
                console.log('===========================================');
                return;
            }
            if (data.code !== CODE.OK) {
                alert("Error occurred. Code: " + data.code);
                return;
            }
            console.log('====> View: show the add request has sent');
            console.log('===========================================');
        });
    }

    function replyAddPlayer(reply) {
        let identifier = -1;
        if (reply === CONST.ReplyAddPlayer.Agree) {
            identifier = parseInt($('#agreeAddPlayer-input').val(), 10);
        } else if (reply === CONST.ReplyAddPlayer.Refuse) {
            identifier = parseInt($('#refuseAddPlayer-input').val(), 10);
        } else {
            alert("Error occurred. reply: " + reply);
            return;
        }
        console.log(`pomelo.request('connector.friendHandler.replyAddPlayer', {identifier: ${identifier}, reply: ${reply}}, cb(data))`);
        pomelo.request("connector.friendHandler.replyAddPlayer", {identifier: identifier, reply: reply}, function (/** @type {{code: number}} */data) {
            console.info(data);
            if (data.code !== CODE.OK) {
                alert("Error occurred. Code: " + data.code);
                return;
            }
            console.log('====> View: if agree, update friend list and request view; if refuse, just update request view');
            console.log('===========================================');
        });
    }

    function removePlayer() {
        const identifier = parseInt($('#removePlayer-input').val(), 10);
        console.log(`pomelo.request('connector.friendHandler.removePlayer', {identifier: ${identifier}}, cb(data))`);
        pomelo.request("connector.friendHandler.removePlayer", {identifier: identifier}, function (/** @type {{code: number}} */data) {
            console.info(data);
            if (data.code !== CODE.OK) {
                alert("Error occurred. Code: " + data.code);
                return;
            }
            console.log('====> View: update friend list view');
            console.log('===========================================');
        });
    }
});