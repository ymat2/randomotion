// Define variables
let particles = [];
let particleCount = 100;
let canvasWidth = 640;
let canvasHeight = 480;

function setup() {
	// Create canvas
	createCanvas(canvasWidth, canvasHeight);

	// Create particles
	for (let i = 0; i < particleCount; i++) {
		let x = random(0, canvasWidth);
		let y = random(0, canvasHeight);
		let speed = random(1, 3);
		let angle = random(0, TWO_PI);
		let particle = new Particle(x, y, speed, angle);
		particles.push(particle);
	}

	// Pause simulation on setup
	noLoop();
	isRunning = false;
}

function draw() {
	// Clear canvas
	background(255);

	// Update particles
	for (let i = 0; i < particles.length; i++) {
		particles[i].update();
		particles[i].checkEdges();
		particles[i].display();

		// Apply repulsion to nearby particles
		for (let j = i + 1; j < particles.length; j++) {
			let distance = particles[i].position.dist(particles[j].position);
			if (distance < 50) {
				let repulsionForce = p5.Vector.sub(particles[i].position, particles[j].position);
				repulsionForce.normalize();
				repulsionForce.mult(0.05);
				particles[i].applyForce(repulsionForce);
				particles[j].applyForce(repulsionForce.mult(-1));
			}
		}
	}
}

// Particle class
class Particle {
	constructor(x, y, speed, angle) {
		this.position = createVector(x, y);
		this.velocity = p5.Vector.fromAngle(angle);
		this.velocity.mult(speed);
		this.acceleration = createVector(0, 0);
		this.radius = 10;
		this.color = color(random(0), random(0), random(255));
	}

	update() {
		this.velocity.add(this.acceleration);
		this.velocity.limit(5);
		this.position.add(this.velocity);
		this.acceleration.mult(0);
	}

	applyForce(force) {
		this.acceleration.add(force);
	}

	checkEdges() {
		if (this.position.x < 0 || this.position.x > canvasWidth) {
			this.velocity.x = -this.velocity.x;
		}

		if (this.position.y < 0 || this.position.y > canvasHeight) {
			this.velocity.y = -this.velocity.y;
		}
	}

	display() {
		noStroke();
		fill(this.color);
		ellipse(this.position.x, this.position.y, this.radius, this.radius);
	}
}
