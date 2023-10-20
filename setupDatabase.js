const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

const { 
    CREATE_POPULATIONS_TABLE, 
    INSERT_OR_IGNORE_POPULATION 
} = require('./queries.js');

const csvPath = path.join(__dirname, 'city_populations.csv');

function initializeDatabase(db, callback) {
    db.serialize(() => {
        db.run(CREATE_POPULATIONS_TABLE);
        
        fs.createReadStream(csvPath)
        .pipe(csv({
            headers: ['city', 'state', 'population'],
            skipLines: 0,
        }))
        .on('data', (row) => {
            db.run(
                    INSERT_OR_IGNORE_POPULATION, 
                    [row.city.toLowerCase(), row.state.toLowerCase(), 
                    parseInt(row.population)],
                );
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
