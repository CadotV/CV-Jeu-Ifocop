/**
 * @author: Valentin Cadot
 * @version: 1.0.0
 * 
 */

// primitives
import Vector2 from './vector';
import Circle from './circle';

/**
 * Rectangle: add a rectangle as physicsBody for gameComponents
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} width 
 * @param {Number} height 
 */
export default function Rectangle(x, y, width, height) {
  this.x = x || 0;
  this.y = y || 0;
  this.width = width || 0;
  this.height = height || 0;
}

/**
 * @param: {number} s - the scale
 * @return: {this} The Vector2 instance scaled
 */
Rectangle.prototype.scale = function (s) {
  if (isFinite(s)) {
      this.x = this.x * s;
      this.y = this.y * s;
      this.width = this.width * s;
      this.height = this.height * s;
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
 * @param {Vector2} v
 */
Rectangle.prototype.update = function (v) {
  this.x = v.x;
  this.y = v.y;
};

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {String} color
 */
Rectangle.prototype.render = function (ctx, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.strokeRect(this.x, this.y, this.width, this.height);
  ctx.stroke();
  ctx.closePath();
};

Object.defineProperties(Rectangle.prototype, {
  area: {
    get: function () {
      return this.width * this.height;
    }
  },
  center: {
    get: function () {
      return new Vector2(this.x + (this.width / 2), this.y + (this.height / 2));
    }
  }
});