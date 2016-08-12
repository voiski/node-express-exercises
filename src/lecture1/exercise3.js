'use strict';

const log = require('../../lib/log');
const fs = require('fs');

log.info('Hello, I\'m the exercise three!!');


fs.readFile('src/stubs/lorem.txt','utf8', function (err,chunk) {
  fs.mkdirSync('tmp');
  fs.writeFileSync('tmp/exercise3_lorem.txt',chunk);
  log.info('File created at tmp/exercise3_lorem.txt');
});
