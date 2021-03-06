
//helper random functions
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

var c = document.getElementById('homeCanvas');
var ctx = c.getContext('2d');

//font properties
var font_family = ["courier", "monospace", "serif", "sans-serif", "impact", "Arial Black", "Times"];
var words = ["hey", "Hey", "HEY", "hello", "Hello", "HELLO", "hi",
    "Hi", "HI", "what's up", "welcome", "WELCOME", "Welcome", "come in", "Come in", "COME IN"];
var punctuation = ["!", ".", "", "?"];
var font_style = ["normal", "italic"];
var font_weight;
var fontColor;
var font;
var size;
var posX, posY;

//On resize clear screen and make canvas fit. 
function resize() {
  c.width = c.parentNode.offsetWidth;
  c.height = c.parentNode.offsetHeight;
  ctx.fillStyle = "rgba(15, 15, 15, 1)";
  ctx.fillRect(0, 0, c.width, c.height);
}

function drawWord() {
  //generate properties for text.
  font = "Arial";
  fontColor = "rgba(" + getRandomInt(30, 255) + "," + getRandomInt(30, 255) + "," + getRandomInt(30, 255) + ",0.95)";
  size = getRandomFloat(1.5, 4) + "em";
  posX = getRandomFloat(-0.1, 0.92) * c.width;
  posY = getRandomFloat(-0.05, 1) * c.height;
  font_weight = getRandomInt(1, 9) + "00";

  //Draw Text to screen.
  ctx.fillStyle = fontColor;
  ctx.font = font_style[getRandomInt(0, 1)] + " " + font_weight + " " + size + " " + font_family[getRandomInt(0, font_family.length - 1)];
  ctx.fillText(words[getRandomInt(0, words.length - 1)] + punctuation[getRandomInt(0, punctuation.length - 1)], posX, posY);
}

//Event listeners for resizing
if (window.addEventListener) {
  window.addEventListener('resize', resize, false);
  window.addEventListener('load', resize, false);
} else if (window.attachEvent) {
  window.attachEvent('onresize', resize);
  window.attachEvent('onload', resize);
}

//draw a new word every so often.
window.setInterval(function () {
  ctx.fillStyle = "rgba(7, 7, 7, 0.09)";
  ctx.fillRect(0, 0, c.width, c.height);
  drawWord();
}, 80);