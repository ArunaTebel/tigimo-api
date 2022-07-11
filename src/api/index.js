const express = require("express");
const router = express.Router();
const postingApi = require('./posting')
const userApi = require('./user')
const channelApi = require('./channel')

router.use('/', postingApi)
router.use('/', userApi)
router.use('/', channelApi)

module.exports = router