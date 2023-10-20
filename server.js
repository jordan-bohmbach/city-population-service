const path = require('path');
const fastifySqlite = require('fastify-sqlite')
const fastify = require('fastify')({
    logger: true
  })
const { 
    POPULATION_BY_STATE_CITY,
    UPDATE_POPULATION_BY_STATE_CITY,
    INSERT_NEW_STATE_CITY_POPULATION
} = require('./queries.js');

const dbFile = process.env.NODE_ENV === 'test'
    ? path.join(__dirname, 'tests/city_populations_test.db')
    : path.join(__dirname, 'city_populations.db');

fastify.register(fastifySqlite, { dbFile })

fastify.get('/api/population/state/:state/city/:city', (request, reply) => {
    const { state, city } = request.params;

    fastify.sqlite.all(POPULATION_BY_STATE_CITY, [state.toLowerCase(), city.toLowerCase()], (err, rows) => {
        if (rows.length === 0) {
            return reply.code(400).send({ error: "State/city combo not found." });
        }
        return reply.send({ population: rows[0].population });
    });
});

fastify.put('/api/population/state/:state/city/:city', (request, reply) => {
    const { state, city } = request.params;
    const population = parseInt(request.body, 10);

    if (isNaN(population)) {
        return reply.code(400).send({ error: "Invalid population data, please include only an integer." });
    }

    fastify.sqlite.get(POPULATION_BY_STATE_CITY, [state.toLowerCase(), city.toLowerCase()], (err, row) => {
        if (row) {
            fastify.sqlite.run(UPDATE_POPULATION_BY_STATE_CITY, [population, state.toLowerCase(), city.toLowerCase()], (err) => {
                return reply.code(200).send({ message: "Updated successfully." });
            });
        } else {
            fastify.sqlite.run(INSERT_NEW_STATE_CITY_POPULATION, [state.toLowerCase(), city.toLowerCase(), population], (err) => {
                return reply.code(201).send({ message: "Created successfully." });
            });
        }
    });
});

fastify.setNotFoundHandler((request, reply) => {
    reply
      .code(404)
      .send({ error: 'Invalid route. Please use /api/population/state/:state/city/:city' });
  });

const startServer = (callback) => {
    fastify.listen({ port: 5555 }, callback);
}

module.exports = {
    startServer,
    fastify,
};
