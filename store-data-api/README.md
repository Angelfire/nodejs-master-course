# The Node.JS Master Course

## Homework Assignment #1
RESTFul API. It can runs in two different modes: `development` or `production`. Now server support HTTPS.

## Instructions
* Start the server: The server can run in two different modes:
  * Development: `NODE_ENV=development node server.js`
  * Production: `NODE_ENV=production node server.js`

### POST
Using Postman (or your preferred tool), POST anything you want to: `http://localhost:3000/user` e.g.:
```
{
    "firstName": "Andres", 
    "lastName": "Bedoya", 
    "phone": "1113339991", 
    "password": "password123", 
    "tosAgreement": true
}
```

### GET
Using Postman, GET the info for the user with phone `1113339991`

`localhost:3000/users?phone=1113339991`

### PUT
Using Postman, PUT new info for the user with phone `1113339991`

```
{
    "firstName": "Seryio", 
    "phone": "1113339991"
}
```

### DELETE
Using Postman, DELETE the info for the user with phone `1113339991`

`localhost:3000/users?phone=1113339991`
