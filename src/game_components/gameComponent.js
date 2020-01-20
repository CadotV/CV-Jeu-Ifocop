/**
 * @author: Valentin Cadot
 * @version: 1.0.0
 * 
 */

// Primitives
import Vector2 from '../geometry/vector';
import Segment from '../geometry/segment';

// Others
import Helper from '../geometry/helper';
import Collision from '../collision';

// Use sub-class pattern to inherit from this constructor function ?

/**
 * This is the base object for abstract gameComponent like player and enemies
 * It only describe base properties for every gameObject, and base functions
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {Circle/Rectangle/Vector2} physicsBody 
 * @param {HTMLImageElement} graphicsBody
 * @param {Boolean} animateUnit
 * @param {Bollean} randomCannon
 * @param {Boolean} debug 
 */
export default function GameComponent(canvas, physicsBody, graphicsBody, animateUnit = false, randomCannon = false, debug) {
    this.canvas = canvas;

    this.physicsBody = physicsBody;
    this.graphicsBody = graphicsBody;

    this.x = physicsBody.center.x;
    this.y = physicsBody.center.y;

    this.angle = 0;
    this.oppositeAngle = 0;
    this.directionAngle = 0;

    this.offset = 0;

    // For reactor component
    this.backPosition = new Vector2(0, 0);

    this.animateUnit = animateUnit;
    this.animateTile = 0;
    this.animateTileMax = 6;

    //this.randomCannon = randomCannon;

    // FIXME Don't work with tiles
    // if (this.randomCannon) {
    //     this.graphicsBodyOffsetX = Math.floor(Math.random() * 3) * this.graphicsBody.width / 3;
    //     this.graphicsBodyOffsetY = Math.floor(Math.random() * 3) * this.graphicsBody.height / 3;
    // }

    this.debug = debug;

    if (this.debug.flagDebug) {
        this.segment = new Segment(physicsBody.center, physicsBody.center);
    }
}

/**
 * Teleport a gameComponent after instantiating it
 * @param {Vector2} targetPos
 */
GameComponent.prototype.teleport = function (targetPos) {
    this.x = targetPos.x;
    this.y = targetPos.y;
}

/**
 * @param {Vector2} targetPos
 * @param {Number} lerpPourcent - a low float value 
 */
GameComponent.prototype.moveLerp = function (targetPos, lerpPourcent) {
    this.x += (targetPos.x - this.physicsBody.center.x) * lerpPourcent;
    this.y += (targetPos.y - this.physicsBody.center.y) * lerpPourcent;
    this.lerpAngle(targetPos, lerpPourcent);

}

// Same function as above but with lerp at the start and the end with a max speed
// use Vector2.normalize
// FIXME take care of float values, to avoid jitter
// maybe put the function in geometry scripts ?
/**
 * @param {Vector2} vector2Direction
 * @param {Number} angle
 * @param {Number} speed
 */
GameComponent.prototype.moveNoLerp = function (vector2Direction, angle, speed) {
    this.x += vector2Direction.normalize().x * speed;
    this.y += vector2Direction.normalize().y * speed;
    this.angle = angle;
}

/**
 * Move the gameComponent along side canvas
 * @param {Vector2} targetPos
 */
GameComponent.prototype.moveCollideWithCanvas = function (targetPos, angle) {
    if (this.physicsBody.center.x - this.physicsBody.radius <= 0 &&
        this.physicsBody.center.y - this.physicsBody.radius <= 0) {
        // Collide left and top side of canvas
        targetPos.x = this.physicsBody.radius;
        targetPos.y = this.physicsBody.radius;
        this.angle = angle;
        this.moveCollision(targetPos);
    } else if (this.physicsBody.center.x + this.physicsBody.radius >= this.canvas.width &&
        this.physicsBody.center.y - this.physicsBody.radius <= 0) {
        // Collide right and top side of canvas
        targetPos.x = this.canvas.width - this.physicsBody.radius;
        targetPos.y = this.physicsBody.radius;
        this.angle = angle;
        this.moveCollision(targetPos);
    } else if (this.physicsBody.center.x - this.physicsBody.radius <= 0 &&
        this.physicsBody.center.y + this.physicsBody.radius >= this.canvas.height) {
        // Collide left and bottom side of canvas
        targetPos.x = this.physicsBody.radius;
        targetPos.y = this.canvas.height - this.physicsBody.radius;
        this.moveCollision(targetPos);
        this.angle = angle;
    } else if (this.physicsBody.center.x + this.physicsBody.radius >= this.canvas.width &&
        this.physicsBody.center.y + this.physicsBody.radius >= this.canvas.height) {
        // Collide right and bottom side of canvas
        targetPos.x = this.canvas.width - this.physicsBody.radius;
        targetPos.y = this.canvas.height - this.physicsBody.radius;
        this.moveCollision(targetPos);
        this.angle = angle;
    }

    if (this.physicsBody.center.x - this.physicsBody.radius <= 0) {
        // Collide left side of canvas
        targetPos.x = this.physicsBody.radius;
        this.moveCollisionX(targetPos, 0.02);
        this.angle = angle;
    } else if (this.physicsBody.center.x + this.physicsBody.radius >= this.canvas.width) {
        // Collide right side of canvas
        targetPos.x = this.canvas.width - this.physicsBody.radius;
        this.moveCollisionX(targetPos, 0.02);
        this.angle = angle;
    } else if (this.physicsBody.center.y - this.physicsBody.radius <= 0) {
        // Collide top side of canvas
        targetPos.y = this.physicsBody.radius;
        this.moveCollisionY(targetPos, 0.02);
        this.angle = angle;
    } else if (this.physicsBody.center.y + this.physicsBody.radius >= this.canvas.height) {
        // Collide bottom side of canvas
        targetPos.y = this.canvas.height - this.physicsBody.radius;
        this.moveCollisionY(targetPos, 0.02);
        this.angle = angle;
    }
}

