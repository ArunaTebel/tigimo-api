const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const {startDatabase} = require('./src/util/db');
const api = require('./src/api')

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

app.use('/api', api)

startDatabase().then(async () => {
    app.listen(3001, async () => {
        console.log('listening on port 3001');
    });
});

module.exports = app;