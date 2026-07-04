const Hapi = require('@hapi/hapi');
const { plugin: shiftsPlugin } = require('../mock-api/shifts-mock-api');
const Joi = require('joi');

let server;

module.exports = async (req, res) => {
    if (!server) {
        server = Hapi.server({
            debug: { request: ['error'] }
        });
        server.validator(Joi);
        await server.register({
            plugin: {
                name: 'shifts-mock-api',
                version: '1.0.0',
                register: shiftsPlugin.register
            },
            routes: { prefix: '/api/shifts' }
        });
        await server.initialize();
    }

    const options = {
        method: req.method,
        url: req.url, // includes query string, e.g. /api/shifts/123/book
        headers: req.headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
        options.payload = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
    }

    try {
        const response = await server.inject(options);
        
        for (const [key, value] of Object.entries(response.headers)) {
            res.setHeader(key, value);
        }
        
        res.status(response.statusCode).send(response.payload);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
    }
};
