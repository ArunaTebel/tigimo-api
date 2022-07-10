const express = require('express')
const {
    getPostings,
    getPosting,
    getPostingsByUserId,
    insertPosting,
    deletePosting,
    updatePosting,
} = require("../service/posting");
const {auth, service} = require("../util/middleware");
const router = express.Router();

const coreAuthMiddleware = [
    auth.checkJwt,
    auth.initCurrentUserData
]
const ownPostingAuthMiddleware = [
    ...coreAuthMiddleware,
    service.isOwnPosting
]

router.get(
    `/postings`,
    async (req, res) => {
        res.send(await getPostings());
    }
);

router.get(
    `/postings/my`,
    coreAuthMiddleware,
    async (req, res) => {
        res.send(await getPostingsByUserId(req.currentUser._id));
    }
);

router.post(
    '/postings',
    coreAuthMiddleware,
    async (req, res, next) => {
        try {
            const postingId = await insertPosting({
                ...req.body,
                userId: req.currentUser._id,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            res.send({
                success: true,
                data: {
                    postingId: postingId
                }
            });
        } catch (e) {
            e.code = 500
            e.message = 'An error occurred while trying to create the Posting'
            next(e)
        }
    }
);

router.get(
    '/posting/:id',
    auth.checkJwt,
    async (req, res) => {
        res.send(await getPosting(req.params.id));
    }
);

router.delete(
    '/posting/:id',
    ownPostingAuthMiddleware,
    async (req, res, next) => {
        try {
            await deletePosting(req.params.id);
            res.send({
                message: 'Posting removed.'
            });
        } catch (e) {
            e.code = 500
            e.message = 'An error occurred while trying to delete the Posting'
            next(e)
        }
    }
);

router.put(
    '/posting/:id',
    ownPostingAuthMiddleware,
    async (req, res, next) => {
        try {
            await updatePosting(
                req.params.id,
                {...req.body, updatedAt: new Date()}
            );
            res.send({
                message: 'Posting updated.'
            });
        } catch (e) {
            e.code = 500
            e.message = 'An error occurred while trying to update the Posting'
            next(e)
        }
    }
);

module.exports = router