'use strict';

const http = require('http');

http.createServer((request, response) => {
  response.writeHead(200);

  request.on('readable', () => {
            let data = null;
            console.log('Reading');
            while (null !== (data = request.read())) {
              console.log(data.toString());
            }
         })
         .on('end', () => {
          console.log('Ending');
          response.write('Thanks!');
          response.end();
        });

}).listen(8080, () => {
  console.log('Listening on port 8080...');
});
