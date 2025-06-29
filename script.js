// Show section
function showGame(id) {
  document.querySelectorAll('.game-section').forEach(s => s.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

// ============ ROCK PAPER SCISSORS ============ //
let rpsUser = 0, rpsComp = 0, rpsRound = 0, rpsTotal = 5;
const winSound = new Audio('https://www.myinstants.com/media/sounds/smw_power-up.wav');
const loseSound = new Audio('https://www.myinstants.com/media/sounds/smw_lost_a_life.wav');
const drawSound = new Audio('https://www.myinstants.com/media/sounds/mario-coin.mp3');

function startRPSGame() {
  rpsUser = rpsComp = rpsRound = 0;
  rpsTotal = parseInt(document.getElementById('rps-rounds').value) || 5;
  document.getElementById('rps-setup').style.display = 'none';
  document.getElementById('rps-game').style.display = 'block';
  document.getElementById('rps-result').textContent = '';
  document.getElementById('rps-score').textContent = '';
  document.getElementById('rps-final').textContent = '';
  document.getElementById('rps-final').style.color = '';
  document.getElementById('rps-play-again').style.display = 'none';
  updateProgressBar(0);
}

function resetRPSGame() {
  document.getElementById('rps-setup').style.display = 'block';
  document.getElementById('rps-game').style.display = 'none';
}

function updateProgressBar(value) {
  const percent = (value / rpsTotal) * 100;
  document.getElementById('rps-progress-fill').style.width = percent + '%';
}

function rpsPlay(user) {
  if (rpsRound >= rpsTotal) return;
  const comp = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)];
  const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };
  const reasons = {
    rockscissors: "Rock crushes Scissors",
    paperrock: "Paper covers Rock",
    scissorspaper: "Scissors cut Paper"
  };
  let result = '', reason = '';
  if (user === comp) {
    result = "It's a Draw!";
    drawSound.play();
  } else if (
    (user === 'rock' && comp === 'scissors') ||
    (user === 'paper' && comp === 'rock') ||
    (user === 'scissors' && comp === 'paper')
  ) {
    rpsUser++;
    result = "You win this round!";
    winSound.play();
    reason = reasons[user + comp];
  } else {
    rpsComp++;
    result = "Computer wins this round!";
    loseSound.play();
    reason = reasons[comp + user];
  }
  rpsRound++;
  updateProgressBar(rpsRound);
  document.getElementById('rps-choices').innerHTML = `👤 You: <span class="rps-icon">${emojis[user]}</span> vs <span class="rps-icon">${emojis[comp]}</span> Computer`;
  document.getElementById('rps-reason').textContent = reason || '';
  document.getElementById('rps-result').textContent = result;
  document.getElementById('rps-score').textContent = `Score: You ${rpsUser} - ${rpsComp} Computer (Round ${rpsRound}/${rpsTotal})`;
  if (rpsRound === rpsTotal) {
    const final = document.getElementById('rps-final');
    document.getElementById('rps-play-again').style.display = 'inline-block';
    if (rpsUser > rpsComp) {
      final.textContent = "🎉 You Win the Game!";
      final.style.color = 'green';
      confetti({ particleCount: 100, spread: 70 });
    } else if (rpsComp > rpsUser) {
      final.textContent = "💻 Computer Wins the Game!";
      final.style.color = 'red';
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.2 } });
    } else {
      final.textContent = "⚖️ It's a Draw!";
      final.style.color = 'gold';
      confetti({ particleCount: 120, spread: 90 });
    }
  }
}

// ============ MEMORY GAME ============ //
let first = null, second = null, lock = false, match = 0, total = 0;
function startMemoryGame() {
  const count = parseInt(document.getElementById('memory-count').value);
  const icons = ['🍎','🍌','🍓','🍇','🍉','🥝','🍍','🍒','🥭','🍑'];
  const board = document.getElementById('memory-board');
  board.innerHTML = '';
  match = 0;
  total = count / 2;
  const cards = [...icons.slice(0, total), ...icons.slice(0, total)].sort(() => 0.5 - Math.random());
  board.style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(count))}, 1fr)`;
  cards.forEach(icon => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerText = '?';
    div.dataset.value = icon;
    div.onclick = () => flipCard(div);
    board.appendChild(div);
  });
  document.getElementById('memory-status').textContent = '';
}
function flipCard(card) {
  if (lock || card.classList.contains('flipped')) return;
  card.innerText = card.dataset.value;
  card.classList.add('flipped');
  if (!first) { first = card; return; }
  second = card;
  lock = true;
  if (first.dataset.value === second.dataset.value) {
    match++;
    if (match === total) {
      document.getElementById('memory-status').textContent = "🎉 All pairs matched!";
      confetti({ particleCount: 120, spread: 80 });
    }
    resetFlip();
  } else {
    setTimeout(() => {
      first.innerText = second.innerText = '?';
      first.classList.remove('flipped');
      second.classList.remove('flipped');
      resetFlip();
    }, 800);
  }
}
function resetFlip() {
  first = second = null;
  lock = false;
}

// ============ DICE GAME ============ //
let diceUser = 0, diceComp = 0, diceRound = 0, diceTotal = 5;
function startDiceGame() {
  diceUser = diceComp = diceRound = 0;
  diceTotal = parseInt(document.getElementById('dice-rounds').value);
  document.getElementById('dice-result').textContent = '';
  document.getElementById('dice-score').textContent = '';
  updateDiceFaces(1, 1);
}
function rollDice() {
  if (diceRound >= diceTotal) return;
  const user = Math.floor(Math.random() * 6) + 1;
  const comp = Math.floor(Math.random() * 6) + 1;
  updateDiceFaces(user, comp);
  diceRound++;
  if (user > comp) diceUser++;
  else if (comp > user) diceComp++;
  document.getElementById('dice-score').textContent = `Round ${diceRound}/${diceTotal} - You: ${diceUser} | Computer: ${diceComp}`;
  if (diceRound === diceTotal && diceUser > diceComp) {
    confetti({ particleCount: 150, spread: 100 });
  }
}
function updateDiceFaces(userVal, compVal) {
  const faces = [[], [4], [0,8], [0,4,8], [0,2,6,8], [0,2,4,6,8], [0,2,3,5,6,8]];
  const face = (val) => {
    const f = document.createElement('div');
    f.className = 'dice';
    for (let i = 0; i < 9; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      if (!faces[val].includes(i)) dot.style.opacity = 0;
      f.appendChild(dot);
    }
    return f;
  };
  document.getElementById('user-dice').innerHTML = '';
  document.getElementById('computer-dice').innerHTML = '';
  document.getElementById('user-dice').appendChild(face(userVal));
  document.getElementById('computer-dice').appendChild(face(compVal));
}
