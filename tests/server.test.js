const chai = require('chai');
const chaiHttp = require('chai-http');
const { server } = require('../server.js');

chai.use(chaiHttp);
const { expect } = chai;

describe('City Population API', () => {
  it('should retrieve population for a given city and state', done => {
    chai.request(server)
      .get('/api/population/state/Florida/city/Orlando')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.population).to.be.a('number');
        expect(res.body.population).to.equal(32423);
        done();
      });
  });

  it('should return an error for a non-existent city and state combo', done => {
    chai.request(server)
      .get('/api/population/state/Nowhere/city/NoCity')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error).to.equal('State/city combo not found.');
        done();
      });
  });

  it('should update population for an existing city and state', done => {
    const newPopulation = 123456;
    chai.request(server)
      .put('/api/population/state/Florida/city/Orlando')
      .send({ population: newPopulation })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should create a new city and state with given population', done => {
    const newPopulation = 789012;
    chai.request(server)
      .put('/api/population/state/NewState/city/NewCity')
      .send({ population: newPopulation })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.message).to.equal('Created successfully.');
        done();
      });
  });

  it('should return an error for invalid population data', done => {
    chai.request(server)
      .put('/api/population/state/Florida/city/Orlando')
      .send({ population: "invalid" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error).to.equal('Invalid population data.');
        done();
      });
  });

  it('should return an error for an invalid route', done => {
    chai.request(server)
      .get('/api/invalid/route')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error).to.equal('Invalid route. Please use /api/population/state/:state/city/:city');
        done();
      });
  });
});
