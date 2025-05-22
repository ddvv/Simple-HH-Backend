import Fastify from 'fastify'
import {auth} from './routes/auth.js'
import {apiRoutes} from './routes/api.js'

const PORT = process.env.PORT ?? 3000;

const fastify = Fastify({
    logger: true
});

fastify.register(auth, { prefix: '/auth' });
fastify.register(apiRoutes, { prefix: '/api' });

fastify.listen({port: PORT}, (err) => {
    if (err) throw err;
    console.log('Server running on http://localhost:' + PORT);
});