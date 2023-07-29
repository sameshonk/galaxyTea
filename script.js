const canvas = document.getElementById('starfallCanvas');
const ctx = canvas.getContext('2d');
const speedMultipier = .05;
let lines = [];
let starsLayers = [
  { stars: [], speed: 1*speedMultipier, numStars: 100, sizeRange: [1, 2] }, // Slowest moving stars (background)
  { stars: [], speed: 2*speedMultipier, numStars: 150, sizeRange: [2, 3] }, // Medium moving stars (change speed here)
  { stars: [], speed: 3*speedMultipier, numStars: 200, sizeRange: [3, 4] } // Fastest moving stars (foreground) (change speed here)
];

// Set canvas dimensions to cover the entire window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const numLines = 1; // Change the number of lines that form initially
const fallSpeed = 20; // Change the speed at which the lines fall (lower values for slower fall)
const angle = 110; // Adjust the angle of the falling lines in degrees

// Function to create a line shooting in from the top at a specified angle
function createLine() {
  const length = Math.random() * 100 + 50; // Random length between 50 and 150
  const speed = Math.random() * (fallSpeed-5) + fallSpeed; // Random speed between 0.5 and 1 (lower values for slower fall)
  const angleInRadians = (angle * Math.PI) / 180; // Convert angle to radians
  const x = Math.random() * canvas.width; // Random horizontal position
  const y = -length - Math.random() * 300; // Start above the canvas with some vertical offset

  return { x, y, length, speed, angle: angleInRadians };
}

// Function to create a background star
function createStar(sizeRange) {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const size = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];

  return { x, y, size };
}

// Function to draw the lines
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background stars with a parallax effect
  for (let layer of starsLayers) {
	for (let star of layer.stars) {
	  ctx.fillStyle = 'rgba(255, 255, 255, .8)'; // Dimmer stars (adjust alpha value)

	  // Move the stars vertically based on the layer speed
	  star.y += layer.speed;
	  if (star.y > canvas.height) {
		star.y = 0; // Reset star position when it goes beyond the canvas
	  }

	  // Draw the square star
	  ctx.fillRect(star.x, star.y, star.size, star.size);
	}
  }

  // Draw the starfall effect in the foreground
  for (let i = 0; i < lines.length; i++) {
	let line = lines[i];
	ctx.beginPath();
	ctx.moveTo(line.x, line.y);
	const endX = line.x + line.length * Math.cos((angle * Math.PI) / 180);
	const endY = line.y + line.length * Math.sin((angle * Math.PI) / 180);
	const alphaMultiplier = 1;
	ctx.lineTo(endX, endY);
	ctx.strokeStyle = 'rgba(255, 255, 255, ' + (1 - (line.y + line.length) / canvas.height)/alphaMultiplier + ')';
	ctx.lineWidth = 1;
	ctx.stroke();

	line.x += line.speed * Math.cos(line.angle); // Move horizontally based on angle
	line.y += line.speed * Math.sin(line.angle); // Move vertically based on angle

	if (line.y > canvas.height) {
	  lines[i] = createLine();
	}
  }

  requestAnimationFrame(draw);
}

// Initialize the lines
for (let i = 0; i < numLines; i++) {
  lines.push(createLine());
}

// Initialize the stars for each layer
for (let layer of starsLayers) {
  for (let i = 0; i < layer.numStars; i++) {
	layer.stars.push(createStar(layer.sizeRange));
  }
}

// Start the animation
draw();