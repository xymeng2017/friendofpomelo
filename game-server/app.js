const pomelo = require('pomelo');
//const globalChannel = require('pomelo-globalchannel-plugin');
const status = require('pomelo-status-plugin');
const AreaService = require('./app/service/AreaService');
const ActionManagerService = require('./app/service/ActionManagerService');
const DataApi = require('./app/util/DataApi');
const IdentifierDao = require('./app/dao/IdentifierDao');

/**
 * Init app for client.
 */
const app = pomelo.createApp();

app.set('name', 'sweets-demo-dotaLike');

/*app.use(globalChannel, {globalChannel: {
    host: '127.0.0.1',
    port: 6379,
    db: '0'       // optinal, from 0 to 15 with default redis configure
}});*/

app.configure('production|development', function() {
    // pomelo-status-plugin configure
    app.use(status, {status: {
        host: '127.0.0.1',
        port: 6379,
        cleanOnStartUp: true
    }});
});

app.configure('production|development', 'gate', function () {
    app.set('connectorConfig', {
        connector: pomelo.connectors.hybridconnector
    });
});

app.configure('production|development', 'connector', function () {
    app.set('connectorConfig', {
        connector: pomelo.connectors.hybridconnector,
        heartbeat: 100,
        useDict: true,
        useProtobuf: true
    });
});

// Configure for auth server
app.configure('production|development', 'auth', function () {
    // load session configure
    app.set('session', require('./config/session.json'));
});

// app.configure('production|development', 'area', function () {
//     const areaId = app.get('curServer').areaId;
//     if (!areaId || areaId < 0) {
//         throw new Error('load area config failed');
//     }
//     const areaService = new AreaService();
//     const actionManagerService = new ActionManagerService();
//     const dataApi = new DataApi();
//     areaService.init(dataApi.area.findById(areaId), actionManagerService);
//     app.set('dataApi', dataApi);
//     app.set('actionManagerService', actionManagerService);
//     app.set('areaService', areaService);
// });

// Configure database
app.configure('production|development', 'area|auth|connector|master', async () => {
    app.loadConfig('mongodb', app.getBase() + '/config/mongodb.json');
    const dbClient = require('./app/dao/mongodb/mongodbClient').init(app);
    app.set('dbClient', dbClient);
    if (app.isMaster()) {
        IdentifierDao.init();
    }
    //app.use(sync, {sync: {path: __dirname + '/app/dao/mapping', dbclient: dbclient}});
});

app.start();

process.on('uncaughtException', function (err) {
    console.error('Caught exception: ' + err.stack);
});