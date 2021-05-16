`use strict`;

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Customer = require('../../lib/database/models/customer');
const { HTTP_STATUS_CODES, APP_ERROR_CODES, SECRET } = require('../../universal_constants');

const _isAuthenticated = async (req) => {
    try {
        let { customer } = req.cookies;
        let decode_customer = jwt.verify(customer, SECRET);
        req.customer = decode_customer;
        return true;
    } catch (err) { return false; }
}

const isAuthenticatedRequest = async (req, res, next) => {
    try {
        if (await _isAuthenticated(req)) return next();
        else return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).send('Unauthorized');
    } catch (err) {
        res.status(HTTP_STATUS_CODES.GENERIC_SERVER_ERROR).send('Something went wrong :(');
    }
}

const getAuthenticatedToken = async (data) => {
    try {
        let { email, password } = data;
        if (!email) throw { message: 'Email is a required field' };
        if (!password) throw { message: 'Password is a required field' }
        let secret_data = await getCustomerInfoFromDB(email);
        if (!validPassword(password, secret_data)) throw { message: 'Invalid email or Password' }
        return getToken(secret_data);
    } catch (err) {
        if (err.message) err.code = APP_ERROR_CODES.INFORMATIVE_ERROR;
        throw err
    }
}

const getToken = (customer_data) => {
    try {
        let token = jwt.sign({
            name: customer_data.name,
            email: customer_data.email,
            id: customer_data.id
        }, SECRET, { expiresIn: '1h' });
        return token;
    } catch (err) { throw err }
}

const getCustomerInfoFromDB = async (email) => {
    try {
        let data = await Customer.findOne({ email: email });
        if (!data) throw { message: 'Invalid email or Password' }
        return data;
    } catch (err) { throw err }
}

const validPassword = (customer_password, secret_data) => {
    try {
        hashed_password = crypto.pbkdf2Sync(customer_password, secret_data.salt, 10000, 64, 'sha512').toString('hex');
        if (hashed_password == secret_data.password) return true;
        return false;
    } catch (err) { throw err }
}

module.exports = {
    isAuthenticatedRequest,
    getAuthenticatedToken
}