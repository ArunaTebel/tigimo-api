const {getUserByUid} = require("../service/user");
const {expressjwt: jwt} = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const config = require("../../config.json");
const {getPosting} = require("../service/posting");
const {getChannel} = require("../service/channel");
const auth0Config = config.auth0;

const core = {
    apiErrorHandler: (err, req, res, next) => {
        res.status(err.code).send({
            success: false,
            message: err._message,
            detailedMessage: err.originalMessage
        })
        next()
    }
}
const auth = {
    checkJwt: jwt({
        secret: jwksRsa.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `${auth0Config.domain}/.well-known/jwks.json`
        }),

        audience: auth0Config.api.audience,
        issuer: auth0Config.issuer,
        algorithms: ['RS256']
    }),
    initCurrentUserData: async function (req, res, next) {
        req.currentUser = await getUserByUid(req.auth.sub)
        next();
    }
}

const service = {
    posting: {
        exists: async (req, res, next) => {
            const posting = await getPosting(req.params.id)
            if (!posting || !posting._id) {
                const error = new Error('No posting found by the given id')
                error.code = 404
                next(error)
            } else {
                next()
            }
        },
        iOwn: async (req, res, next) => {
            const posting = await getPosting(req.params.id)
            if (!posting || !posting._id) {
                const error = new Error('No posting found by the given id')
                error.code = 404
                next(error)
            } else if (posting.user._id.toString() !== req.currentUser._id.toString()) {
                const error = new Error('You are not authorized to delete this Posting')
                error.code = 401
                next(error)
            } else {
                next()
            }
        }
    },
    channel: {
        exists: async (req, res, next) => {
            const channel = await getChannel(req.params.id)
            if (!channel || !channel._id) {
                const error = new Error('No Channel found by the given id')
                error.code = 404
                next(error)
            } else {
                next()
            }
        },
        iOwn: async (req, res, next) => {
            const channel = await getChannel(req.params.id)
            if (!channel || !channel._id) {
                const error = new Error('No Channel found by the given id')
                error.code = 404
                next(error)
            } else if (channel.owner._id.toString() !== req.currentUser._id.toString()) {
                const error = new Error('Cannot perform this action since you are not the owner of this Channel')
                error.code = 401
                next(error)
            } else {
                next()
            }
        }
    }
}

module.exports = {auth, service, core}