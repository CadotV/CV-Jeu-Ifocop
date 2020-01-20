/**
 * @author: Valentin Cadot
 * @version: 1.0.0
 */

// CV
// TODO slow on tablet, blocked on mobile
// use URI CV
import { cvBase64 } from '../cvbase64';

// Config
import { gameConfig, gameDebug, backgroundConfig, enemyConfig, shieldPackConfig } from './config/config';

// Primitives
import Vector2 from './geometry/vector';
import Rectangle from './geometry/rectangle';

// GameComponents
import Player from './game_components/player/player';
import Enemy from './game_components/enemy/enemy';

// UI
import Score from './ui/score';
import Background from './background/background';
import Text from './ui/text';
import ShieldPack from './game_components/shieldPack/shieldPack';

// Ressources
import rulesImg from './Rules.jpg';

// Globals variables
// TODO: bind the context in the window.addEventListener
// Add a game world
var playerTarget = new Vector2(0, 0);

export default function Game(canvas) {
  this.canvas = canvas;

  this.ctx = canvas.getContext('2d');
  this.ctxBlackScreen = canvas.getContext('2d');
  this.ctxText = canvas.getContext('2d');
  this.ctxMenu = canvas.getContext('2d');
  this.ctxMenuRestart = canvas.getContext('2d');

  this.startTime = -1;
  this.animationLength = 2000;

  // store calls to requestAnimationFrame
  this.rafID = null;

  this.playerReachStartPos = false;

  // initiale position for every gameComponents
  this.initPos = new Vector2(0, 0);

  this.rulesImage = new Image();
  this.rulesImage.src = rulesImg;

  this.totalScore = 0;

  this.buttonShowDebug = false;

  this.spawnEnemyTimer = enemyConfig.enemySpeedSpawn;
  this.spawnShieldPackTimer = shieldPackConfig.shieldPackSpeedSpawn;
}

Game.prototype.menuScreen = function () {
  this.ctxMenu.clearRect(0, 0, this.canvas.width, this.canvas.height);

  this.buttonArr = [];

  let startButton = {
    width: 600,
    height: 150,
    left: 0,
    top: 0,
    text: 'Start',
    render: function (context) {
      context.fillStyle = "#372F3F";
      context.fillRect(this.left, this.top, this.width, this.height);
      context.font = `bold 64px Monospace`;
      context.fillStyle = "grey";
      context.fillText(`${this.text}`, this.left + this.width / 2 - 95, this.top + this.height / 2 + 20);
    },
    center: function (canvas) {
      this.left = canvas.width / 2 - this.width / 2;
      this.top = 100;
    },
    click: () => {
      this.ctxMenu.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvas.removeEventListener('click', buttonClick);
      this.canvas.removeEventListener('mouseover', buttonHover);
      this.buttonArr = [];
      // this is Game object
      this.start();
    },
    hover: () => {
      this.ctxMenu.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctxMenu.fillStyle = "#372F00";
      this.ctxMenu.fillRect(this.left, this.top, this.width, this.height);
      this.ctxMenu.font = `bold 64px Monospace`;
      this.ctxMenu.fillStyle = "white";
      this.ctxMenu.fillText(`${this.text}`, this.left + this.width / 2 - 95, this.top + this.height / 2 + 20);
    }
  };

  this.buttonArr.push(startButton);

  let debugButton = {
    width: 600,
    height: 150,
    left: 0,
    top: 0,
    text: 'Show debug',
    showDebug: this.buttonShowDebug,
    render: function (context) {
      if (!this.showDebug) {
        this.showDebug = !this.showDebug;
        context.fillStyle = "#372F3F";
        context.fillRect(this.left, this.top, this.width, this.height);
        context.font = `bold 64px Monospace`;
        context.fillStyle = "grey";
        context.fillText(`${this.text}`, this.left + this.width / 2 - 185, this.top + this.height / 2 + 20);
      } else {
        this.showDebug = !this.showDebug;
        context.fillStyle = "green";
        context.fillRect(this.left, this.top, this.width, this.height);
        context.font = `bold 64px Monospace`;
        context.fillStyle = "grey";
        context.fillText(`${this.text}`, this.left + this.width / 2 - 185, this.top + this.height / 2 + 20);
      }
    },
    center: function (canvas) {
      this.left = canvas.width / 2 - this.width / 2;
      this.top = 300;
    },
    click: () => {
      this.buttonShowDebug = !this.buttonShowDebug;
      gameDebug.flagDebug = this.buttonShowDebug;
      this.buttonArr.forEach(button => {
        button.render(this.ctxMenu);
      })
    },
    hover: () => {
      this.ctxMenu.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctxMenu.fillStyle = "#372F00";
      this.ctxMenu.fillRect(this.left, this.top, this.width, this.height);
      this.ctxMenu.font = `bold 64px Monospace`;
      this.ctxMenu.fillStyle = "white";
      this.ctxMenu.fillText(`${this.text}`, this.left + this.width / 2 - 95, this.top + this.height / 2 + 20);
    }
  };

  this.buttonArr.push(debugButton);

  let rulesButton = {
    width: 600,
    height: 0,
    left: 0,
    top: 0,
    img: this.rulesImage,
    render: function (context) {
      context.drawImage(
        this.img,
        0,
        this.top,
        this.width,
        this.height
      );
    },
    center: function (canvas) {
      this.left = canvas.width / 2 - this.width / 2;
      this.top = 500;
      this.width = canvas.width;
      this.height = canvas.height - this.top;
    },
    click: () => {
    },
    hover: () => {
    }
  };

  this.buttonArr.push(rulesButton);

  this.rulesImage.onload = () => {
    this.buttonArr.forEach(button => {
      button.center(this.canvas);
      button.render(this.ctxMenu);
    })
  }

  this.canvas.buttons = this.buttonArr;

  this.canvas.addEventListener('click', buttonClick);
  this.canvas.addEventListener('mouseover', buttonHover);
}

