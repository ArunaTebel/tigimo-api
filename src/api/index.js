const express = require("express");
const router = express.Router();
const postingApi = require('./posting')
const userApi = require('./user')

router.use('/', postingApi)
router.use('/', userApi)

module.exports = router