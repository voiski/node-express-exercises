'use strict';

const http = require('http');
const fs = require('fs');

http.createServer((request, response) => {
  response.writeHead(200);
  response.write('Starting process');

  const writeStream = fs.createWriteStream('tmp/exercise14_data.txt');
  let count = 0;
  console.log('Reading');

  request.on('readable', () => {
            let data = null;
            while (null !== (data = request.read(1000))) {
              count += data.toString().length;
              console.log(`${count} received!`);
              response.write(`${count} received!`);
              writeStream.write(data.toString());
            }
         })
         .on('end', function () {
            console.log('Ending');
            response.write('Done');
            response.end();
            writeStream.end();
         });

}).listen(8080, () => {
  console.log('Listening on port 8080...');
});
