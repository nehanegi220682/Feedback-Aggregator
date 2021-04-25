`use strict`;

const { HTTP_STATUS_CODES } = require('../../universal_constants');

const _isAuthenticated = async () => {
    try {
        return true;//allow all
    } catch (err) { throw err }
}

const isAuthenticatedRequest = async (req, res, next) => {
    try {
        if (await _isAuthenticated()) return next();
        else return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).send('Unauthorized');
    } catch (err) {
        res.status(HTTP_STATUS_CODES.GENERIC_SERVER_ERROR).send('Something went wrong :(');
    }
}

module.exports = {
    isAuthenticatedRequest
}