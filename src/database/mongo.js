const {MongoClient, ServerApiVersion} = require('mongodb');
const config = require('config');
require('dotenv').config();

const client = new MongoClient(
    getConnectionUri(),
    {useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1}
);

let db = null;

function getConnectionUri() {
    return config.db.uri
        .replace('<username>', process.env.DB_USER)
        .replace('<password>', process.env.DB_PASS)
        .replace('<cluster>', process.env.DB_CLUSTER);
}

async function startDatabase() {
    try {
        await client.connect();
        return client.db('tigimo');
    } catch (e) {
        console.log(`Failed to start db. Error is: ${e}`)
    }
}

async function closeDatabase() {
    await client.close();
    db = null;
}

async function getDatabase() {
    if (!db) {
        db = await startDatabase();
    }
    return db;
}

module.exports = {
    startDatabase,
    getDatabase,
    closeDatabase,
};