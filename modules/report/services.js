`use strict`;

const { response } = require('express');
const mongoose = require('mongoose');
const Answer = require('../../lib/database/models/answer');
const Campaign = require('../../lib/database/models/campaign');
const User = require('../../lib/database/models/user');
const { getAllCampaign } = require('../campaign_management/services');

const getHompageDetails = async (customer_id) => {
    try {
        let response = {};
        response.campaign_list = await getAllCampaign(customer_id);
        response.response_rate = await _getResponseRate(customer_id);
        response.source_breakdown = await _getResponseSourceBreakdown(customer_id);
        return response;
    } catch (err) { throw err }
}

const _getResponseRate = async (customer_id) => {
    try {
        let [responeded_user_count] = await Answer.aggregate([
            { "$match": { "customer_id": mongoose.Types.ObjectId(customer_id), "user_id": { $ne: null } } },
            { "$group": { _id: "$user_id" } },
            { "$count": "user_id" }
        ]);
        if (!responeded_user_count || !responeded_user_count.user_id) return 'No Data Avaliable';
        responeded_user_count = responeded_user_count.user_id;
        let [toal_users_in_campaign] = await User.aggregate([
            { "$match": { "customer_id": mongoose.Types.ObjectId(customer_id) } },
            { "$count": "user_id" }
        ]);
        if (!toal_users_in_campaign || !toal_users_in_campaign.user_id) return 'No Data Avaliable';
        toal_users_in_campaign = toal_users_in_campaign.user_id;
        return `${Math.round(responeded_user_count / toal_users_in_campaign * 100)}%`;
    } catch (err) { throw err }
}



const _getResponseSourceBreakdown = async (customer_id) => {
    try {
        let [responeded_by_user_count] = await Answer.aggregate([
            { "$match": { "customer_id": mongoose.Types.ObjectId(customer_id), "user_id": { $ne: null } } },
            { "$count": "user_id" }
        ]);
        responeded_by_user_count["By Email"] = responeded_by_user_count.user_id;
        delete responeded_by_user_count.user_id;
        let [responeded_anonumus_user_count] = await Answer.aggregate([
            { "$match": { "customer_id": mongoose.Types.ObjectId(customer_id), "user_id": null } },
            { "$count": "user_id" }
        ]);
        responeded_anonumus_user_count["Anonumusly"] = responeded_anonumus_user_count.user_id;
        delete responeded_anonumus_user_count.user_id;
        return [responeded_by_user_count, responeded_anonumus_user_count];
    } catch (err) { throw err }
}

module.exports = {
    getHompageDetails
}