`use strict`;

const Campaign = require('../../lib/database/models/campaign');
const Product = require('../../lib/database/models/product');
const Customer = require('../../lib/database/models/customer');
const Question = require('../../lib/database/models/question');
const { APP_ERROR_CODES } = require('../../universal_constants');


const getSurveyDetails = async (campaign_id) => {
    try {
        if (!campaign_id) throw { message: 'campaign_id is required' }
        let campaign = await _getCampaign(campaign_id);
        let customer = await _getCustomer(campaign.customer_id);
        let product = await _getProduct(campaign.product_id);
        let all_questions = await _getAllQuestions(campaign_id);
        let response = _compileSurvey(product, customer, all_questions, campaign_id);
        return response;
    } catch (err) {
        if (err.message) err.code = APP_ERROR_CODES.INFORMATIVE_ERROR;
        throw err
    }
}

const _getCampaign = async (campaign_id) => {
    try {
        let campaign = await Campaign.findById({ _id: campaign_id });
        if (!campaign) throw { message: 'Campaign not available' };
        return campaign;
    } catch (err) { throw err }
}

const _getProduct = async (product_id) => {
    try {
        let product = await Product.findById({ _id: product_id });
        if (!product) throw { message: 'Product not available' };
        return product;
    } catch (err) { throw err }
}

const _getCustomer = async (customer_id) => {
    try {
        let customer = await Customer.findById({ _id: customer_id });
        if (!customer) throw { message: 'Customer not available' };
        return customer;
    } catch (err) { throw err }
}

const _getAllQuestions = async (campaign_id) => {
    try {
        let all_questions = await Question.find({ campaign_id: campaign_id });
        if (!all_questions) all_questions = [];
        all_questions = all_questions.map(question => {
            return {
                question_id: question.id,
                question: question.question,
                positive_option: question.positive_option,
                negative_option: question.negative_option,
                neutral_option: question.neutral_option,
            }
        });
        return all_questions;
    } catch (err) { throw err }
}

const _compileSurvey = (product, customer, all_questions, campaign_id) => {
    try {
        let response = {};
        response.customer_id = customer.id;
        response.campaign_id = campaign_id;
        response.product_id = product.id;
        response.survey_head = `Please fill your honest Feedback for ${product.name} `;
        response.disclaimer = `This data is collected by ${customer.name}`;
        response.question = all_questions;
        return response;
    } catch (err) { throw err }
}

module.exports = {
    getSurveyDetails
}