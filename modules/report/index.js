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

protected_router.get('/campaign_report/:campaign_id', async (req, res) => {
    try {
        let { campaign_id } = req.params;
        if (!campaign_id) throw { message: 'campaign id required' }
        let response = await report_services.getCampaignreport(campaign_id);
        return res.json(response);
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});


module.exports = {
    protected_router
};
