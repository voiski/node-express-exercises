'use strict';

const http = require('http');
const log = require('./log');
const StringDecoder = require('string_decoder').StringDecoder;
const extend = require('util')._extend;

const HandlerHttp = (options) => {
    const _options = options;
    const doRequest = (requestOptions, data, callback) => {
        extend(requestOptions,_options)
          && requestOptions.headers
          && (requestOptions.headers=extend({},_options.headers));

        if(data){
          data = JSON.stringify(data);
          !requestOptions.headers && (requestOptions.headers = {});
          requestOptions.headers['Content-Type'] = 'application/json';
          requestOptions.headers['Content-Length'] = Buffer.byteLength(data);
        }

        const request = http.request(requestOptions, (response) => {
            log.info(`${requestOptions.method} ${requestOptions.path}`);
            data && log.debug(`Request body: ${data}`);
            log.debug('Response:');
            let result=null;
            response.on('data', function(data) {
                result = new StringDecoder('utf8').write(data);
                if(response.statusCode>=300){
                  log.error(result);
                }else{
                  try{
                    result = JSON.parse(result);
                  }catch(e){}
                  log.info(result);
                }
            });

            callback && response.on('end', (data) => {
                callback(result, request, response);
            });
        });
        data && request.write(data);
        request.end();
    };

    return {
        options: () => _options,
        get: (path, query, callback) => doRequest({
            method: 'GET',
            path: query? `${path}?${query}`: path
        }, null, callback),
        post: (path, data, callback) => doRequest({
            method: 'POST',
            path: path
        }, data, callback),
        put: (path, data, callback) => doRequest({
            method: 'PUT',
            path: path
        }, data, callback),
        delete: (path, callback) => doRequest({
            method: 'DELETE',
            path: path
        }, null, callback)
    };
};

module.exports = HandlerHttp;
