/* *******************************************
 * Copyright (c) 2016-2017
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : treasures
 * File         : app.js
 * Created      : 2017-01-18
 * Author       : lee
 * *******************************************/

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');
const util = require('util');
const Koa = require('koa');
const favicon = require('koa-favicon');
const serve = require('koa-static');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session-minimal');
const redisStore = require('koa-redis');
const handleError = require('koa-handle-error');
const render = require('koa-ejs');
const Router = require('koa-router');
const router = new Router();
const mongodbClient = require('./app/dao/mongodb/mongodbClient');

const app = new Koa();

// configure error, must register first!
app.use(handleError(err => {
    console.error(`koa-handle-error catch:\n${err.stack}`);
}));

// configure logger
require('pomelo-logger').configure('./config/log4js.json');

// configure ejs
render(app, {
    root: path.join(__dirname, 'view'),
    layout: false,
    viewExt: 'ejs',
    cache: false,
    debug: true
});

app.use(logger());
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(serve(__dirname + '/public'));
app.use(bodyParser());
app.use(session({tore: redisStore()}));

// configure mongodb database
mongodbClient.init();

// configure session
app.use(async (ctx, next) => {
    if (typeof ctx.session !== 'undefined') {
        ctx.state.user = ctx.session.user;
    } else {
        ctx.state.user = null;
    }
    return next();
});

// configure page permission controller middleware
app.use(async (ctx, next) => {
    const pathname = url.parse(ctx.url).pathname;
    if (pathname === '/' || pathname === '/welcome' || pathname === '/favicon.ico' || pathname === '/auth/agreement') { // any
        await next();
    } else if (pathname === '/auth/login' || pathname === '/auth/register' || pathname === '/auth/forget') { // need guest
        if (ctx.session.user) {
            ctx.redirect('/home');
        } else {
            await next();
        }
    } else { // need user
        if (ctx.session.user) {
            await next();
        } else {
            ctx.redirect('/auth/login');
        }
    }
});

require('./router')(router);
app.use(router.routes());
app.use(router.allowedMethods());

// configure 404 page
app.use(async (ctx, next) => {
    try {
        await next();
        const status = ctx.status || 404;
        if (status === 404) ctx.throw(404);
    } catch (err) {
        if (err.status !== 404) return;
        ctx.status = err.status || 500;
        switch (ctx.accepts('html', 'json')) {
            case 'html':
                ctx.type = 'html';
                ctx.body = '<p>Page Not Found</p>';
                break;
            case 'json':
                ctx.type = 'json';
                ctx.body = {
                    message: 'Page Not Found'
                };
                break;
            default:
                ctx.type = 'text';
                ctx.body = 'Page Not Found';
        }
    }
});

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        // some errors will have .status
        // however this is not a guarantee
        ctx.status = err.status || 500;
        ctx.type = 'html';
        ctx.body = '<p>Something <em>exploded</em>, please contact developer.</p>';

        // since we handled this manually we'll
        // want to delegate to the regular app
        // level error handling as well so that
        // centralized still functions correctly.
        ctx.app.emit('error', err, ctx);
    }
});

// create HTTP server
http.createServer(app.callback()).listen(80);
console.log('Listening on port 80.');



