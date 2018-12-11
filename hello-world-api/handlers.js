const handlers = {};

handlers.hello = (data, cb) => {
  cb(200, {
    'message': 'Welcome Message'
  })
}

handlers.notFound = (data, cb) => {
  cb(404);
}

module.exports = handlers;
