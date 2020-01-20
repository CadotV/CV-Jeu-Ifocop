/**
 * @author: Valentin Cadot
 * @version: 1.0.0
 */

// Others
import BackgroundPlanets from './backgroundPlanets';
import BackgroundStars from './backgroundStars';
import BackgroundFogs from './backgroundFogs';

/**
 * Background: the background of the Game. Use repeated tiles in top and bottom
 * @param {HTMLCanvasElement} canvas 
 * @param {Number} gameSpeed - background scroll
 */
export default function Background(canvas, nbBackgroundStars, nbForegroundStars, nbBackgroundFogs, nbForegroundFogs, gameSpeed) {
    this.canvas = canvas;
    this.gameSpeed = gameSpeed;

    // this.backgroundGraphicsBody = new Image();
    // this.backgroundGraphicsBody.src = backgroundImg;

    // // FIXME retrieve image size with onlaod ? 
    // this.backgroundWidth = 2480;
    // this.backgroundHeight = 3508;

    // // TODO add gameSpeed in update function to change speed during game loop
    // this.backgroundSpeed = gameSpeed;

    // // TODO Ratio: not usefull right now
    // this.ratioW = this.backgroundWidth / this.canvas.width;
    // this.ratioH = this.backgroundHeight / this.canvas.height;

    // // Canvas destination position
    // this.backgroundDX = 0;
    // this.backgroundDY = this.setOffset(this.backgroundHeight);


    // TODO backgroundStars and backgroundPlanets are the same. Make a generic object constructor
    this.backgroundPlanets = new BackgroundPlanets(canvas, gameSpeed);

    this.starsBackgroundArr = [];
    for (let i = 0; i < nbBackgroundStars; i++) {
        this.starsBackgroundArr.push(new BackgroundStars(canvas, gameSpeed));
    }

    this.starsForegroundArr = [];
    for (let i = 0; i < nbForegroundStars; i++) {
        this.starsForegroundArr.push(new BackgroundStars(canvas, gameSpeed));
    }

    this.fogsBackgroundArr = [];
    for (let i = 0; i < nbBackgroundFogs; i++) {
        this.fogsBackgroundArr.push(new BackgroundFogs(canvas, gameSpeed));
    }

    this.fogsForegroundArr = [];
    for (let i = 0; i < nbForegroundFogs; i++) {
        this.fogsForegroundArr.push(new BackgroundFogs(canvas, gameSpeed));
    }
}

/**
 * Static function to calculate starting offset
 * offset is calculated with width ratio in account
 * @param {Number} imageHeight
 * @return {Number} the offset
 */
Background.prototype.setOffset = function (imageHeight) {
    return this.canvas.height - imageHeight;
}

/**
 * Move background and others object in parallax. Then repeat
 */
Background.prototype.update = function () {
    // this.backgroundDY += this.backgroundSpeed;
    // if (this.backgroundDY >= 0) {
    //     this.backgroundDY = this.setOffset(this.backgroundHeight);
    // }

    this.starsBackgroundArr.forEach(star => {
        star.update();
    })

    this.starsForegroundArr.forEach(star => {
        star.update();
    })

    this.fogsBackgroundArr.forEach(fog => {
        fog.update();
    })

    this.fogsForegroundArr.forEach(fog => {
        fog.update();
    })

    this.backgroundPlanets.update();
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */
Background.prototype.render = function (ctx) {
    // Draw the background
    // ctx.drawImage(
    //     this.backgroundGraphicsBody,
    //     this.backgroundDX,
    //     this.backgroundDY,
    //     this.canvas.width,
    //     this.backgroundHeight,
    // );

    this.starsBackgroundArr.forEach(star => {
        star.render(ctx);
    })

    this.fogsBackgroundArr.forEach(fog => {
        fog.render(ctx);
    })

    this.backgroundPlanets.render(ctx);

    this.starsForegroundArr.forEach(star => {
        star.render(ctx);
    })

    this.fogsForegroundArr.forEach(fog => {
        fog.render(ctx);
    })
}

