var User = require('./user.schema');
var users = [{
    _id: 0,
    name: 'test',
    email: 'admin@mail.com',
    role: 'admin',
    password: 'test',
    provider: 'local',
    salt: 'salty',
    facebook: {},
    twitter: {},
    google: {},
    github: {}
}, {
    _id: 1,
    name: 'Bruno Araujo',
    email: 'brunoaraujo1942@uol.com',
    role: 'user',
    password: 'atletico',
    provider: 'avenuecode',
    salt: 'salty',
    facebook: {},
    twitter: {},
    google: {},
    github: {}
}, {
    _id: 2,
    name: 'Jao Feijao',
    email: 'jao.feijao@uol.com',
    role: 'user',
    password: 'jao',
    provider: 'avenuecode',
    salt: 'salty',
    facebook: {},
    twitter: {},
    google: {},
    github: {}
}];

/**
 * User Data Access Object class. This class is responsible to deal with all user's operation
 */
var UserDAO = function() {

    /**
     * Get user by ID.
     * @param id {Number} number that represents user ID
     * @param successCB {Function} callback function to be executed if the method executes without error
     * @param failCB {Function} callback function to be executed if an error occurs
     */
    this.getUser = function(id, successCB, failCB) {
        var user = users.find((user) => {
            return user._id == id
        });
        user && successCB(user) ||
        failCB('There is no user with ID #' + id + ' in the Database.');
    };

    /**
     * Get user by email.
     * @param email {String} String that represents user email
     * @param successCB {Function} callback function to be executed if the method executes without error
     * @param failCB {Function} callback function to be executed if an error occurs
     */
    this.getUserByEmail = function(email, successCB, failCB) {
        var user = users.find((user) => {
            return user.mail == email
        });
        user && successCB(user) ||
            failCB('There is no user with email' + email + ' in the Database.');
    };

    /**
     * List all users in the users array.
     * @param successCB {Function} callback function to be executed if the method executes without error
     * @param failCB {Function} callback function to be executed if an error occurs
     */
    this.listAllUsers = function(successCB, failCB) {
        successCB(users);
    };

    /**
     * Search for users that its name match the a RegExp created with the query provided.
     * @param query {String} String to be used as search key
     * @param successCB {Function} callback function to be executed if the method executes without error
     * @param failCB {Function} callback function to be executed if an error occurs
     */
    this.searchUsersByName = function(query, successCB, failCB) {
        var regExp = new RegExp(query, 'i');
        var results = [];
        for (var x = users.length - 1; x >= 0; x--) {
            if (regExp.test(users[x].name)) {
                results.push(users[x]);
            }
        }

        successCB(results);
    };

    /**
     * Get user by email and password
     * @param userData {Object} object with attributes: email and password
     * @param successCB {Function} callback function to be executed if the method executes without error
     * @param failCB {Function} callback function to be executed if an error occurs
     */
    this.getUserByEmailAndPassword = function(userData, successCB, failCB) {
        for (var x = users.length - 1; x >= 0; x--) {
            if (users[x].email === userData.username && users[x].password === userData.password) {
                successCB(users[x]);
                return;
            }
        }

        failCB('No user was found.');
    };

    /**
     * Changes user's password
     * @param userData {Object} object with attributes: "_id", "oldPassword" and "newPassword"
     * @param successCB {Function} callback function to be executed if the method executes without error
     * @param failCB {Function} callback function to be executed if an error occurs
     */
    this.changePassword = function(userData, successCB, failCB) {
        var user;
        for (var x = users.length - 1; x >= 0; x--) {
            if (users[x]._id == userData._id) {
                user = users[x];
            }
        }

        if (user && user.password === userData.oldPassword) {
            user.password = userData.newPassword;
            successCB(user);
        } else {
            failCB('Something went wrong! No Password change.');
        }
    };

    /**
     * Create a new user
     * @param userData {Object} object with attributes: "name", "email" and "password"
     * @param successCB {Function} callback function to be executed if the method executes without error
     * @param failCB {Function} callback function to be executed if an error occurs
     */
    this.createUser = function(userData, successCB, failCB) {
        if (userData.email && userData.name && userData.password) {
            var newUser = new User(userData.name, userData.email, userData.password);
            newUser._id = users.length;
            users.push(newUser);

            successCB(newUser);
        } else {
            failCB('Wrong data');
        }
    };

    /**
     * Delete an user by ID
     * @param userId {Number} number that represents user ID
     * @param successCB {Function} callback function to be executed if the method executes without error
     * @param failCB {Function} callback function to be executed if an error occurs
     */
    this.deleteUser = function(userId, successCB, failCB) {
        var user = {};
        for (var x = users.length - 1; x >= 0; x--) {
            if (users[x]._id == userId) {
                user = users.splice(x, 1)[0];
            }
        }

        successCB(user);
    };
};

module.exports = new UserDAO();
