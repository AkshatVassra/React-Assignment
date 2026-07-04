const Joi = require('joi');
const Boom = require('@hapi/boom');

const { delay } = require('./utils');
const { createMockDb } = require('./db');
const mockShifts = require('./mockShifts');

const db = createMockDb({ shifts: mockShifts });

const routes = [{
        method: 'GET',
        path: '/',
        handler: async() => {
            await delay(0);
            return db.shifts.list();
        },
    },
    {
        method: 'GET',
        path: '/{id}',
        handler: async({ params }) => {
            const shift = await db.shifts.get(params.id);
            await delay(0);

            if (!shift) {
                throw Boom.notFound(`Shift not found with id ${params.id}`);
            }

            return shift;
        },
        config: {
            validate: {
                params: {
                    id: Joi.string().required(),
                },
            },
        },
    },
    {
        method: 'POST',
        path: '/{id}/book',
        handler: async({ params }) => {
            console.log('Book request for', params.id);
            const shift = await db.shifts.get(params.id);
            console.log('Shift found:', !!shift);

            if (!shift) {
                throw Boom.notFound(`Shift not found with id ${params.id}`);
            } else if (shift.booked) {
                throw Boom.badRequest(`Shift ${params.id} is already booked`);
            } else if (Date.now() >= shift.endTime) {
                throw Boom.badRequest('Shift is already finished');
            } else if (Date.now() > shift.startTime) {
                throw Boom.badRequest('Shift has already started');
            }

            const allShifts = await db.shifts.list();
            const overlappingShiftExists = !!allShifts
                .filter(s => s.booked)
                .find(s => s.startTime < shift.endTime && s.endTime > shift.startTime);

            if (overlappingShiftExists) {
                throw Boom.badRequest('Cannot book an overlapping shift');
            }

            await db.shifts.set(params.id, { booked: true });
            await delay(1500);

            return db.shifts.get(params.id);
        },
        config: {
            validate: {
                params: {
                    id: Joi.string().required(),
                },
            },
            payload: {
                parse: false
            }
        },
    },
    {
        method: 'POST',
        path: '/{id}/cancel',
        handler: async({ params }) => {
            const shift = await db.shifts.get(params.id);

            if (!shift) {
                throw Boom.notFound(`Shift not found with id ${params.id}`);
            } else if (!shift.booked) {
                throw Boom.badRequest('Cannot cancel shift that is not booked');
            }

            await db.shifts.set(params.id, { booked: false });
            await delay(1500);

            return db.shifts.get(params.id);
        },
        config: {
            validate: {
                params: {
                    id: Joi.required(),
                },
            },
            payload: {
                parse: false
            }
        },
    },
];

const plugin = {
    name: 'shifts-mock-api',
    version: '1.0.0',
    register(server) {
        server.route(routes);
    },
};

module.exports = { plugin };