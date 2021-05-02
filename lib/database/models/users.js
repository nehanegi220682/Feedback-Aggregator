const { v4 } = require('uuid');
const { model, Schema } = require('mongoose');

const User = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: false
    },
    encrypted_password: {
        type: String,
        required: true
    },
    jwt_secret: {
        type: String,
        default: v4()
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
}, { versionKey: true });

export const Projection = model('Projection', User, 'projection');
