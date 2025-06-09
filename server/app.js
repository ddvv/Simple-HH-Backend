const Fastify = require('fastify');
const fastifySession = require('@fastify/session');
const fastifyCookie = require('@fastify/cookie');

const { auth } = require('./routes/auth.js');
const { apiRoutes } = require('./routes/api.js');

const port = process.env.PORT ?? 3000;
const host = process.env.HOST;

const fastify = Fastify({
    logger: true
});

const init = () => {

// Плагины для работы с сессиями и куками
    fastify.register(fastifyCookie);
    fastify.register(fastifySession, {
        secret: process.env.SESSION_SECRET, // Замените на надежный ключ
        cookie: {secure: false} // Для HTTPS: secure: true
    });

    fastify.register(auth, {prefix: '/auth'});
    fastify.register(apiRoutes, {prefix: '/api'});

    fastify.listen({port, host}, (err) => {
        if (err) throw err;
    });
}

const close = () => fastify.close();

exports.fastify = fastify;
exports.init = init;
exports.close = close;