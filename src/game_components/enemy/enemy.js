/**
 * @author: Valentin Cadot
 * @version: 1.0.0
 * 
 */

// primitives
import Circle from '../../geometry/circle';
import Vector2 from '../../geometry/vector';

import Helper from '../../geometry/helper';
import Projectile from '../projectiles/projectile';
import Collision from '../../collision';

// Ressources
import enemyImg from './img/enemy_spriteTile.png';
import GameComponent from '../gameComponent';
import Cannon from '../cannon/cannon';
import UiHealth from '../../ui/game_components/uiHealth';
import Reactor from '../reactor/reactor';

/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {Vector2} startPos 
 * @param {Boolean} debug 
 */

// Global variables
var id = 0;

export default function Enemy(canvas, startPos, debug) {
  this.canvas = canvas;
  this.radius = 60;

  // TODO enemy and player are generic objects, health should be set in abstract objects
  this.health = 200;
  this.shield = 0;

  this.score = 0;

  this.id = id++;

  let physicsBody = new Circle(startPos.x, startPos.y, this.radius, true);
  let graphicsBody = new Image();
  graphicsBody.src = enemyImg;

  this.gameComponent = new GameComponent(canvas, physicsBody, graphicsBody, true, false, debug);
  this.aggroRadius = new Circle(physicsBody.x, physicsBody.y, 400);
  this.satelliteRadius = new Circle(physicsBody.x, physicsBody.y, 100);
  this.cannon = new Cannon(canvas, physicsBody, 30, 'red', 0.1, 'enemy', debug);
  //this.reactor = new Reactor(canvas, physicsBody, this.gameComponent.angle, debug);
  //this.reactorOffset = this.reactor.offset;

  // UI
  this.uiHealth = new UiHealth(physicsBody, this.health, this.shield, debug);


  this.aggro = false;
  this.satellite = false;

  this.reachStartPos = false;
  this.reachRandPos = false;

  let randomX = Math.round(Math.random() * (this.canvas.width - this.gameComponent.physicsBody.radius * 2)) + this.gameComponent.physicsBody.radius;
  let randomY = Math.round(Math.random() * (this.canvas.height - this.gameComponent.physicsBody.radius * 2)) + this.gameComponent.physicsBody.radius;
  this.randomPosInCanvas = new Vector2(randomX, randomY);
  this.randomPos = this.aggroRadius.randomPoint;

  this.destroyed = false;

  // FIXME make an Array of enemy


  this.debug = debug;
};

/**
 * @param {Vector2} target - player position
 */
Enemy.prototype.moveStartPos = function (target) {
  this.gameComponent.moveLerp(this.randomPosInCanvas, 0.005);

  if (this.aggro && undefined !== target) {
    // this.reachRandPos = true for strange but real behavior x)
    this.reachStartPos = true;
    this.moveToTarget(target);
  } else if (Vector2.distance(this.randomPosInCanvas, this.gameComponent.physicsBody.center) <= 1) {
    this.reachStartPos = true;
  }
}

/**
 * @param {game_components: player/...} target
 */
Enemy.prototype.move = function (target) {
  if (!this.aggro && undefined !== target) {
    this.moveRandom();
  } else {
    this.moveToTarget(target);
  }

  // if (Collision.circleCanvasCollision(this.gameComponent.physicsBody, this.canvas)) {
  //   this.moveInCanvas();
  // }
};

Enemy.prototype.moveInCanvas = function () {
  this.randomPos = this.aggroRadius.randomPoint;
  this.reachRandPos = false;
  if (this.randomPos.x < this.canvas.width &&
    this.randomPos.x > 0 &&
    this.randomPos.y < this.canvas.height &&
    this.randomPos.y < 0) {
    this.reachRandPos = true;
    this.moveRandom();
  } else {
    this.randomPos = this.aggroRadius.randomPoint;
    this.reachRandPos = false;
  }
}

