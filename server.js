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

// Middleware - we are configuring Express to use body-parser as Middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json()); // the data to be in JSON format

// Using Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

//  Initializing the main project folder
app.use(express.static('webapp'));

// Set up Server
const port = 8000;

// Start up the server
const server = app.listen(port, ()=>{
	console.log(`running on localhost: ${port}`)})

// GET route - /retrieve is the link to the app route
app.get('/retrieve', getData);

// function to send back data from API to the Server
function getData (request, response) {
    response.send(projectData);
}

// POST route
app.post('/add', postData)
 // /add is the link to the app route
function postData(req, res)  {
    projectData = req.body;
    res.send({ message: "Post recieved"})
    console.log(req);
}




