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

// create a string of random alphanumeric chars, of a given length
const createRandomString = strLength => {
  strLength = typeof(strLength) === 'number' && strLength > 0 ? strLength : false;
  if(strLength) {
    const  possibleChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';

    for(var i = 1; i <= strLength; i++) {
      const randomChar = possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
      
      str += randomChar;
    }

    return str;
  } else {
    return false;
  }
};

module.exports = {
  hash,
  parseJsonToObject,
  createRandomString
};
