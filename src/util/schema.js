import mongoose from 'mongoose';

const {Schema} = mongoose;

const ChannelSchema = new Schema({
    name: String,
    description: String,
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
    channels: [ChannelSchema]
});

const PostingSchema = new Schema({
    title: String,
    url: String,
    note: String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    user: UserSchema,
    channel: ChannelSchema,
    meta: {favorites: Number},
});