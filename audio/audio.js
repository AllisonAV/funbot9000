// Import the interface to Tessel hardware
var tessel = require('tessel');

// Turn one of the LEDs on to start.
tessel.led[2].on();

// Blink!
setInterval(function () {
  tessel.led[2].toggle();
  tessel.led[3].toggle();
}, 100);

console.log("I'm blinking! (Press CTRL + C to stop)");

var path = require('path');
var av = require('tessel-av');
var mp3 = path.join(__dirname, 'Snap - I ve Got The power.mp3');
var sound = new av.Speaker(mp3);

sound.play();

sound.on('ended', function(seconds) {
  sound.play();
});


module.exports = sound