const axios = require('axios');
const jestMock = require('jest-mock');
const buildApp = require("../../server/buildApp");

jest.mock('axios');

describe('OAuth flow without passport (manual)', () => {
    let app;

    beforeAll(async () => {
        process.env.API_TOKEN_URL = 'https://provider.example.com/token';
        process.env.API_CLIENT_ID = 'mock-client-id';
        process.env.API_CLIENT_SECRET = 'mock-client-secret';
        process.env.API_REDIRECT_URI = 'http://localhost:3000/auth/callback';
        process.env.SESSION_SECRET = 'supersecretkey_that_is_long_enough';
        process.env.NODE_ENV = 'test';

        app = buildApp();
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it.only('Должен успешно авторизоваться', () => {

    })

    it('should exchange code for token and store access_token in session', async () => {
        const mockToken = {
            access_token: 'mock_access_token',
            refresh_token: 'mock_refresh_token',
            expires_in: 3600,
            token_type: 'Bearer'
        };

        // Мокаем ответ от OAuth-провайдера
        axios.post.mockResolvedValue({ data: mockToken });

        const callbackRes = await app.inject({
            method: 'GET',
            url: '/auth/callback?code=mock_code'
        });

        expect(callbackRes.statusCode).toBe(200);
        expect(callbackRes.body).toBe('OK');

        // Получаем Set-Cookie
        const setCookieHeader = callbackRes.headers['set-cookie'];
        expect(setCookieHeader).toBeDefined();

        const cookie = Array.isArray(setCookieHeader)
            ? setCookieHeader.map(c => c.split(';')[0]).join('; ')
            : setCookieHeader.split(';')[0];

        // Теперь делаем запрос с этой кукой
        const sessionRes = await app.inject({
            method: 'GET',
            url: '/session',
            headers: {
                cookie
            }
        });

        const sessionData = JSON.parse(sessionRes.body);
        expect(sessionData.access_token).toBe('mock_access_token');
    });
});
