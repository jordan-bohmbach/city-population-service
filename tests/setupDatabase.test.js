const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sqlite3 = require('sqlite3').verbose();

const { initializeDatabase } = require('../setupDatabase.js');

describe('setupDatabase.js', () => {
    let db;

    beforeEach((done) => {
        db = new sqlite3.Database('../city_population.db');
        initializeDatabase(db, done);
    });

    afterEach((done) => {
        db.close(done);
    });

    it('should create a populations table', (done) => {
        db.get(`
            SELECT count(*) as count 
            FROM sqlite_master 
            WHERE type='table' 
            AND name='populations'
        `, (err, row) => {
            if (err) done(err);
            expect(row.count).to.equal(1)
            done();
        });
    });

    it('should insert data from CSV into populations table', (done) => {
        db.get(`
            SELECT count(*) as count 
            FROM populations
        `, (err, row) => {
            if (err) done(err);
            expect(row.count).to.be.above(0);
            done();
        });
    });

    it('should not overwrite existing data on repeated runs', (done) => {
        db.run(`
            INSERT OR IGNORE 
            INTO populations (city, state, population) 
            VALUES (?, ?, ?)
        `, ["testcity", "teststate", 99999], (err) => {
            if (err) return done(err);
    
            initializeDatabase(db, () => {
                db.get(`
                    SELECT population 
                    FROM populations 
                    WHERE city='testcity' 
                    AND state='teststate'
                `, (err, row) => {
                    if (err) return done(err);
                    
                    expect(row.population).to.equal(99999);
                    done();
                });
            });
        });
    });
});