/**
 * @param {Vector2} targetPos
 */
GameComponent.prototype.moveCollisionX = function (targetPos, lerpPourcent) {
    // this.x = (targetPos.x - this.physicsBody.center.x);
    this.x = targetPos.x
    this.y += (targetPos.y - this.physicsBody.center.y) * lerpPourcent;
}

/**
 * @param {Vector2} targetPos 
 */
GameComponent.prototype.moveCollisionY = function (targetPos, lerpPourcent) {
    this.x += (targetPos.x - this.physicsBody.center.x) * lerpPourcent;
    this.y = targetPos.y;
}

/**
 * @param {Vector2} targetPos
 */
GameComponent.prototype.moveCollision = function (targetPos) {
    this.x = targetPos.x;
    this.y = targetPos.y;
}

// var EasingFunctions = {
//     linear: function (t) { return t },
//     easeInQuad: function (t) { return t * t },
//     easeOutQuad: function (t) { return t * (2 - t) },
//     easeInOutQuad: function (t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t },
//     easeInCubic: function (t) { return t * t * t },
//     easeOutCubic: function (t) { return (--t) * t * t + 1 },
//     easeInOutCubic: function (t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 },
//     easeInQuart: function (t) { return t * t * t * t },
//     easeOutQuart: function (t) { return 1 - (--t) * t * t * t },
//     easeInOutQuart: function (t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t },
//     easeInQuint: function (t) { return t * t * t * t * t },
//     easeOutQuint: function (t) { return 1 + (--t) * t * t * t * t },
//     easeInOutQuint: function (t) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t }
// }

// FIXME find you to apply lerp to angle/rotation
/**
 * @param {Vector2} targetPos
 * @param {Number} lerpPourcent
 */
GameComponent.prototype.lerpAngle = function (targetPos, lerpPourcent) {
    // if (this.angle == this.directionAngle) {
    //     this.angle = Helper.angleFromDirection(this.physicsBody.center, targetPos);
    // } else {
    //     this.angle += Helper.angleFromDirection(this.physicsBody.center, targetPos) * lerpPourcent;
    // }
    this.angle = Helper.angleFromDirection(this.physicsBody.center, targetPos);
    this.oppositeAngle = Helper.oppositeAngleFromDirection(this.physicsBody.center, targetPos);
}

// GameComponent.getDirectionAngle = function (targetPos) {
//     this.directionAngle = Helper.angleFromDirection(this.physicsBody.center, targetPos);
// }

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!! Separate physics from graphics !!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/**
 * @param {Circle/Ractangle/Vector2} physicsBody
 * @param {Number} angle
 * @param {Number} offset
 */
GameComponent.prototype.update = function (physicsBody = null, angle = null, offset = null) {
    if (physicsBody && angle) {
        this.physicsBody.update(physicsBody);
        this.angle = angle;
    } else {
        this.physicsBody.update(this.center);
    }
    if (this.debug.flagDebug) {
        this.segment.update(this.physicsBody.center, this.vectorAngle);
    }

    if (offset) {
        this.offset = offset;
    }

    this.backPosition = this.oppositeVectorAngle;
};

