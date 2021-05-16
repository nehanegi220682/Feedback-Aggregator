`use strict`;

const express = require('express');
const protected_router = express.Router();
const campaign_services = require('./services');
const { handelHTTPEndpointError } = require('../../lib/error_handling')

protected_router.post('/create_campaign', async (req, res) => {
    try {
        const campaign = req.body;
        await campaign_services.createCampaign(campaign, req.customer);
        return res.send('Campaign created');
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});

protected_router.post('/change_status', async (req, res) => {
    try {
        const new_campaign_status = req.body;
        await campaign_services.toggleCampaignStatus(new_campaign_status, req.customer);
        return res.send(`Campaign Status Changed to :: ${new_campaign_status.status}`);
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});

protected_router.get('/list_all', async (req, res) => {
    try {
        let all_campaign = await campaign_services.getAllCampaign(req.customer.id);
        return res.json(all_campaign);
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});

module.exports = {
    protected_router
};
