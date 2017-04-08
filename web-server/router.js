const logger = require('pomelo-logger').getLogger(__filename);
const UserDao = require('./app/dao/UserDao');
const User = require('./app/entity/User');
const secret = require('./config/session').secret;
const Token = require('./app/util/Token');
const CODE = require('./const/code');
const ObjectId = require('mongodb').ObjectId;

module.exports = function (router) {

    router.get('/auth/login', async (ctx, next) => {
        // check if the user's credentials are saved in a cookie
        if (ctx.cookies.get('username') && ctx.cookies.get('password')) {
            // attempt automatic login
            const opts = {username: ctx.cookies.get('username'), password: ctx.cookies.get('password')};
            const /** ?User */ user = await UserDao.autoLogin(opts);
            if (user) {
                ctx.session.user = user;
                await ctx.render('auth/login', {params: JSON.stringify({status: 'login', uid: user._id, token: Token.create(user._id, Date.now(), secret)})});
            } else {
                await ctx.render('auth/login', {params: JSON.stringify({status: 'normal'})});
            }
        } else {
            const logout = ctx.query['logout'];
            if (typeof logout !== 'undefined') {
                await ctx.render('auth/login', {params: JSON.stringify({status: 'logout'})});
            } else {
                await ctx.render('auth/login', {params: JSON.stringify({status: 'normal'})});
            }

        }
        return next();
    });

    router.post('/auth/login', async (ctx, next) => {
        const opts = {username: ctx.request.body['username'], password: ctx.request.body['password']};
        const /** User|number */ user = await UserDao.manualLogin(opts);
        if (typeof user === 'object') {
            if (ctx.request.body['remember'] === 'on') {
                const expiredDate = new Date(Date.now() + 3600 * 24 * 7 * 1000);
                ctx.cookies.set('username', user.username, {expires: expiredDate});
                ctx.cookies.set('password', user.password, {expires: expiredDate});
            }
            ctx.session.user = user;
            ctx.status = 200;
            ctx.body = {code: CODE.OK, uid: user._id, token: Token.create(user._id, Date.now(), secret)};
        } else {
            ctx.status = 400;
            ctx.body = {code: user};
        }
        return next();
    });

    router.get('/auth/register', async (ctx, next) => {
        await ctx.render('auth/register');
        return next();
    });

    router.post('/auth/register', async (ctx, next) => {
        const opts = {username: ctx.request.body['username'], password: ctx.request.body['password']};
        const /** User|number */ user = await UserDao.createNewAccount(opts);
        if (typeof user === 'object') {
            ctx.status = 200;
            ctx.body = JSON.stringify({code: CODE.OK});
        } else {
            ctx.status = 400;
            ctx.body = JSON.stringify({code: user});
        }
        return next();
    });

    router.get('/auth/register', async (ctx, next) => {
        await ctx.render('auth/register');
        return next();
    });

    router.post('/auth/logout', async (ctx, next) => {
        ctx.cookies.set('username', null);
        ctx.cookies.set('password', null);
        ctx.session = null;
        ctx.redirect('/auth/login?logout');
        return next();
    });

    router.get('/auth/forget', async (ctx, next) => {
        await ctx.render('auth/forget-forbidden');
        return next();
    });

    router.get('/auth/agreement', async (ctx, next) => {
        await ctx.render('auth/agreement');
        return next();
    });

    router.get('/', async (ctx, next) => {
        await ctx.render('index');
        return next();
    });

    router.get('/welcome', async (ctx, next) => {
        await ctx.render('index');
        return next();
    });

    router.get('/home', async (ctx, next) => {
        await ctx.render('home');
        return next();
    });
};
