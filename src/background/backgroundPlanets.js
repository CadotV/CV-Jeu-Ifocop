/**
 * @author: Valentin Cadot
 * @version: 1.0.0
 */

// Ressources
import planetsImg from './img/planets.png';

/**
 * Same concept as Background. Add random parallax stars
 * TODO change size of stars depending on speed for realism
 * @param {HTMLCanvasElement} canvas 
 * @param {Number} gameSpeed 
 */
export default function BackgroundPlanets(canvas, gameSpeed) {
    this.canvas = canvas;

    this.backgroundGraphicsBody = new Image();
    this.backgroundGraphicsBody.src = planetsImg;

    // FIXME retrieve image size with onlaod ? 
    this.backgroundWidth = 507;
    this.backgroundHeight = 512;

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

BackgroundPlanets.prototype.randomSpeed = function (gameSpeed) {
    return gameSpeed * Math.round(Math.random() * 2) + 2; // + 1 to avoid 0 speed
}

/**
 * offset in SX image to choose randomly between 3 stars in tile
 */
BackgroundPlanets.prototype.offsetSX = function () {
    return Math.floor(Math.random() * 3) * this.backgroundWidth;
}

/**
 * offset in DX canvas so half of the start is always visible
 */
BackgroundPlanets.prototype.offsetDX = function () {
    return Math.random() * this.canvas.width - this.backgroundWidth / 2;
}

/**
 * Move background and others object in parallax from top to bottom screen. Then repeat
 */
BackgroundPlanets.prototype.update = function () {
    this.backgroundDY += this.backgroundSpeed;
    if (this.backgroundDY >= this.canvas.height + this.backgroundHeight * 2) {
        this.backgroundSX = this.offsetSX();
        this.backgroundDX = this.offsetDX();
        this.backgroundDY = - this.backgroundHeight;
        this.backgroundSpeed = this.randomSpeed(this.gameSpeed);
    }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */
BackgroundPlanets.prototype.render = function (ctx) {
    // Draw the background
    ctx.drawImage(
        this.backgroundGraphicsBody,
        this.backgroundSX,
        this.backgroundSY,
        this.backgroundWidth,
        this.backgroundHeight,
        this.backgroundDX,
        this.backgroundDY,
        this.backgroundWidth,
        this.backgroundHeight,
    );
}