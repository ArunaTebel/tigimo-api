const mongoose = require('mongoose')
const {Schema} = mongoose;

const ChannelSchema = new Schema({
    name: String,
    description: String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
});

const UserSchema = new Schema({
    uid: String,
    first_name: String,
    last_name: String,
    full_name: String,
    nick_name: String,
    picture: String,
    email: String,
    email_verified: Boolean,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    channels: [{ type: Schema.Types.ObjectId, ref: 'Channel' }]
});

const PostingSchema = new Schema({
    title: String,
    url: String,
    note: String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    channel: { type: Schema.Types.ObjectId, ref: 'Channel' },
    meta: {favorites: {type: Number, default: 0}},
});

ChannelSchema.add({owner: { type: Schema.Types.ObjectId, ref: 'User' }});

const Channel = mongoose.model('Channel', ChannelSchema);
const User = mongoose.model('User', UserSchema);
const Posting = mongoose.model('Posting', PostingSchema);

module.exports = {Channel, User, Posting}
