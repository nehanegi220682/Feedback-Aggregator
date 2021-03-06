`use strict`;

const mongoose = require('mongoose');
const Answer = require('../../lib/database/models/answer');
const Question = require('../../lib/database/models/question');
const User = require('../../lib/database/models/user');
const { getAllCampaign } = require('../campaign_management/services');

const getHompageDetails = async (customer_id) => {
    try {
        let response = {};
        response.campaign_list = await getAllCampaign(customer_id);
        response.response_rate = await _getOverAllResponseRate(customer_id);
        response.source_breakdown = await _getOverAllResponseSourceBreakdown(customer_id);
        response.response_sentiment_breakdown = await _getOverAllResponseSentimentBreakDown(customer_id);
        response.total_responses = (response.source_breakdown[0] ? response.source_breakdown[0].value : 0) + (response.source_breakdown[1] ? response.source_breakdown[1].value : 0);
        return response;
    } catch (err) { throw err }
}

const getCampaignreport = async (campaign_id) => {
    try {
        let response = {};
        response.response_rate = await _getCampaignResponseRate(campaign_id);
        response.source_breakdown = await _getCampaignResponseSourceBreakdown(campaign_id);
        response.response_sentiment_breakdown = await _getCampaignResponseSentimentBreakDown(campaign_id);
        response.total_responses = (response.source_breakdown[0] ? response.source_breakdown[0].value : 0) + (response.source_breakdown[1] ? response.source_breakdown[1].value : 0);
        return response;
    } catch (err) { throw err }
}

