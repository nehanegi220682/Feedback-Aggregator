`use strict`;

const express = require('express');
const protected_router = express.Router();
const product_services = require('./services');
const { handelHTTPEndpointError } = require('../../lib/error_handling');

protected_router.post('/create_product', async (req, res) => {
    try {
        const product = req.body;
        await product_services.createProduct(product, req.customer);
        return res.send('Product created');
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});

protected_router.get('/list_all', async (req, res) => {
    try {
        let all_product = await product_services.getAllProduct(req.customer.id);
        return res.json(all_product);
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});


protected_router.delete('/:product_id', async (req, res) => {
    try {
        await product_services.deleteProduct(req.params.product_id, req.customer.id);
        return res.send('Product Deleted');
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});

module.exports = {
    protected_router
};
