'use strict';

const log = require('../../../lib/log');

const Iam = (name) => {
  const _name = name;
  return {
    tellWhoIam: () => log.info(`I'm ${_name}!`)
  }
}

module.exports = Iam;
