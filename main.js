const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./images/blue flying bird.png");
ASSET_MANAGER.queueDownload("./images/crossbow.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");

	// Create multiple birds flying in random directions
	const numBirds = 8;
	for (let i = 0; i < numBirds; i++) {
		gameEngine.addEntity(new Bird(gameEngine));
	}

	// Add crossbow at bottom
	gameEngine.addEntity(new Crossbow(gameEngine));

	// Collision detection helper
	function checkCollision(a, b) {
		return a.x < b.x + b.width &&
			   a.x + a.width > b.x &&
			   a.y < b.y + b.height &&
			   a.y + a.height > b.y;
	}

	// Add collision detection to game loop
	const originalUpdate = gameEngine.update.bind(gameEngine);
	gameEngine.update = function() {
		originalUpdate();

		// Get all arrows and birds
		const arrows = this.entities.filter(e => e.tag === "arrow");
		const birds = this.entities.filter(e => e.tag === "bird");

		// Check collisions
		for (let arrow of arrows) {
			for (let bird of birds) {
				if (arrow.removeFromWorld || bird.removeFromWorld) continue;

				const arrowBox = arrow.getBoundingBox();
				const birdBox = bird.getBoundingBox();

				if (checkCollision(arrowBox, birdBox)) {
					arrow.removeFromWorld = true;
					bird.removeFromWorld = true;
				}
			}
		}
	};

	gameEngine.init(ctx);

	gameEngine.start();
});
