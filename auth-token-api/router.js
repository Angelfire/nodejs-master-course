const handlers = require('./handlers');

const router = {
  'users': handlers.users,
  'tokens': handlers.tokens,
  'notFound': handlers.notFound
};

module.exports = router;
