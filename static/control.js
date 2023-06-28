let isRunning = false;
let simulationStartTime;
let totalPausedTime = 0;
let intervalID;

function controlSimulation() {
	if (!isRunning) {
		isRunning = true;
		simulationStartTime = millis() - totalPausedTime;
		loop();
		document.getElementById("controlButton").textContent = "Pause"
	} else {
		isRunning = false;
		noLoop();
		totalPausedTime += millis() - simulationStartTime;
		document.getElementById("controlButton").textContent = "Restart"
	}
}
