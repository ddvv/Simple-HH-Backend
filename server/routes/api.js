const axios = require('axios');

function apiRoutes(fastify, opts) {
    // Middleware для проверки авторизации
    fastify.addHook('preHandler', (request, reply, done) => {
        if (!request.session.access_token) {
            reply.code(401).send({error: 'Unauthorized'});
            return;
        }
        done();
    });

    // Пример защищенного API
    fastify.get('*', async (request, reply) => {
        try {
            // Используем токен для запроса к внешнему API
            const response = await axios.get(process.env.API_URL + request.params['*'], {
                headers: {
                    Authorization: `Bearer ${request.session.access_token}`,
                    ...request.headers,
                }
            });
            reply.send(response.data);
        } catch (error) {
            reply.code(500).send({error: 'API request failed'});
        }
    });

    fastify.post('*', async (request, reply) => {
        try {
            // Используем токен для запроса к внешнему API
            const response = await axios.post(process.env.API_URL + request.params['*'], {
                headers: {
                    Authorization: `Bearer ${request.session.access_token}`,
                    ...request.headers,
                }
            });
            reply.send(response.data);
        } catch (error) {
            reply.code(500).send({error: 'API request failed'});
        }
    });
}

exports.apiRoutes = apiRoutes;
