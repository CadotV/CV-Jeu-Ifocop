/**
 * @author: Valentin Cadot
 * @version: 1.0.0
 * 
 */


export default function Collision() { }

Collision.rectsCollision = function (rect1, rect2) {
  if (rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y) {
    return true;
  } else {
    return false;
  }
}

// WARNING same function as vector2CircleCollision, refactore !
Collision.circlesCollision = function (circle1, circle2) {
  let distance = circle1.radius + circle2.radius;
  let distX = Math.abs(circle1.x - circle2.x);
  let distY = Math.abs(circle1.y - circle2.y);

  // Use Vector2 normalize
  if (distance > Math.sqrt((distX * distX) + (distY * distY))) {
    return true;
  } else {
    return false;
  }
};

// Simple collision detection between shapes
Collision.rectCircleCollision = function (rect, circle) {
  let distX = Math.abs(circle.x - rect.x - rect.width / 2);
  let distY = Math.abs(circle.y - rect.y - rect.height / 2);

  if (distX > (rect.width / 2 + circle.radius)) { return false; }
  if (distY > (rect.height / 2 + circle.radius)) { return false; }

  if (distX <= (rect.width / 2)) { return true; }
  if (distY <= (rect.heigh / 2)) { return true; }

  let dx = distX - rect.width / 2;
  let dy = distY - rect.height / 2;
  return (dx * dx + dy * dy <= (circle.radius * circle.radius));
};

Collision.vector2CircleCollision = function (vector2, circle) {
  let distX = Math.abs(circle.x - vector2.x);
  let distY = Math.abs(circle.y - vector2.y);

  if (circle.radius > Math.sqrt((distX * distX) + (distY * distY))) {
    return true;
  } else {
    return false;
  }
};


Collision.circleCanvasCollision = function (circle, canvas) {
  if (circle.x + circle.radius > canvas.width ||
    circle.x - circle.radius < 0 ||
    circle.y + circle.radius > canvas.height ||
    circle.y - circle.radius < 0) {
    return true;
  } else {
    return false;
  }
}
// for more complicated collisions use: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection