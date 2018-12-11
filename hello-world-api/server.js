const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const router = require('./router');

const PORT = 5000;

const server = http.createServer((req, res) => {

  // get the URL and parse it
  const parsedUrl = url.parse(req.url, true);
  
  // get the path
  const pathUrl = parsedUrl.pathname;
  const trimmedPath = pathUrl.replace(/^\/+|\/+$/g, '');

  // get the payload, if there is any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', data => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();

    const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : router['notFound'];
    
    chosenHandler({}, (statusCode, payload) => {
      statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

      payload = typeof(payload) === 'object' ? payload : {};

      const payloadString = JSON.stringify(payload);

      // return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on port: ${ PORT }`);
});