/** 
 * TODO Same as startButton - factorise !
 */
Game.prototype.restartScreen = function () {
  this.ctxMenuRestart.clearRect(0, 0, this.canvas.width, this.canvas.height);

  this.buttonArr = [];

  let restartButton = {
    width: 600,
    height: 150,
    left: 0,
    top: 0,
    text: 'Restart',
    render: function (context) {
      context.fillStyle = "#372F3F";
      context.fillRect(this.left, this.top, this.width, this.height);
      context.font = `bold 64px Monospace`;
      context.fillStyle = "grey";
      context.fillText(`${this.text}`, this.left + this.width / 2 - 120, this.top + this.height / 2 + 20);
    },
    center: function (canvas) {
      this.left = canvas.width / 2 - this.width / 2;
      this.top = 100;
    },
    click: () => {
      this.ctxMenuRestart.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvas.removeEventListener('click', buttonClick);
      this.canvas.removeEventListener('touchdown', buttonClick);
      this.canvas.removeEventListener('mouseover', buttonHover);
      this.buttonArr = [];
      // this is Game object
      this.start();
    },
    hover: () => {
      this.ctxMenuRestart.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctxMenuRestart.fillStyle = "#372F00";
      this.ctxMenuRestart.fillRect(this.left, this.top, this.width, this.height);
      this.ctxMenuRestart.font = `bold 64px Monospace`;
      this.ctxMenuRestart.fillStyle = "white";
      this.ctxMenuRestart.fillText(`${this.text}`, this.left + this.width / 2 - 120, this.top + this.height / 2 + 20);
    }
  };

  this.buttonArr.push(restartButton);

  let debugButton = {
    width: 600,
    height: 150,
    left: 0,
    top: 0,
    text: 'Show debug',
    showDebug: this.buttonShowDebug,
    render: function (context) {
      if (!this.showDebug) {
        this.showDebug = !this.showDebug;
        context.fillStyle = "#372F3F";
        context.fillRect(this.left, this.top, this.width, this.height);
        context.font = `bold 64px Monospace`;
        context.fillStyle = "grey";
        context.fillText(`${this.text}`, this.left + this.width / 2 - 185, this.top + this.height / 2 + 20);
      } else {
        this.showDebug = !this.showDebug;
        context.fillStyle = "green";
        context.fillRect(this.left, this.top, this.width, this.height);
        context.font = `bold 64px Monospace`;
        context.fillStyle = "grey";
        context.fillText(`${this.text}`, this.left + this.width / 2 - 185, this.top + this.height / 2 + 20);
      }
    },
    center: function (canvas) {
      this.left = canvas.width / 2 - this.width / 2;
      this.top = 300;
    },
    click: () => {
      this.buttonShowDebug = !this.buttonShowDebug;
      gameDebug.flagDebug = this.buttonShowDebug;
      this.buttonArr.forEach(button => {
        button.render(this.ctxMenuRestart, this.totalScore);
      })
    },
    hover: () => {
      this.ctxMenu.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctxMenu.fillStyle = "#372F00";
      this.ctxMenu.fillRect(this.left, this.top, this.width, this.height);
      this.ctxMenu.font = `bold 64px Monospace`;
      this.ctxMenu.fillStyle = "white";
      this.ctxMenu.fillText(`${this.text}`, this.left + this.width / 2 - 95, this.top + this.height / 2 + 20);
    }
  };

  this.buttonArr.push(debugButton);

  let downloadCV = {
    width: 600,
    height: 150,
    left: 0,
    top: 0,
    text: 'Download my CV',
    render: function (context) {
      context.fillStyle = "#372F3F";
      context.fillRect(this.left, this.top, this.width, this.height);
      context.font = `bold 64px Monospace`;
      context.fillStyle = "grey";
      context.fillText(`${this.text}`, this.left + this.width / 2 - 265, this.top + this.height / 2 + 20);
    },
    center: function (canvas) {
      this.left = canvas.width / 2 - this.width / 2;
      this.top = 500;
    },
    stringWidth: (text) => {
      return (text.length + this.totalScore.toString().length) * 19;
    },
    click: function () {
      window.open("data:application/pdf;base64, " + cvBase64);
    },
    hover: () => { }
  }

  this.buttonArr.push(downloadCV);

  let totalScore = {
    width: 600,
    height: 150,
    left: 0,
    top: 0,
    text: 'final score : ',
    render: function (ctx, score) {
      ctx.font = `bold 64px Monospace`;
      ctx.fillStyle = "white";
      ctx.fillText(`${this.text}${score}`, this.left + this.width / 2 - this.stringWidth(this.text), this.top + this.height / 2 + 20);
    },
    center: function (canvas) {
      this.left = canvas.width / 2 - this.width / 2;
      this.top = 700;
    },
    stringWidth: (text) => {
      return (text.length + this.totalScore.toString().length) * 19;
    },
    click: () => { },
    hover: () => { }
  };

  this.buttonArr.push(totalScore);


  this.buttonArr.forEach(button => {
    button.center(this.canvas);
    button.render(this.ctxMenuRestart, this.totalScore);
  })

  this.canvas.buttons = this.buttonArr;

  this.canvas.addEventListener('click', buttonClick);
  this.canvas.addEventListener('touchdown', buttonClick);
  this.canvas.addEventListener('mouseover', buttonHover);
}

