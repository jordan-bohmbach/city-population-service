const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

const dbPath = path.join(__dirname, 'city_population.db');
const csvPath = path.join(__dirname, 'city_populations.csv');

const db = new sqlite3.Database(dbPath);

const determineIfDatabaseIsSetup = () => {
    console.log('Determine if the database is already setup');
}

const setupDatabase = () => {
    console.log('Setup the database');
}

const main = () => {
    console.log('Main function');
}

if (require.main === module) {
    init();
}

module.exports = {
    determineIfDatabaseIsSetup,
    setupDatabase,
    db,
};
