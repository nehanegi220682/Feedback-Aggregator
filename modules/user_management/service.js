`use strict`;

const csv = require('csvtojson');
const { APP_ERROR_CODES } = require('../../universal_constants');


const uploadUsers = async (file, customer, campaign_id) => {
    try {
        _validateBulkSendRequest(file, campaign_id);
        let user_list = await csv().fromFile(file.path);
        if (!user_list.length) throw { message: 'CSV should at least have 1 email' };
        let email_content = await _compileMailContent(campaign_id);
        _sendMailsToAllPeople(user_list, email_content);
        console.log(user_list);
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
    return 'email_body';
}

const _sendMailsToAllPeople = async (user_list, email_content) => {
    try {
        for (let i = 0; user_list.length; i++) {
            //send email
        }
    } catch (err) {
        console.log("Error sending Emails:", err)
    }
}

module.exports = {
    uploadUsers
}

