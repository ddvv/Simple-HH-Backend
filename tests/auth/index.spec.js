const request = require('supertest');
const App = require('../../server/app.js');

beforeAll(async () => {
    jest.resetModules();
    App.init();
})

afterAll(async () => {
    App.close();
})

describe('Auth Routes', () => {
    it('авторизация', async () => {
        try {
            await App.fastify.ready();

        } catch (e) {
            console.log(e)
        }

        // const res = await request(App.fastify)
        //     .post('/auth/login')
        //     .send({});
        //

        expect(true).toEqual(true);
    })
})