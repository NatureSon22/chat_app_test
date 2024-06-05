import express from "express";
import http from "http";
import mongoose from "mongoose";
import WebSocket, { WebSocketServer as WSWebSocketServer } from "ws";
import dotenv from "dotenv";

const app = express();
const server = http.createServer(app);

// Create a WebSocket server and bind it to the HTTP server
const WebSocketServer = WebSocket.Server || WSWebSocketServer;
const wss = new WebSocketServer({ server });

app.use(express.json());
dotenv.config();

// Handle WebSocket connections
wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    // Broadcast the message to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

const setup = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected");
    server.listen(3000, () => console.log("Server is running"));
  } catch (error) {
    console.log(error.message);
  }
};

setup();