const _getOverAllResponseRate = async (customer_id) => {
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



const _getOverAllResponseSourceBreakdown = async (customer_id) => {
    try {
        let [responeded_by_user_count] = await Answer.aggregate([
            { "$match": { "customer_id": mongoose.Types.ObjectId(customer_id), "user_id": { $ne: null } } },
            { "$count": "user_id" }
        ]);
        if (!responeded_by_user_count) return [];
        let graph_obj_1 = {
            "title": "By Email",
            "value": responeded_by_user_count.user_id,
            "color": "#eaf043"
        };
        let [responeded_anonumus_user_count] = await Answer.aggregate([
            { "$match": { "customer_id": mongoose.Types.ObjectId(customer_id), "user_id": null } },
            { "$count": "user_id" }
        ]);
        if (!responeded_anonumus_user_count) return [];
        let graph_obj_2 = {
            "title": "Anonomusly",
            "value": responeded_anonumus_user_count.user_id,
            "color": "#43f091"
        };
        return [graph_obj_1, graph_obj_2];
    } catch (err) { throw err }
}

const _getOverAllResponseSentimentBreakDown = async (customer_id) => {
    try {
        let all_answers = await _getAllAnswers(customer_id);
        let all_questions = await _getAllQuestions(customer_id);
        let guestion_sentiment_map = _createQuestionSentimentMap(all_questions);
        let bucketed_response = _bucketBySentiment(all_answers, guestion_sentiment_map);
        return bucketed_response;
    } catch (err) { throw err }
}

const _getAllAnswers = async (customer_id) => {
    try {
        let all_answers = await Answer.find({ "customer_id": customer_id });
        all_answers = all_answers.map(ans => {
            ans = ans.toJSON();
            ans.question_id = ans.question_id.toString('hex');
            return ans;
        });
        return all_answers;
    } catch (err) { throw err }
}

const _getAllQuestions = async (customer_id) => {
    try {
        let all_questions = await Question.find({ "customer_id": customer_id });
        all_questions = all_questions.map(que => {
            que = que.toJSON();
            que._id = que._id.toString('hex');
            return que;
        });
        return all_questions;
    } catch (err) { throw err }
}

const _createQuestionSentimentMap = (all_questions) => {
    try {
        let map = {};
        all_questions.forEach(question => {
            map[`${question._id}${question.negative_option}`] = 'negative';
            map[`${question._id}${question.neutral_option}`] = 'neutral';
            map[`${question._id}${question.positive_option}`] = 'positive';
        });
        return map;
    } catch (err) { throw err }
}

const _bucketBySentiment = (all_answers, guestion_sentiment_map) => {
    try {
        let graph_response = [
            { title: 'negative', value: 0, color: '#c13737' },
            { title: 'neutral', value: 0, color: '#eaf043' },
            { title: 'positive', value: 0, color: '#37c14c' }
        ];
        if (!all_answers.length) return [];
        all_answers.forEach(answer => {
            let sentiment = guestion_sentiment_map[`${answer.question_id}${answer.answer}`];
            switch (sentiment) {
                case 'negative': graph_response[0].value++;
                    break;
                case 'neutral': graph_response[1].value++;
                    break;
                case 'positive': graph_response[2].value++;
                    break;
            }
        });
        return graph_response;
    } catch (err) { throw err }
}

const _getCampaignResponseRate = async (campaign_id) => {
    try {
        let [responeded_user_count] = await Answer.aggregate([
            { "$match": { "campaign_id": mongoose.Types.ObjectId(campaign_id), "user_id": { $ne: null } } },
            { "$group": { _id: "$user_id" } },
            { "$count": "user_id" }
        ]);
        if (!responeded_user_count || !responeded_user_count.user_id) return 'No Data Avaliable';
        responeded_user_count = responeded_user_count.user_id;
        let [toal_users_in_campaign] = await User.aggregate([
            { "$match": { "campaign_id": mongoose.Types.ObjectId(campaign_id) } },
            { "$count": "user_id" }
        ]);
        if (!toal_users_in_campaign || !toal_users_in_campaign.user_id) return 'No Data Avaliable';
        toal_users_in_campaign = toal_users_in_campaign.user_id;
        return `${Math.round(responeded_user_count / toal_users_in_campaign * 100)}%`;
    } catch (err) { throw err }
}

const _getCampaignResponseSourceBreakdown = async (campaign_id) => {
    try {
        let [responeded_by_user_count] = await Answer.aggregate([
            { "$match": { "campaign_id": mongoose.Types.ObjectId(campaign_id), "user_id": { $ne: null } } },
            { "$count": "user_id" }
        ]);
        if (!responeded_by_user_count) return [];
        let graph_obj_1 = {
            "title": "By Email",
            "value": responeded_by_user_count.user_id,
            "color": "#eaf043"
        };
        let [responeded_anonumus_user_count] = await Answer.aggregate([
            { "$match": { "campaign_id": mongoose.Types.ObjectId(campaign_id), "user_id": null } },
            { "$count": "user_id" }
        ]);
        if (!responeded_anonumus_user_count) return [];
        let graph_obj_2 = {
            "title": "Anonomusly",
            "value": responeded_anonumus_user_count.user_id,
            "color": "#43f091"
        };
        return [graph_obj_1, graph_obj_2];
    } catch (err) { throw err }
}

const _getCampaignResponseSentimentBreakDown = async (campaign_id) => {
    try {
        let all_answers = await _getAllAnswersFromCampaign(campaign_id);
        let all_questions = await _getAllQuestionsFromCampign(campaign_id);
        let guestion_sentiment_map = _createQuestionSentimentMap(all_questions);
        let bucketed_response = _bucketBySentiment(all_answers, guestion_sentiment_map);
        return bucketed_response;
    } catch (err) { throw err }
}

const _getAllAnswersFromCampaign = async (campaign_id) => {
    try {
        let all_answers = await Answer.find({ "campaign_id": campaign_id });
        all_answers = all_answers.map(ans => {
            ans = ans.toJSON();
            ans.question_id = ans.question_id.toString('hex');
            return ans;
        });
        return all_answers;
    } catch (err) { throw err }
}

const _getAllQuestionsFromCampign = async (campaign_id) => {
    try {
        let all_questions = await Question.find({ "campaign_id": campaign_id });
        all_questions = all_questions.map(que => {
            que = que.toJSON();
            que._id = que._id.toString('hex');
            return que;
        });
        return all_questions;
    } catch (err) { throw err }
}


module.exports = {
    getHompageDetails,
    getCampaignreport
}