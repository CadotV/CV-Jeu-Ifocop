/**
 * @author: Valentin Cadot
 * @version: 1.0.0
 * 
 */

// primitives
import Vector2 from './vector';
import Rectangle from './rectangle';

/**
 * Circle: add a circle physicsBody for gameComponents
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} radius 
 */
export default function Circle(x, y, radius) {
    this.x = x || 0;
    this.y = y || 0;
    this.radius = radius || 0;

    this.boundingCirc = this;
    this.boundingRect = new Rectangle(this.x, this.y, this.radius * 2, this.radius * 2);
}

/**
 * @param: {number} s - the scale
 * @return: {this} The Vector2 instance scaled
 */
Circle.prototype.scale = function (s) {
    if (isFinite(s)) {
        this.x = this.x * s;
        this.y = this.y * s;
        this.radius = this.radius * s;
    } else {
        this.x = 0;
        this.y = 0;
    }
    //return this;
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!! Separate physics from graphics !!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/**
 * @param {Vector2} targetPos
 */
Circle.prototype.update = function (targetPos) {
    this.x = targetPos.x;
    this.y = targetPos.y;
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {String} color
 */
Circle.prototype.render = function (ctx, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
}

Object.defineProperties(Circle.prototype, {
    area: {
        get: function () {
            return this.radius * this.radius * Math.PI;
        }
    },
    diameter: {
        get: function () {
            return this.radius * 2;
        }
    },
    circumference: {
        get: function () {
            return 2 * Math.PI * this.radius;
        }
    },
    // Useless ? this.x and this.y already point to circle center
    center: {
        get: function () {
            return new Vector2(this.x, this.y);
        }
    },
    randomPoint: {
        get: function () {
            let randAngle = Math.random() * 2 * Math.PI;
            let radius = this.radius * Math.sqrt(Math.random());

            let x = radius * Math.cos(randAngle) + this.center.x;
            let y = radius * Math.sin(randAngle) + this.center.y;

            return new Vector2(x, y);
        }
    }
});