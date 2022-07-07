const express = require('express')
const {getPostings, insertPosting, deletePosting, updatePosting, getPosting} = require("../service/posting");
const {checkJwt} = require("../util/auth");
const router = express.Router();

router.get(`/postings`, async (req, res) => {
    res.send(await getPostings());
});

router.post('/postings', checkJwt, async (req, res) => {
    await insertPosting(req.body);
    res.send({message: 'New posting inserted.'});
});

router.get('/posting/:id', checkJwt, async (req, res) => {
    res.send(await getPosting(req.params.id));
});

router.delete('/posting/:id', checkJwt, async (req, res) => {
    await deletePosting(req.params.id);
    res.send({message: 'Posting removed.'});
});

router.put('/posting/:id', checkJwt, async (req, res) => {
    await updatePosting(req.params.id, req.body);
    res.send({message: 'Posting updated.'});
});

module.exports = router