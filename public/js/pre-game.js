document.addEventListener('DOMContentLoaded', () => {
  let gameStarted = false; // Initialize gameStarted flag

  // Handle the gameState event to receive the gameStarted flag from the server
  socket.on('gameState', (state) => {
    gameStarted = state;
    // Check if the game has already started
    if (gameStarted) {
      // Hide the pre-game section and show the game section
      document.getElementById('preGame').style.display = 'none';
      document.getElementById('game').style.display = 'block';
      return; // Exit early if the game has already started
    }
    
    // Otherwise, run the pre-game logic
    const characters = document.querySelectorAll('.character');
    const checkInButton = document.getElementById('checkInButton');
    const preGameMessage = document.getElementById('preGameMessage');

    let selectedCharacter = null;

    characters.forEach(character => {
      character.addEventListener('click', () => {
        characters.forEach(c => c.classList.remove('selected'));
        character.classList.add('selected');
        selectedCharacter = character.dataset.character;
        checkInButton.removeAttribute('disabled');
      });
    });

    checkInButton.addEventListener('click', () => {
      if (selectedCharacter) {
        socket.emit('checkIn', selectedCharacter);
        // Show the waiting message if preGameMessage exists
        if (preGameMessage) {
          preGameMessage.textContent = 'Waiting for the second player to join.';
        } else {
          console.error("preGameMessage element not found");
        }
        // Disable character selection and check-in button
        characters.forEach(character => character.setAttribute('disabled', 'disabled'));
        checkInButton.setAttribute('disabled', 'disabled');
      }
    });

    // Handle the startGame event
    socket.on('startGame', () => {
      // Hide the pre-game section
      document.getElementById('preGame').style.display = 'none';
      // Show the game section
      document.getElementById('game').style.display = 'block';

      // You can also include any additional initialization or logic for starting the game here
      // For example, if gomoku.js needs any initialization, call it here
      // initGame();
    });
  });
});
