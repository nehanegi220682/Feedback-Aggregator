`use strict`;

const multer = require('multer')
const express = require('express');
const protected_router = express.Router();
const { uploadUsers } = require('./service');
const { handelHTTPEndpointError } = require('../../lib/error_handling');

let upload = multer({ dest: '/tmp/' });

protected_router.post('/send_bulk_Emails', upload.single('csv'), async (req, res) => {
    try {
        let { campaign_id } = req.body;
        await uploadUsers(req.file, req.customer, campaign_id);
        return res.send('Uploaded');
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});

module.exports = {
    protected_router
};
