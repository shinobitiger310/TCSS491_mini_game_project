class Crossbow {
    constructor(game) {
        this.game = game;
        this.image = ASSET_MANAGER.getAsset("./images/crossbow.png");

        this.scale = 0.3;
        this.width = this.image.width * this.scale;
        this.height = this.image.height * this.scale;

        // Position at bottom center of canvas
        this.x = 512 - this.width / 2;
        this.y = 768 - this.height - 20;

        // Firing
        this.canFire = true;
        this.fireDelay = 0.3;
        this.fireTimer = 0;
    }

    update() {
        // Cooldown timer
        if (!this.canFire) {
            this.fireTimer += this.game.clockTick;
            if (this.fireTimer >= this.fireDelay) {
                this.canFire = true;
                this.fireTimer = 0;
            }
        }

        // Fire arrow on space press
        if (this.game.keys[" "] && this.canFire) {
            this.fire();
            this.canFire = false;
        }
    }

    fire() {
        // Spawn arrow at top center of crossbow
        const arrowX = this.x + this.width / 2;
        const arrowY = this.y;
        this.game.addEntity(new Arrow(this.game, arrowX, arrowY));
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

        // Guide text
        ctx.fillStyle = "green";
        ctx.font = "20px Arial";
        ctx.textAlign = "left";
        ctx.fillText("Press SPACE to fire arrow", this.x + this.width + 20, this.y + 60);
        ctx.fillText("Kill all birds to win!", this.x + this.width + 20, this.y + 90);
    }
}
