'use strict';
/**
 * Function index
 * Main entry file
 * @author: Valentin Cadot
 * @version: 1.0.0
**/

import Game from './game.js';
import './style.css';

var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
    console.log('mobile detected :', navigator.userAgent);
} else {
    console.log("Navigator don't support deviceorientation");
}

// Create the canvas element
// TODO get height and width from config file
function canvasComponent() {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'gameCanvas');
        canvas.setAttribute('width', window.innerWidth);
        canvas.setAttribute('height', window.innerHeight);
    canvas.innerHTML = `${canvas} / canvas element don't exist, please use a modern web browser :)`;
    return canvas;
}

if (isMobile) {
    window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.ontouchmove = preventDefault;
    function preventDefault(e) {
        e = e || window.event;
        if (e.preventDefault)
            e.preventDefault();
        e.returnValue = false;
    }
}

let canvasElement = canvasComponent();
document.body.appendChild(canvasElement);

window.addEventListener('resize', function() {
    this.document.getElementById('gameCanvas').setAttribute('width', window.innerWidth);
    this.document.getElementById('gameCanvas').setAttribute('height', window.innerHeight);
});

// Instantiate the game
let game = new Game(canvasElement);

// Initialize the game
game.menuScreen();

