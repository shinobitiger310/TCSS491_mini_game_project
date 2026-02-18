const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

const LEVELS = [
	{ birds: 3,  minSpeed: 80,  maxSpeed: 130 },
	{ birds: 5,  minSpeed: 110, maxSpeed: 170 },
	{ birds: 8,  minSpeed: 140, maxSpeed: 210 },
	{ birds: 10, minSpeed: 170, maxSpeed: 250 },
	{ birds: 12, minSpeed: 200, maxSpeed: 300 },
];

ASSET_MANAGER.queueDownload("./images/blue flying bird.png");
ASSET_MANAGER.queueDownload("./images/crossbow.png");
ASSET_MANAGER.queueDownload("./images/red_heart.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	window.addEventListener("resize", () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	});

	const ctx = canvas.getContext("2d");

	// Read saved level from localStorage (null if none)
	const savedRaw   = localStorage.getItem("birdHunterLevel");
	const savedLevel = savedRaw !== null ? Math.min(parseInt(savedRaw), LEVELS.length - 1) : null;

	function spawnLevel(index) {
		gameEngine.currentLevel = index;
		const config = LEVELS[index];
		gameEngine.totalBirds = config.birds;
		for (let i = 0; i < config.birds; i++) {
			gameEngine.addEntity(new Bird(gameEngine));
		}
		if (gameEngine.soundManager) gameEngine.soundManager.playLevel(index);
	}

	function checkCollision(a, b) {
		return a.x < b.x + b.width  &&
			   a.x + a.width  > b.x &&
			   a.y < b.y + b.height &&
			   a.y + a.height > b.y;
	}

	function startGame(startLevel) {
		gameEngine.canvas = canvas;
		gameEngine.playerHP = 3;
		gameEngine.levels = LEVELS;
		gameEngine.currentLevel = 0;
		gameEngine.levelTransition = false;
		gameEngine.levelTransitionTimer = 0;
		gameEngine.gameWon = false;
		gameEngine.gameOver = false;
		gameEngine.gameOverTimer = 0;
		gameEngine.paused = false;

		spawnLevel(startLevel);
		gameEngine.addEntity(new Crossbow(gameEngine));
		gameEngine.addEntity(new HUD(gameEngine));
		gameEngine.addEntity(new PauseMenu(gameEngine, canvas));

		// M key toggles pause
		canvas.addEventListener("keydown", (e) => {
			if (e.key === "m" || e.key === "M") gameEngine.paused = !gameEngine.paused;
		});

		const originalUpdate = gameEngine.update.bind(gameEngine);
		gameEngine.update = function() {
			if (this.paused) return;

			// Game over: freeze game and return to main menu after delay
			if (this.gameOver) {
				this.gameOverTimer += this.clockTick;
				if (this.gameOverTimer >= 3) location.reload();
				return;
			}

			originalUpdate();

			const arrows = this.entities.filter(e => e.tag === "arrow");
			const birds  = this.entities.filter(e => e.tag === "bird");

			for (let arrow of arrows) {
				for (let bird of birds) {
					if (arrow.removeFromWorld || bird.removeFromWorld) continue;
					if (checkCollision(arrow.getBoundingBox(), bird.getBoundingBox())) {
						arrow.removeFromWorld = true;
						bird.removeFromWorld  = true;
						this.soundManager.playBirdHit();
					}
				}
			}

			// Lose condition
			if (this.playerHP <= 0) {
				this.gameOver = true;
				return;
			}

			const remaining = this.entities.filter(e => e.tag === "bird");
			if (this.levelTransition) {
				this.levelTransitionTimer += this.clockTick;
				if (this.levelTransitionTimer >= 2) {
					this.levelTransition = false;
					this.levelTransitionTimer = 0;
					spawnLevel(this.currentLevel + 1);
				}
			} else if (!this.gameWon && remaining.length === 0) {
				if (this.currentLevel + 1 < LEVELS.length) {
					this.levelTransition = true;
					this.levelTransitionTimer = 0;
					// Save progress: next level index
					localStorage.setItem("birdHunterLevel", String(this.currentLevel + 1));
				} else {
					this.gameWon = true;
					localStorage.removeItem("birdHunterLevel");
				}
			}
		};

		gameEngine.init(ctx);
		gameEngine.start();
	}



	// Show main menu first
	new MainMenu(canvas, savedLevel, startGame);
});
