'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const HostConfig = require('./hostConfig');
const routes = {
    login:  require('./routes/loginRoute'),
    logged: require('./routes/loggedRoute'),
    users:  require('./routes/usersRoute'),
    friendships:  require('./routes/friendshipsRoute')
}


express()
// parse application/x-www-form-urlencoded
.use(bodyParser.urlencoded())
// parse application/json
.use(bodyParser.json())
// parse cookie
.use(cookieParser())
// Static
.use(express.static('../public'))

// Exercise 1/2, 6, 7
.use('/login', routes.login)
// Exercise 1, 5, 6, 7
.use('/users', routes.users)
// Exercise 4, 6, 7
.use('/me', routes.logged)
// Exercise 9
.use('/friendships', routes.friendships)

.listen(HostConfig.port, function() {
    console.log(`Listening on port ${HostConfig.port}...`);
});
