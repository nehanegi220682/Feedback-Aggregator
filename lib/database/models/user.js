const { model, Schema } = require('mongoose');

const UserSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        require: true
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

const User = model('users', UserSchema);

module.exports = User