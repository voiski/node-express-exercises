'use strict';

const http = require('http');
const fs = require('fs');

http.createServer((request, response) => {
  request.on('end', function () {
            console.log('Ending');
            response.writeHead(200);
            response.write('Thanks!');
            response.end();
         })
         .pipe(fs.createWriteStream('tmp/exercise13_data.txt'));

}).listen(8080, () => {
  console.log('Listening on port 8080...');
});
