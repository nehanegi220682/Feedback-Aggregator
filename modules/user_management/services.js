`use strict`;
const { v4 } = require('uuid');
const crypto = require('crypto');
const User = require('../../lib/database/models/users');
const { APP_ERROR_CODES } = require('../../universal_constants');


const createUser = async (user) => {
    try {
        await _validateUser(user);
        let _serializedUser = _serializeUser(user);
        await saveUser(_serializedUser);
    } catch (err) { throw err }
}

const _validateUser = async (user) => {
    try {
        if (!(user && Object.keys(user).length))
            throw { message: 'User is required in body' };
        if (!(user.name && user.name.length))
            throw { message: 'User Name is a required field' };
        if (!(user.email && user.email.length))
            throw { message: 'Email is a required field' };
        if (!_validateEmail(user.email))
            throw { message: 'Not a valid email Address' };
        if (!(user.password && user.password.length))
            throw { message: 'Password is a required field' };
        if (!_validatePassword(user.password))
            throw { message: 'Password should contain at least 1 lowercase 1 uppercase 1 numeric 1 special and 8 in total characters' };
        if (user.phone && !_validatePhoneNumber(user.phone))
            throw { message: 'Invalid Phone No (Valid entry 10 digits without country code )' };
    } catch (err) {
        if (err.message) err.code = APP_ERROR_CODES.INFORMATIVE_ERROR;
        throw err;
    }
}

const _serializeUser = (user) => {
    try {
        user.salt = v4();
        user.password = crypto.pbkdf2Sync(user.password, user.salt, 10000, 64, 'sha512').toString('hex');
        return user;
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

const saveUser = async (serializedUser) => {
    try {
        let user = new User(serializedUser);
        await user.save();
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
    createUser
}