const {getDatabase, closeDatabase} = require('../util/db');
const {ObjectID} = require('mongodb');

const collectionName = 'postings';

async function insertPosting(posting) {
    const database = await getDatabase();
    const {insertedId} = await database.collection(collectionName).insertOne(posting);
    await closeDatabase();
    return insertedId;
}

async function getPostings() {
    const database = await getDatabase();
    const postings = await database.collection(collectionName).find({}).toArray();
    await closeDatabase();
    return postings;
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
    updatePosting,
    deletePosting,
};