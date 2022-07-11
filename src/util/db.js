const mongoose = require('mongoose')
const config = require('../../config.json');
require('dotenv').config();

async function connectToDb() {
    try {
        await mongoose.connect(
            config.db.uri
                .replace('<username>', process.env.DB_USER)
                .replace('<password>', process.env.DB_PASS)
                .replace('<cluster>', process.env.DB_CLUSTER)
        );
    } catch (e) {
        console.log(e)
    }
}

module.exports = {connectToDb}