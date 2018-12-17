const handlers = require('./handlers');

const router = {
  'users': handlers.users,
  'tokens': handlers.tokens,
  'checks': handlers.checks,
  'notFound': handlers.notFound
};

module.exports = router;
