const { Server } = require("socket.io");
const http = require("http");

// 1. Create the HTTP server
const httpServer = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200);
    res.end("Server is healthy!");
  } else {
    res.writeHead(200);
    res.end("Battle Ball Server is Live.");
  }
});

// 2. Initialize Socket.io with CORS allowed for your GitHub Pages
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allows any website to connect (perfect for testing)
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 10000;

// Store players in memory
let players = {};

io.on("connection", (socket) => {
  console.log(`User Joined: ${socket.id}`);

  // When a player moves, update our list and tell everyone else
  socket.on("move", (data) => {
    players[socket.id] = data;
    
    // Broadcast to all OTHER players
    socket.broadcast.emit("player_moved", {
      id: socket.id,
      x: data.x,
      y: data.y
    });
  });

  // Clean up when a player leaves
  socket.on("disconnect", () => {
    console.log(`User Left: ${socket.id}`);
    delete players[socket.id];
    // Tell others to remove this player from their screen
    socket.broadcast.emit("player_disconnected", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
