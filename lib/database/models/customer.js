const { model, Schema } = require('mongoose');

const CustomerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    phone: {
        type: Number,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        require: true
    },
    otp: {
        type: Number
    },
    active_status: {
        type: Boolean,
        default: true
    },
    campaign_limit: {
        type: Number,
        default: 0
    },
    campaign_limit_used: {
        type: Number,
        default: 0
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

const Customer = model('Customers', CustomerSchema);

module.exports = Customer;