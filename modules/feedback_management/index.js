`use strict`;

const express = require('express');
const router_unprotected = express.Router();
const { handelHTTPEndpointError } = require('../../lib/error_handling');

router_unprotected.get('/:campaign_id', async (req, res) => {
    try {
        let { campaign_id } = req.params;
        return res.send('survey');
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});

module.exports = {
    router_unprotected
};
