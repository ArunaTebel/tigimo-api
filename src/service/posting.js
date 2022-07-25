const {Posting} = require("../util/schema");

/**
 * Returns all the Postings
 *
 * @returns {Promise}
 */
async function getPostings() {
    return await Posting
        .find()
        .populate('channel')
        .populate('user')
        .exec();
}

/**
 * Returns the Postings created by the given user
 *
 * @param userId - id of the user that created the returned Postings
 * @returns {Promise<*>}
 */
async function getPostingsByUserId(userId) {
    return await Posting
        .find({"user._id": userId})
        .exec();
}

/**
 * Returns the Postings created under the given channel
 *
 * @param channelId - id of the channel on which the Postings appear
 * @returns {Promise<*>}
 */
async function getPostingsByChannelId(channelId) {
    return await Posting
        .find({"channel": channelId})
        .populate('channel')
        .populate('user')
        .exec();
}

/**
 * Inserts a new Posting
 *
 * @param postingData - Posting data.
 * Eg: {title: 'My Posting', url: 'https://example.com', note: 'My Note'}
 * @returns {Promise<*>}
 */
async function insertPosting(postingData) {
    const posting = new Posting(postingData);
    await posting.save()
    return posting
}

/**
 * Updates the Posting having the given id
 *
 * @param id
 * @param posting
 * @returns {Promise<*>}
 */
async function updatePosting(id, posting) {
    return Posting.findOneAndUpdate(
        {_id: id},
        {...posting, updated_at: new Date()}, {new: true}
    );
}

/**
 * Returns the Posting having the given id
 *
 * @param id
 * @returns {Promise<{}|*>}
 */
async function getPosting(id) {
    return Posting.findOne({_id: id});
}

/**
 * Deletes the Posting having the given id
 *
 * @param id
 * @returns {Promise<*>}
 */
async function deletePosting(id) {
    return Posting.findOneAndDelete({_id: id});
}

module.exports = {
    getPostings,
    getPosting,
    getPostingsByUserId,
    getPostingsByChannelId,
    insertPosting,
    updatePosting,
    deletePosting,
};