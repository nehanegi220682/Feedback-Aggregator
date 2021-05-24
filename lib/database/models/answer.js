const { model, Schema } = require('mongoose');

const AnswerSchema = new Schema({
    answer: {
        type: String,
    },
    question_id: {
        type: Schema.Types.ObjectId,
        ref: 'questions'
    },
    campaign_id: {
        type: Schema.Types.ObjectId,
        ref: 'campaigns'
    },
    customer_id: {
        type: Schema.Types.ObjectId,
        ref: 'customers'
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    created: {
        type: Date,
        default: Date.now
    },
    modified: {
        type: Date,
        default: Date.now
    }
});

const Answer = model('Answer', AnswerSchema);

module.exports = Answer;