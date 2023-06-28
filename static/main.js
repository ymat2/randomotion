// Define variables
let particles = [];
let particleCount = 50;
let canvasWidth = document.querySelector('main').offsetWidth-48;
let canvasHeight = 640;

function setup() {
	// Create canvas
	createCanvas(canvasWidth, canvasHeight);

	// Create particles
	for (let i = 0; i < particleCount; i++) {
		particle_i = createParticle()
		particles.push(particle_i);
	}

	// Pause simulation on setup
	noLoop();
	isRunning = false;
}

function setBackgroundColor() {
	var bgcolor = Number(document.getElementById("bg-slider").value);
	background(bgcolor);
}

function createParticle(
		x = random(15, canvasWidth-15),
		y = random(15, canvasHeight-15),
		speed = random(0, 0.1),
		angle = random(0, TWO_PI),
		bw_value = Math.round(random()) === 0 ? 65 : 252 // randomly b/w
	) {
	let particle = new Particle(x, y, speed, angle, bw_value);
	return particle;
}

function draw() {
	// Clear canvas
	setBackgroundColor();

	// Update particles
	for (let i = 0; i < particles.length; i++) {
		particles[i].update();
		particles[i].checkEdges();
		particles[i].tryReproduct();
		particles[i].display();

		// Apply repulsion to nearby particles
		for (let j = i + 1; j < particles.length; j++) {
			let distance = particles[i].position.dist(particles[j].position);
			if (distance < 50) {
				let repulsionForce = p5.Vector.sub(particles[i].position, particles[j].position);
				repulsionForce.normalize();
				repulsionForce.mult(0.01);
				particles[i].applyForce(repulsionForce);
				particles[j].applyForce(repulsionForce.mult(-1));
			}
		}
	}

	let particleCountByColor = {"black": 0, "white": 0};
	for (let k = 0; k < particles.length; k++) {
		if (particles[k].rgb == 65 && particles[k].isAlive) {
			particleCountByColor["black"] += 1
		} else if (particles[k].rgb == 252 && particles[k].isAlive) {
			particleCountByColor["white"] += 1
		}
	}
	document.getElementById("pop_black").textContent = particleCountByColor["black"] || 0;
	document.getElementById("pop_white").textContent = particleCountByColor["white"] || 0;

	// Stop simulation after 30 seconds
	if (millis() - simulationStartTime >= 30000) {
		isRunning = false;
		noLoop();
	}
}

// Detele particle
function mousePressed() {
	for (let i = particles.length - 1; i >= 0; i--) {
		let particle = particles[i];
		let distance = dist(mouseX, mouseY, particle.position.x, particle.position.y);
		if (distance < particle.radius / 2) {
			particle.isAlive = false;
		}
	}
}

// Particle class
class Particle {
	constructor(x, y, speed, angle, bw_value) {
		this.position = createVector(x, y);
		this.velocity = p5.Vector.fromAngle(angle);
		this.velocity.mult(speed);
		this.acceleration = createVector(0, 0);
		this.radius = 30;
		this.rgb = bw_value;
		this.color = color(this.rgb, this.rgb, this.rgb);
		this.isAlive = true;
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
		if (this.position.x < 15 || this.position.x > canvasWidth-15) {
			this.velocity.x = -this.velocity.x;
		}

		if (this.position.y < 15 || this.position.y > canvasHeight-15) {
			this.velocity.y = -this.velocity.y;
		}
	}

	tryReproduct() {
		let successRep = random();
		if (this.isAlive && successRep < 0.0001) {
			let particle_new = createParticle();
			particles.push(particle_new);
		}
	}

	display() {
		if (this.isAlive) {
			noStroke();
			fill(this.color);
			ellipse(this.position.x, this.position.y, this.radius, this.radius);
		}
	}
}
