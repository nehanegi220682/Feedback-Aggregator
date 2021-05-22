`use strict`;

const express = require('express');
const router_unprotected = express.Router();
const { getSurveyDetails } = require('./services');
const { handelHTTPEndpointError } = require('../../lib/error_handling');

router_unprotected.get('/:campaign_id', async (req, res) => {
    try {
        let { campaign_id } = req.params;
        let response = await getSurveyDetails(campaign_id);
        return res.json(response);
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});

module.exports = {
    router_unprotected
};
