import { parse } from "url";

/**
 * Vector2 is used by other primitive geometry shapes
 * @author: Valentin Cadot
 * @mail: valentin.cadot@gmail.com
 * @licence: MIT
 * @version: 1.0.0
 */

/**
 * TIPS
 * - use integer values for graphics, not position
 */

/**
 * Vector2 Object
 * @since: 1.0.0
 */

// origin: use when origin is not the canvas but the object instance
export default function Vector2(x, y, refX = 0, refY = 0) {
  if (!isNaN(x) && !isNaN(y)) {
    this.x = x || 0;
    this.y = y || 0;
    this.origin = false;
  } else {
    console.error("x and y must be valid integers");
  }

  if ((!isNaN(refX) && !isNaN(refY)) && (refX != 0 && refY != 0)) {
    this.refX = refX;
    this.refY = refY;
    this.origin = true;
  } else {
    //console.error("refX and refY must be valid integers");
  }
}

/////////////////////////////////
///// public static methods /////
/////////////////////////////////

/**
 * @since: 1.0.0
 * @return: {Vector2} Sum of 2 Vector2
 */
Vector2.sum = function (v1, v2) {
  return new Vector2(v1.x + v2.x, v1.y + v2.y);
}

/**
 * @since: 1.0.0
 * @return: {Vector2} Subtraction of 2 Vector2
 */
Vector2.substract = function (v1, v2) {
  return new Vector2(v1.x - v2.x, v1.y - v2.y);
}

/**
 * @since: 1.0.0
 * @return: {Vector2} dotProduct of 2 Vector2
 */
Vector2.dotProduct = function (v1, v2) {
  return new Vector2(v1.x * v2.x, v1.y * v2.y);
}

/**
 * @since: 1.0.0
 * @return: {Vector2} ScalarProduct of 2 Vector2
 */
Vector2.scalarProduct = function (v1, v2) {
  return v1.x * v2.x + v1.y * v2.y;
}

/**
 * @since: 1.0.0
 * @return: {Vector2} Division of 2 Vector2
 */
Vector2.divide = function (v1, v2) {
  return new Vector2(v1.x / v2.x, v1.y / v2.y);
}

/**
 * @since: 1.0.0
 * @return {Number} distance between 2 vectors
 */
Vector2.distance = function (v1, v2) {
  return Math.sqrt((v1.x - v2.x)**2 + (v1.y - v2.y)**2);
}

/**
 * @since: 1.0.0
 * @return: {Vector2} A clone of the Vector2 Object instance
 */
Vector2.clone = function () {
  return new Vector(this.x, this.y);
}

/////////////////////////////////////
///// public non static methods /////
/////////////////////////////////////

// use matrice with transforms and translation in spaces references instead 
/* Vector2.prototype.width = function(originPoint = new Vector2(0, 0)) {
  typeof originPoint.__proto__ === 'Vector2' ? originPoint : new Vector2(0, 0);
  return this.x - originPoint.x;
}

Vector2.prototype.height = function(originPoint = new Vector2(0, 0)) {
  typeof originPoint.__proto__ === 'Vector2' ? originPoint : new Vector2(0, 0);
  return this.y - originPoint.y;
} */

/**
 * return: {this} 
 */
// Vector2.prototype.angleRadians = function () {
//   var angle = Math.atan2(this.x, this.y);
//   if (angle < 0) {
//     angle += 2 * Math.PI;
//   }
//   return angle;
// }

/**
 * @since: 1.0.0
 * @param: {number} s - the scale
 * @return: {this} The Vector2 instance scaled
 */
Vector2.prototype.scale = function (s) {
  if (isFinite(s)) {
    this.x = this.x * s;
    this.y = this.y * s;
  } else {
    this.x = 0;
    this.y = 0;
  }
  // return this;
}

/**
 * @since: 1.0.0
 */
Vector2.prototype.normalize = function () {
  var norm = this.x ** 2 + this.y ** 2;
  if (norm > 0) {
    norm = 1 / Math.sqrt(norm);
    this.x *= norm;
    this.y *= norm;
  }
  return this;
}

/**
 * @param {Vector2} v
 */
Vector2.prototype.update = function (v) {
  this.x = v.x;
  this.y = v.y;
}

/**
 * @param {Vector2} ref - the origin ref Vector2
 * @param {ctx} ctx - the requestAimationFrame reference ?
 * @param {string} color - color used for graphics rendering
 * @since: 1.0.0
 * TODO: temp function, not necessary
 */
Vector2.prototype.render = function (ref, ctx, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(ref.x, ref.y);
  ctx.lineTo(this.x, this.y);
  ctx.stroke();
  ctx.closePath();
}


/**
 * Getters & Setters
 * __defineGetter__ and __defineSetter__ is the old way of doing getters and setters
 * new way is Object.defineProperties("My field", function{})
 */
Object.defineProperties(Vector2.prototype, {
  /**
   * @since: 1.0.0
   * @get: {number} Return the magnitude (length) of the Vector2 instance
   * @set: {this} Set Vector2 instance x and y values with same direction
   */
  center: {
    get: function () {
      return this;
    }
  },
  magnitude: {
    get: function () {
      // Don't use Math.pow(), way more slower than **
      return Math.sqrt(this.x ** 2 + this.y ** 2);
    },
    set: function (newMagnitude = 0) {
      /* this.x *= newMagnitude / this.magnitude;  
      this.y *= newMagnitude / this.magnitude;   */
      this.x *= newMagnitude / this.magnitude;
      this.y *= newMagnitude / this.magnitude;
    }
  },
})