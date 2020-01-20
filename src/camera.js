// /**
//  * Camera
//  */

// // Width and height represent the camera view
// export default function Camera(x, y, width, height) {
//   this.x = x || 0;
//   this.y = y || 0;
//   this.width = width || 0;
//   this.height = height || 0;
//   this.follow = false;
// }

// Camera.prototype.updatePosition = function (v) {
//   if (isFinite(v.x) && isFinite(v.y)) {
//     this.x = v.x;
//     this.y = v.y;
//   } else {
//     this.x = 0;
//     this.y = 0;
//   }
// }

// // function used to point camera from player to another target
// Camera.prototype.followTarget = function (target) {
//   this.x = target.x;
//   this.y = target.y;

//   // Set flag to true
//   this.follow = true;
//   // Add to the render function (requestanimationframe) the new position of the camrera
// }

// // Function used to point camera back to the player
// Camera.prototype.forgetTarget = function (target) {

// }