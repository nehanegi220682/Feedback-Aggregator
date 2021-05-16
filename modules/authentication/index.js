`use strict`;

const express = require('express');
const router_unprotected = express.Router();
const auth_services = require('./services');
const { handelHTTPEndpointError } = require('../../lib/error_handling')

router_unprotected.post('/authorize', async (req, res) => {
    try {
        let token = await auth_services.getAuthenticatedToken(req.body);
        res.cookie('customer', token, { httpOnly: true });
        return res.send('Authenticated');
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});

module.exports = {
    router_unprotected
};
