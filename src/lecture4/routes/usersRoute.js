'use strict';

const express = require('express');
const router = express.Router();
const log = require('../../../lib/log');
const User = require('../../model/user.schema');
const UserDao = require('../../model/userDao');
const Auth = require('../../../lib/auth');
const HostConfig = require('../hostConfig');
const CORS = require('../../../lib/cors');

const handler = (response, status) => {
    const _status = status ? status : 200;
    return {
        success: (user) => response.status(_status).send(user),
        error: (errorMsg) => response.status(403).send(errorMsg)
    }
};

const auth = Auth(HostConfig);

router.use(auth.isAuthenticated);

router.route('/')
    .post((request, response) => {
        const data = request.body;
        log.info(`POST createUser - id: ${JSON.stringify(data)}`);
        UserDao.createUser(data, handler(response, 201).success, handler(response).error);
    })
    .get(CORS,(request,response) => {
        log.info('GET listAllUsers');
        UserDao.listAllUsers(handler(response).success, handler(response).error);
    });

router.route('/:userId')
    .get((request, response) => {
        log.info(`GET getUser - id: ${request.params.userId}`);
        UserDao.getUser(request.params.userId, handler(response).success, handler(response).error);
    })
    .delete((request, response) => {
        log.info(`DELETE deleteUser - id: ${request.params.userId}`);
        if (auth.loggedInfo(request).admin) {
            UserDao.deleteUser(request.params.userId, handler(response).success, handler(response).error);
        } else {
            handler(response).error("You need to be a Admin!");
        }
    })
    .put((request, response) => {
        log.info(`PUT changePassword - id: ${request.params.userId}`);
        UserDao.getUser(request.params.userId, (user) => {
            if (user.email == auth.loggedInfo(request).email) {
                const data = request.body;
                data._id = request.params.userId;
                UserDao.changePassword(data, handler(response).success, handler(response).error);
            } else {
                handler(response).error("You are different user!");
            }
        }, handler(response).error);
    });

module.exports = router;
