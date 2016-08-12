const Friendship = require('./friendship.schema');
const extend = require('util')._extend;
const friendships = [{
    _id: 0,
    status: 1,
    userRequested: 0,
    userRequester: 1
}, {
    _id: 1,
    status: 0,
    userRequested: 0,
    userRequester: 2
}, {
    _id: 2,
    status: 0,
    blockUserRequested: 2,
    blockUserRequester: 1
}];

/**
 * Friendship Data Access Object class. This class is responsible to deal with all friendship's operation
 */
const FriendshipDAO = function() {

    /**
     * Get friendship by ID.
     * @param id {Number} number that represents friendship ID
     * @param successCB {Function} callback function to be executed if the method executes without error
     * @param failCB {Function} callback function to be executed if an error occurs
     */
    this.getFriendship = function(id, successCB, failCB) {
        const friendship = friendships.find((friendship) => {
            return friendship._id == id
        });
        friendship && successCB(friendship) ||
            failCB('There is no friendship with ID #' + id + ' in the Database.');
    };

    /**
     * Search for friendships by user id.
     * @param userId {String} number that represents Requester user ID
     * @param friendId {String} number that represents Requested user ID
     * @param successCB {Function} callback function to be executed if the method executes without error
     * @param failCB {Function} callback function to be executed if an error occurs
     */
    this.getFriendshipByUserId = function(userId, friendId, successCB, failCB) {
        successCB(
            friendships.filter((friendship) => {
                return friendship.userRequester == userId &&
                      friendship.userRequested == friendId ||
                      friendship.userRequester == friendId &&
                      friendship.userRequested == userId;
            })
        );
    };

    /**
     * List all friendships in the friendships array.
     * @param successCB {Function} callback function to be executed if the method executes without error
     * @param failCB {Function} callback function to be executed if an error occurs
     */
    this.listAllFriendships = function(successCB, failCB) {
        successCB(friendships);
    };

    /**
     * List all friendships in the friendships array.
     * @param userId {String} number that represents Requested/Requester user ID
     * @param successCB {Function} callback function to be executed if the method executes without error
     * @param failCB {Function} callback function to be executed if an error occurs
     */
    this.listAllMyFriendships = function(userId, successCB, failCB) {
        successCB(
            friendships.filter((friendship) => {
                return friendship.status == 1 && (
                    friendship.userRequester == userId ||
                    friendship.userRequested == userId
                );
            })
        );
    };

    /**
     * Create a new friendship
     * @param userId {String} number that represents Requester user ID
     * @param friendId {String} number that represents Requested user ID
     * @param successCB {Function} callback function to be executed if the method executes without error
     * @param failCB {Function} callback function to be executed if an error occurs
     */
    this.createFriendship = function(userId, friendId, successCB, failCB) {
        if (userId && friendId) {
            const newFriendship = new Friendship(userId, friendId);
            newFriendship._id = friendships.length;
            friendships.push(newFriendship);

            successCB(newFriendship);
        } else {
            failCB('Wrong data');
        }
    };

    /**
     * Update a friendship property
     * @param userId {String} number that represents Requester user ID
     * @param friendId {String} number that represents Requested user ID
     * @param property {String} property name to be changed
     * @param value {Object} value to be set
     * @param successCB {Function} callback function to be executed if the method executes without error
     * @param failCB {Function} callback function to be executed if an error occurs
     */
    this.updateFriendshipProperty = function(userId, friendId, property, value, successCB, failCB) {
        if (userId && friendId && property && value) {
            friendship = friendships.find((friendship) => {
                return friendship.userRequester == userId || friendship.userRequested == friendId;
            });
            friendship && (friendship[property] = value) && successCB(friendship) ||
                failCB('There is no friendship between this users.');
        } else {
            failCB('Wrong data');
        }
    };

    /**
     * Update a friendship property
     * @param id {Number} number that represents friendship ID
     * @param property {String} property name to be changed
     * @param value {Object} value to be set
     * @param successCB {Function} callback function to be executed if the method executes without error
     * @param failCB {Function} callback function to be executed if an error occurs
     */
    this.updateFriendshipPropertyById = function(id, property, value, successCB, failCB) {
        if (id && property && value) {
            this.getFriendship(id, (friendship) => {
                friendship[property] = value;
                successCB(friendship);
            }, failCB);
        } else {
            failCB('Wrong data');
        }
    };

    /**
     * Update a friendship properties
     * @param id {Number} number that represents friendship ID
     * @param properties {Object} hash of properties to be changed
     * @param successCB {Function} callback function to be executed if the method executes without error
     * @param failCB {Function} callback function to be executed if an error occurs
     */
    this.updateFriendshipPropertiesById = function(id, properties, successCB, failCB) {
        if (id && property && value) {
            this.getFriendship(id, (friendship) => {
                extend(friendship,properties);
                successCB(friendship);
            }, failCB);
        } else {
            failCB('Wrong data');
        }
    };

    /**
     * Update the friendship status
     * @param id {Number} number that represents friendship ID
     * @param status {Number} new status value that can be: 0, 1, 2
     * @param successCB {Function} callback function to be executed if the method executes without error
     * @param failCB {Function} callback function to be executed if an error occurs
     */
    this.updateFriendshipStatus = function(id, status, successCB, failCB) {
        this.updateFriendshipPropertyById(id, 'status', status, successCB, failCB);
    };
};

module.exports = new FriendshipDAO();
