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

        // Random Y position (keep fully below top edge)
        this.y = 20 + Math.random() * 280;

        // Random speed
        this.speed = 100 + Math.random() * 100;

        // Start from left, move right
        this.x = -this.scaledWidth - Math.random() * 500;
    }

    update() {
        this.x += this.speed * this.game.clockTick;

        // Reset to left when off right edge
        if (this.x > 1024) {
            this.x = -this.scaledWidth;
            this.y = 20 + Math.random() * 280;
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
