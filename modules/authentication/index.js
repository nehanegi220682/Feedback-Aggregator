`use strict`;

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Protected Link!')
});

router.get('/test2', (req, res) => {
    res.send('Hello World2!')
});

router.get('/test1', (req, res) => {
    res.send('Hello World1!')
});

module.exports = router;