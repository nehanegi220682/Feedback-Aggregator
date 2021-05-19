`use strict`;

const Campaign = require('../../lib/database/models/campaign');
const Customer = require('../../lib/database/models/customer');
const Question = require('../../lib/database/models/question');
const { APP_ERROR_CODES } = require('../../universal_constants');


const createCampaign = async (campaign, customer) => {
    try {
        await _validateCampaign(campaign);
        let current_usage = await _checkUsageLimit(customer.id);
        await _doesCampaignExists(campaign.name, customer.id);
        campaign = _serializeCampaign(campaign, customer);
        await _saveCampaign(campaign);
        await _updateUsageCount(current_usage, customer.id, 1);
    } catch (err) {
        if (err.message) err.code = APP_ERROR_CODES.INFORMATIVE_ERROR;
        throw err;
    }
}


const toggleCampaignStatus = async (new_campaign_status, customer) => {
    try {
        _validateToggleInput(new_campaign_status);
        let { campaign_id, status } = new_campaign_status;
        await _isAuthorizedToEditCampaign(campaign_id, customer.id);
        await _updateCampaignStatus(status, campaign_id);
    } catch (err) {
        if (err.message) err.code = APP_ERROR_CODES.INFORMATIVE_ERROR;
        throw err;
    }
}

const getAllCampaign = async (customer_id) => {
    try {
        let all_campaigns = await Campaign.find({ customer_id: customer_id });
        if (!all_campaigns) all_campaigns = [];
        all_campaigns = all_campaigns.map(campaign => {
            return campaign.toJSON();
        });
        return all_campaigns;
    } catch (err) { throw err }
}

const deleteCampaign = async (campaign_id, customer_id) => {
    try {
        if (!campaign_id) throw { message: 'campaign_id is required in params' };
        await _isAuthorizedToEditCampaign(campaign_id, customer_id);
        await _deleteCampaign(campaign_id);
        let current_usage = await _checkUsageLimit(customer_id);
        await _updateUsageCount(current_usage, customer_id, -1);
    } catch (err) {
        if (err.message) err.code = APP_ERROR_CODES.INFORMATIVE_ERROR;
        throw err
    }
}

const addQuestions = async (to_add, customer_id) => {
    try {
        _validateQuestions(to_add);
        await _insertAllQuestions(to_add, customer_id.id)
    } catch (err) {
        if (err.message) err.code = APP_ERROR_CODES.INFORMATIVE_ERROR;
        throw err;
    }
}

const getAllQuestions = async (campaign_id) => {
    try {
        let all_questions = await Question.find({ campaign_id: campaign_id });
        if (!all_questions) all_questions = [];
        all_questions = all_questions.map(question => {
            return question.toJSON();
        });
        return all_questions;
    } catch (err) {
        if (err.message) err.code = APP_ERROR_CODES.INFORMATIVE_ERROR;
        throw err
    }
}


const deleteQuestion = async (question_id, customer_id) => {
    try {
        if (!question_id) throw { message: 'question_id is required in params' };
        await _isAuthorizedToEditQuestion(question_id, customer_id);
        await _deleteQuestion(question_id);
    } catch (err) {
        if (err.message) err.code = APP_ERROR_CODES.INFORMATIVE_ERROR;
        throw err
    }
}

const _validateQuestions = (to_add) => {
    try {
        let { campaign_id, questions } = to_add;
        if (!campaign_id)
            throw { message: 'campaign_id is a required field' };
        if (!questions && questions.length)
            throw { message: 'at least 1 question is required' };
        questions.forEach(question => {
            if (!question.question)
                throw { message: 'Every question should have a text question' };
            if (Object.keys(question).length < 4)
                throw { message: 'Every question should have a least 2 options' };
        });
    } catch (err) {
        throw err;
    }
}

