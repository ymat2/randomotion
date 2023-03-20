let isRunning = false;
let intervalID;

function startSimulation() {
	if (!isRunning) {
		isRunning = true;
		loop();
	}
}

function pauseSimulation() {
	if (isRunning) {
		isRunning = false;
		noLoop();
	}
}