Enemy.prototype.moveRandom = function () {
  if (!this.reachRandPos) {
    if (Collision.circleCanvasCollision(this.gameComponent.physicsBody, this.canvas)) {
      this.gameComponent.moveCollideWithCanvas(this.randomPos);
      this.reachRandPos = true;
    } else {
      this.gameComponent.moveLerp(this.randomPos, 0.02);
    }

    if (
      parseInt(this.randomPos.x) == parseInt(this.gameComponent.physicsBody.x) ||
      parseInt(this.randomPos.y) == parseInt(this.gameComponent.physicsBody.y)) {
      this.reachRandPos = true;
    }
  } else {
    // if (this.gameComponent.physicsBody.x > this.canvas.width ||
    //   this.gameComponent.physicsBody.x < 0 ||
    //   this.gameComponent.physicsBody.y > this.canvas.height ||
    //   this.gameComponent.physicsBody.y < 0) {
    //   // TODO use parseInt ?
    //   this.randomPos = this.aggroRadius.randomPoint;
    //   this.reachRandPos = true;
    // } else {
      this.randomPos = this.aggroRadius.randomPoint;
      this.reachRandPos = false;
    // }
  }
  this.cannon.aggro = false;
};

/**
 * @param {game_components: player/...} target
 */
Enemy.prototype.moveToTarget = function (target) {
  // when near the player, rotate as satelite around player
  // TODO: take care of aggro radius < player satellite radius ?
  this.cannon.fireAtTarget(target);
  if (Collision.vector2CircleCollision(this.gameComponent.physicsBody.center, target.satelliteRadius)) {
    // enemy follow the target satelliteRadius path, which is a circle
    this.moveSatellite(target.aggroRadius);
  } else {
    this.gameComponent.moveLerp(target.gameComponent.physicsBody.center, 0.01);
  }
};

/**
 * @param {Circle} aggroRadius
 */
Enemy.prototype.moveSatellite = function (aggroRadius) {
  // move around the player satelliteRadius
  let x = this.gameComponent.physicsBody.x + aggroRadius * Math.cos(this.gameComponent.angle);
  let y = this.gameComponent.physicsBody.y + aggroRadius * Math.sin(this.gameComponent.angle);
}

/**
 * @param {game_components player/...} target
 */
Enemy.prototype.detectTargetInAggroRadius = function (target) {
  // check collision with player and aggro radius of enemy
  if (Collision.circlesCollision(this.aggroRadius, target.gameComponent.physicsBody)) {
    this.aggro = true;
    // rather than returning to the last position, take a new one
    this.randomPos = this.aggroRadius.randomPoint;
  } else {
    this.aggro = false;
  }
};

/**
 * @param {Number} damage - damage from projectiles
 */
Enemy.prototype.getHit = function (damage) {
  if (this.shield > 0) {
    this.shield -= damage / 2;
    this.score += 1;
  } else {
    this.shield = 0;
    this.score += 2;
    this.health -= damage;
    if (this.health <= 0) {
      this.health = 0;
      this.destroyed = true;
    }
  }
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!! Separate physics from graphics !!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/**
 * @param {player, enemy} target
 */
Enemy.prototype.update = function (target) {
  if (!this.destroyed) {
    // Logic
    this.detectTargetInAggroRadius(target);

    // Physics
    this.gameComponent.update(null, null, this.reactorOffset);
    this.aggroRadius.update(this.gameComponent.physicsBody);
    this.satelliteRadius.update(this.gameComponent.physicsBody);
    this.cannon.update(this.gameComponent.physicsBody, this.gameComponent.angle);
    //this.reactor.update(this.gameComponent.backPosition, this.gameComponent.angle);
    // UI
    this.uiHealth.update(this.gameComponent.physicsBody);
    this.uiHealth.updateHealthAndShield(this.health, this.shield);
  }
};

/**
 * @param {CanvasRenderingContext2D} ctx
 */
Enemy.prototype.render = function (ctx) {
  if (!this.destroyed) {
    // UI
    this.uiHealth.render(ctx);

    // Physics
    //this.reactor.render(ctx);
    this.gameComponent.render(ctx);
    this.cannon.render(ctx);

    if (this.debug.flagDebug) {
      this.satelliteRadius.render(ctx, 'yellow');
      if (!this.aggro) {
        this.aggroRadius.render(ctx, 'red');
      } else {
        this.aggroRadius.render(ctx, 'green');
      }
    }
  }
};