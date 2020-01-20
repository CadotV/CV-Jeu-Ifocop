/**
 * @author: Valentin Cadot
 * @version: 1.0.0
 * 
 */

// Game Objects
import GameComponent from "../gameComponent";
import Projectile from '../projectiles/projectile';

// Primitives
import Circle from "../../geometry/circle";
//import Vector2 from "../../geometry/vector";

// Ressources
import cannonPlayerImg from './img/cannonPlayer.png';

import cannonEnemyHTML from './img/cannonEnemyHTML.png';
import cannonEnemyCSS from './img/cannonEnemyCSS.png';
import cannonEnemyNode from './img/cannonEnemyNode.png';
import cannonEnemyMeteor from './img/cannonEnemyMeteor.png';
import cannonEnemyJS from './img/cannonEnemyJS.png';
import cannonEnemySQL from './img/cannonEnemySQL.png';
import cannonEnemyMongo from './img/cannonEnemyMongo.png';
import cannonEnemyPHP from './img/cannonEnemyPHP.png';
import cannonEnemyAngular from './img/cannonEnemyAngular.png';

import Helper from "../../geometry/helper";

// Base on requestAnimationFrame time
// Fire each second at basis, changed with fireRate
var baseFireRate = 5;

/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {Circle/Rectangle/Vector2} physicsBodyAttached 
 * @param {Number} radius 
 * @param {String} color - the color of projectile
 * @param {String} typeCannon - for graphicsBody
 * @param {Boolean} debug 
 */
export default function Cannon(canvas, physicsBodyAttached, radius, projectileColor, fireRate, typeCannon, debug) {
    this.canvas = canvas;

    this.radius = radius;

    let physicsBody = new Circle(physicsBodyAttached.center.x, physicsBodyAttached.center.y, this.radius);
    let graphicsBody = new Image();

    this.randomCannon = false;

    switch (typeCannon) {
        case 'player':
            graphicsBody.src = cannonPlayerImg;
            break;
        case 'enemy':
            let random = Math.floor(Math.random() * 9);
            switch (random) {
                case 0: graphicsBody.src = cannonEnemyAngular;
                    break;
                case 1: graphicsBody.src = cannonEnemyCSS;
                    break;
                case 2: graphicsBody.src = cannonEnemyHTML;
                    break;
                case 3: graphicsBody.src = cannonEnemyMeteor;
                    break;
                case 4: graphicsBody.src = cannonEnemyNode;
                    break;
                case 5: graphicsBody.src = cannonEnemySQL;
                    break;
                case 6: graphicsBody.src = cannonEnemyMongo;
                    break;
                case 7: graphicsBody.src = cannonEnemyPHP;
                    break;
                case 8: graphicsBody.src = cannonEnemyJS;
                    break;
                default: break;
            }
        default: break;
    }

    this.gameComponent = new GameComponent(canvas, physicsBody, graphicsBody, false, this.randomCannon, debug);

    this.flagFiring = false;
    this.aggro = false;
    this.fireRate = fireRate;
    // add random to baseFireRate with fireRate
    this.finalFireRate = baseFireRate + Math.random() * 300 * this.fireRate;

    this.fireTimeCount = 0;
    this.fireAngle = 0;

    this.projectileColor = projectileColor;

    this.target = null;

    this.projectileArr = [];


    this.debug = debug;
}

/**
 * @param {game_components: player/ennemy/...} target
 * FIXME simplify the logic !
 */
Cannon.prototype.fireAtTarget = function (target, enemyArr = []) {
    // TODO the first fire should take current this.gameComponent position in account  
    this.target = target;
    this.aggro = true;

    if (target !== undefined) {
        this.angleToTarget(target);
        if (this.flagFiring) {
            var projectile = new Projectile(this.canvas, this.gameComponent.physicsBody.center, target, this.projectileColor, enemyArr, this.debug);
            this.projectileArr.push(projectile);
            this.flagFiring = false;
        } else {
            // Add delay between each fire
            this.fireTimeCount++;
            if (this.fireTimeCount >= this.finalFireRate) {
                this.finalFireRate = baseFireRate + Math.random() * 300 * this.fireRate;
                this.flagFiring = true;
                this.fireTimeCount = 0;
            }
        }
    }
}

/**
 * @param {Vector2} target
 */
Cannon.prototype.angleToTarget = function (target) {
    this.fireAngle = Helper.angleFromDirection(this.gameComponent.physicsBody.center, target.gameComponent.physicsBody.center);
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!! Separate physics from graphics !!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/**
 * @param {Circle/Rectangle/Vector2} physicsBody
 * @param {Float} angle
 */
Cannon.prototype.update = function (physicsBody, angle) {
    if (this.aggro) {
        this.gameComponent.update(physicsBody, this.fireAngle);
    } else {
        this.gameComponent.update(physicsBody, angle);
    }

    // update projectiles and remove the ones destroyed
    // FIXME Move this block outside cannon/enemy/player/etc...
    // to avoid deleted projectiles when game_component is deleted
    if (this.projectileArr.length) {
        for (let i = 0; i < this.projectileArr.length; i++) {
            if (this.projectileArr[i].destroyed) {
                this.projectileArr.splice(i, 1);
            } else {
                this.projectileArr[i].update();
                this.projectileArr[i].moveDirection(this.target);
            }
        }
    }
};

/**
 * @param {CanvasRenderingContext2D} ctx
 */
Cannon.prototype.render = function (ctx) {
    // IMPORANT order of rendering matters ! last is rendered in front
    if (this.projectileArr.length) {
        this.projectileArr.forEach(projectile => {
            projectile.render(ctx);
        });
    }
    this.gameComponent.render(ctx);
};

