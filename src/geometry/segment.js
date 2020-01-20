/**
 * @author: Valentin Cadot
 * @version: 1.0.0
 * 
 */

// primitives
import Vector2 from "./vector";

/**
 * 
 * @param {Vector2} v1 
 * @param {Vector2} v2 
 */
export default function Segment(v1, v2) {
  this.v1 = v1 || new Vector2(0, 0);
  this.v2 = v2 || new Vector2(0, 0);
}

/**
 * @param {Float} s - the scale factor for devices ratio
 */
Segment.prototype.scale = function (s) {
  if (isFinite(s)) {
    this.v1.x = this.v1.x * s;
    this.v1.y = this.v1.y * s;
    this.v2.x = this.v2.x * s;
    this.v2.y = this.v2.y * s;
  } else {
    this.v1.x = 0;
    this.v1.y = 0;
    this.v2.x = 0;
    this.v2.y = 0;
  }
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!! Separate physics from graphics !!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/**
 * @param {Vector2} v1
 * @param {Vector2} v2
 */
Segment.prototype.update = function (v1, v2) {
  // when need to calculate v2 which is on radius
  // use equilateral triangle from Vector2(0, 0)
  this.v1 = v1;
  this.v2 = v2;
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {String} color
 */
Segment.prototype.render = function (ctx, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(this.v1.x, this.v1.y);
  ctx.lineTo(this.v2.x, this.v2.y);
  ctx.stroke();
  ctx.closePath();
}

Object.defineProperties(Segment.prototype, {
  magnitude: {
    get: function () {
      return Math.sqrt(this.v2.x ** 2 + this.v2.y ** 2) - Math.sqrt(this.v1.x ** 2 + this.v2.y ** 2);
    }
  }
})