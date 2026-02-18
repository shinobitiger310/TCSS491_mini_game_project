class Crossbow {
    constructor(game) {
        this.game = game;
        this.image = ASSET_MANAGER.getAsset("./images/crossbow.png");

        this.scale = 0.2;
        this.width = this.image.width * this.scale;
        this.height = this.image.height * this.scale;

        // Position at bottom center of canvas
        this.x = this.game.canvas.width / 2 - this.width / 2;
        this.y = this.game.canvas.height - this.height - 20;

        // Angle in radians: -PI/2 = straight up
        this.angle = -Math.PI / 2;

        // Firing
        this.canFire = true;
        this.fireDelay = 0.3;
        this.fireTimer = 0;
    }

    update() {
        const pivotX = this.x + this.width / 2;
        const pivotY = this.y + this.height / 2;

        // Mouse aiming: always track cursor position
        if (this.game.mouse) {
            const dx = this.game.mouse.x - pivotX;
            const dy = this.game.mouse.y - pivotY;
            this.angle = Math.atan2(dy, dx);
        }

        // Clamp to upper half only (can't aim downward)
        this.angle = Math.max(-Math.PI + 0.05, Math.min(-0.05, this.angle));

        // Cooldown timer
        if (!this.canFire) {
            this.fireTimer += this.game.clockTick;
            if (this.fireTimer >= this.fireDelay) {
                this.canFire = true;
                this.fireTimer = 0;
            }
        }

        // Fire on Space or left click
        if ((this.game.keys[" "] || this.game.click) && this.canFire) {
            this.fire();
            this.canFire = false;
            this.game.click = null;
        }
    }

    fire() {
        this.game.soundManager.playArrow();
        const pivotX = this.x + this.width / 2;
        const pivotY = this.y + this.height / 2;
        const tipDist = Math.max(this.width, this.height) / 2;
        const arrowX = pivotX + Math.cos(this.angle) * tipDist;
        const arrowY = pivotY + Math.sin(this.angle) * tipDist;
        this.game.addEntity(new Arrow(this.game, arrowX, arrowY, this.angle));
    }

    draw(ctx) {
        const pivotX = this.x + this.width / 2;
        const pivotY = this.y + this.height / 2;

        // Draw crossbow rotated around its center
        // Image points up by default, offset by +PI/2 to align with angle system
        ctx.save();
        ctx.translate(pivotX, pivotY);
        ctx.rotate(this.angle + Math.PI / 2);
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();

        // Guide text at bottom center
        ctx.save();
        ctx.fillStyle    = "green";
        ctx.font         = "18px Arial";
        ctx.textAlign    = "left";
        ctx.textBaseline = "bottom";
        ctx.fillText("Move mouse to aim  |  SPACE or Click to fire", 10, ctx.canvas.height - 10);
        ctx.restore();
    }
}
