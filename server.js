const { Server } = require("socket.io");
const http = require("http");

// Create a basic HTTP server so Render has something to "ping"
const httpServer = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200);
    res.end("Server is healthy and running!");
  } else {
    res.writeHead(200);
    res.end("Battle Ball Server is active. Connect via WebSockets.");
  }
});

const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allows connections from GitHub Pages or Localhost
    methods: ["GET", "POST"]
  }
});

// Port handling for Render
const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Example: Listen for player movement
  socket.on("move", (data) => {
    // Broadcast movement to all other players
    socket.broadcast.emit("player_moved", {
      id: socket.id,
      x: data.x,
      y: data.y
    });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
