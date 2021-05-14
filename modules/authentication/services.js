`use strict`;

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../../lib/database/models/users');
const { HTTP_STATUS_CODES, APP_ERROR_CODES, SECRET } = require('../../universal_constants');

const _isAuthenticated = async (req) => {
    try {
        let { user } = req.cookies;
        let decode_user = jwt.verify(user, SECRET);
        req.user = decode_user;
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
        let secret_data = await getUserInfoFromDB(email);
        if (!validPassword(password, secret_data)) throw { message: 'Invalid email or Password' }
        return getToken(secret_data);
    } catch (err) {
        if (err.message) err.code = APP_ERROR_CODES.INFORMATIVE_ERROR;
        throw err
    }
}

const getToken = (user_data) => {
    try {
        let token = jwt.sign({
            name: user_data.name,
            email: user_data.email
        }, SECRET, { expiresIn: '1h' });
        return token;
    } catch (err) { throw err }
}

const getUserInfoFromDB = async (email) => {
    try {
        let data = await User.findOne({ email: email });
        if (!data) throw { message: 'Invalid email or Password' }
        return data;
    } catch (err) { throw err }
}

const validPassword = (user_password, secret_data) => {
    try {
        hashed_password = crypto.pbkdf2Sync(user_password, secret_data.salt, 10000, 64, 'sha512').toString('hex');
        if (hashed_password == secret_data.password) return true;
        return false;
    } catch (err) { throw err }
}

module.exports = {
    isAuthenticatedRequest,
    getAuthenticatedToken
}