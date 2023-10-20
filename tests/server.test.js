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
        done();
      });
  });
});
