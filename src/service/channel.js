const {Channel} = require("../util/schema");

/**
 * Returns all the Channels
 *
 * @returns {Promise}
 */
async function getChannels() {
    return await Channel
        .find()
        .exec();
}

/**
 * Returns the Channels created by the given user
 *
 * @param userId - id of the user that created the returned Channels
 * @returns {Promise<*>}
 */
async function getChannelsByUserId(userId) {
    return await Channel
        .find({"owner._id": userId})
        .exec();
}

/**
 * Inserts a new Channel
 *
 * @param channelData - Channel data.
 * Eg: {name: 'My Channel', description: 'My Channel Description'}
 * @returns {Promise<*>}
 */
async function insertChannel(channelData) {
    const channel = new Channel(channelData);
    await channel.save()
    return channel
}

/**
 * Updates the Channel having the given id
 *
 * @param id
 * @param channel
 * @returns {Promise<*>}
 */
async function updateChannel(id, channel) {
    return Channel.findOneAndUpdate(
        {_id: id},
        {...channel, updated_at: new Date()}, {new: true}
    );
}

/**
 * Returns the Channel having the given id
 *
 * @param id
 * @returns {Promise<{}|*>}
 */
async function getChannel(id) {
    return Channel.findOne({_id: id});
}

/**
 * Deletes the Channel having the given id
 *
 * @param id
 * @returns {Promise<*>}
 */
async function deleteChannel(id) {
    return Channel.findOneAndDelete({_id: id});
}

module.exports = {
    getChannels,
    getChannel,
    getChannelsByUserId,
    insertChannel,
    updateChannel,
    deleteChannel,
};