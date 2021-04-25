`use strict`;

const express = require('express');
const app = express();
const { APP_PORT, HTTP_STATUS_CODES } = require('./universal_constants');
const { isAuthenticatedRequest } = require('./modules/authentication/services');

app.listen(APP_PORT, () => console.log(`Server Running at http://localhost:${APP_PORT}`));

app.use('/protected', isAuthenticatedRequest);

app.use('/protected', require('./modules/authentication/index'));

app.get(['/', '/ping'], (req, res) => res.send('pong!'));


