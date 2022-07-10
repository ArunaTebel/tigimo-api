const {getDatabase, closeDatabase} = require('../util/db');
const {ObjectID} = require('mongodb');

const collectionName = 'postings';

async function getPostings() {
    const database = await getDatabase();
    const postings = await database.collection(collectionName).find({}).toArray();
    await closeDatabase();
    return postings;
}

async function getPostingsByUserId(userId) {
    const database = await getDatabase();
    const postings = await database.collection(collectionName).find({userId: userId}).toArray();
    await closeDatabase();
    return postings;
}

async function insertPosting(postingData) {
    const database = await getDatabase();
    const {insertedId} = await database.collection(collectionName).insertOne(postingData);
    await closeDatabase();
    return insertedId;
}

async function updatePosting(id, posting) {
    const database = await getDatabase();
    const postings = await database.collection(collectionName).update(
        {_id: new ObjectID(id),},
        {
            $set: {
                ...posting,
            },
        },
    );
    await closeDatabase();
    return postings;
}

async function getPosting(id) {
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

async function deletePosting(id) {
    const database = await getDatabase();
    const postings = await database.collection(collectionName).deleteOne({
        _id: new ObjectID(id),
    });
    await closeDatabase();
    return postings;
}

module.exports = {
    insertPosting,
    getPostings,
    getPosting,
    updatePosting,
    deletePosting,
    getPostingsByUserId,
};