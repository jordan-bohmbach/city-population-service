const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

const csvPath = path.join(__dirname, 'city_populations.csv');

function initializeDatabase(db, callback) {
    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS populations (state TEXT, city TEXT, population INTEGER, PRIMARY KEY(state, city))");
        
        fs.createReadStream(csvPath)
        .pipe(csv({
            headers: ['city', 'state', 'population'],
            skipLines: 0,
        }))
        .on('data', (row) => {
            db.run('INSERT OR IGNORE INTO populations (city, state, population) VALUES (?, ?, ?)', [row.city.toLowerCase(), row.state.toLowerCase(), parseInt(row.population)]);
        })
        .on('error', (error) => {
            console.error('Error reading CSV:', error);
            if (callback) callback(error);
        })
        .on('end', () => {
            console.log('CSV file successfully processed.');
            if (callback) callback();
        });
    });
}

module.exports = {
    initializeDatabase
};
