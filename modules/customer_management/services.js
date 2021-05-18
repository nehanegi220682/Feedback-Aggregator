`use strict`;
const { v4 } = require('uuid');
const crypto = require('crypto');
const Customer = require('../../lib/database/models/customer');
const { APP_ERROR_CODES } = require('../../universal_constants');


const createCustomer = async (customer) => {
    try {
        await _validateCustomer(customer);
        let _serializedCustomer = _serializeCustomer(customer);
        await saveCustomer(_serializedCustomer);
    } catch (err) { throw err }
}

const getCustomerDetails = async (customer_id) => {
    try {
        let customer = await Customer.findOne({ _id: customer_id });
        if (!customer) throw { message: 'Customers not found' };
        customer = customer.toJSON();
        delete customer.password;
        delete customer.salt;
        return customer;
    } catch (err) { throw err }
}

const _validateCustomer = async (customer) => {
    try {
        if (!(customer && Object.keys(customer).length))
            throw { message: 'Customers is required in body' };
        if (!(customer.name && customer.name.length))
            throw { message: 'Customers Name is a required field' };
        if (!(customer.email && customer.email.length))
            throw { message: 'Email is a required field' };
        if (!_validateEmail(customer.email))
            throw { message: 'Not a valid email Address' };
        if (!(customer.password && customer.password.length))
            throw { message: 'Password is a required field' };
        if (!_validatePassword(customer.password))
            throw { message: 'Password should contain at least 1 lowercase 1 uppercase 1 numeric 1 special and 8 in total characters' };
        if (customer.phone && !_validatePhoneNumber(customer.phone))
            throw { message: 'Invalid Phone No (Valid entry 10 digits without country code )' };
    } catch (err) {
        if (err.message) err.code = APP_ERROR_CODES.INFORMATIVE_ERROR;
        throw err;
    }
}

const _serializeCustomer = (customer) => {
    try {
        customer.salt = v4();
        customer.password = crypto.pbkdf2Sync(customer.password, customer.salt, 10000, 64, 'sha512').toString('hex');
        return customer;
    } catch (err) { throw err }
}

const _validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const _validatePhoneNumber = (phone) => {
    return phone.match(/^\d{10}$/g);
}

const _validatePassword = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    return strongRegex.test(password);
}

const saveCustomer = async (serializedCustomer) => {
    try {
        let customer = new Customer(serializedCustomer);
        await customer.save();
    } catch (err) {
        if (err.message.includes('E11000'))
            throw {
                code: APP_ERROR_CODES.INFORMATIVE_ERROR,
                message: 'Email is already registered'
            }
        throw err;
    }
}

module.exports = {
    createCustomer,
    getCustomerDetails
}