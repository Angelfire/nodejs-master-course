# The Node.JS Master Course

## Homework Assignment #1
This a very basic RESTFul API. It can runs in two different modes: `development` or `production`. Now server support HTTPS.

## Instructions
* Start the server: The server can run in two different modes:
  * Development: `NODE_ENV=development node server.js`
  * Production: `NODE_ENV=production node server.js`
- Using Postman (or your preferred tool), POST anything you want to: `http://localhost:3000/hello` or `https://localhost:3001/hello`, the body should contain (with `200 status`):
```
{
    "message": "Welcome Message"
}
```
- Check any other URL, the body should contain (with `404 status`):

```
{}
```