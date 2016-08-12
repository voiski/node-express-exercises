'use strict';

const log = require('./log');

const Cookie = (hostConfig) => {
    const _hostConfig = hostConfig;
    return (request, response, next) => {
        const cookies = request.headers.cookie;
        const appCookie = cookies ? cookies.split(';').find((cookie) => cookie.split('=')[0] == _hostConfig.appName) : null;

        appCookie && log.debug(`Cookie: ${appCookie}`);

        next();
    };
};

module.exports = Cookie;
