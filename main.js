const sqlite3 = require('sqlite3').verbose();
const { initializeDatabase } = require('./setupDatabase');
const { server } = require('./server');

const main = async () => {
    const db = new sqlite3.Database('./city_population.db');
    initializeDatabase(db);
    
    server.listen({ port: 5555 }, (err) => {
        if (err) {
            server.log.error(err);
            process.exit(1);
        } else {
            server.log.info(`server listening on ${server.server.address().port}`);
        }
    });
}

main();
