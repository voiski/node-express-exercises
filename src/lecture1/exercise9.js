'use strict';

const http = require('http');
const StringDecoder = require('string_decoder').StringDecoder;

const options = {
    host: 'localhost',
    port: 8080,
    path: '/',
    method: 'POST'
};

const request = http.request(options, function(response){
    response.on('data', function(data){
        const decoder = new StringDecoder('utf8');
        console.log( decoder.write(data));
    });
});

request.write('Are you alive?');
request.end();
