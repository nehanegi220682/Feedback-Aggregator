`use strict`;

const express = require('express');
const router_unprotected = express.Router();
const auth_services = require('./services');
const { HTTP_STATUS_CODES, APP_ERROR_CODES } = require('../../universal_constants');

router_unprotected.post('/authorize', async (req, res) => {
    try {
        let token = await auth_services.getAuthenticatedToken(req.body);
        res.cookie('user', token, { httpOnly: true });
        return res.send('Authenticated');
    } catch (err) {
        if (err.code == APP_ERROR_CODES.INFORMATIVE_ERROR)
            return res.status(HTTP_STATUS_CODES.INVALID_INPUT).send(err.message);
        return res.status(HTTP_STATUS_CODES.GENERIC_SERVER_ERROR).send('Something Went Wrong');
    }
});

module.exports = {
    router_unprotected
};
