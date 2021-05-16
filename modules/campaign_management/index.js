`use strict`;

const express = require('express');
const protected_router = express.Router();
const campaign_services = require('./services');
const { HTTP_STATUS_CODES, APP_ERROR_CODES } = require('../../universal_constants');

protected_router.post('/create_campaign', async (req, res) => {
    try {
        const campaign = req.body;
        await campaign_services.createCampaign(campaign, req.customer);
        return res.send('Campaign created');
    } catch (err) {
        if (err.code == APP_ERROR_CODES.INFORMATIVE_ERROR)
            return res.status(HTTP_STATUS_CODES.INVALID_INPUT).send(err.message);
        return res.status(HTTP_STATUS_CODES.GENERIC_SERVER_ERROR).send('Something Went Wrong');
    }
});

protected_router.post('/change_status', async (req, res) => {
    try {
        const new_campaign_status = req.body;
        await campaign_services.toggleCampaignStatus(new_campaign_status, req.customer);
        return res.send(`Campaign Status Changed to :: ${new_campaign_status.status}`);
    } catch (err) {
        if (err.code == APP_ERROR_CODES.INFORMATIVE_ERROR)
            return res.status(HTTP_STATUS_CODES.INVALID_INPUT).send(err.message);
        return res.status(HTTP_STATUS_CODES.GENERIC_SERVER_ERROR).send('Something Went Wrong');
    }
});

module.exports = {
    protected_router
};
