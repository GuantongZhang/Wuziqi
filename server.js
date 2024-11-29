const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let chatHistory = [];
let checkedInPlayers = [];
let placedStones
let gameStarted = false; // Flag to indicate whether the game has started

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.emit('chatHistory', chatHistory);
  
  // Send the game state to the client when it connects
  socket.emit('gameState', gameStarted);

  socket.on('message', (message) => {
    console.log('Message received: ', message);
    chatHistory.push(message);
    io.emit('message', message);
  });

  // Handle the checkIn event
  socket.on('checkIn', (character) => {
    checkedInPlayers.push({ id: socket.id, character });
    if (checkedInPlayers.length === 1 && !gameStarted) {
      // Send a message to the first player indicating waiting for the second player
      io.to(socket.id).emit('waitingForSecondPlayer');
    } else if (checkedInPlayers.length === 2 && !gameStarted) {
      // Emit the startGame event along with game state and checked-in players
      io.emit('startGame', { gameStarted, checkedInPlayers });
      gameStarted = true; // Set gameStarted flag to true
    }
  });

  socket.on('placeStone', ({ row, col }) => {
    io.emit('stonePlaced', { row, col });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    checkedInPlayers = checkedInPlayers.filter(player => player.id !== socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
