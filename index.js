const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Set the port to 8080. Using process.env.PORT makes the app cloud-friendly.
const PORT = process.env.PORT || 8080;

const app = express();
const server = http.createServer(app);
// Initialize Socket.IO server
const io = new Server(server, {
    cors: {
      origin: "*", // Allows all origins for simplicity in this project
      methods: ["GET", "POST"]
    }
  });
  
  // Serve the static HTML client file when the root URL is accessed
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
  
    // Listen for 'chat message' events from the client
    socket.on('chat message', (msg) => {
      // Prefix message with the first 4 characters of the sender's ID for client-side display logic
      const shortId = socket.id.substring(0, 4);
      const fullMsg = `[${shortId}]: ${msg}`;
      console.log('Message received:', fullMsg);
      
      // Broadcast the message to all connected clients
      io.emit('chat message', fullMsg);
    });
  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
