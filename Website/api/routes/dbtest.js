const express = require("express");
const router = express.Router();

const { Pool, Client } = require("pg");
const dotenv = require('dotenv');

dotenv.config();

const credentials = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
};

// Connect with a connection pool.

async function poolDemo() {
    const pool = new Pool(credentials);
    const now = await pool.query("SELECT NOW()");
    await pool.end();

    return now;
}

// Connect with a client.

async function clientDemo() {
    const client = new Client(credentials);
    await client.connect();
    const now = await client.query("SELECT NOW()");
    await client.end();

    return now;
}


async function test() {
    const poolResult = await poolDemo();
    console.log("Time with pool: " + poolResult.rows[0]["now"]);

    const clientResult = await clientDemo();
    console.log("Time with client: " + clientResult.rows[0]["now"]);
}

async function getSamples() {
    const pool = new Pool(credentials);
    const text = `SELECT * FROM sensor_data LIMIT 10`;
    return pool.query(text);
}

async function query(sqlQuery) {
    const pool = new Pool(credentials);
    return pool.query(sqlQuery);
}


router.get("/", function (req, res, next) {
    getSamples()
        .then((data) => res.send(data));
});

router.get("/query", function (req, res, next) {
    const queryParams = req.query;
    res.send('Query!')
});

module.exports = router;
