const crypto = require('crypto');
const config = require('../config');

// create a SHA256 has
const hash = str => {
  if(typeof(str) === 'string' && str.length > 0) {
    const hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');

    return hash;
  } else {
    return false;
  }
};

// parse a JSON string to an object
const parseJsonToObject = str => {
  try {
    const obj = JSON.parse(str);

    return obj;
  } catch(e) {
    return {};
  }
};

module.exports = {
  hash,
  parseJsonToObject
};
