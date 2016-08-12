'use strict';

const log = require('./log');
const minutes = '1h';
const jwt = require('jsonwebtoken');

const Auth = (hostConfig) => {
    const _hostConfig = hostConfig;
    const verifyAuth = function(request) {
        let cookie = request.cookies[_hostConfig.appName];
        if (cookie) {
            try {
                request.token = jwt.verify(cookie,
                    _hostConfig.secret, {
                        logged: true,
                        ignoreExpiration: false
                    });
                return true;
            } catch (error) {
                log.warn('Request unauthorized. Error decoding token.');
                return false;
            }
        } else {
            log.debug('Request unauthorized. No token available.');
            return false;
        }
    };

    return {
        isAuthenticated: (request, response, next) => {
            if (verifyAuth(request)) {
                next();
            } else {
                response.sendStatus(407);
            }
        },
        signToken: (payload) => {
            return jwt.sign(payload,
                _hostConfig.secret, {
                    issuer: _hostConfig.issuer,
                    expiresIn: minutes
                });
        },
        loggedInfo: (request) => { return jwt.decode(request.cookies[_hostConfig.appName]) },
    };
};


module.exports = Auth;
