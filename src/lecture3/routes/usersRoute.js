'use strict';

const express = require('express');
const router = express.Router();
const log = require('../../../lib/log');
const User = require('../../model/user.schema');
const UserDao = require('../../model/userDao');

const handler = (response, status) => {
    const _status = status ? status : 200;
    return {
        success: (user) => response.status(_status).send(user),
        error: (errorMsg) => response.status(403).send(errorMsg)
    }
};

router.route('/')
    .post((request, response) => {
        const data = request.body;
        log.info(`POST createUser - id: ${JSON.stringify(data)}`);
        UserDao.createUser(data, handler(response, 201).success, handler(response).error);
    });

router.route('/:userId')
    .get((request, response) => {
        log.info(`GET getUser - id: ${request.params.userId}`);
        UserDao.getUser(request.params.userId, handler(response).success, handler(response).error);
    })
    .delete((request, response) => {
        log.info(`DELETE deleteUser - id: ${request.params.userId}`);
        UserDao.deleteUser(request.params.userId, handler(response).success, handler(response).error);
    })
    .put((request, response) => {
        log.info(`PUT changePassword - id: ${request.params.userId}`);
        const data = request.body;
        data._id = request.params.userId;
        UserDao.changePassword(data, handler(response).success, handler(response).error);
    });

module.exports = router;
