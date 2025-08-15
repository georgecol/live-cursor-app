//Step 1: Instantiate server for http and ws
//Step 2 : Accept incoming connections from users, identify them by name, and keep track of them and their underlying connection.
//Step 3: Handle incoming messages from users, and broadcast them to all other connected users
//Step 4: Handle disconnections and clean up resources
const http = require('http');
const { WebSocketServer } = require('ws');
const url = require('url');
const uuidv4 = require('uuid').v4; // Import uuid for generating unique identifiers


const server = http.createServer();
const wsServer = new WebSocketServer({ server });

const connections = {}; // Object to store user connections, using UUID as keys
const users = {}; // Object to store user information, using username as keys

const broadcastUsers = () => {
    //Send message to all connected users except the sender
    Object.keys(connections).forEach(uuid => { // Iterate over all connections
        const connection = connections[uuid]; // Get the connection for the user
        const message = JSON.stringify(users); // Convert users object to JSON string for sending over WebSocket
        connection.send(message); // Send the message to the user
    });
}

//Step 3 
//Message = state
const handleMessage = (bytes, uuid) => {
//Copy object, and replace the state of the user with the new state
    const message = JSON.parse(bytes = bytes.toString()); // Convert bytes to string // Get bytes from the server
    const user = users[uuid]; // Get the user object using the UUID
    user.state = message; // Update the user's state with the new message , can do that here because only have one message type for now
    console.log(`Received message from ${user}:`, message); // Log the received message

    broadcastUsers();

    console.log(`${user.username} updated their state :, ${JSON.stringify(user.state)}`); // Log the updated state of the user
}

const handleClose = (uuid) => {
    console.log(`Client disconnected: ${users[uuid].username} ${uuid}`); // Log the disconnection of the user

    delete connections[uuid]; // Remove the connection from the connections object
    delete users[uuid]; // Remove the user from the users object

    broadcastUsers(); // Broadcast the updated users list to all remaining connections
}

//Listen for connections
const port = 8000;
//Handle new websocket connections , Step 2
wsServer.on('connection', (connection, req) => {  //When client connects, do this (call back function) - with the connection and request objects

    // ws://localhost:8000?username=Alex - when connecting from client, using string like this, passing username via query parameter.

    const { username } = url.parse(req.url, true).query; //Extract username from the request URL - Step 2
    const uuid = uuidv4(); //Generate a unique identifier for the user - Step 2
    console.log(`New client connected: ${username} ${uuid}`); //Log the username of the new client - Step 2


    //Want to store dictionary of users, so later down the line you can send a broadcast/fan out , so that everyone connected gets the message

    //Store the connection in an array with the uuid as the key
    connections[uuid] = connection;

    //Same time, you need to keep track of users. 

    //So when a client updates, you can send the update to all other clients
    users[uuid] = {
        username: username,
        state: {
            //Initiate user with empty state , every time client moves cursor, send update to server, to update x and y values
            //Then you can periodically send a broadcast to the connections (all clients), with 
            // x: 0,
            //y: 0
            //Could also have a typing boolean to say if they are typing (e.g in a chat app)
            //typing: true/false
        }
    }

    //Call handleMessage and handleClose functions when messages are received or connections are closed

    connection.on("message", message => handleMessage(message, uuid)) //Capture every time we get a new message, know who it is
    connection.on("close", () => handleClose(uuid)) //Capture when the connection closes, so we can remove the user from the users object

    //JSON.stringify(users) //Convert users object to JSON string for sending over WebSocket

});

server.listen(port, () => {
    console.log(`WebSocket server is listening on port ${port}`); //template literal string corrected -- use backticks ``
});




