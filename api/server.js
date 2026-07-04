const Hapi = require('@hapi/hapi');

const server = new Hapi.Server({
    host: '0.0.0.0',
    port: '8081',
    routes: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with'],
        },
    },
});

server.validator(require('joi'));

async function main() {
    server.route({
        method: 'POST',
        path: '/test',
        config: { payload: { parse: false } },
        handler: () => 'Hello POST'
    });

    await server.register([{
        plugin: require('./shifts-mock-api'),
        routes: { prefix: '/shifts' },
    }]);

    await server.start();

    console.info(`✅  API server is listening at ${server.info.uri.toLowerCase()}`);
}

main();