GameComponent.prototype.unitAnimation = function () {
    this.animateTile++
    if (this.animateTile >= this.animateTileMax) {
        this.animateTile = 0;
    }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */
GameComponent.prototype.render = function (ctx) {
    // save the unrotated context of the canvas so we can restore it later
    // the alternative is to untranslate & unrotate after drawing
    ctx.save();
    // move to the center of the physics body
    ctx.translate(this.physicsBody.x, this.physicsBody.y);
    // rotate the canvas to the specified angle
    ctx.rotate(this.angle);

    // TODO add animation for other physicsBody type
    // Also take specific render in corresponding constructor
    // draw the image
    // since the context ctx is rotated, the image will be rotated also
    // Draw for a circle
    if (this.physicsBody.radius) {
        if (this.animateUnit) {
            ctx.drawImage(
                this.graphicsBody,
                (this.graphicsBody.width / this.animateTileMax) * this.animateTile,
                0,
                this.graphicsBody.width / this.animateTileMax,
                this.graphicsBody.height,
                - this.physicsBody.radius,
                - this.physicsBody.radius,
                this.physicsBody.boundingRect.width,
                this.physicsBody.boundingRect.height
            );
            this.unitAnimation();
        // } else if (this.randomCannon) {
        //     ctx.drawImage(
        //         this.graphicsBody,
        //         this.graphicsBodyOffsetX + this.physicsBody.radius,
        //         this.graphicsBodyOffsetY + this.physicsBody.radius,
        //         this.graphicsBody.width / 3,
        //         this.graphicsBody.height / 3,
        //         - this.physicsBody.radius,
        //         - this.physicsBody.radius,
        //         this.physicsBody.boundingRect.width,
        //         this.physicsBody.boundingRect.height
        //     );
        } else {
            ctx.drawImage(
                this.graphicsBody,
                - this.physicsBody.radius,
                - this.physicsBody.radius,
                this.physicsBody.boundingRect.width,
                this.physicsBody.boundingRect.height
            );
        }
    } else {
        ctx.drawImage(
            this.graphicsBody,
            0,
            0,
            this.physicsBody.width,
            this.physicsBody.height
        );
    }
    // we’re done with the rotating so restore the unrotated context
    ctx.restore();

    // For DEBUG
    if (this.debug.flagDebug) {
        this.physicsBody.render(ctx, 'blue');
        if (this.debug.flagDebug) {
            this.segment.render(ctx, 'blue');
        }
        // TODO: add different level for debug: eg: debug.level = 1/2/3 ...
        if (this.debug.debugLevel > 1) {
            this.physicsBody.center.render(new Vector2(this.canvas.clientLeft, this.canvas.clientTop), ctx, 'white');
        }
    }
};

Object.defineProperties(GameComponent.prototype, {
    center: {
        get: function () {
            return new Vector2(this.x, this.y);
        }
    },
    position: {
        get: function () {
            return new Vector2(this.physicsBody.center.x, this.physicsBody.center.y);
        },
        set: function (newPos) {
            this.physicsBody.center.x = newPos.x;
            this.physicsBody.center.y = newPos.y;
        }
    },
    // in degrees
    rotation: {
        get: function () {
            // TODO add Utils.RAD_TO_DEG and DEG_TO_RAD const
            return this.angle * 180 / Math.PI;
        }
    },
    vectorAngle: {
        get: function () {
            // add this.physicsBody.centerx and this.physicsBody.center.y for relative computation
            // also check if rectangle or circle
            if (this.physicsBody.radius) {
                var angleX = this.physicsBody.radius * Math.cos(this.angle) + this.physicsBody.center.x;
                var angleY = this.physicsBody.radius * Math.sin(this.angle) + this.physicsBody.center.y;
            } else {
                // Rectangle
                if (this.physicsBody.width > this.physicsBody.height) {
                    var angleX = this.physicsBody.width / 2 * Math.cos(this.angle) + this.physicsBody.center.x;
                    var angleY = this.physicsBody.width / 2 * Math.sin(this.angle) + this.physicsBody.center.y;
                } else {
                    var angleX = this.physicsBody.height / 2 * Math.cos(this.angle) + this.physicsBody.center.x;
                    var angleY = this.physicsBody.height / 2 * Math.sin(this.angle) + this.physicsBody.center.y;
                }
            }
            return new Vector2(angleX, angleY);
        },
        set: function (newVectorAngle) {
            this.vectorAngle = newVectorAngle;
        }
    },
    oppositeVectorAngle: {
        get: function () {
            if (this.physicsBody.radius) {
                var angleX = (this.physicsBody.radius + this.offset) * Math.cos(this.oppositeAngle) + this.physicsBody.center.x;
                var angleY = (this.physicsBody.radius + this.offset) * Math.sin(this.oppositeAngle) + this.physicsBody.center.y;
            } else {
                // Rectangle
                if (this.physicsBody.width > this.physicsBody.height) {
                    var angleX = (this.physicsBody.width / 2 + this.offset) * Math.cos(this.oppositeAngle) + this.physicsBody.center.x;
                    var angleY = (this.physicsBody.width / 2 + this.offset) * Math.sin(this.oppositeAngle) + this.physicsBody.center.y;
                } else {
                    var angleX = (this.physicsBody.height / 2 + this.offset) * Math.cos(this.oppositeAngle) + this.physicsBody.center.x;
                    var angleY = (this.physicsBody.height / 2 + this.offset) * Math.sin(this.oppositeAngle) + this.physicsBody.center.y;
                }
            }
            return new Vector2(angleX, angleY);
        }
    }
});
