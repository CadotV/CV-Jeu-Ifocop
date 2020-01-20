/**
 * @author: Valentin Cadot
 * @version: 1.0.0
 */

import fogsImg from './img/fogs.png';

/**
 * BackgroundFogs: create random stars in the background
 * @param {HTMLCanvasElement} canvas 
 * @param {Number} gameSpeed 
 */
export default function BackgroundFogs(canvas, gameSpeed) {
    this.canvas = canvas;
    this.gameSpeed = gameSpeed;

    this.backgroundGraphicsBody = new Image();
    this.backgroundGraphicsBody.src = fogsImg;

    // FIXME retrieve image size with onlaod ? 
    this.backgroundWidth = 2048;
    this.backgroundHeight = 2048;

    this.randomSize = this.returnRandomSize();

    this.randomRotation = this.returnRandomRotation();

    // TODO add gameSpeed in update function to change speed during game loop
    this.gameSpeed = gameSpeed;
    this.backgroundSpeed = this.randomSpeed(gameSpeed);

    // TODO Ratio: not usefull right now
    this.ratioW = this.backgroundWidth / this.canvas.width;
    this.ratioH = this.backgroundHeight / this.canvas.height;

    // Image source
    this.backgroundSX = this.offsetSX();
    this.backgroundSY = 0;

    // Canvas destination position
    this.backgroundDX = this.offsetDX();
    this.backgroundDY = - this.backgroundHeight;
}

BackgroundFogs.prototype.returnRandomRotation = function() {
    return Math.floor(Math.random() * 360) * (Math.PI / 180);
}

/**
 * Return the random size for a fog
 * @param {Number} - a random number between 1 and 2 include
 */
BackgroundFogs.prototype.returnRandomSize = function () {
    return Math.floor(Math.random() * 2) + 1;
}

BackgroundFogs.prototype.randomSpeed = function (gameSpeed) {
    return gameSpeed * Math.round(Math.random() * 3) + 1; // + 1 to avoid 0 speed
}


/**
 * offset in SX image to choose randomly between 4 stars in tile
 */
BackgroundFogs.prototype.offsetSX = function () {
    return Math.floor(Math.random() * 3) * this.backgroundWidth;
}


/**
 * offset in DX canvas so half of the start is always visible
 */
BackgroundFogs.prototype.offsetDX = function () {
    return Math.random() * this.canvas.width - this.backgroundWidth / 2;
}

/**
 * Move background and others object in parallax from top to bottom screen. Then repeat
 */
BackgroundFogs.prototype.update = function () {
    this.backgroundDY += this.backgroundSpeed;
    if (this.backgroundDY >= this.canvas.height + this.backgroundHeight * 2) {
        this.randomRotation = this.returnRandomRotation();
        this.randomSize = this.returnRandomSize();
        this.backgroundSX = this.offsetSX();
        this.backgroundDX = this.offsetDX();
        this.backgroundDY = - this.backgroundHeight;
        this.backgroundSpeed = this.randomSpeed(this.gameSpeed);
    }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */
BackgroundFogs.prototype.render = function (ctx) {
    // save the unrotated context of the canvas so we can restore it later
    // the alternative is to untranslate & unrotate after drawing
    // ctx.save();
    // // move to the center of the physics body
    // ctx.translate(
    //     this.canvas.width / 2,
    //     this.canvas.height / 2);
    // // rotate the canvas to the specified angle
    // ctx.rotate(this.randomRotation);
    // Draw the star
    ctx.drawImage(
        this.backgroundGraphicsBody,
        this.backgroundSX,
        this.backgroundSY,
        this.backgroundWidth,
        this.backgroundHeight,
        this.backgroundDX,
        this.backgroundDY,
        this.backgroundWidth / this.randomSize,
        this.backgroundHeight /this.randomSize,
    );
    // ctx.restore();
}