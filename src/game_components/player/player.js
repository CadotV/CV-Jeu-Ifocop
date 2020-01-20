/**
 * @author: Valentin Cadot
 * @version: 1.0.0
 * 
 */

// Game Components
import GameComponent from '../gameComponent';
import Cannon from '../cannon/cannon';
import Collision from '../../collision';

// Primitives
import Rectangle from '../../geometry/rectangle';
import Vector2 from '../../geometry/vector';
import Circle from '../../geometry/circle';

import Helper from '../../geometry/helper';

// Ressources
import playerImg from './img/player_spriteTile.png';
import UiHealth from '../../ui/game_components/uiHealth';
import Reactor from '../reactor/reactor';

var id = 'player';

/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {Vector2} startPos 
 * @param {Boolean} debug 
 */
export default function Player(canvas, startPos, scale, debug) {
  this.canvas = canvas;
  this.id = id;

  this.width = 100 * scale;
  this.height = 100 * scale;

  this.radius = 100 * scale;

  // TODO: bug if health < 100
  this.health = 100;
  this.shield = 100;

  this.score = 0;

  let physicsBody = new Circle(startPos.x, startPos.y, this.radius);

  // Create an HTMLImageElement
  let graphicsBody = new Image();
  graphicsBody.src = playerImg;

  // Create the gameComponent for physicsBody, graphicsBody, etc...
  // the gameComponent hold the physic computation
  this.gameComponent = new GameComponent(canvas, physicsBody, graphicsBody, true, false, debug);
  this.aggroRadius = new Circle(physicsBody.center.x, physicsBody.center.y, 400);
  this.satelliteRadius = new Circle(physicsBody.center.x, physicsBody.center.y, 400);
  this.cannon = new Cannon(canvas, physicsBody, 60, 'green', 0.000005, 'player', debug);
  //this.reactor = new Reactor(canvas, physicsBody, this.gameComponent.angle, debug);
  //this.reactorOffset = this.reactor.offset;
  // UI
  this.uiHealth = new UiHealth(physicsBody, this.health, this.shield, debug);


  this.aggro = false;
  this.enemyInAggroArr = []; // array of enemies id
  this.flagEnemyInAggroRadius = false; // true if there's 1 enemy in aggro radius

  this.destroyed = false;

  this.startGamePos = new Vector2(this.canvas.width / 2, this.canvas.height / 2);
  this.vector0 = new Vector2(0, 0);

  this.debug = debug;
};

/**
 * @param {Vector2} targetPos
 */
Player.prototype.moveTouch = function (targetPos) {

  if (Collision.circleCanvasCollision(this.gameComponent.physicsBody, this.canvas)) {
    this.gameComponent.moveCollideWithCanvas(targetPos, this.gameComponent.angle);
  } else {
    this.gameComponent.moveLerp(targetPos, 0.02);
  }

}

/**
 * Move from bottom to center of canvas
 * @return {Boolean} false while player didn't reach the center of canvas
 */
Player.prototype.reachStartPos = function () {
  this.gameComponent.moveLerp(this.startGamePos, 0.02);
  if (parseInt(this.gameComponent.physicsBody.y) == parseInt(this.canvas.height / 2)) {
    return true;
  } else {
    return false;
  }
}

/**
 * IMPORTANT player need a killing order to avoid shotting a random enemy based on fireAtTarget count !!!
 * killing order is FIFO pile
 * FIXME when an enemy is aggro, player stop firing..
 * @param {Array} enemyArr
 */
Player.prototype.detectTargetInAggroRadius = function (enemyArr) {
  // check collision with player and aggro radius of enemy
  enemyArr.forEach(enemy => {
    // If player collide with an enemy aggro radius, add id to an Array
    if (Collision.circlesCollision(this.aggroRadius, enemy.gameComponent.physicsBody)) {
      if (!this.enemyInAggroArr.includes(enemy.id)) {
        this.enemyInAggroArr.push(enemy.id);
      }
    } else {
      // Remove id of enemies that are no more in player aggro radius but still alive
      if (this.enemyInAggroArr.includes(enemy.id)) {
        var enemyIndex = this.enemyInAggroArr.indexOf(enemy.id);
        this.enemyInAggroArr.splice(enemyIndex, 1);
      }
    }
  });

  if (this.enemyInAggroArr.length !== 0) {
    this.attackTargetInAggroRadius(enemyArr);
  } else {
    this.stopAggro();
  }
};

/**
 * @param {Array} enemyArr
 */
Player.prototype.attackTargetInAggroRadius = function (enemyArr) {
  if (enemyArr.length !== 0) {
    this.aggro = true;
    this.cannon.aggro = true;
    // Attack the first target in enemyInAggroArr
    var target = null;
    enemyArr.forEach(enemy => {
      if (this.enemyInAggroArr[0] == enemy.id) {
        target = enemy;
      }
    })
    if (target == undefined) {
      console.log('bug !');
      this.stopAggro();
    }
    // add enemyArr so projectiles can shot any enemy while firing at target
    this.cannon.fireAtTarget(target, enemyArr);
  } else {
    this.stopAggro();
  }
}

Player.prototype.stopAggro = function () {
  this.aggro = false;
  this.cannon.aggro = false;
  this.enemyInAggroArr = [];
}

/**
 * @param {Number} damage - damage from projectiles
 */
Player.prototype.getHit = function (damage) {
  if (this.shield > 0) {
    this.shield -= damage / 2;
    this.score -= 5;
  } else {
    this.shield = 0;
    this.health -= damage;
    this.score -= 15;
    if (this.health <= 0) {
      this.health = 0;
      this.destroyed = true;
    }
  }
}

Player.prototype.regenerateHealth = function () {
  if (this.health < 100) {
    this.health += 0.1;
    if (this.health >= 100) {
      this.health = 100;
    }
  }
}

/**
 * @param {Number} shield
 */
Player.prototype.gainShield = function (shield) {
  if(this.shield < 100) {
    this.shield += shield;
    if (this.shield >= 100) {
      this.shield = 100;
    }
  }
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!! Separate physics from graphics !!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/**
 * @param {Array} enemyArr - array of enemies object
 */
Player.prototype.update = function (enemyArr) {
  // Logic
  this.detectTargetInAggroRadius(enemyArr);
  this.regenerateHealth();

  // Physics
  this.gameComponent.update(null, null, this.reactorOffset); // update offset of reactor
  this.aggroRadius.update(this.gameComponent.physicsBody);
  this.satelliteRadius.update(this.gameComponent.physicsBody);
  this.cannon.update(this.gameComponent.physicsBody, this.gameComponent.angle);
  //this.reactor.update(this.gameComponent.backPosition, this.gameComponent.angle);
  // UI
  this.uiHealth.update(this.gameComponent.physicsBody);
  this.uiHealth.updateHealthAndShield(this.health, this.shield);
};

/**
 * @param {CanvasRenderingContext2D} ctx
 */
Player.prototype.render = function (ctx) {
  if (!this.destroyed) {
    // Physcis
    //this.reactor.render(ctx);
    this.gameComponent.render(ctx);
    this.cannon.render(ctx);
  
    // UI
    this.uiHealth.render(ctx);
  
    if (this.debug.flagDebug) {
      this.satelliteRadius.render(ctx, 'yellow');
      // TODO only true for 1 enemy
      if (!this.aggro) {
        this.aggroRadius.render(ctx, 'red');
      } else {
        this.aggroRadius.render(ctx, 'green');
      }
    }
  }
};

