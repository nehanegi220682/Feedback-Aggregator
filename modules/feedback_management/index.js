`use strict`;

const express = require('express');
const router_unprotected = express.Router();
const { generateForm } = require('./services');
const { handelHTTPEndpointError } = require('../../lib/error_handling');

router_unprotected.get('/load_form', async (req, res) => {
    try {
        let { campaign_id, customer_id, user_id } = req.query;
        let response = await generateForm(campaign_id, customer_id, user_id);
        return res.send(response);
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});


router_unprotected.post('/submit_answers', async (req, res) => {
    try {
        let {campaign_id, customer_id, user_id} = req.query;
        await submitAnswers(campaign_id, customer_id, user_id);
        return res.send('Answer Recorded');
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});

module.exports = {
    router_unprotected
};
