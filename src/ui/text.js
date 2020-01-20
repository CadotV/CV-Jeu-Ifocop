/**
 * @author: Valentin Cadot
 * @version: 1.0.0
 * 
 */

/**
 * Display in the target position text
 * @param {HTMLCanvasElement} canvas 
 * @param {String} text 
 */
export default function Text(canvas, text, targetPos, fontSize, debug) {
    this.canvas = canvas;
    this.text = text;
    this.targetPos = targetPos;
    this.fontSize = fontSize;
    this.destroyed = false;
    this.debug = debug;
}

// Return the width in px of the String
Text.prototype.stringTotalWdith = function () {
    return (this.text.length) * this.fontSize / 3.5;
}

/**
 * @param {String} text
 */
Text.prototype.changeText = function (text) {
    this.text = text;
}

Text.prototype.update = function () { }

Text.prototype.destroy = function () {
    this.destroyed = true;
}

Text.prototype.render = function (ctx) {
    ctx.fillStyle = "rgba(100, 100, 255, 1)";
    ctx.font = `bold ${this.fontSize}px Monospace`;
    ctx.fillText(`${this.text}`, (this.canvas.width / 2) - this.stringTotalWdith(), this.canvas.height / 2 - 200);
}