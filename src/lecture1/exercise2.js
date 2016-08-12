'use strict';

const log = require('../../lib/log');
const fs = require('fs');

log.info('Hello, I\'m the exercise two!!');

log.info(fs.readFileSync('src/stubs/lorem.txt','utf8'));
