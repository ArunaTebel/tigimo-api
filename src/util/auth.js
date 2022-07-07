const config = require("../../config.json");
const {expressjwt: jwt} = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const auth0Config = config.auth0;

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${auth0Config.domain}/.well-known/jwks.json`
    }),

    audience: auth0Config.api.audience,
    issuer: auth0Config.issuer,
    algorithms: ['RS256']
});


module.exports = {checkJwt}
