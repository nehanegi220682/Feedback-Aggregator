`use strict`;

const express = require('express');
const router_unprotected = express.Router();
const protected_router = express.Router();
const user_services = require('./services');
const { HTTP_STATUS_CODES, APP_ERROR_CODES } = require('../../universal_constants');

router_unprotected.post('/create_user', async (req, res) => {
    try {
        const user = req.body;
        await user_services.createUser(user);
        return res.send('User created');
    } catch (err) {
        if (err.code == APP_ERROR_CODES.INFORMATIVE_ERROR)
            return res.status(HTTP_STATUS_CODES.INVALID_INPUT).send(err.message);
        return res.status(HTTP_STATUS_CODES.GENERIC_SERVER_ERROR).send('Something Went Wrong');
    }
});


protected_router.post('/update', (req, res) => {
    res.send('I am protected');
});

module.exports = {
    router_unprotected,
    protected_router
};
