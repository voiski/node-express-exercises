'use strict';

const http = require('http');
const fs = require('fs');
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

let readStream = fs.createReadStream('src/stubs/lorem.txt');
readStream.on('end', function () {
  request.end();
});

readStream.pipe(request);
