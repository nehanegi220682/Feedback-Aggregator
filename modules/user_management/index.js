`use strict`;

const express = require('express');
const router_unprotected = express.Router();
const protected_router = express.Router();

router_unprotected.post('/create_user', (req, res) => {
    res.send('dummy User created');
});


protected_router.post('/update', (req, res) => {
    res.send('I am protected');
});

module.exports = {
    router_unprotected,
    protected_router
};