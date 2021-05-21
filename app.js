`use strict`;

require('./lib/database/mongo');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const { APP_PORT, SECRET } = require('./universal_constants');
const { isAuthenticatedRequest } = require('./modules/authentication/services');


app.listen(APP_PORT, () => console.log(`Server Running at http://localhost:${APP_PORT}`));

app.use(express.json());
app.use(cookieParser(SECRET));
app.use(express.urlencoded({ extended: true }));

//Unprotected Routes
app.get(['/', '/ping'], (req, res) => res.send('pong!'));
app.use(['/customer'], require('./modules/customer_management/index').router_unprotected);
app.use('/authentication', require('./modules/authentication/index').router_unprotected);

//Protected Routes
app.use('/protected', isAuthenticatedRequest);
app.use(['/protected/user'], require('./modules/user_management/index').protected_router);
app.use(['/protected/product'], require('./modules/product_management/index').protected_router);
app.use(['protected/customer'], require('./modules/customer_management/index').protected_router);
app.use(['/protected/customer'], require('./modules/customer_management/index').protected_router);
app.use(['/protected/campaign'], require('./modules/campaign_management/index').protected_router);

