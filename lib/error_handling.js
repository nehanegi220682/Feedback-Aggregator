`use strict`;

const { HTTP_STATUS_CODES, APP_ERROR_CODES } = require('../universal_constants');


const handelHTTPEndpointError = (err, res) => {
    if (err.code == APP_ERROR_CODES.INFORMATIVE_ERROR)
        return res.status(HTTP_STATUS_CODES.INVALID_INPUT).send(err.message);
    return res.status(HTTP_STATUS_CODES.GENERIC_SERVER_ERROR).send('Something Went Wrong');
}

module.exports = {
    handelHTTPEndpointError
}