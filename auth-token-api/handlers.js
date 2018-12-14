const hash = require('./lib/helpers').hash;
const createRandomString = require('./lib/helpers').createRandomString
const _data = require('./lib/crud-data');

// handlers container
let handlers = {};

// user submethods container
handlers._users = {};

// token methods
handlers._tokens = {};

handlers.users = (data, cb) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if(acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, cb);
  } else {
    cb(405);
  }
};

handlers.tokens = (data, cb) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if(acceptableMethods.indexOf(data.method) > -1) {
    handlers._tokens[data.method](data, cb);
  } else {
    cb(405);
  }
};

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = (data, cb) => {
  // Check that all required fields are filled out
  const firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  const lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  const phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;
  const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  const tosAgreement = typeof(data.payload.tosAgreement) === 'boolean' && data.payload.tosAgreement === true ? true : false;

  if(firstName && lastName && phone && password && tosAgreement){
    // Make sure the user doesnt already exist
    _data.read('users', phone, err => {
      if(err){
        // Hash the password
        const hashedPassword = hash(password);

        // Create the user object
        if(hashedPassword){
          const userObject = {
            'firstName' : firstName,
            'lastName' : lastName,
            'phone' : phone,
            'hashedPassword' : hashedPassword,
            'tosAgreement' : true
          };

          // Store the user
          _data.create('users', phone, userObject, err => {
            if(!err){
              cb(200);
            } else {
              cb(500, {'Error' : 'Could not create the new user'});
            }
          });
        } else {
          cb(500, {'Error' : 'Could not hash the user\'s password'});
        }

      } else {
        // User alread exists
        cb(400, {'Error' : 'A user with that phone number already exists'});
      }
    });

  } else {
    cb(400, {'Error' : 'Missing required fields'});
  }
};

