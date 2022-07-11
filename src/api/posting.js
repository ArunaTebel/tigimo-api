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
const {handleApiError} = require("../util/apiUtils");
const router = express.Router();

const coreAuthMiddleware = [
    auth.checkJwt,
    auth.initCurrentUserData
]
const ownPostingAuthMiddleware = [
    ...coreAuthMiddleware,
    service.posting.iOwn
]

router.get(
    `/postings`,
    auth.checkJwt,
    async (req, res, next) => {
        try {
            res.send(await getPostings());
        } catch (e) {
            handleApiError(
                e,
                'An error occurred while trying to get Postings',
                next,
                e.code
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
    [auth.checkJwt, service.posting.exists],
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
                {...req.body, updated_at: new Date()}
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

module.exports = router