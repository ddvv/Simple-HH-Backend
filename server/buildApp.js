const Fastify = require('fastify');
const fastifySession = require('@fastify/session');
const fastifyCookie = require('@fastify/cookie');

const { auth } = require('./routes/auth.js');
const { apiRoutes } = require('./routes/api.js');

function buildApp() {
    const fastify = Fastify({
        logger: true
    });

    // Плагины для работы с сессиями и куками
    fastify.register(fastifyCookie);
    fastify.register(fastifySession, {
        secret: process.env.SESSION_SECRET, // Замените на надежный ключ
        cookie: {secure: false} // Для HTTPS: secure: true
    });

    fastify.register(auth, {prefix: '/auth'});
    fastify.register(apiRoutes, {prefix: '/api'});

    // Только для тестов: доступ к текущей сессии
    if (process.env.NODE_ENV === 'test') {
        fastify.get('/session', (req, reply) => {
            reply.send(req.session);
        });
    }

    return fastify;
}

module.exports = buildApp;