// Required data: phone
// Optional data: none
handlers._users.get = (data, cb) => {
  // Check that phone number is valid
  const phone = typeof(data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.trim().length === 10 ? data.queryStringObject.phone.trim() : false;
  
  if(phone){
    // Get token from headers
    const token = typeof(data.headers.token) === 'string' ? data.headers.token : false;
    // Verify that the given token is valid for the phone number
    handlers._tokens.verifyToken(token, phone, tokenIsValid => {
      if(tokenIsValid){
        // Lookup the user
        _data.read('users', phone, (err, data) => {
          if(!err && data){
            // Remove the hashed password from the user user object before returning it to the requester
            delete data.hashedPassword;
            cb(200, data);
          } else {
            cb(404);
          }
        });
      } else {
        cb(403,{"Error" : "Missing required token in header, or token is invalid"})
      }
    });
  } else {
    cb(400,{'Error' : 'Missing required field'})
  }
};

// Required data: phone
// Optional data: firstName, lastName, password (at least one must be specified)
handlers._users.put = (data, cb) => {
  // Check for required field
  const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

  // Check for optional fields
  const firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  const lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  // Error if phone is invalid
  if(phone){
    // Error if nothing is sent to update
    if(firstName || lastName || password){
      // Get token from headers
      const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

      // Verify that the given token is valid for the phone number
      handlers._tokens.verifyToken(token, phone, tokenIsValid => {
        if(tokenIsValid){
          // Lookup the user
          _data.read('users', phone, (err, userData) => {
            if(!err && userData){
              // Update the fields if necessary
              if(firstName){
                userData.firstName = firstName;
              }
              if(lastName){
                userData.lastName = lastName;
              }
              if(password){
                userData.hashedPassword = hash(password);
              }
              // Store the new updates
              _data.update('users', phone, userData, err => {
                if(!err){
                  cb(200);
                } else {
                  cb(500, {'Error' : 'Could not update the user'});
                }
              });
            } else {
              cb(400, {'Error' : 'Specified user does not exist'});
            }
          });
        } else {
          cb(403, {"Error" : "Missing required token in header, or token is invalid"});
        }
      });
    } else {
      cb(400, {'Error' : 'Missing fields to update.'});
    }
  } else {
    cb(400, {'Error' : 'Missing required field'});
  }
};

// Required data: phone
// @TODO Cleanup (delete) any other data files associated with the user
handlers._users.delete = (data, cb) => {
  // Check that phone number is valid
  const phone = typeof(data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
  
  if(phone){

    // Get token from headers
    const token = typeof(data.headers.token) === 'string' ? data.headers.token : false;

    // Verify that the given token is valid for the phone number
    handlers._tokens.verifyToken(token, phone, tokenIsValid => {
      if(tokenIsValid){
        // Lookup the user
        _data.read('users', phone, (err, data) => {
          if(!err && data){
            _data.delete('users', phone, err => {
              if(!err){
                cb(200);
              } else {
                cb(500, {'Error' : 'Could not delete the specified user'});
              }
            });
          } else {
            cb(400, {'Error' : 'Could not find the specified user.'});
          }
        });
      } else {
        cb(403, {"Error" : "Missing required token in header, or token is invalid"});
      }
    });
  } else {
    cb(400, {'Error' : 'Missing required field'})
  }
};

// Tokens - post
// Required data: phone, password
// Optional data: none
handlers._tokens.post = (data, cb) => {
  const phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;
  const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  
  if(phone && password){
    // Lookup the user who matches that phone number
    _data.read('users', phone, (err, userData) =>{
      if(!err && userData){
        // Hash the sent password, and compare it to the password stored in the user object
        const hashedPassword = hash(password);

        if(hashedPassword === userData.hashedPassword){
          // If valid, create a new token with a random name. Set an expiration date 1 hour in the future.
          const tokenId = createRandomString(20);
          const expires = Date.now() + 1000 * 60 * 60;
          const tokenObject = {
            'phone' : phone,
            'id' : tokenId,
            'expires' : expires
          };

          // Store the token
          _data.create('tokens', tokenId, tokenObject, err => {
            if(!err){
              cb(200, tokenObject);
            } else {
              cb(500, {'Error' : 'Could not create the new token'});
            }
          });
        } else {
          cb(400, {'Error' : 'Password did not match the specified user\'s stored password'});
        }
      } else {
        cb(400, {'Error' : 'Could not find the specified user.'});
      }
    });
  } else {
    cb(400, {'Error' : 'Missing required field(s)'})
  }
};

// Tokens - get
// Required data: id
// Optional data: none
handlers._tokens.get = (data, cb) => {
  // Check that id is valid
  const id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim() : false;
  
  if(id){
    // Lookup the token
    _data.read('tokens', id, (err,tokenData) => {
      if(!err && tokenData){
        cb(200, tokenData);
      } else {
        cb(404);
      }
    });
  } else {
    cb(400, {'Error' : 'Missing required field, or field invalid'})
  }
};

// Tokens - put
// Required data: id, extend
// Optional data: none
handlers._tokens.put = (data, cb) => {
  const id = typeof(data.payload.id) === 'string' && data.payload.id.trim().length === 20 ? data.payload.id.trim() : false;
  const extend = typeof(data.payload.extend) === 'boolean' && data.payload.extend === true ? true : false;
  
  if(id && extend){
    // Lookup the existing token
    _data.read('tokens', id, (err,tokenData) => {
      if(!err && tokenData){
        // Check to make sure the token isn't already expired
        if(tokenData.expires > Date.now()){
          // Set the expiration an hour from now
          tokenData.expires = Date.now() + 1000 * 60 * 60;
          // Store the new updates
          _data.update('tokens', id, tokenData, err => {
            if(!err){
              cb(200);
            } else {
              cb(500, {'Error' : 'Could not update the token\'s expiration'});
            }
          });
        } else {
          cb(400, {"Error" : "The token has already expired, and cannot be extended"});
        }
      } else {
        cb(400, {'Error' : 'Specified user does not exist'});
      }
    });
  } else {
    cb(400, {"Error": "Missing required field(s) or field(s) are invalid"});
  }
};

// Tokens - delete
// Required data: id
// Optional data: none
handlers._tokens.delete = (data, cb) => {
  // Check that id is valid
  const id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim() : false;
  
  if(id){
    // Lookup the token
    _data.read('tokens', id, (err,tokenData) => {
      if(!err && tokenData){
        // Delete the token
        _data.delete('tokens', id, err => {
          if(!err){
            cb(200);
          } else {
            cb(500, {'Error' : 'Could not delete the specified token'});
          }
        });
      } else {
        cb(400, {'Error' : 'Could not find the specified token.'});
      }
    });
  } else {
    cb(400, {'Error' : 'Missing required field'})
  }
};

// Verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = (id, phone, cb) => {
  // Lookup the token
  _data.read('tokens', id, (err, tokenData) => {
    if(!err && tokenData){
      // Check that the token is for the given user and has not expired
      if(tokenData.phone === phone && tokenData.expires > Date.now()){
        cb(true);
      } else {
        cb(false);
      }
    } else {
      cb(false);
    }
  });
};

module.exports = handlers;
