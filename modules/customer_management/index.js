`use strict`;

const express = require('express');
const router_unprotected = express.Router();
const protected_router = express.Router();
const customer_services = require('./services');
const { HTTP_STATUS_CODES, APP_ERROR_CODES } = require('../../universal_constants');

router_unprotected.post('/create_customer', async (req, res) => {
    try {
        const customer = req.body;
        await customer_services.createCustomer(customer);
        return res.send('Customer created');
    } catch (err) {
        if (err.code == APP_ERROR_CODES.INFORMATIVE_ERROR)
            return res.status(HTTP_STATUS_CODES.INVALID_INPUT).send(err.message);
        return res.status(HTTP_STATUS_CODES.GENERIC_SERVER_ERROR).send('Something Went Wrong');
    }
});


protected_router.get('/test', (req, res) => {
    res.send('I am protected');
});

module.exports = {
    router_unprotected,
    protected_router
};
