let isRunning = false;
let intervalID;

function controlSimulation() {
	if (!isRunning) {
		isRunning = true;
		loop();
		document.getElementById("controlButton").textContent = "Pause"
	} else {
		isRunning = false;
		noLoop();
		document.getElementById("controlButton").textContent = "Restart"
	}
}
