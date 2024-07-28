// Required modules
const WebSocket = require('ws');  // For WebSocket functionality
const express = require('express');  // Web application framework
const path = require('path');  // For handling and transforming file paths

// Initialize express application
const app = express();
// Create HTTP server and integrate it with Express
const server = require('http').createServer(app);
// Initialize WebSocket server and attach it to the HTTP server
const wss = new WebSocket.Server({ server });

// Serve static files (HTML, CSS, JavaScript) from the current directory
app.use(express.static(path.join(__dirname)));

// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Array to store chat messages
const messages = [];

// WebSocket server event handling
wss.on('connection', (ws) => {
  console.log('Client connected');
  
  // Send existing messages to newly connected client
  ws.send(JSON.stringify({ type: 'history', messages }));

  // Handle incoming messages
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    messages.push(data);
    
    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'message', ...data }));
      }
    });
  });
});

// Set port for the server
const PORT = process.env.PORT || 3000;
// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});