'use strict';

const express = require('express');
const router = express.Router();
const log = require('../../../lib/log');
const UserDao = require('../../model/userDao');

router.route('/')
    .get(function(request, response) {
      const userName = request.query.q;
      log.info(`GET searchUsersByName - ${userName}`);
      if(userName){
        UserDao.searchUsersByName(userName,(users)=> response.send(users));
      }else{
        UserDao.listAllUsers((users)=> response.send(users));
      }
    });

module.exports = router;
