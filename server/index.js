import Fastify from 'fastify'
import fastifySession from '@fastify/session';
import fastifyCookie from '@fastify/cookie';

import {auth} from './routes/auth.js'
import {apiRoutes} from './routes/api.js'

const PORT = process.env.PORT ?? 3000;

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

fastify.listen({port: PORT}, (err) => {
    if (err) throw err;
    console.log('Server running on http://localhost:' + PORT);
});