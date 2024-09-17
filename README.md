
# WebSocket Server Package

This package provides an easy and professional way to set up a WebSocket server integrated with an Express.js application. With this package, users can initialize and manage WebSocket connections, enabling real-time data communication in their applications.

## Features

- Easy WebSocket server setup with an existing Express.js application.
- Handles WebSocket connections, messages, disconnections, and connection health checks via ping-pong.
- Allows sending notifications to individual clients, all clients, or broadcasting messages except for a specific client.
- Flexible, allowing the user to pass an instance of their Express app and port.
- Lightweight and designed to be integrated into any Express.js project.

## Installation

To install the package via npm, run:

```bash
npm install express-ws-easy
```

## Usage

To use this package in your project, follow the steps below.

### 1. Create an Express Application

First, you need to have an Express.js application where you'll integrate the WebSocket server.

Install Express.js if you haven’t:

```bash
npm install express
```

### 2. Set Up WebSocket with the Package

Create your Express.js app and integrate the WebSocket server from this package.

#### Example:

```js
import express from 'express';
import { WebSocketApp } from 'express-ws-easy';  
import cors from 'cors'

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json()); 
 
const server = new WebSocketApp(app, port, 1234);
const corsOptions={
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsOptions))
app.get('/', (req, res) => {
    res.send('WebSocket Server is running');
});

app.post('/send', (req, res) => {
    const data = req.body;
    server.getController().notifyDataToBothClients(data.receiver,data.sender, data); 
    res.send('Message sent to the specified client');
});

server.listen(() => {
    console.log(`Server running on port ${port}`);
});
```
### 3. Ping-Pong Mechanism for Connection Health

This package supports the **ping-pong mechanism** to ensure that WebSocket connections remain alive and healthy.

- The WebSocket server will periodically send **ping** messages to connected clients.
- Clients are expected to respond with **pong** messages.
- If the server does not receive a pong message within a certain timeout, it may assume the connection has dropped and close it.

This mechanism is crucial for keeping connections alive and detecting when clients have disconnected or become unresponsive.

### 4. Start the Server

To start your server with WebSocket enabled, run:

```bash
node index.js
```

## API

### `new WebSocketApp(app, port).getController()`

- **app**: An instance of your Express app.
- **port**: The port number to run the WebSocket and HTTP server on.

### Methods

#### `.start()`

Starts the HTTP server along with the WebSocket server.

#### `.notifyData(userId, data)`

Notifies a specific connected WebSocket client by sending them the `userId` and `data`.

- **userId**: The ID of the user to send data to.
- **data**: The data you want to send to the client.

#### `.notifyDataToAllClients(data)`

Sends a message to all connected WebSocket clients.

- **data**: The message or data to send to all clients.

#### `.broadcastExcept(userId, data)`

Broadcasts a message to all connected WebSocket clients except for the specified `userId`.

- **userId**: The ID of the user to exclude from the broadcast.
- **data**: The message or data to send to other clients.

#### `.getAllConnectedClients()`

Returns an array of all currently connected client `userId`s.

#### `.pingAllClients()`

Sends a **ping** message to all connected WebSocket clients to ensure connection health.

#### `.notifyDataToBothClients(receiverId, senderId, data)`

Notifies both the receiver and the sender WebSocket clients by sending them the `data`.

- **receiverId**: The ID of the receiver to send data to.
- **senderId**: The ID of the sender to send data to.
- **data**: The data you want to send to both clients.

#### `.notifyDataToSpecificClient(userId, data)`

Sends a message to a specific WebSocket client identified by `userId`.

- **userId**: The ID of the user to send the message to.
- **data**: The message or data to send to the client.

#### `.broadcastExcept(userId, data)`

Sends a message to all connected WebSocket clients, excluding the client with the specified `userId`.

- **userId**: The ID of the client to exclude from the broadcast.
- **data**: The message or data to send to the remaining clients.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
