const express = require('express')
const axios = require('axios');
const {createAccount} = require("../service/user");
const router = express.Router();
const config = require("../../config.json");
const {auth} = require("../util/middleware");

router.post('/users/me', auth.checkJwt, async (req, res) => {
    try {
        const userInfo = await axios({
            url: `${config.auth0.domain}/userinfo`,
            headers: {'Authorization': req.headers.authorization}
        });
        const user = userInfo.data;
        if (req.auth.sub === user.sub) {
            await createAccount(user);
            res.send({
                success: true,
                message: 'New user account created.'
            });
        } else {
            res.status(400).send({
                success: false,
                message: 'Authentication details mismatch.'
            });
        }
    } catch (e) {
        res.status(400).send({error: e.message});
    }
});

module.exports = router