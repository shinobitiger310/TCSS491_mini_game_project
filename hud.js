class HUD {
    constructor(game) {
        this.game = game;
        this.heartImage = ASSET_MANAGER.getAsset("./images/red_heart.png");
    }

    update() {}

    draw(ctx) {
        const size    = 24;
        const padding = 8;
        const gap     = 4;

        // --- Hearts (top-right) ---
        const heartsStartX = ctx.canvas.width - padding - 3 * (size + gap);
        const startY = padding;

        ctx.save();
        for (let i = 0; i < 3; i++) {
            ctx.globalAlpha = i < this.game.playerHP ? 1 : 0.3;
            ctx.filter      = i < this.game.playerHP ? "none" : "grayscale(100%)";
            ctx.drawImage(this.heartImage, heartsStartX + i * (size + gap), startY, size, size);
        }
        ctx.restore();

        // --- Bird count (left of hearts) ---
        const remaining = this.game.entities.filter(e => e.tag === "bird").length;
        const total     = this.game.totalBirds;

        ctx.save();
        ctx.font         = "bold 16px Arial";
        ctx.fillStyle    = "#333";
        ctx.textAlign    = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(`Birds: ${remaining} / ${total}`, heartsStartX - 12, startY + size / 2);
        ctx.restore();

        // --- Level indicator (top-left) ---
        const totalLevels = this.game.levels.length;
        const levelNum    = this.game.currentLevel + 1;

        ctx.save();
        ctx.font         = "bold 16px Arial";
        ctx.fillStyle    = "#333";
        ctx.textAlign    = "left";
        ctx.textBaseline = "top";
        ctx.fillText(`Level: ${levelNum} / ${totalLevels}`, padding, padding);
        ctx.restore();

        // --- Level transition overlay ---
        if (this.game.levelTransition) {
            const next = this.game.currentLevel + 2;
            this._drawCenterMessage(ctx, `Level ${this.game.currentLevel + 1} Clear!`, `Get ready for Level ${next}...`);
        }

        // --- Win overlay ---
        if (this.game.gameWon) {
            this._drawCenterMessage(ctx, "You Win!", "All levels completed!");
        }

        // --- Game over overlay ---
        if (this.game.gameOver) {
            this._drawCenterMessage(ctx, "Game Over", "Returning to main menu...");
        }

        // --- Guide text (bottom-left) ---
        ctx.save();
        ctx.fillStyle    = "green";
        ctx.font         = "18px Arial";
        ctx.textAlign    = "left";
        ctx.textBaseline = "bottom";
        ctx.fillText("Move mouse to aim  |  SPACE or Click to fire  |  M - Game Menu", 10, ctx.canvas.height - 10);
        ctx.restore();
    }

    _drawCenterMessage(ctx, title, subtitle) {
        const cx = ctx.canvas.width  / 2;
        const cy = ctx.canvas.height / 2;

        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";

        ctx.font      = "bold 56px Arial";
        ctx.fillStyle = "#fff";
        ctx.fillText(title, cx, cy - 30);

        ctx.font      = "24px Arial";
        ctx.fillStyle = "#ddd";
        ctx.fillText(subtitle, cx, cy + 30);
        ctx.restore();
    }
}
