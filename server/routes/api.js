const axios = require('axios');

module.exports = async function(fastify, opts) {
    // Middleware для проверки авторизации
    fastify.addHook('preHandler', (request, reply, done) => {
        if (!request.session.access_token) {
            reply.code(401).send({ error: 'Unauthorized' });
            return;
        }
        done();
    });

    // Пример защищенного API
    fastify.get('/data', async (request, reply) => {
        try {
            // Используем токен для запроса к внешнему API
            const response = await axios.get('https://api.provider.com/data', {
                headers: {
                    Authorization: `Bearer ${request.session.access_token}`
                }
            });
            reply.send(response.data);
        } catch (error) {
            reply.code(500).send({ error: 'API request failed' });
        }
    });
};