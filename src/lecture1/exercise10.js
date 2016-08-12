'use strict';

const http = require('http');

http.createServer((request, response) => {
  response.writeHead(200);

  request.on('readable', () => {
            let data = null;
            console.log('Reading');
            while (null !== (data = request.read())) {
              response.write(data.toString());
            }
          })
          .on('end', () => {
            console.log('Ending');
            response.end();
          });

}).listen(8080, () => {
  console.log('Listening on port 8080...');
});
