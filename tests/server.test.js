const chai = require('chai');
const chaiHttp = require('chai-http');
const { startServer, fastify } = require('../server.js');

chai.use(chaiHttp);
const { expect } = chai;

describe('City Population API', () => {
  before((done) => {
    startServer((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      done();
    });
  });

  after((done) => {
    fastify.close(done);
  });

  it('should retrieve population for a given city and state', done => {
    chai.request(fastify.server)
      .get('/api/population/state/Florida/city/Orlando')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.population).to.be.a('number');
        expect(res.body.population).to.equal(309154);
        done();
      });
  });

  it('should return an error for a non-existent city and state combo', done => {
    chai.request(fastify.server)
      .get('/api/population/state/Nowhere/city/NoCity')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error).to.equal('State/city combo not found.');
        done();
      });
  });

  it('should update population for an existing city and state', done => {
    const newPopulation = '123456';
    chai.request(fastify.server)
      .put('/api/population/state/Alabama/city/Mobile')
      .set('Content-Type', 'text/plain')
      .send(newPopulation)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should create a new city and state with given population', done => {
    const newPopulation = '789012';
    const uniqueCityName = `NewCity-${Date.now()}`;
    const uniqueStateName = `NewState-${Date.now()}`;

    chai.request(fastify.server)
      .put(`/api/population/state/${uniqueStateName}/city/${uniqueCityName}`)
      .set('Content-Type', 'text/plain')
      .send(newPopulation)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.message).to.equal('Created successfully.');
        done();
      });
  });

  it('should return an error for invalid population data', done => {
    chai.request(fastify.server)
      .put('/api/population/state/Florida/city/Orlando')
      .set('Content-Type', 'text/plain')
      .send("invalid")
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error).to.equal('Invalid population data, please include only an integer.');
        done();
      });
  });

  it('should return an error for an invalid route', done => {
    chai.request(fastify.server)
      .get('/api/invalid/route')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error).to.equal('Invalid route. Please use /api/population/state/:state/city/:city');
        done();
      });
  });
});
