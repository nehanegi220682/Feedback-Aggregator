`use strict`;

const express = require('express');
const protected_router = express.Router();
const report_services = require('./services');
const { handelHTTPEndpointError } = require('../../lib/error_handling');

protected_router.get('/homepage', async (req, res) => {
    try {
        let response = await report_services.getHompageDetails(req.customer.id);
        return res.json(response);
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});

module.exports = {
    protected_router
};
