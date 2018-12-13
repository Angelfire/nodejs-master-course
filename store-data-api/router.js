const handlers = require('./handlers');

const router = {
  'hello': handlers.hello,
  'users': handlers.users,
  'notFound': handlers.notFound
};

module.exports = router;