const _insertAllQuestions = async (to_add, customer_id) => {
    try {
        let { campaign_id, questions } = to_add;
        for (let i = 0; i < questions.length; i++) {
            let question = questions[i];
            question.customer_id = customer_id;
            question.campaign_id = campaign_id;
            let new_question = new Question(question);
            await new_question.save();
        }
    } catch (err) { throw err }
}

const _validateToggleInput = (new_campaign_status) => {
    try {
        let { campaign_id, status } = new_campaign_status;
        if (!(new_campaign_status && Object.keys(new_campaign_status).length))
            throw { message: 'campaign is required in body' };
        if (!campaign_id)
            throw { message: 'campaign_id is a required field' };
        if (!status)
            throw { message: 'status id is a required field' };
        if (!(status == 'ACTIVE' || status == 'PAUSED'))
            throw { message: 'Not a valid status' };
    } catch (err) {
        throw err;
    }
}

const _validateCampaign = async (campaign) => {
    try {
        if (!(campaign && Object.keys(campaign).length))
            throw { message: 'campaign is required in body' };
        if (!(campaign.name && campaign.name.length))
            throw { message: 'Campaign Name is a required field' };
        if (!(campaign.product_id && campaign.name.length))
            throw { message: 'Product_id is a required field' };
    } catch (err) {
        if (err.message) err.code = APP_ERROR_CODES.INFORMATIVE_ERROR;
        throw err;
    }
}

const _serializeCampaign = (campaign, customer) => {
    try {
        campaign.customer_id = customer.id;
        return campaign;
    } catch (err) { throw err }
}

const _saveCampaign = async (campaign) => {
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

const _updateUsageCount = async (current_usage, customer_id, to_update) => {
    try {
        current_usage = current_usage + to_update;
        let res = await Customer.findOneAndUpdate({ _id: customer_id }, { campaign_limit_used: current_usage });
        if (!res) throw { message: 'Customer not found' };
    } catch (err) { throw err }
}

const _isAuthorizedToEditCampaign = async (campaign_id, customer_id) => {
    try {
        let campaign = await Campaign.findById({ _id: campaign_id });
        if (!campaign) throw { message: 'campaign not available' };
        if (campaign.customer_id.id.toString('hex') == customer_id) return true;
        throw { message: 'Unauthorized to make changes to this campaign' };
    } catch (err) { throw err }
}


const _isAuthorizedToEditQuestion = async (question_id, customer_id) => {
    try {
        let question = await Question.findById({ _id: question_id });
        if (!question) throw { message: 'question not available' };
        if (question.customer_id.id.toString('hex') == customer_id) return true;
        throw { message: 'Unauthorized to make changes to this question' };
    } catch (err) { throw err }
}

const _updateCampaignStatus = async (status_to_update, campaign_id) => {
    try {
        let res = await Campaign.findOneAndUpdate({ _id: campaign_id }, { campaign_status: status_to_update });
        if (!res) throw { message: 'campaign not available' };
    } catch (err) { throw err }
}

const _deleteCampaign = async (campaign_id) => {
    try {
        let response = await Campaign.deleteOne({ _id: campaign_id });
        if (response && response.deletedCount) return;
        throw { message: 'Unable to delete this campaign' };
    } catch (err) { throw err }
}

const _deleteQuestion = async (question_id) => {
    try {
        let response = await Question.deleteOne({ _id: question_id });
        if (response && response.deletedCount) return;
        throw { message: 'Unable to delete this question' };
    } catch (err) { throw err }
}

const _doesCampaignExists = async (campaign_name, customer_id) => {
    try {
        let campaign = await Campaign.findOne({ name: campaign_name, customer_id: customer_id });
        if (campaign) throw { message: 'campaign already Exists' };
    } catch (err) { throw err }
}

module.exports = {
    addQuestions,
    deleteQuestion,
    createCampaign,
    getAllCampaign,
    deleteCampaign,
    getAllQuestions,
    toggleCampaignStatus
}