function buttonClick(event) {
  var x = event.pageX - this.offsetLeft;
  var y = event.pageY - this.offsetTop;

  this.buttons.forEach(button => {
    if (y > button.top && y < button.top + button.height
      && x > button.left && x < button.left + button.width) {
      button.click();
    }
  });
}

function buttonHover(event) {
  var x = event.pageX - this.offsetLeft;
  var y = event.pageY - this.offsetTop;

  this.buttons.forEach(button => {
    if (y > button.top && y < button.top + button.height
      && x > button.left && x < button.left + button.width) {
      button.hover();
    }
  });
}


Game.prototype.start = function () {
  // setTimeout(function () {
  //   // preload stuff
  // }, 1000);
  this.listener();
  this.init();
}

Game.prototype.reset = function () {
  this.restartScreen();
}

Game.prototype.init = function () {
  // CTX
  this.ctxBlackScreen.globalAlpha = 0;

  this.flagDrawPending = false;

  // Score
  this.totalScore = 0;

  // UI
  this.score = new Score(this.canvas);

  // Text
  this.readyText = new Text(this.canvas, 'Ready ?', new Vector2(0, 0), 128, gameDebug);
  // Background
  this.background = new Background(this.canvas,
    backgroundConfig.nbBackgroundStars,
    backgroundConfig.nbForegroundStars,
    backgroundConfig.nbBackgroundFogs,
    backgroundConfig.nbForegroundFogs,
    gameConfig.gameSpeed);

  // Player
  // To set player position outside canvas, make a teleport function
  // when player is instantiate, teleport to the position
  playerTarget.x = this.canvas.width / 2;
  playerTarget.y = this.canvas.height / 2;

  this.player = new Player(this.canvas, this.initPos, gameConfig.gameScale, gameDebug);
  this.playerReachStartPos = false;
  let playerStartPos = new Vector2(this.canvas.width / 2, this.canvas.height + this.player.gameComponent.physicsBody.radius * 2);
  this.player.gameComponent.teleport(playerStartPos);

  // Enemies
  this.enemyArr = [];
  this.allEnemyArr = [];

  this.shieldPackArr = [];

  // Projectiles
  this.projectileArr = [];

  // Scale the game before lauching the loop
  this.scale();

  // start the game loop
  requestAnimationFrame(this.requestRedraw.bind(this));
}

