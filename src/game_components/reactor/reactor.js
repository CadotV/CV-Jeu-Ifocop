/**
 * @author: Valentin Cadot
 * @version: 1.0.0
 */

// Primitives
import Rectangle from '../../geometry/rectangle';
import Circle from '../../geometry/circle';

// Game Components
import GameComponent from '../gameComponent';

// Ressources
import reactorImg from './img/reactorDefault.png';
import Vector2 from '../../geometry/vector';

/**
 * Reactor: add a reactor behind player position for movement and particles
 * FIXME !!! offset is in player/enemy/gameComponent and here. Bad
 * @param {HTMLCanvasElement} canvas 
 * @param {gameComponent} gameComponentsAttached 
 * @param {Float} angle 
 * @param {Boolean} debug 
 */
export default function Reactor(canvas, physicsBodyAttached, angle, debug) {
    this.width = 160;
    this.height = 80;
    this.angle = angle;

    this.offset = 20;

    let physicsBody = new Rectangle(physicsBodyAttached.center.x - physicsBodyAttached.radius, physicsBodyAttached.center.y, this.width, this.height);
    let graphicsBody = new Image(this.width, this.height);
    graphicsBody.src = reactorImg;
    // For tilesSprite animation
    graphicsBody.animate = true;

    this.gameComponent = new GameComponent(canvas, physicsBody, graphicsBody, false, false, debug);

    this.debug = debug;
}

/**
 * @param {Circle, Rectangle, ...} physicsBody
 * @param {Float} angle
 */
Reactor.prototype.update = function (physicsBody, angle) {
    this.gameComponent.update(physicsBody, angle);
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */
Reactor.prototype.render = function (ctx) {
    this.gameComponent.render(ctx);
}

