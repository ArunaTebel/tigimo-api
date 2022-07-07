const express = require('express')
const {createUser, getUser} = require("../service/user");
const {checkJwt} = require("../util/auth");
const router = express.Router();

router.post('/users', checkJwt, async (req, res) => {
    await createUser(req.body);
    res.send({message: 'New user created.'});
});

router.get('/user/:id', checkJwt, async (req, res) => {
    res.send(await getUser(req.params.id));
});

module.exports = router