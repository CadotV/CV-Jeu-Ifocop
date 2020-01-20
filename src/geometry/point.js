// Useless !?! Use Vector2 for points instead

/**
 * Point: add a point - not use right now, prefer vector in video games
 * @param {Number} x 
 * @param {Number} y 
 */
export default function Point(x, y) {
  this.x = x || 0;
  this.y = y || 0;

};

/**
 * @param {Point} p1
 * @param {Point} p2
 */
Point.prototype.distance = function (p1, p2) {
  return new Point(p1.x - p2.x, p1.y - p2.y);
};

/**
 * @param {Vector2} v
 */
Point.prototype.update = function (v) {
  if (isFinite(v.x) && isFinite(v.y)) {
    this.x = v.x;
    this.y = v.y;
  } else {
    this.x = 0;
    this.y = 0;
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {String} color
 */
Point.prototype.render = function (ctx, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.fillRect(this.x, this.y, 1, 1);
  ctx.stroke();
  ctx.closePath();
};
