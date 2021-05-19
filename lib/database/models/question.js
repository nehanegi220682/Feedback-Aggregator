const { model, Schema } = require('mongoose');

const QuestionSchema = new Schema({
    question: {
        type: String,
    },
    positive_option: {
        type: String
    },
    negative_option: {
        type: String
    },
    neutral_option: {
        type: String
    },
    campaign_id: {
        type: Schema.Types.ObjectId,
        ref: 'campaigns'
    },
    customer_id: {
        type: Schema.Types.ObjectId,
        ref: 'customers'
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

const Question = model('Questions', QuestionSchema);

module.exports = Question;