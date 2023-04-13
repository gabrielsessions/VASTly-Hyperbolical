const express = require("express");
const router = express.Router();

const url = require('url');

const { Pool, Client } = require("pg");
const dotenv = require('dotenv');

// Config and fetch .env file
dotenv.config();

// Connect to Postgres server using these credentials
const credentials = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
};

// Connect with a connection pool
// Sample SQL command, just gets current time
async function poolDemo() {
    const pool = new Pool(credentials);
    const now = await pool.query("SELECT NOW()");
    await pool.end();

    return now;
}

// Connect with a client
async function clientDemo() {
    const client = new Client(credentials);
    await client.connect();
    const now = await client.query("SELECT NOW()");
    await client.end();

    return now;
}


// Queries the database for the first 10 entries of the sensor_data table
async function getSamples() {
    const pool = new Pool(credentials);
    const text = `SELECT * FROM sensor_data LIMIT 10;`;
    return pool.query(text);
}

// Runs a query and returns the result
// Parameters: sqlQuery - string 
// TODO: prevent SQL injection
async function query(sqlQuery) {
    const pool = new Pool(credentials);
    return pool.query(sqlQuery);
}

router.get("/", function (req, res, next) {
    getSamples()
        .then((data) => res.send(data));
});

router.get("/query", function (req, res, next) {
    const url_parts = url.parse(req.url, true);
    query(url_parts.query.sqlQuery)
        .then((data) => res.send(data));
});

module.exports = router;
