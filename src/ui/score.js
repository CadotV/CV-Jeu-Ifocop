/**
 * @author: Valentin Cadot
 * @version: 1.0.0
 * 
 */

/**
 * Score: display score of player
 */
export default function Score(canvas) {
    this.canvas = canvas;

    this.scoreString = 'Score : ';
    this.score = 0;
}

// Return the width in px of the String with score value
Score.prototype.scoreStringTotalWdith = function() {
    return (this.scoreString.length + this.score.toString().length) * 19;
}

/**
 * @param {Number} score
 */
Score.prototype.update = function (newScore) {
    if (newScore) this.score = newScore;
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */
Score.prototype.render = function (ctx) {
    ctx.fillStyle = "white";
    ctx.font = "bold 64px Monospace";
    ctx.fillText(`${this.scoreString + this.score}`, (this.canvas.width / 2) - this.scoreStringTotalWdith(), 80);
}