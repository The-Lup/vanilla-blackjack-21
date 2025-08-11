const blackjackModule = (() => {
  'use strict';

  let deck = [];
  const cardTypes = ['C', 'D', 'H', 'S'],
    specialCards = ['A', 'J', 'Q', 'K'];

  let playersPoints = [];

  // HTML references
  const btnHit = document.querySelector('#btnHit'),
    btnStand = document.querySelector('#btnStand'),
    btnNew = document.querySelector('#btnNew');

  const divPlayersCards = [
    document.querySelector('#ply-cards'),
    document.querySelector('#comp-cards'),
  ];

  const scrAccum = document.querySelectorAll('h2 small');

  // ========== Final message on screen at the bottom ==========
  const messageContainer = document.createElement('div');
  messageContainer.id = 'game-message';
  document.body.appendChild(messageContainer);

  function showMessage(text, duration = 3000) {
    messageContainer.textContent = text;
    messageContainer.style.opacity = '1';
    messageContainer.style.pointerEvents = 'auto';

    setTimeout(() => {
      messageContainer.style.opacity = '0';
      messageContainer.style.pointerEvents = 'none';
    }, duration);
  }
  // ================================================================

  // ======== Deck Counter ========
  const deckCounter = document.createElement('div');
  deckCounter.id = 'deck-counter';
  deckCounter.innerHTML = `
    <div class="counter-container">
      <span class="counter-label">Cards left</span>
      <span class="counter-value">0</span>
    </div>
  `;

  document.body.appendChild(deckCounter);

  // Update the deck counter display and color based on remaining cards
  const updateDeckCounter = () => {
    const valueElement = deckCounter.querySelector('.counter-value');
    if (!valueElement) return;

    valueElement.textContent = deck.length;

    deckCounter.classList.remove('bg-low', 'bg-medium', 'bg-high');

    if (deck.length < 10) {
      deckCounter.classList.add('bg-low');
    } else if (deck.length < 20) {
      deckCounter.classList.add('bg-medium');
    } else {
      deckCounter.classList.add('bg-high');
    }
  };

  // Simple function to get the value of a card, Ace always counts as 11
  const cardValue = (card) => {
    const value = card.substring(0, card.length - 1);
    return isNaN(value) ? (value === 'A' ? 11 : 10) : parseInt(value);
  };

  // Store the cards each player has
  let playersCards = [[], []];

  // Create and shuffle a new deck
  const createDeck = () => {
    const newDeck = [];
    for (let i = 2; i <= 10; i++) {
      for (let type of cardTypes) {
        newDeck.push(i + type);
      }
    }
    for (let type of cardTypes) {
      for (let special of specialCards) {
        newDeck.push(special + type);
      }
    }
    return _.shuffle(newDeck);
  };

  // Take a card from the deck, update counter
  const takeCard = () => {
    if (deck.length === 0) {
      throw new Error('No cards left in the deck.');
    }
    const card = deck.pop();
    updateDeckCounter();
    return card;
  };

  // Update player's points and UI score display
  const accumulatePoints = (card, turn) => {
    playersPoints[turn] += cardValue(card);
    scrAccum[turn].innerText = playersPoints[turn];
    return playersPoints[turn];
  };

  // Create card image element and append to player's card container
  const createCard = (card, turn) => {
    const imgCard = document.createElement('img');
    imgCard.src = `./01-Blackjack/assets/cartas/${card}.png`;
    imgCard.classList.add('cards');
    divPlayersCards[turn].appendChild(imgCard);
  };

  // Show final game result message on UI
  const checkWinner = () => {
    const [playerPoints, computerPoints] = playersPoints;

    setTimeout(() => {
      if (playerPoints > 21) {
        showMessage('You busted! You lose 😞');
      } else if (computerPoints > 21) {
        showMessage('Computer busted! You win 🎉');
      } else if (playerPoints === computerPoints) {
        showMessage('Tie! 🤝');
      } else if (
        (playerPoints > computerPoints && playerPoints <= 21) ||
        computerPoints > 21
      ) {
        showMessage('You won!!! 🎉');
      } else {
        showMessage('You Lose!!! 😢');
      }
    }, 200);
  };

  // Computer's turn logic: draw until beats player's score or busts
  const computerTurn = (playerPoints) => {
    let computerPoints = 0;
    do {
      const card = takeCard();
      playersCards[1].push(card);
      createCard(card, 1);
      computerPoints = accumulatePoints(card, 1);
    } while (computerPoints < playerPoints && playerPoints <= 21);

    checkWinner();
  };

  // Initialize a new game: reset points, cards and deck
  const initializeGame = (numPlayers = 2) => {
    playersPoints = [];
    playersCards = [[], []];
    scrAccum.forEach((elem) => (elem.innerText = '0'));
    divPlayersCards.forEach((div) => (div.innerHTML = ''));

    for (let i = 0; i < numPlayers; i++) {
      playersPoints.push(0);
      playersCards[i] = [];
    }

    deck = createDeck();

    btnHit.disabled = false;
    btnStand.disabled = false;

    updateDeckCounter();
    console.clear();
    console.log('New deck created:', deck.length, 'cards');
  };

  // Event listener for "Hit" button: player draws card
  btnHit.addEventListener('click', () => {
    const card = takeCard();
    playersCards[0].push(card);
    createCard(card, 0);
    const playerPoints = accumulatePoints(card, 0);

    if (playerPoints > 21) {
      console.warn('You Lose');
      btnHit.disabled = true;
      btnStand.disabled = true;
      computerTurn(playerPoints);
    } else if (playerPoints === 21) {
      console.warn('21, You Win!');
      btnHit.disabled = true;
      btnStand.disabled = true;
      computerTurn(playerPoints);
    }
  });

  // Event listener for "Stand" button: player's turn ends, computer's turn starts
  btnStand.addEventListener('click', () => {
    btnHit.disabled = true;
    btnStand.disabled = true;
    computerTurn(playersPoints[0]);
  });

  // Event listener for "New Game" button: reset game
  btnNew.addEventListener('click', () => initializeGame());

  // Start the game on load
  initializeGame();

  return {
    newGame: initializeGame,
  };
})();
