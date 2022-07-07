const {getDatabase, closeDatabase} = require('../util/db');
const {ObjectID} = require('mongodb');

const collectionName = 'users';

async function createUser(user) {
    const database = await getDatabase();
    const {insertedId} = await database.collection(collectionName).insertOne(user);
    await closeDatabase();
    return insertedId;
}

async function getUser(id) {
    const database = await getDatabase();
    try {
        return await database.collection(collectionName).findOne(
            {_id: new ObjectID(id),}
        );
    } catch (e) {
        return {}
    } finally {
        await closeDatabase();
    }
}

module.exports = {
    createUser,
    getUser
};