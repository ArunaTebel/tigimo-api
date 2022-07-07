const express = require("express");
const router = express.Router();
const postingApi = require('./posting')

router.use('/', postingApi)

module.exports = router