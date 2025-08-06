const buildApp = require("./buildApp");

const port = process.env.PORT ?? 3000;
const host = process.env.HOST;

const fastify = buildApp();

const init = () => {
    fastify.listen({port, host}, (err) => {
        if (err) throw err;
    });
}

const close = () => fastify.close();

exports.fastify = fastify;
exports.init = init;
exports.close = close;
