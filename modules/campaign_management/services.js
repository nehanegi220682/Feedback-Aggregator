`use strict`;

const Campaign = require('../../lib/database/models/campaign');
const Customer = require('../../lib/database/models/customer');
const { APP_ERROR_CODES } = require('../../universal_constants');


const createCampaign = async (campaign, customer) => {
    try {
        await _validateCampaign(campaign);
        let current_usage = await _checkUsageLimit(customer.id);
        campaign = _serializeCustomer(campaign, customer);
        await saveCampaign(campaign);
        await updateUsageCount(current_usage, customer.id);
    } catch (err) {
        if (err.message) err.code = APP_ERROR_CODES.INFORMATIVE_ERROR;
        throw err;
    }
}

const _validateCampaign = async (campaign) => {
    try {
        if (!(campaign && Object.keys(campaign).length))
            throw { message: 'campaign is required in body' };
        if (!(campaign.name && campaign.name.length))
            throw { message: 'Campaign Name is a required field' };
    } catch (err) {
        if (err.message) err.code = APP_ERROR_CODES.INFORMATIVE_ERROR;
        throw err;
    }
}

const _serializeCustomer = (campaign, customer) => {
    try {
        campaign.customer_id = customer.id;
        return campaign;
    } catch (err) { throw err }
}

const saveCampaign = async (campaign) => {
    try {
        let new_campaign = new Campaign(campaign);
        await new_campaign.save();
    } catch (err) { throw err }
}

const _checkUsageLimit = async (customer_id) => {
    try {
        let customer = await Customer.findById({ _id: customer_id });
        if (!customer) throw { message: 'Customer not available' };
        if (customer.campaign_limit_used >= customer.campaign_limit)
            throw { message: 'Campaign Limit Exhausted, Buy more to continue using' };
        return customer.campaign_limit_used;
    } catch (err) { throw err }
}

const updateUsageCount = async (current_usage, customer_id) => {
    try {
        current_usage++;
        await Customer.FindAndModify({ _id: customer_id }, { campaign_limit_used: current_usage });
    } catch (err) { throw err }
}

module.exports = {
    createCampaign
}