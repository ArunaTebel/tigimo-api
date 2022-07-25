const {User} = require("../util/schema");

/**
 * Creates a new user using the provided data.
 *
 * @param user
 * @returns {Promise}
 */
async function createAccount(user) {
    const existingUser = await User
        .findOne({uid: user.sub})
        .exec();
    if (existingUser && existingUser.uid === user.sub) {
        throw new Error('A user account already exists for this user');
    }

    return await (new User({
        ...user,
        uid: user.sub,
        first_name: user.given_name,
        last_name: user.family_name,
        full_name: user.name,
        nick_name: user.nickname,
        created_at: new Date(),
    })).save();
}

/**
 * Returns the user having the given uid
 *
 * @param uid
 * @returns {Promise}
 */
async function getUserByUid(uid) {
    return await User
        .findOne({uid: uid})
        .exec();
}

module.exports = {
    createAccount,
    getUserByUid
};