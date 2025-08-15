//Step 1: Instantiate server for http and ws
const http = require('http');
const { WebSocketServer } = require('ws');
const url = require('url');
const uuidv4 = require('uuid').v4; // Import uuid for generating unique identifiers


const server = http.createServer(); 
const wsServer = new WebSocketServer({ server });

const connections = {}; // Object to store user connections, using UUID as keys
const users = {}; // Object to store user information, using username as keys

//Step 2 : Accept incoming connections from users, identify them by name, and keep track of them and their underlying connection.

//Listen for connections
const port = 8000;
//Handle new websocket connections
wsServer.on('connection', (connection, req) => {  //When client connects, do this (call back function) - with the connection and request objects

    // ws://localhost:8000?username=Alex - when connecting from client, using string like this, passing username via query parameter.

    const { username } = url.parse(req.url, true).query; //Extract username from the request URL - Step 2
    const uuid = uuidv4(); //Generate a unique identifier for the user - Step 2
    console.log(`New client connected: ${username} ${uuid}`); //Log the username of the new client - Step 2


    //Want to store dictionary of users, so later down the linbe you can send a broadcast/fan out , so that everyone connected gets the message

    //Store the connection in an array with the uuid as the key
    connections[uuid] = connection;

    //Same time, you need to keep track of users.
    users[uuid] = {
        username: username,
    }

});

server.listen(port, () => {
    console.log(`WebSocket server is listening on port ${port}`); //template literal string corrected -- use backticks ``
});




