const { model, Schema } = require('mongoose');

const UserSchema = new Schema({
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
    jwt_secret: {
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

const User = model('users', UserSchema);

module.exports = User;