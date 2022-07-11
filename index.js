const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const {connectToDb} = require('./src/util/db');
const api = require('./src/api')
const {core} = require("./src/util/middleware");

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}
app.use('/api', api)
app.use(core.apiErrorHandler)

connectToDb().then(async () => {
    app.listen(3001, async () => {
        if (process.env.NODE_ENV !== 'test') {
            console.log('listening on port 3001');
        }
    });
});

module.exports = app;