// TODO use () => function or .bind() to get the context ?
Game.prototype.listener = function () {
  // Touch listeners
  this.canvas.addEventListener('touchstart', touchHandler, false);
  this.canvas.addEventListener('touchmove', touchHandler, false);

  // Mouse Listeners
  this.canvas.addEventListener('mosuedown', mouseHandler, false);
  this.canvas.addEventListener('mousemove', mouseHandler, false);

  // Add condition if using mobile device
  
};

// TODO: add focus on canvas to avoid scrolling the document and avoid player leaving the canvas
function touchHandler(event) {
  event.preventDefault();
  event = event.touches[0];
  playerTarget = new Vector2(event.pageX, event.pageY);
}

function mouseHandler(event) {
  event.preventDefault();
  playerTarget = new Vector2(event.pageX, event.pageY);
}

// unreference destroyed gameComponents so garbage collector can delete them
Game.prototype.updateDestroyed = function () {
  for (let i = 0; i < this.enemyArr.length; i++) {
    if (this.enemyArr[i].destroyed) {
      // remove the enemy
      // this.player.enemyInAggroArr.splice(i, 1);
      this.player.enemyInAggroArr.splice(this.player.enemyInAggroArr.indexOf(this.enemyArr[i].id), 1);
      // ! Delete the object at last, because reference is lost for other operation
      this.enemyArr.splice(i, 1);
    }

    for (let i = 0; i < this.shieldPackArr.length; i++) {
      if (this.shieldPackArr[i].destroyed) {
        this.shieldPackArr.splice(i, 1);
      }
    }

    if (undefined !== this.player && this.player.destroyed) {
      this.player = null;
      delete this.player;
    }

    if (undefined !== this.readyText && this.readyText.destroyed) {
      this.readyText = null;
      delete this.readyText;
    }
  }
}

Game.prototype.updateScore = function () {
  if (undefined !== this.player) {
    var enemyTotalScore = 0;
    this.allEnemyArr.forEach(enemy => {
      enemyTotalScore += enemy.score;
    });
    this.score.update(enemyTotalScore + this.player.score);
    this.totalScore = this.score.score;
  }
}

/**
 * Scale the gameComponents and physicsBody
 */
Game.prototype.scale = function () {
  this.enemyArr.forEach(enemy => {
    enemy.gameComponent.physicsBody.scale(gameConfig.gameScale);
  })

  this.player.gameComponent.physicsBody.scale(gameConfig.gameScale);
}

Game.prototype.spawnShieldPack = function () {
  this.spawnShieldPackTimer -= Math.random();

  if (this.spawnShieldPackTimer <= 0) {
    this.spawnShieldPackTimer = shieldPackConfig.shieldPackSpeedSpawn;
    this.shieldPackArr.push(new ShieldPack(this.canvas, gameDebug));
  }
}

/**
 * Spawn random enemies based on score
 */
Game.prototype.spawnRandomEnemy = function () {
  this.spawnEnemyTimer -= Math.random();

  if (this.spawnEnemyTimer <= 0) {
    this.spawnEnemyTimer = enemyConfig.enemySpeedSpawn;

    var enemy = new Enemy(this.canvas, this.initPos, gameDebug);

    var spawnX = null;
    var spawnY = null

    let randomSideCanvas = Math.round(Math.random() * 3); // choose a side of canvas
    switch (randomSideCanvas) {
      case 0: // top side
        spawnX = Math.round(Math.random() * (this.canvas.width - enemy.gameComponent.physicsBody.radius * 2)) + enemy.gameComponent.physicsBody.radius;
        spawnY = - enemy.gameComponent.physicsBody.radius * 2;
        break;
      case 1: // bottom side
        spawnX = Math.round(Math.random() * (this.canvas.width - enemy.gameComponent.physicsBody.radius * 2)) + enemy.gameComponent.physicsBody.radius;
        spawnY = this.canvas.height + enemy.gameComponent.physicsBody.radius;
        break;
      case 2: // Left side
        spawnX = - enemy.gameComponent.physicsBody.radius;
        spawnY = Math.round(Math.random() * (this.canvas.height - enemy.gameComponent.physicsBody.radius * 2)) + enemy.gameComponent.physicsBody.radius;
        break;
      case 3: // Right side
        spawnX = this.canvas.width + enemy.gameComponent.physicsBody.radius;
        spawnY = Math.round(Math.random() * (this.canvas.height - enemy.gameComponent.physicsBody.radius * 2)) + enemy.gameComponent.physicsBody.radius;
        break;
      default: console.log('Bug');
    }

    enemy.gameComponent.teleport(new Vector2(spawnX, spawnY));
    this.enemyArr.push(enemy);
    this.allEnemyArr.push(enemy);
  }
}
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!! Separate physics from graphics !!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/**
 * Update the game logic and physic
 */
