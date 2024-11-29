const socket = io();

const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

// Function to append a message to the message container
function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messages.appendChild(messageElement);
}

// Listen for chat history from the server
socket.on('chatHistory', (history) => {
  // Display chat history
  history.forEach(message => {
    appendMessage(message);
  });
});

sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  if (message.trim() !== '') {
    socket.emit('message', message);
    messageInput.value = '';
  }
});

socket.on('message', (message) => {
  // Display the received message directly on the screen
  appendMessage(message);
});



// JavaScript code to generate the intersections dynamically
const gameBoard = document.getElementById('gameBoard');

// Function to create intersections
function createIntersection(row, col) {
  const intersection = document.createElement('div');
  intersection.classList.add('intersection');
  intersection.dataset.row = row;
  intersection.dataset.col = col;
  gameBoard.appendChild(intersection);
}

// Create 15x15 grid
for (let row = 0; row < 15; row++) {
  for (let col = 0; col < 15; col++) {
    createIntersection(row, col);
  }
}

// Event listener for placing stones on intersections
gameBoard.addEventListener('click', (event) => {
  const intersection = event.target;
  if (intersection.classList.contains('intersection')) {
    placeStone(intersection);
  }
});


// Maintain a map to keep track of placed stones
const placedStones = {};

// Function to place a stone on the clicked intersection
function placeStone(intersection) {
  const row = intersection.dataset.row;
  const col = intersection.dataset.col;

  // Check if a stone is already placed on this intersection
  if (!placedStones[`${row}-${col}`]) {
    // Create a black stone element
    const stone = document.createElement('div');
    stone.classList.add('stone');
    // Append the stone to the clicked intersection
    intersection.appendChild(stone);
    // Mark this intersection as occupied by a stone
    placedStones[`${row}-${col}`] = true;

    // Emit an event to inform other clients about the placed stone
    socket.emit('placeStone', { row, col });
  }
}

// Listen for stone placement events from the server
socket.on('stonePlaced', ({ row, col }) => {
  const intersection = document.querySelector(`.intersection[data-row="${row}"][data-col="${col}"]`);
  if (intersection && !placedStones[`${row}-${col}`]) {
    // Create a black stone element
    const stone = document.createElement('div');
    stone.classList.add('stone');
    // Append the stone to the intersection
    intersection.appendChild(stone);
    // Mark this intersection as occupied by a stone
    placedStones[`${row}-${col}`] = true;
  }
});