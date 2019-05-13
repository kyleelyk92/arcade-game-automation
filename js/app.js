let gameTime = 0;
const incTimer = () => gameTime++;
const gameTimer = () => setInterval(incTimer, 1000);

class Enemy {
  constructor(x, y) {
    this.sprite = "images/enemy-bug.png";
    this.x = x;
    this.y = y;
    this.velX = (Math.random() + 1) * 70;
    this.width = 30;
    this.height = 30;
  }
  update(dt) {
    //handling bug speed and movement
    this.x += this.velX * dt * (Player.level * 0.8);
    if (this.x > 500) {
      this.x = -100;
    }
    //handling bug collision with player
    if (
      player.x - player.width < this.x + this.width &&
      player.x + player.width > this.x - this.width &&
      player.y + player.height > this.y - this.height &&
      player.y - player.height < this.y + this.height &&
      player.alive === true
    ) {
      player.alive = false;
      hitSound.play();
      player.lives--;
      player.lives > 0
        ? Swal.fire("Ewwwwwwwwwwwww!", `You touched it!`)
        : Swal.fire("Game Over!", `You made it to Level ${Player.level}`);
      setTimeout(() => {
        player.x = 100;
        player.y = 400;
        allEnemies = [
          new Enemy(-80, 60),
          new Enemy(-80, 145),
          new Enemy(-80, 225),
          new Enemy(-80, 310)
        ];
      }, 500);
      setTimeout(() => {
        player.alive = true;
      }, 1000);
    }
  }
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}

class Player {
  static level = 1;
  static highestlevel = 1;

  constructor(x, y) {
    this.sprite = "images/char-boy.png";
    this.x = x;
    this.y = y;
    this.lives = 3;
    this.width = 20;
    this.height = 20;
    this.alive = true;
  }
  update() {
    //win checker
    if (this.y < 60 && !this.win) {
      waterSound.play();
      this.alive = false;
      this.win = true;
      setTimeout(() => {
        this.y = 400;
        this.x = 100;
        this.alive = true;
        this.win = false;
        Player.level++;
        Swal.fire("Nice job!", `Level ${Player.level}`);
        if (Player.level > Player.highestlevel) {
          Player.highestlevel = Player.level;
        }
      }, 1500);
    }
    updateStats();
    //gameover
    if (player.lives === 0) {
      Player.level = 1;
      player.lives = 3;
    }
  }
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
  handleInput(key) {
    if (typeof key == "string") {
      if (key === "left" && this.x > 0 && this.alive === true) {
        this.x = this.x - 100;
      }
      if (key === "right" && this.x < 400 && this.alive === true) {
        this.x = this.x + 100;
      }
      if (key === "up" && this.y > 0 && this.alive === true) {
        this.y = this.y - 85;
      }
      if (key === "down" && this.y < 399 && this.alive === true) {
        this.y = this.y + 85;
      }
      if (player.y > 300) {
        grassSound.stop();
        grassSound.play();
      }
      if (player.y > 50 && player.y < 300) {
        stoneSound.play();
      }
    }
  }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

let allEnemies = [
  new Enemy(-80, 60),
  new Enemy(-80, 145),
  new Enemy(-80, 225),
  new Enemy(-80, 310)
];

let player = new Player(100, 400);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener("keyup", function(e) {
  var allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
  };
  player.handleInput(allowedKeys[e.keyCode]);
});

// code to insert the stats and level trackers, waiting for DOM content to load
const statsBar = document.createElement("div");
statsBar.innerHTML = `<div class='stats'> Lives: ${player.lives} Level: ${
  Player.level
}</div>`;

const levelCounter = document.createElement("div");
levelCounter.innerHTML = `<div class='levels'><h1>Level: ${Player.level}</h1>
<h1>Highest Level: ${Player.highestlevel}</h1></div>`;

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector("canvas")
    .insertAdjacentElement("beforebegin", statsBar);

  document
    .querySelector("canvas")
    .insertAdjacentElement("beforebegin", levelCounter);
});

const updateStats = () => {
  statsBar.innerHTML = `<h1 class='title'> BUGGER
  </h1>`;
  levelCounter.innerHTML = `<div class="levelbar"><h2>Level: ${
    Player.level
  }</h2><div class="lifecounter"><h2> Lives: ${player.lives}</h2></div>
  <h2>Highest Level: ${Player.highestlevel}</h2>`;
};

//sound class

class Sound {
  constructor(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function() {
      this.sound.play();
    };
    this.stop = function() {
      this.sound.pause();
      this.sound.currentTime = 0;
    };
  }
}
const hitSound = new Sound("sounds/diesound.mp3");
const waterSound = new Sound("sounds/watersplat.mp3");
const grassSound = new Sound("sounds/grass.wav");
const stoneSound = new Sound("sounds/stone.wav");

gameTimer();

//Character change functionality

document.addEventListener("DOMContentLoaded", function() {
  const formElement = document.createElement("div");
  formElement.innerHTML = `<form onsubmit='changeChar()'>
  <select player="chars" size="3">
    <option selected value="images/char-boy.png">Boy</option>
    <option value="images/char-cat-girl.png">Girl</option>
    <option value="images/char-horn-girl.png">Girl 2</option>
    <option value="images/char-pink-girl.png">Girl 3</option>
    <option value="images/char-princess-girl.png">Princess</option>
  </select>
<input type='submit' class='char-select' value='Change Character'>`;

  document
    .querySelector("canvas")
    .insertAdjacentElement("afterend", formElement);
});

document.addEventListener("DOMContentLoaded", function() {
  const charSelectButton = document.querySelector("form .char-select");
  charSelectButton.addEventListener("click", function(e) {
    e.preventDefault();
    player.sprite = document.querySelector("form select").value;
  });
});
