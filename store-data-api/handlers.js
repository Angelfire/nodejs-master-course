const hash = require('./lib/helpers').hash;
const _data = require('./lib/crud-data');

// handlers container
let handlers = {};

// user submethods container
handlers._users = {};

handlers.hello = (data, cb) => {
  cb(200, {
    'message': 'Hello World'
  });
};

handlers.users = (data, cb) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if(acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, cb);
  } else {
    cb(405);
  }
};

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
              cb(500,{'Error' : 'Could not create the new user'});
            }
          });
        } else {
          cb(500,{'Error' : 'Could not hash the user\'s password'});
        }

      } else {
        // User alread exists
        cb(400,{'Error' : 'A user with that phone number already exists'});
      }
    });

  } else {
    cb(400,{'Error' : 'Missing required fields'});
  }

};

// Required data: phone
// Optional data: none
// @TODO Only let an authenticated user access their object. Dont let them access anyone elses.
handlers._users.get = (data, cb) => {
  // Check that phone number is valid
  const phone = typeof(data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.trim().length === 10 ? data.queryStringObject.phone.trim() : false;
  
  if(phone){
    // Lookup the user
    _data.read('users', phone, (err,data) => {
      if(!err && data){
        // Remove the hashed password from the user user object before returning it to the requester
        delete data.hashedPassword;
        cb(200,data);
      } else {
        cb(404);
      }
    });
  } else {
    cb(400,{'Error' : 'Missing required field'})
  }
};

// Required data: phone
// Optional data: firstName, lastName, password (at least one must be specified)
// @TODO Only let an authenticated user up their object. Dont let them access update elses.
handlers._users.put = (data, cb) => {
  // Check for required field
  const phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;

  // Check for optional fields
  const firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  const lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  // Error if phone is invalid
  if(phone){
    // Error if nothing is sent to update
    if(firstName || lastName || password){
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
            userData.hashedPassword = helpers.hash(password);
          }

          // Store the new updates
          _data.update('users', phone, userData, err => {
            if(!err){
              cb(200);
            } else {
              cb(500,{'Error' : 'Could not update the user'});
            }
          });
        } else {
          cb(400,{'Error' : 'Specified user does not exist'});
        }
      });
    } else {
      cb(400,{'Error' : 'Missing fields to update'});
    }
  } else {
    cb(400,{'Error' : 'Missing required field'});
  }

};

// Required data: phone
// @TODO Only let an authenticated user delete their object. Dont let them delete update elses.
// @TODO Cleanup (delete) any other data files associated with the user
handlers._users.delete = (data, cb) => {
  // Check that phone number is valid
  const phone = typeof(data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.trim().length === 10 ? data.queryStringObject.phone.trim() : false;

  if(phone){
    // Lookup the user
    _data.read('users', phone, (err, data) => {
      if(!err && data){
        _data.delete('users', phone, err => {
          if(!err){
            cb(200);
          } else {
            cb(500,{'Error' : 'Could not delete the specified user'});
          }
        });
      } else {
        cb(400,{'Error' : 'Could not find the specified user'});
      }
    });
  } else {
    cb(400,{'Error' : 'Missing required field'})
  }
};

module.exports = handlers;
