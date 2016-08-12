'use strict';

const http = require('http');
const fs = require('fs');

http.createServer((request, response) => {
  const writeStream = fs.createWriteStream('tmp/exercise12_data.txt')
  request.on('readable', () => {
            let data = null;
            console.log('Reading');
            while (null !== (data = request.read())) {
              writeStream.write(data.toString());
            }
         })
         .on('end', function () {
            console.log('Ending');
            response.writeHead(200);
            response.write('Thanks!');
            response.end();
            writeStream.end();
         });

}).listen(8080, () => {
  console.log('Listening on port 8080...');
});
