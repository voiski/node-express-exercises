'use strict';

const EventEmitter = require('events');
const MyEvent = require('lib/myEvent');
const logger = new EventEmitter();

const Alan = MyEvent('Alan');

logger.emit('log');
Alan.emit('log');
