# The Node.JS Master Course

## Homework Assignment #1
RESTFul API. It can runs in two different modes: `development` or `production`. Now server support HTTPS.

## Instructions
* Start the server: The server can run in two different modes:
  * Development: `NODE_ENV=development node server.js`
  * Production: `NODE_ENV=production node server.js`

### POST
```
Method: "POST"
Path: "/users"
Body: {
    "firstName": "Andres", 
    "lastName": "Bedoya", 
    "phone": "1113339991", 
    "password": "password123", 
    "tosAgreement": true
}
```

### GET
```
Method: "GET
Path: "/users?phone=1113339991"
```

### PUT
```
Method: "PUT"
Path: "/users
Body: {
    "firstName": "Seryio", 
    "phone": "1113339991"
}
```

### DELETE
```
Method: "DELETE"
Path: "/users?phone=1113339991"
```
