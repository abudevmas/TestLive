const BASE_COLORS = ['green', 'yellow', 'red', 'blue', 'purple', 'orange', 'brown', 'pink'];
let level = 1;
let selectedTube = null;
let gameContainer = document.getElementById('game');
let tubeCapacity = 4;

function shuffle(array) {
  let a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startGame() {
  document.getElementById('instructions').style.display = 'none';
  document.getElementById('levelContainer').style.display = 'block';
  createLevel(level);
}

function createLevel(level) {
  gameContainer.innerHTML = '';
  document.getElementById('level').innerText = `Level: ${level}`;
  selectedTube = null;

  const colorCount = 3 + (level - 1);
  const colorsUsed = BASE_COLORS.slice(0, colorCount);
  const tubesCount = colorCount + 1;

  let colorPieces = [];
  colorsUsed.forEach(color => {
    for (let i = 0; i < tubeCapacity; i++) {
      colorPieces.push(color);
    }
  });

  colorPieces = shuffle(colorPieces);

  let tubes = Array.from({ length: tubesCount }, () => []);
  let index = 0;

  for (let i = 0; i < colorPieces.length; i++) {
    tubes[index].push(colorPieces[i]);
    index = (index + 1) % (tubesCount - 1); // leave 1 tube empty
  }

  tubes.forEach((colors, i) => {
    let tube = document.createElement('div');
    tube.className = 'tube';
    tube.dataset.index = i;
    renderColors(tube, colors);
    tube.addEventListener('click', () => handleClick(i, tubes));
    gameContainer.appendChild(tube);
  });

  window.currentTubes = tubes;
}

function renderColors(tubeElement, colors) {
  tubeElement.innerHTML = '';
  for (let i = 0; i < colors.length; i++) {
    let colorDiv = document.createElement('div');
    colorDiv.className = `color ${colors[i]}`;
    tubeElement.appendChild(colorDiv);
  }
}

function handleClick(index, tubes) {
  let current = tubes[index];

  if (selectedTube === null) {
    if (current.length === 0) return;
    selectedTube = index;
  } else {
    if (selectedTube === index) {
      selectedTube = null;
      return;
    }

    let from = tubes[selectedTube];
    let to = tubes[index];

    if (to.length < tubeCapacity) {
      // ✅ Allow any move to any tube
      to.push(from.pop());
      updateTubes(tubes);
      selectedTube = null;

      if (checkWin(tubes)) {
        setTimeout(() => {
          alert('🎉 Congratulations! Level Completed!');
          level++;
          createLevel(level);
        }, 800);
      }
    } else {
      selectedTube = null;
    }
  }
}

function updateTubes(tubes) {
  let tubeDivs = document.querySelectorAll('.tube');
  tubes.forEach((colors, i) => {
    renderColors(tubeDivs[i], colors);
  });
}

function checkWin(tubes) {
  return tubes.every(tube => {
    return tube.length === 0 || (new Set(tube).size === 1 && tube.length === tubeCapacity);
  });
}
