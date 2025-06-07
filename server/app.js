const Fastify = require('fastify');
const fastifySession = require('@fastify/session');
const fastifyCookie = require('@fastify/cookie');

const { auth } = require('./routes/auth.js');
const { apiRoutes } = require('./routes/api.js');

const PORT = process.env.PORT ?? 3000;

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

    fastify.listen({port: PORT}, (err) => {
        if (err) throw err;
        console.log('Server running on http://localhost:' + PORT);
    });
}

const close = () => fastify.close();

exports.fastify = fastify;
exports.init = init;
exports.close = close;