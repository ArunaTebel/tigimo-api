const {getDatabase, closeDatabase} = require('../util/db');
const {ObjectID} = require('mongodb');

const collectionName = 'postings';

/**
 * Returns all the Postings
 *
 * @returns {Promise}
 */
async function getPostings() {
    const database = await getDatabase();
    return database
        .collection(collectionName)
        .find({})
        .toArray();
}

/**
 * Returns the Postings created by the given user
 *
 * @param userId - id of the user that created the returned Postings
 * @returns {Promise<*>}
 */
async function getPostingsByUserId(userId) {
    const database = await getDatabase();
    return database
        .collection(collectionName)
        .find({userId: userId})
        .toArray();
}

/**
 * Inserts a new Posting
 *
 * @param postingData - Posting data.
 * Eg: {title: 'My Posting', url: 'https://example.com', note: 'My Note'}
 * @returns {Promise<*>}
 */
async function insertPosting(postingData) {
    const database = await getDatabase();
    const {insertedId} = await database
        .collection(collectionName)
        .insertOne(postingData);
    return insertedId;
}

/**
 * Updates the Posting having the given id
 *
 * @param id
 * @param posting
 * @returns {Promise<*>}
 */
async function updatePosting(id, posting) {
    const database = await getDatabase();
    return database
        .collection(collectionName)
        .updateOne(
            {_id: new ObjectID(id),},
            {
                $set: {
                    ...posting,
                },
            },
        );
}

/**
 * Returns the Posting having the given id
 *
 * @param id
 * @returns {Promise<{}|*>}
 */
async function getPosting(id) {
    const database = await getDatabase();
    try {
        return database
            .collection(collectionName)
            .findOne(
                {_id: new ObjectID(id),}
            );
    } catch (e) {
        return {}
    }
}

/**
 * Deletes the Posting having the given id
 *
 * @param id
 * @returns {Promise<*>}
 */
async function deletePosting(id) {
    const database = await getDatabase();
    return database
        .collection(collectionName)
        .deleteOne({
            _id: new ObjectID(id),
        });
}

module.exports = {
    getPostings,
    getPosting,
    getPostingsByUserId,
    insertPosting,
    updatePosting,
    deletePosting,
};