'use strict';

const express = require('express');
const router = express.Router();
const log = require('../../../lib/log');
const Auth = require('../../../lib/auth');
const UserDao = require('../../model/userDao');
const HostConfig = require('../hostConfig');
const CORS = require('../../../lib/cors');

const auth = Auth(HostConfig);

router.use(auth.isAuthenticated);

router.route('/')
    .get(CORS,function(request, response) {
        const loggedUser = auth.loggedInfo(request);
        response.send(loggedUser);
    });

module.exports = router;
