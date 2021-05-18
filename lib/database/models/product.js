const { model, Schema } = require('mongoose');

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    customer_id: {
        type: Schema.Types.ObjectId,
        ref: 'customers',
    },
    category: {
        type: String,
        required: true
    },
    sub_category: {
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

const Product = model('Products', ProductSchema);

module.exports = Product;