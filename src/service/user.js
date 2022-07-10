const {getDatabase, closeDatabase} = require('../util/db');

const collectionName = 'users';

async function createAccount(user) {
    const database = await getDatabase();
    const existingUser = await database.collection(collectionName).findOne(
        {sub: user.sub,}
    );
    if (existingUser && existingUser.sub === user.sub) {
        throw new Error('A user account already exists for this user');
    }
    const {insertedId} = await database.collection(collectionName).insertOne(user);
    await closeDatabase();
    return insertedId;
}

async function getUserByAuthSub(authSub) {
    const database = await getDatabase();
    const user = await database.collection(collectionName).findOne(
        {sub: authSub,}
    );
    await closeDatabase();
    return user;
}

module.exports = {
    createAccount,
    getUserByAuthSub
};