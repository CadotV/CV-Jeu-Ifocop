/**
 * @author: Valentin Cadot
 * @version: 1.0.0
 * 
 */

// Primitives
import Circle from '../../geometry/circle';
import Vector2 from '../../geometry/vector';

// Game Components
import GameComponent from '../gameComponent';

// Ressources
import projectileImg from './img/projectileDefault.png';
import projectileGreenImg from './img/projectileGreen.png';
import projectileRedImg from './img/projectileRed.png';

// Others
import Helper from '../../geometry/helper';
import Collision from '../../collision';
import Player from '../player/player';

/**
 * @param {Number} id - keep track of every projectiles
 */
var id = 0;
//var projectileArr = [];

/**
 * Projectile fired from cannon
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {Vector2} startPos 
 * @param {Vector2} targetCenterPos
 * @param {String} projectileColor
 * @param {Boolean} debug 
 */
export default function Projectile(canvas, startPos, target, projectileColor, enemyArr, debug) {
  this.canvas = canvas;

  this.radius = 8;

  this.baseDamage = 10;

  let physicsBody = new Circle(startPos.x, startPos.y, this.radius);
  let graphicsBody = new Image(this.radius * 2, this.radius * 2);
  switch (projectileColor) {
    case 'red':
      graphicsBody.src = projectileRedImg;
      break;
    case 'green':
      graphicsBody.src = projectileGreenImg;
      break;
    default:
      graphicsBody.src = projectileImg;
      break;
  }

  this.gameComponent = new GameComponent(canvas, physicsBody, graphicsBody, false, false, debug);
  this.vector2Direction = new Vector2.substract(target.gameComponent.physicsBody.center, physicsBody.center);
  
  // Add some little randomness
  if (Math.floor(Math.random() * 2)) {
    this.vector2Direction.x += Math.round(Math.random() * 100);
    this.vector2Direction.y += Math.round(Math.random() * 100);
  } else {
    this.vector2Direction.x -= Math.round(Math.random() * 100);
    this.vector2Direction.y -= Math.round(Math.random() * 100);

  }

  this.angle = Helper.angleFromDirection(startPos, target.gameComponent.physicsBody.center);

  this.destroyed = false;

  this.enemyArr = enemyArr;

  // Global variables
  this.id = id++;
  //projectileArr.push(this);

  this.debug = debug;
}

/**
 * Test position of every enemy
 * @param {game_components: player/enemy} target
 */
Projectile.prototype.moveDirection = function (target) {
  if (this.enemyArr.length && target != undefined) {
    // projectiles from player
    this.enemyArr.forEach(enemy => {
      if (Collision.circlesCollision(this.gameComponent.physicsBody, enemy.gameComponent.physicsBody)) {
        // destroy the projectile
        enemy.getHit(this.baseDamage);
        this.destroyed = true;
        // FIXME remove instance when projectile is off screen
      } else if (Collision.circleCanvasCollision(this.gameComponent.physicsBody, this.canvas)) {
        this.destroyed = true;
      }
    })
  }
  // projectiles from enemy
  // test if target == player to avoid projectiles to disappear
  if (target.id === 'player') {
    if (Collision.circlesCollision(this.gameComponent.physicsBody, target.gameComponent.physicsBody)) {
      // enemy follow the target satelliteRadius path, which is a circle
      target.getHit(this.baseDamage);
      this.destroyed = true;
      
      // FIXME remove instance when projectile is off screen
    } else if (Collision.circleCanvasCollision(this.gameComponent.physicsBody, this.canvas)) {
      this.destroyed = true;
    }
  }
  this.gameComponent.moveNoLerp(this.vector2Direction, this.angle, 5);
}


// Set the projectile destroyed for Garbage Collector
// FIXME projectiles that still alive (!destroyed) when enemy is destroyed are destroyed
// Cannon is deleted by garbage collector so projectiles associated are deleted...
// FIXE THAT !

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!! Separate physics from graphics !!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
Projectile.prototype.update = function () {
  this.gameComponent.update();
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */
Projectile.prototype.render = function (ctx) {
  this.gameComponent.render(ctx);
}