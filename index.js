// Import the interface to Tessel hardware
var tessel = require('tessel');
var sound = require('./audio/audio')
var servo = require('./servo/servo')
var camera = require('./camera/camera')
var accel = require('accel-mma84').use(tessel.port['B']);
var path = require('path');
var av = require('tessel-av');
var mp3 = path.join(__dirname, 'Snap - I ve Got The power.mp3');
var sound = new av.Speaker(mp3);
var servolib = require('servo-pca9685');
var os = require('os');
var http = require('http');

var servo = servolib.use(tessel.port['A']);

var servo1 = 1; // We have a servo plugged in at position 1
var servo2 = 2;

// Turn one of the LEDs on to start.
tessel.led[2].on();

// Blink!
setInterval(function () {
  tessel.led[2].toggle();
  tessel.led[3].toggle();
}, 100);

console.log("I'm blinking! (Press CTRL + C to stop)");

servo.on('ready', function () {
 var position = 0;  //  Target position of the servo between 0 (min) and 1 (max).

 //  Set the minimum and maximum duty cycle for servo 1.
 //  If the servo doesn't move to its full extent or stalls out
 //  and gets hot, try tuning these values (0.05 and 0.12).
 //  Moving them towards each other = less movement range
 //  Moving them apart = more range, more likely to stall and burn out
 servo.configure(servo1, 0.05, 0.12, function () {
   setTimeout(function(){
    setInterval(function () {
     console.log('Position (in range 0-1):', position);
     //  Set servo #1 to position pos.
     servo.move(servo1, position);
     servo.move(servo2, position);

     // Increment by 10% (~18 deg for a normal servo)
     position += 0.1;
     if (position > 1) {
       position = 0; // Reset servo position
     }
   }, 500); // Every 500 milliseconds
    console.log('Servo should be dancing')
   })
 }, 8000);

//  });
});


// Initialize the accelerometer.
accel.on('ready', function () {
// Stream accelerometer data
  accel.on('data', function (xyz) {
  console.log('x:', xyz[0].toFixed(2),
    'y:', xyz[1].toFixed(2),
    'z:', xyz[2].toFixed(2));
  });
  accel.getAcceleration(function(err, xyz){
      console.log(xyz[0], xyz[1], xyz[2]);
  });
});
accel.on('error', function(err){
 console.log('Error:', err);
});




sound.play();

sound.on('ended', function(seconds) {
  sound.play();
});












var port = 3000;
var camera = new av.Camera();

http.createServer((request, response) => {
 response.writeHead(200, { 'Content-Type': 'image/jpg' });

 camera.capture().pipe(response);

}).listen(port, () => console.log(`http://${os.hostname()}.local:${port}`));

