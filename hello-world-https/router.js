const handlers = require('./handlers');

const router = {
  'hello': handlers.hello,
  'notFound': handlers.notFound
};

module.exports = router;
