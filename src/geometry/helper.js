/**
 * @author: Valentin Cadot
 * @version: 1.0.0
 * 
 */

/**
 * Helper: just static function to help
 */
export default function Helper() { }

/**
 * @param {Vector2} bodyPos
 * @param {Vector2} targetPos
 */
Helper.angleFromDirection = function (bodyPos, targetPos) {
  var distX = targetPos.x - bodyPos.x;
  var distY = targetPos.y - bodyPos.y;
  return Math.atan2(distY, distX);
}

Helper.oppositeAngleFromDirection = function (bodyPos, targetPos) {
  var distX = bodyPos.x - targetPos.x;
  var distY = bodyPos.y - targetPos.y;
  return Math.atan2(distY, distX);
}