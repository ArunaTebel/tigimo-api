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
    async (req, res, next) => {
        try {
            res.send(await getPostings());
        } catch (e) {
            handleApiError(
                e,
                'An error occurred while trying to get Postings',
                next
            )
        }
    }
);

router.get(
    `/postings/my`,
    coreAuthMiddleware,
    async (req, res, next) => {
        try {
            res.send(await getPostingsByUserId(req.currentUser._id));
        } catch (e) {
            handleApiError(
                e,
                'An error occurred while trying to get my Postings',
                next
            )
        }
    }
);

router.post(
    '/postings',
    coreAuthMiddleware,
    async (req, res, next) => {
        try {
            const posting = await insertPosting({
                ...req.body,
                user: req.currentUser,
                created_at: new Date(),
                updated_at: new Date()
            });
            res.send({
                success: true,
                data: {
                    posting: posting
                }
            });
        } catch (e) {
            handleApiError(
                e,
                'An error occurred while trying to create the Posting',
                next
            )
        }
    }
);

router.get(
    '/posting/:id',
    [auth.checkJwt, service.postingExists],
    async (req, res, next) => {
        try {
            res.send(await getPosting(req.params.id));
        } catch (e) {
            handleApiError(
                e,
                'An error occurred while trying to find the Posting',
                next
            )
        }
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
            handleApiError(
                e,
                'An error occurred while trying to delete the Posting',
                next
            )
        }
    }
);

router.put(
    '/posting/:id',
    ownPostingAuthMiddleware,
    async (req, res, next) => {
        try {
            const posting = await updatePosting(
                req.params.id,
                {...req.body, updatedAt: new Date()}
            );
            res.send({
                message: 'Posting updated.',
                data: {posting}
            });
        } catch (e) {
            handleApiError(
                e,
                'An error occurred while trying to update the Posting',
                next
            )
        }
    }
);

function handleApiError(e, message, next, code = 500) {
    e.code = code
    e.originalMessage = e.message
    e.message = message
    next(e)
}

module.exports = router