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

## Instructions for Generating Tokens
The tokens can be created for existing users (same phone number)

### POST
```
Method: "POST"
Path: "/tokens"
Body: {
    "phone": "1113339990", 
    "password": "password123"
}
```

### GET
It is necessary to use an id of a token that has already been created

```
Method: "GET"
Path: "/tokens?id=f9eyesd9voj2qo8dsxhp"
```

### PUT
```
Method: "PUT"
Path: "/tokens"
Body: {
    id: "f9eyesd9voj2qo8dsxhp",
    extend: true
}
```

### DELETE
```
Method: "DELETE"
Path: /tokens?id=f9eyesd9voj2qo8dsxhp"
```

## Instructions for checks
### POST

```
Method: ""
Path: "/checks"
Headers: {
    token: ""
}
Body: {
    "protocol: "http",
    "url": "google.com",
    "method" : "GET",
    "sucessCodes": [200, 201],
    "timeoutSeconds": 3
}
```

### GET


### PUT


### DELETE
