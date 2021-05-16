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