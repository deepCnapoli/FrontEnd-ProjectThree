// file: server.js
"use strict";

// Empty JS array to hold data
let projectData = {};

// Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

// Dependencies
const bodyParser = require('body-parser')

// Middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Cross origin allowance
const cors = require('cors');
app.use(cors());

//  Initializing the main project folder
app.use(express.static('webapp'));

// PORT set as 8000
const port = 8000;

// Start up the server
const server = app.listen(port, listening);
function listening() {
    console.log(server);
    console.log(`running on localhost: ${port}`);
}

// GET route
app.get('/retrieve', getData);

function getData (request, response) {
    response.send(projectData);
}

// POST route
app.post('/add', postData)

function postData(request, response)  {
    projectData = request.body;
    response.send({ message: "Post recieved"})
    console.log(request);
}