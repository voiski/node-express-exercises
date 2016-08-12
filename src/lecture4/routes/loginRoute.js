'use strict';

const express = require('express');
const router = express.Router();
const log = require('../../../lib/log');
const Auth = require('../../../lib/auth');
const UserDao = require('../../model/userDao');
const HostConfig = require('../hostConfig');
const CORS = require('../../../lib/cors');

const auth = Auth(HostConfig);

router.route('/')
    .post(CORS,function(request, response) {
        const data = request.body;
        log.info(`POST login - ${JSON.stringify(data)}`);
        UserDao.getUserByEmailAndPassword(data, (user) => {

            const token = auth.signToken({
                email: user.email,
                admin: user.role=='admin',
                issuer: user.name
            });

            response.cookie(HostConfig.appName, token)
                .send(`Loged as ${user.name}`);

        }, (errorMsg) => response.status(403).send(errorMsg));
    });

module.exports = router;
