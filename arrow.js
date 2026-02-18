class Arrow {
    constructor(game, x, y, angle = -Math.PI / 2) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.tag = "arrow";
        this.speed = 600;
        this.width = 4;
        this.height = 30;
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        this.removeFromWorld = false;
    }

    update() {
        this.x += this.vx * this.game.clockTick;
        this.y += this.vy * this.game.clockTick;

        // Remove when off any edge of the screen
        const cw = this.game.ctx.canvas.width;
        const ch = this.game.ctx.canvas.height;
        if (this.x < -this.height || this.x > cw + this.height ||
            this.y < -this.height || this.y > ch + this.height) {
            this.removeFromWorld = true;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        // Rotate so arrowhead points in direction of travel
        ctx.rotate(this.angle + Math.PI / 2);

        // Arrow shaft
        ctx.fillStyle = "#8B4513";
        ctx.fillRect(-this.width / 2, 0, this.width, this.height);

        // Arrow head (points toward negative Y in local space = direction of travel)
        ctx.fillStyle = "#333";
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(-6, 0);
        ctx.lineTo(6, 0);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    getBoundingBox() {
        return {
            x: this.x - 8,
            y: this.y - 8,
            width: 16,
            height: 16
        };
    }
}
