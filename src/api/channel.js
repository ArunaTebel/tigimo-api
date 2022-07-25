const express = require('express')
const {
    getChannels,
    getChannel,
    getChannelsByUserId,
    insertChannel,
    deleteChannel,
    updateChannel,
} = require("../service/channel");
const {auth, service} = require("../util/middleware");
const {handleApiError} = require("../util/apiUtils");
const router = express.Router();

const coreAuthMiddleware = [
    auth.checkJwt,
    auth.initCurrentUserData
]
const ownChannelAuthMiddleware = [
    ...coreAuthMiddleware,
    service.channel.iOwn
]

router.get(
    `/channels`,
    async (req, res, next) => {
        try {
            res.send(await getChannels());
        } catch (e) {
            handleApiError(
                e,
                'An error occurred while trying to get Channels',
                next
            )
        }
    }
);

router.get(
    `/channels/my`,
    coreAuthMiddleware,
    async (req, res, next) => {
        try {
            res.send(await getChannelsByUserId(req.currentUser._id));
        } catch (e) {
            handleApiError(
                e,
                'An error occurred while trying to get my Channels',
                next
            )
        }
    }
);

router.post(
    '/channels',
    coreAuthMiddleware,
    async (req, res, next) => {
        try {
            const channel = await insertChannel({
                ...req.body,
                owner: req.currentUser._id,
                created_at: new Date(),
                updated_at: new Date()
            });
            res.send({
                success: true,
                data: {
                    channel: channel
                }
            });
        } catch (e) {
            handleApiError(
                e,
                'An error occurred while trying to create the Channel',
                next
            )
        }
    }
);

router.get(
    '/channel/:id',
    [auth.checkJwt, service.channel.exists],
    async (req, res, next) => {
        try {
            res.send(await getChannel(req.params.id));
        } catch (e) {
            handleApiError(
                e,
                'An error occurred while trying to find the Channel',
                next
            )
        }
    }
);

router.delete(
    '/channel/:id',
    ownChannelAuthMiddleware,
    async (req, res, next) => {
        try {
            await deleteChannel(req.params.id);
            res.send({
                message: 'Channel removed.'
            });
        } catch (e) {
            handleApiError(
                e,
                'An error occurred while trying to delete the Channel',
                next
            )
        }
    }
);

router.put(
    '/channel/:id',
    ownChannelAuthMiddleware,
    async (req, res, next) => {
        try {
            const channel = await updateChannel(
                req.params.id,
                {...req.body, updated_t: new Date()}
            );
            res.send({
                message: 'Channel updated.',
                data: {channel}
            });
        } catch (e) {
            handleApiError(
                e,
                'An error occurred while trying to update the Channel',
                next
            )
        }
    }
);

module.exports = router