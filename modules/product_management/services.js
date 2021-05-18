`use strict`;

const Product = require('../../lib/database/models/product');
const { APP_ERROR_CODES } = require('../../universal_constants');

const createProduct = async (product, customer) => {
    try {
        await _validateProduct(product);
        await _doesProductExists(product.name,customer.id);
        product = _serializeProduct(product, customer);
        await _saveProduct(product);
    } catch (err) {
        if (err.message) err.code = APP_ERROR_CODES.INFORMATIVE_ERROR;
        throw err;
    }
}

const getAllProduct = async (customer_id) => {
    try {
        let all_products = await Product.find({ customer_id: customer_id });
        if (!all_products) all_products = [];
        all_products = all_products.map(product => {
            return product.toJSON();
        });
        return all_products;
    } catch (err) {
        if (err.message) err.code = APP_ERROR_CODES.INFORMATIVE_ERROR;
        throw err;
    }
}

const deleteProduct = async (product_id, customer_id) => {
    try {
        if (!product_id) throw { message: 'product is required in body' };
        await _isAuthorizedToDeleteProduct(product_id, customer_id);
        await _deleteProduct(product_id);
    } catch (err) {
        if (err.message) err.code = APP_ERROR_CODES.INFORMATIVE_ERROR;
        throw err
    }
}

const _doesProductExists = async (product_name, customer_id) => {
    try {
        let product = await Product.findOne({ name: product_name, customer_id: customer_id });
        if (product) throw { message: 'Product already Exists' };
    } catch (err) { throw err }
}

const _validateProduct = async (product) => {
    try {
        if (!(product && Object.keys(product).length))
            throw { message: 'product is required in body' };
        if (!(product.category && product.name.length))
            throw { message: 'category is a required field' };
        if (!(product.sub_category && product.name.length))
            throw { message: 'sub category Name is a required field' };
    } catch (err) {
        if (err.message) err.code = APP_ERROR_CODES.INFORMATIVE_ERROR;
        throw err;
    }
}

const _serializeProduct = (product, customer) => {
    try {
        product.customer_id = customer.id;
        return product;
    } catch (err) { throw err }
}

const _saveProduct = async (product) => {
    try {
        let new_product = new Product(product);
        await new_product.save();
    } catch (err) { throw err }
}

const _isAuthorizedToDeleteProduct = async (product_id, customer_id) => {
    try {
        let product = await Product.findById({ _id: product_id });
        if (!product) throw { message: 'product not available' };
        if (product.customer_id.id.toString('hex') == customer_id) return true;
        throw { message: 'Unauthorized to delete this product' };
    } catch (err) { throw err }
}

const _deleteProduct = async (product_id) => {
    try {
        let response = await Product.deleteOne({ _id: product_id });
        if (response && response.deletedCount) return;
        throw { message: 'Unable to delete this product' };
    } catch (err) { throw err }
}

module.exports = {
    createProduct,
    getAllProduct,
    deleteProduct
}