const axios = require('axios');

function auth(fastify, opts, done) {
    // 1. Перенаправление на OAuth-провайдера
    fastify.get('/login', (request, reply) => {
        const url = new URL('', process.env.API_AUTH_URL);
        url.searchParams.set('response_type', 'code');
        url.searchParams.set('state', 'true');
        url.searchParams.set('client_id', process.env.API_CLIENT_ID);
        url.searchParams.set('redirect_uri', process.env.API_REDIRECT_URI);

        reply.redirect(url.toString());
    })

    // 2. Callback-обработчик (получает код)
    fastify.get('/callback', async (request, reply) => {
        const {code} = request.query;

        try {
            // 3. Обмен кода на access_token
            const tokenResponse = await axios.post(process.env.API_TOKEN_URL, {
                client_id: process.env.API_CLIENT_ID,
                client_secret: process.env.API_CLIENT_SECRET,
                code,
                grant_type: 'authorization_code',
                redirect_uri: process.env.API_REDIRECT_URI
            }, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            });

            const {access_token, refresh_token, expires_in, token_type} = tokenResponse.data;

            // 4. Сохраняем токен в сессии
            request.session['access_token'] = access_token;

            // 5. Опционально: получаем данные пользователя
            // const userInfo = await axios.get(config.userInfoUrl, {
            //     headers: { Authorization: `Bearer ${access_token}` }
            // });


            // request.session.user = userInfo.data;
            reply.code(200).send('OK');
        } catch (error) {
            fastify.log.error(error);
            reply.code(500).send('Auth failed');
        }
    });

    // 6. Выход (logout)
    fastify.get('/logout', (request, reply) => {
        request.session.destroy();
        reply.redirect('/');
    });

    done()
}

exports.auth = auth;