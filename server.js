const path = require('path');
const fastifySqlite = require('fastify-sqlite')
const fastify = require('fastify')({
    logger: true
  })

fastify.register(fastifySqlite, {
    dbFile: path.join(__dirname, 'city_population.db')
})

fastify.get('/api/population/state/:state/city/:city', (request, reply) => {
    console.log('get route goes here')
});

fastify.put('/api/population/state/:state/city/:city', (request, reply) => {
    console.log('put route goes here')
});

module.exports.server = fastify;
