import { describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

describe('POST /save', () => {
  it('should save json to a file', () => {
    let json = { test: 'test' };
    chai
      .request('http://localhost:3001')
      .post('/save')
      .send(json)
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res).to.be.json;
      });
  });
});

describe('GET /load', () => {
  it('should get json from a file', () => {
    chai
      .request('http://localhost:3001')
      .get('/load')
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res).to.be.json;
      });
  });
});

describe('GET /another', () => {
  it('should return 2', () => {
    chai
      .request('http://localhost:3001')
      .get('/another')
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res).to.be.json;
      });
  });
});
