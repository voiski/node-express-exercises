'use strict';

const log = require('./log');

const allowedOrigins = ['*.avenuecode.com', '*.avenuecode.io', '*.voiski.com'];
const allowedMethods = ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'];
const allowedHeaders = ['Content-Type', 'Authorization', 'Content-Length'];

const CORSEnabler = function(request, response, next) {
    log.info('Configuring CORS');
    log.debug(`Method ${request.method} from ${request.origin}`);

    if (allowedMethods.indexOf(request.method) > -1) {
        response.header('Access-Control-Allow-Origin', allowedOrigins.join(','));
        response.header('Access-Control-Allow-Methods', allowedMethods.join(','));
        response.header('Access-Control-Allow-Headers', allowedHeaders.join(','));
    }

    next();
}

module.exports = CORSEnabler;
