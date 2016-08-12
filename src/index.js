'use strict';

const http = require('http');

http.createServer((request, response) => {
  response.writeHead(200);
  response.write('Hello World!');
  response.end();
}).listen(8080, () => {
  console.log('Listening on port 8080...');
});
