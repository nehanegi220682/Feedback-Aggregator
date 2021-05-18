`use strict`;

const express = require('express');
const router_unprotected = express.Router();
const protected_router = express.Router();
const customer_services = require('./services');
const { handelHTTPEndpointError } = require('../../lib/error_handling')

router_unprotected.post('/create_customer', async (req, res) => {
    try {
        const customer = req.body;
        await customer_services.createCustomer(customer);
        return res.send('Customer created');
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});

protected_router.get('/customer_details', async (req, res) => {
    try {
        let customer_info = await customer_services.getCustomerDetails(req.customer.id);
        return res.json(customer_info);
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});

protected_router.get('/test', (req, res) => {
    res.send('I am protected');
});

module.exports = {
    router_unprotected,
    protected_router
};
