const POPULATION_BY_STATE_CITY = `
    SELECT population 
    FROM populations 
    WHERE state = ? AND city = ?;
`;

const UPDATE_POPULATION_BY_STATE_CITY = `
    UPDATE populations 
    SET population = ? 
    WHERE state = ? 
    AND city = ?;
`;

const INSERT_NEW_STATE_CITY_POPULATION = `
    INSERT INTO populations (state, city, population) 
    VALUES (?, ?, ?);
`;

const CREATE_POPULATIONS_TABLE = `
    CREATE TABLE IF NOT EXISTS 
    populations (
        state TEXT, 
        city TEXT, 
        population INTEGER, 
        PRIMARY KEY(state, city)
    );
`;

const INSERT_OR_IGNORE_POPULATION = `
    INSERT OR IGNORE INTO populations (city, state, population) 
    VALUES (?, ?, ?);
`;

module.exports = {
    CREATE_POPULATIONS_TABLE,
    INSERT_OR_IGNORE_POPULATION,
    POPULATION_BY_STATE_CITY,
    UPDATE_POPULATION_BY_STATE_CITY,
    INSERT_NEW_STATE_CITY_POPULATION,
};
