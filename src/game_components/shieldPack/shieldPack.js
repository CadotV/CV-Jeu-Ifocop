/**
 * @author: Valentin Cadot
 * @version: 1.0.0
 */

import shieldPackImg from './img/shieldPack.png'
import Circle from '../../geometry/circle';
import GameComponent from '../gameComponent';
import Vector2 from '../../geometry/vector';
import Collision from '../../collision';

export default function ShieldPack(canvas, debug) {
    this.canvas = canvas;

    this.radius = 16;

    let randomX = Math.round(Math.random() * (this.canvas.width - this.radius * 2)) + this.radius;
    
    let graphicsBody = new Image();
    graphicsBody.src = shieldPackImg;

    let physicsBody = new Circle(randomX, - this.radius * 2, this.radius);

    this.gameComponent = new GameComponent(canvas, physicsBody, graphicsBody, false, false, debug);

    this.topPosition = new Vector2(randomX, -this.radius * 2);
    this.bottomPosition = new Vector2(randomX, this.canvas.height + this.radius * 2);
    this.vector2Direction = Vector2.substract(this.bottomPosition, this.topPosition);

    // TODO add various shield amounts
    this.shieldAmount = 25;

    this.destroyed = false;

    this.debug = debug;
}

/**
 * Move from random top canvas position to same X bottom
 * @param {Game_components: player} target
 */
ShieldPack.prototype.move = function (target) {
    if (Collision.circlesCollision(this.gameComponent.physicsBody, target.gameComponent.physicsBody)) {
        target.gainShield(this.shieldAmount);
        this.destroyed = true;
    } else if (this.gameComponent.y >= this.bottomPosition) {
        this.destroyed = true;
    } else {
        this.gameComponent.moveNoLerp(this.vector2Direction, 0, 5);
    }
}

ShieldPack.prototype.update = function () {
    this.gameComponent.update();
}

ShieldPack.prototype.render = function (ctx) {
    this.gameComponent.render(ctx);
}