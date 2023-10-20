const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sqlite3 = require('sqlite3').verbose();

const { isDatabaseSetUp, setupDatabase, db } = require('../setupDatabase.js');

describe('setupDatabase.js', () => {
    beforeEach(() => {
        sinon.stub(sqlite3, 'Database').returns({
            get: (query, cb) => cb(null, { count: 0 }),
            run: (query, ...params) => ({}),
        });
    });

    afterEach(() => {
        sqlite3.Database.restore();
    });

    describe('isDatabaseSetUp', () => {

        it('should call the callback with false if the table does not exist', (done) => {
            isDatabaseSetUp((err, isSetUp) => {
                expect(err).to.be.null;
                expect(isSetUp).to.be.false;
                done();
            });
        });
    });

    describe('setupDatabase', () => {

        it('should call the callback without error on success', (done) => {
            setupDatabase((err) => {
                expect(err).to.be.null;
                done();
            });
        });
    });
});
