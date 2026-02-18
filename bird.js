class Bird {
    constructor(game) {
        this.game = game;
        this.tag = "bird";
        this.removeFromWorld = false;
        this.spritesheet = ASSET_MANAGER.getAsset("./images/blue flying bird.png");

        // Frame dimensions (4 frames horizontal strip)
        this.frameWidth = 600;
        this.frameHeight = 508;
        this.frameCount = 4;
        this.frameDuration = 0.1;

        this.animator = new Animator(
            this.spritesheet,
            0, 0,
            this.frameWidth,
            this.frameHeight,
            this.frameCount,
            this.frameDuration
        );

        // Scale
        this.scale = 0.15;
        this.scaledWidth = this.frameWidth * this.scale;

        // Random Y position (keep in upper half of canvas)
        this.y = 20 + Math.random() * (this.game.canvas.height * 0.4);

        // Speed from level config
        const config = this.game.levels[this.game.currentLevel];
        this.speed = config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed);

        // Start from left, move right
        this.x = -this.scaledWidth - Math.random() * 500;
    }

    update() {
        this.x += this.speed * this.game.clockTick;

        // Reset to left when off right edge — costs the player 1 HP
        if (this.x > this.game.ctx.canvas.width) {
            if (this.game.playerHP > 0) this.game.playerHP--;
            this.x = -this.scaledWidth;
            this.y = 20 + Math.random() * (this.game.ctx.canvas.height * 0.4);
        }
    }

    draw(ctx) {
        this.animator.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
    }

    getBoundingBox() {
        return {
            x: this.x,
            y: this.y,
            width: this.scaledWidth,
            height: this.frameHeight * this.scale
        };
    }
}
