`use strict`;

const csv = require('csvtojson');
const { sendEmail } = require('../../lib/email');
const User = require('../../lib/database/models/user');
const Product = require('../../lib/database/models/product');
const Campaign = require('../../lib/database/models/campaign');
const { APP_ERROR_CODES } = require('../../universal_constants');



const uploadUsers = async (file, customer, campaign_id) => {
    try {
        _validateBulkSendRequest(file, campaign_id);
        let user_list = await csv().fromFile(file.path);
        if (!user_list.length) throw { message: 'CSV should at least have 1 email' };
        let email_content = await _compileMailContent(customer, campaign_id);
        _sendMailsToAllPeople(user_list, email_content, customer.id, campaign_id);
    } catch (err) {
        if (err.message) err.code = APP_ERROR_CODES.INFORMATIVE_ERROR;
        throw err;
    }
}

const _validateBulkSendRequest = (file, campaign_id) => {
    try {
        if (!(file && Object.keys(file).length))
            throw { message: 'CSV file containing email and password should be sent' };
        if (!campaign_id)
            throw { message: 'campaign_id is a required field' };
        if (!file.path)
            throw { message: 'CSV file containing email and password should be sent' };
    } catch (err) {
        throw err;
    }
}

const _compileMailContent = async (customer, campaign_id) => {
    try {
        let campaign_details = await _getCampaignDetail(campaign_id);
        let product_details = await _getProductDetail(campaign_details.product_id);
        let mail_content = _getMailContent(customer.name, product_details.name);
        return mail_content;
    } catch (err) { throw err }
}

const _getCampaignDetail = async (campaign_id) => {
    try {
        let campaign = await Campaign.findOne({ _id: campaign_id });
        if (!campaign) throw { message: 'campaign not available' };
        campaign = campaign.toJSON();
        return campaign;
    } catch (err) { throw err }
}

const _getProductDetail = async (product_id) => {
    try {
        let product = await Product.findOne({ _id: product_id });
        if (!product) throw { message: 'product not available' };
        product = product.toJSON();
        return product;
    } catch (err) { throw err }
}

const _getMailContent = (customer_name, product_name) => {
    try {
        let email_body = `
        Hi $$NAME$$,
        Hope you are doing, ${customer_name} want's to hear from you 
        regarding ${product_name} and your experience it.
        Your feedback is incredibly valuable.
        Please take 2 min time to fill this feedback form by clicking hear $$link$$.
        `
        return email_body;
    } catch (err) { throw err }
}

const _sendMailsToAllPeople = async (user_list, email_content, customer_id, campaign_id) => {
    try {
        for (let i = 0; user_list.length; i++) {
            let user = user_list[i];
            if (user.email) {
                try {
                    let user_id = await _addUser(user.email, user.name, customer_id, campaign_id);
                    email_content = user.name ? email_content.replace('$$NAME$$', user.name) : email_content.replace('$$NAME$$', '');
                    await sendEmail('We value your Feedback', email_content, user.email);
                } catch (err) {
                    console.log(`Error sending Email to ${user.email} failed because of Error: ${err}`);
                }
            }
        }
    } catch (err) {
        console.log("Error sending Emails:", err)
    }
}

const _addUser = async (email, name = 'No Name', customer_id, campaign_id) => {
    try {
        let user = {
            email,
            name,
            campaign_id,
            customer_id
        }
        let new_user = new User(user);
        await new_user.save();
        return new_user.id;
    } catch (err) { throw err }
}

module.exports = {
    uploadUsers
}

