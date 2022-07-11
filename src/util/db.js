const mongoose = require('mongoose')
const config = require('../../config.json');
require('dotenv').config();

async function connectToDb() {
    try {
        const dbUri = process.env.NODE_ENV === 'test' ? config.db.test.uri: config.db.prod.uri;
        await mongoose.connect(
            dbUri
                .replace('<username>', process.env.DB_USER)
                .replace('<password>', process.env.DB_PASS)
                .replace('<cluster>', process.env.DB_CLUSTER)
        );
    } catch (e) {
        console.log(e)
    }
}

module.exports = {connectToDb}