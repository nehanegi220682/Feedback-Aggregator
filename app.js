`use strict`;

require('./lib/database/mongo');
const express = require('express');
const app = express();
const { APP_PORT, HTTP_STATUS_CODES } = require('./universal_constants');
const { isAuthenticatedRequest } = require('./modules/authentication/services');


app.listen(APP_PORT, () => console.log(`Server Running at http://localhost:${APP_PORT}`));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//Unprotected Routes
app.get(['/', '/ping'], (req, res) => res.send('pong!'));
app.use(['/user'], require('./modules/user_management/index').router_unprotected);
app.use('/authentication', require('./modules/authentication/index').router_unprotected);

//Protected Routes
app.use('/protected', isAuthenticatedRequest);
app.use(['/protected/user'], require('./modules/user_management/index').protected_router);