Game.prototype.update = function () {
  // UI
  this.updateScore();

  // background
  this.background.update();

  // gameComponents
  this.updateDestroyed();

  // player and enemies
  if (!this.playerReachStartPos) {
    this.player.reachStartPos();
    this.player.update(this.enemyArr);
    if (this.player.reachStartPos()) {
      this.playerReachStartPos = true;
      console.log('game start !');
      this.readyText.changeText('GO !!!');
      this.readyText.destroy();
    }
  } else {
    if (undefined !== this.player) {
      this.player.moveTouch(playerTarget);
      this.player.update(this.enemyArr);
      this.spawnRandomEnemy();
      this.spawnShieldPack();

      this.shieldPackArr.forEach(shieldPack => {
        shieldPack.move(this.player);
        shieldPack.update();
      })

      this.enemyArr.forEach(enemy => {
        if (enemy.reachStartPos) {
          if (undefined !== this.player) {
            enemy.move(this.player);
          } else {
            enemy.move();
          }
        } else {
          if (undefined !== this.player) {
            enemy.moveStartPos(this.player);
          } else {
            enemy.moveStartPos();
          }
        }
        enemy.update(this.player);
      })
    }
  }
  // this.projectileArr.forEach(projectile => {
  //   projectile.update();
  // })
}

/**
 * Update the game graphics
 */
Game.prototype.render = function () {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.ctxBlackScreen.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.ctxText.clearRect(0, 0, this.canvas.window, this.canvas.height);

  // Draw a black background fading while player didn't reach the startPos
  //// to avoid the ugly background rendering at start
  if (!this.playerReachStartPos) {
    this.ctxBlackScreen.fillStyle = 'black';
    this.ctxBlackScreen.globalAlpha += 0.008;
  } else {
    this.ctxBlackScreen.globalAlpha = 1;
  }

  // Background
  this.background.render(this.ctx);

  // UI
  this.score.render(this.ctx);

  // Enemies
  this.enemyArr.forEach(enemy => {
    enemy.render(this.ctx);
  })

  this.shieldPackArr.forEach(shieldPack => {
    shieldPack.render(this.ctx);
  })

  // Text
  if (undefined !== this.readyText) {
    this.readyText.render(this.ctxText);
  }

  // Player
  if (undefined !== this.player) {
    this.player.render(this.ctx);
  }
}
/**
 * Game loop: redraw the game physics and graphics
 */
Game.prototype.redraw = function () {
  if (undefined !== this.player) {
    this.flagDrawPending = false;
    this.update();
    this.render();
    this.requestRedraw();
  } else {
    this.reset();
  }
}

// Use 2 functions calling each others to keep RAF singleton (avoid drawings same thing multiple times). With flagDrawPending
/**
 * Game loop: manage RequestAnimationFrame timestamp, singleton and fps
 * @param {Float} timestamp - the time between each call to RAF
 */
Game.prototype.requestRedraw = function (timestamp) {
  if (!this.flagDrawPending) {
    this.flagDrawPending = true;

    let progress = 0;

    if (this.startTime < 0) {
      this.startTime = timestamp;
    } else {
      progress = timestamp - this.startTime;
    }

    // TODO: DRY!
    if (progress < this.animationLength) {
      this.rafID = requestAnimationFrame(this.redraw.bind(this));
    } else {
      // TODO: look if necessary ?
      this.startTime = -1;
      this.rafID = requestAnimationFrame(this.redraw.bind(this));
    }
  }
}
