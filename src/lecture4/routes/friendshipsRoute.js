'use strict';

const express = require('express');
const router = express.Router();
const log = require('../../../lib/log');
const Friendship = require('../../model/friendship.schema');
const FriendshipDao = require('../../model/friendshipDao');
const UserDao = require('../../model/userDao');
const Auth = require('../../../lib/auth');
const HostConfig = require('../hostConfig');

const handler = (response, status) => {
    return {
        loggedUser: (request, successCB) => {
            UserDao.getUserByEmail(auth.loggedInfo(request).mail, successCB, handler(response).error);
        },
        success: (user) => response.status(status || 200).send(user),
        error: (errorMsg) => response.status(403).send(errorMsg)
    }
};

const auth = Auth(HostConfig);

router.use(auth.isAuthenticated);

router.route('/')
    .get((request, response) => {
        log.info('GET listAllFriendships');
        FriendshipDao.listAllFriendships(handler(response).success, handler(response).error);
    });

router.route('/me')
    .get((request, response) => {
        log.info('GET listAllMyFriendships');
        handler(response).loggedUser(request, (user) => {
            FriendshipDao.listAllMyFriendships(user._id, handler(response).success, handler(response).error);
        });
    });

router.route('/:friendId')
    .get((request, response) => {
        log.info(`GET getFriendshipByUserId - id: ${request.params.friendId}`);
        handler(response).loggedUser(request, (user) => {
            FriendshipDao.getFriendshipByUserId(user._id, request.params.friendId, handler(response).success, handler(response).error);
        });
    })
    .post((request, response) => {
        log.info(`POST createFriendship - id: ${request.params.friendId}`);
        handler(response).loggedUser(request, (user) => {
            FriendshipDao.getFriendshipByUserId(user._id, request.params.friendId, (friendship) => {
                switch (friendship.status) {
                    case Friendship.statusType.NEW:
                        handler(response).error("Request already exist and is pending!");
                        break;
                    case Friendship.statusType.ACCEPT:
                        handler(response).error("You already are friends!");
                        break;
                    case Friendship.statusType.REVOKE:
                        FriendshipDao.updateFriendshipPropertiesById(friendship._id, {
                            status: Friendship.statusType.NEW,
                            userRequester: user._id,
                            userRequested: request.params.friendId
                        }, handler(response).success, handler(response).error);
                        break;
                    default:
                        handler(response).error("Invalid friendship situation!");
                }
            }, (msg) => {
                FriendshipDao.createFriendship(user._id, request.params.friendId, handler(response).success, handler(response).error);
            });
        });
    })
    .put((request, response) => {
        log.info(`PUT acceptFriend - id: ${request.params.friendId}`);
        handler(response).loggedUser(request, (user) => {
            FriendshipDao.getFriendshipByUserId(request.params.friendId, user._id, (friendship) => {
                if (friendship.status != Friendship.statusType.NEW) {
                    handler(response).error("Invalid friendship situation!");
                } else if (friendship.userRequested != user._id) {
                    handler(response).error("You can't accept your own friendship request!");
                } else {
                    FriendshipDao.updateFriendshipStatus(friendship._id, Friendship.statusType.ACCEPT, handler(response).success, handler(response).error);
                }
            }, handler(response).error);
        });
    })
    .delete((request, response) => {
        log.info(`DELETE rejectFriend - id: ${request.params.friendId}`);
        handler(response).loggedUser(request, (user) => {
            FriendshipDao.getFriendshipByUserId(request.params.friendId, user._id, (friendship) => {
                const status = friendship.userRequested == user._id ? Friendship.statusType.REJECT : Friendship.statusType.REVOKE;
                FriendshipDao.updateFriendshipStatus(friendship._id, status, handler(response).success, handler(response).error);
            }, handler(response).error);
        });
    });

router.route('/:friendId/block')
    .get((request, response) => {
        log.info(`GET block/unblock - id: ${request.params.friendId}`);
        handler(response).loggedUser(request, (user) => {
            const blockUnblock = (friendship) => {
                let options;
                if (friendship.status == Friendship.statusType.BLOCK) {
                    options = {
                        status: Friendship.statusType.REVOKE,
                        blockUserRequester: null,
                        blockUserRequested: null
                    }
                } else {
                    options = {
                        status: Friendship.statusType.BLOCK,
                        blockUserRequester: user._id,
                        blockUserRequested: request.params.friendId
                    }
                }
                FriendshipDao.updateFriendshipPropertiesById(friendship._id, options, handler(response).success, handler(response).error);
            }
            FriendshipDao.getFriendshipByUserId(request.params.friendId, user._id, blockUnblock, (msg) => {
                FriendshipDao.createFriendship(user._id, request.params.friendId, blockUnblock, handler(response).error);
            });
        });
    })

module.exports = router;
