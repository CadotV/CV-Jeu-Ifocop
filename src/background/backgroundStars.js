/**
 * @author: Valentin Cadot
 * @version: 1.0.0
 */

import starsImg from './img/stars.png';
import Background from './background';

/**
 * BackgroundStars: create random stars in the background
 * @param {HTMLCanvasElement} canvas 
 * @param {Number} gameSpeed 
 */
export default function BackgroundStars(canvas, gameSpeed) {
    this.canvas = canvas;
    this.gameSpeed = gameSpeed;

    this.backgroundGraphicsBody = new Image();
    this.backgroundGraphicsBody.src = starsImg;

    // FIXME retrieve image size with onlaod ? 
    this.backgroundWidth = 58;
    this.backgroundHeight = 64;

    this.randomSize = this.returnRandomSize();

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

/**
 * Return the random size for a star
 * @param {Number} - a random number between 1 and 3 include
 */
BackgroundStars.prototype.returnRandomSize = function () {
    return Math.floor(Math.random() * 4) + 4;
}

BackgroundStars.prototype.randomSpeed = function (gameSpeed) {
    return gameSpeed * Math.round(Math.random() * 8) + 1; // + 1 to avoid 0 speed
}


/**
 * offset in SX image to choose randomly between 4 stars in tile
 */
BackgroundStars.prototype.offsetSX = function () {
    return Math.floor(Math.random() * 4) * this.backgroundWidth;
}


/**
 * offset in DX canvas so half of the start is always visible
 */
BackgroundStars.prototype.offsetDX = function () {
    return Math.random() * this.canvas.width - this.backgroundWidth / 2;
}

/**
 * Move background and others object in parallax from top to bottom screen. Then repeat
 */
BackgroundStars.prototype.update = function () {
    this.backgroundDY += this.backgroundSpeed;
    if (this.backgroundDY >= this.canvas.height + this.backgroundHeight * 2) {
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
BackgroundStars.prototype.render = function (ctx) {
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
        this.backgroundHeight / this.randomSize,
    );
}