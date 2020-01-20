/**
 * @author: Valentin Cadot
 * @version: 1.0.0
 * 
 */

// Primitives
import Circle from "../../geometry/circle";

/**
 * Display health ui around the gameComponent
 * Green for life, red for missing life, blue for shield
 * ui is separated so it can be turned on/off while playing
 * @param {HTMLCanvasElement} canvas 
 * @param {Circle/Reactangle} physicsBody
 * @param {Number} startHealth
 * @param {Number} startShield
 * @param {Boolean} debug 
 */
export default function UiHealth(physicsBody, startHealth, startShield, debug) {
    this.physicsBody = physicsBody;

    this.startHealth = startHealth;
    this.currentHealth = startHealth;
    this.currentHealthPourcent = 100;

    this.currentShield = startShield;

    this.debug = debug;
}

/**
 * @param {Number} health
 * @param {Number} shield
 */
UiHealth.prototype.updateHealthAndShield = function(health, shield) {
    this.currentHealth = health;
    this.currentShield = shield;
}

UiHealth.prototype.displayHealth = function() {
    this.currentHealthPourcent = this.currentHealth * 100 / this.startHealth;
    return 2 * Math.PI * (this.currentHealthPourcent / 100);
}

// 2 * Math.PI = 100 shield
// FIXME when it return more than 2 * Math.PI, there's no indication about the current shield
// Maybe add another function to display super shield, or change rgb values ?
// Or set a maxShield = 100
UiHealth.prototype.displayShield = function() {
    return this.currentShield * (2 * Math.PI / 100);
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!! Separate physics from graphics !!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/**
 * @param {Vector2} positionCenter
 */
UiHealth.prototype.update = function (positionCenter) {
    this.physicsBody = positionCenter;
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */
UiHealth.prototype.render = function (ctx) {
    // Display empty health
    // ctx.strokeStyle =  "rgba(255, 0, 0, 0.5)";;
    // ctx.lineWidth = 8;
    // ctx.beginPath();
    // ctx.arc(this.physicsBody.center.x, this.physicsBody.center.y, this.physicsBody.radius + ctx.lineWidth, 0, 2 * Math.PI );
    // ctx.stroke();
    // ctx.closePath();
    
    // Display current health
    // ctx.strokeStyle =  "rgba(125, 246, 81, 1)";;
    ctx.strokeStyle =  "rgba(0, 255, 0, 1)";;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(this.physicsBody.center.x, this.physicsBody.center.y, this.physicsBody.radius + ctx.lineWidth, 0, this.displayHealth());
    ctx.stroke();
    ctx.closePath();
    
    // Display current shield
    ctx.strokeStyle =  "rgba(65, 93, 246, 1)";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(this.physicsBody.center.x, this.physicsBody.center.y, this.physicsBody.radius + ctx.lineWidth, 0, this.displayShield());
    ctx.stroke();
    ctx.closePath();

}