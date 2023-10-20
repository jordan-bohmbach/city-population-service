const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { initializeDatabase } = require('./setupDatabase');
const { startServer, fastify } = require('./server');

const dbPath = path.join(__dirname, 'city_populations.db');

const main = () => {
    const db = new sqlite3.Database(dbPath);
    initializeDatabase(db);
    
    startServer((err) => {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        } else {
            fastify.log.info(`server listening on ${fastify.server.address().port}`);
        }
    });
}

main();
