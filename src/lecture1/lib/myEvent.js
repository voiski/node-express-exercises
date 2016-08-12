'use strict';

const log = require('../../../lib/log');
const EventEmitter = require('events');
const logger = new EventEmitter();

const MyEvent = (name) => {
  const _name = name;

  logger.on('log', (message) => {
    console.log('Error: ' + _name);
  });

  return {
    emit: logger.emit
  };
}

module.exports = MyEvent;
