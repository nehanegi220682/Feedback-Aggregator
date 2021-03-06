const { model, Schema } = require('mongoose');

const CampaignSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    customer_id: {
        type: Schema.Types.ObjectId,
        ref: 'customers'
    },
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'products'
    },
    campaign_status: {
        type: String,
        enum: ['ACTIVE', 'IN_ACTIVE'],
        default: 'IN_ACTIVE'
    },
    campaign_moderation_status: {
        type: String,
        enum: ['UN_RAISED', 'IN-PROGRESS', 'DECLINED'],
        default: 'UN_RAISED'
    },
    default_url: {
        type: String,
        required: true
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

const Campaign = model('Campaigns', CampaignSchema);

module.exports = Campaign;