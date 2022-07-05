const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const {expressjwt: jwt} = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const config = require('config');
const {startDatabase} = require('./src/database/mongo');
const {insertPosting, getPostings, updatePosting, deletePosting} = require('./src/database/postings');

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

const auth0Config = config.get('auth0');

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${auth0Config.domain}/.well-known/jwks.json`
    }),

    audience: auth0Config.api.audience,
    issuer: auth0Config.domain,
    algorithms: ['RS256']
});

app.get('/', async (req, res) => {
    res.send(await getPostings());
});

app.use(checkJwt);

app.post('/', async (req, res) => {
    await insertPosting(req.body);
    res.send({message: 'New posting inserted.'});
});

app.delete('/:id', async (req, res) => {
    await deletePosting(req.params.id);
    res.send({message: 'Posting removed.'});
});

app.put('/:id', async (req, res) => {
    await updatePosting(req.params.id, req.body);
    res.send({message: 'Posting updated.'});
});

startDatabase().then(async () => {
    app.listen(3001, async () => {
        console.log('listening on port 3001');
    });
});

module.exports = app;