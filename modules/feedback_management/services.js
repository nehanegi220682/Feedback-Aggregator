`use strict`;

const Campaign = require('../../lib/database/models/campaign');
const Product = require('../../lib/database/models/product');
const Customer = require('../../lib/database/models/customer');
const Question = require('../../lib/database/models/question');
const { APP_ERROR_CODES } = require('../../universal_constants');
const { MASTER_TEMPLATE, QUESTION_TEMPLATE, OPTIONS_TEMPLATE } = require('../../html_templates/feedback_form');


const generateForm = async (campaign_id, customer_id, user_id) => {
    try {
        if (!campaign_id) throw { message: 'campaign_id is required' }
        let data_for_form = await _getRelevantData(campaign_id);
        let html = _generateHTML(data_for_form, user_id);
        return html;
    } catch (err) {
        if (err.message) err.code = APP_ERROR_CODES.INFORMATIVE_ERROR;
        throw err
    }
}

const submitAnswers = async (campaign_id, customer_id, user_id) => {
    try {

    } catch (err) { throw err }
}

const _generateHTML = (data_for_form, user_id) => {
    try {
        let questions_html = '';
        let temp_questions_template = QUESTION_TEMPLATE;
        let submit_answers_URL = _generateSubmitAnswersUrl(data_for_form.customer_id, data_for_form.campaign_id, user_id);
        data_for_form.questions.forEach(question => {
            let options_html = '';
            let temp_option_template = OPTIONS_TEMPLATE;
            if (question.positive_option) {
                options_html = `${options_html} ${temp_option_template.replace('$$option$$', question.positive_option)}`;
                options_html = options_html.replace('$$question_id$$',question.question_id);
            }
            if (question.neutral_option) {
                options_html = `${options_html} ${temp_option_template.replace('$$option$$', question.neutral_option)}`;
                options_html = options_html.replace('$$question_id$$',question.question_id);
            }
            if (question.negative_option) {
                options_html = `${options_html} ${temp_option_template.replace('$$option$$', question.negative_option)}`;
                options_html = options_html.replace('$$question_id$$',question.question_id);
            }
            questions_html = `${questions_html} ${temp_questions_template.replace('$$question$$', question.question)}`;
            questions_html = questions_html.replace('$$options$$', options_html);
        });
        let temp_master_html = MASTER_TEMPLATE;
        temp_master_html = temp_master_html.replace('$$questions$$', questions_html);
        temp_master_html = temp_master_html.replace('$$survey_head$$',data_for_form.survey_head);
        temp_master_html = temp_master_html.replace('$$disclaimer$$',data_for_form.disclaimer);
        temp_master_html = temp_master_html.replace('$$collect_answers_link$$',submit_answers_URL);
        return temp_master_html;
    } catch (err) { throw err }
}

const _generateSubmitAnswersUrl = (customer_id, campaign_id, user_id) => {
    return `http://${process.env.FE_URL}/feedback/submit_answers?customer_id=${customer_id}&campaign_id=${campaign_id}&user_id=${user_id}`;
}


const _getRelevantData = async (campaign_id) => {
    try {
        let campaign = await _getCampaign(campaign_id);
        let customer = await _getCustomer(campaign.customer_id);
        let product = await _getProduct(campaign.product_id);
        let all_questions = await _getAllQuestions(campaign_id);
        let response = _compileSurvey(product, customer, all_questions, campaign_id);
        return response;
    } catch (err) { throw err }
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
        response.questions = all_questions;
        return response;
    } catch (err) { throw err }
}

module.exports = {
    generateForm,
    submitAnswers
}