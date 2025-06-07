const fastifySession = require('@fastify/session');
const fastifyCookie = require('@fastify/cookie');

const { auth } = require('./routes/auth.js');
const { apiRoutes } = require('./routes/api.js');

module.exports = function (fastify, options, next) {
    fastify.register(fastifyCookie);
    fastify.register(fastifySession, {
        secret: process.env.SESSION_SECRET,
        cookie: {secure: true} // Для HTTPS: secure: true
    });

    fastify.register(auth, {prefix: '/auth'});
    fastify.register(apiRoutes, {prefix: '/api'});

    next()
}