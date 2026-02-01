class Arrow {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.tag = "arrow";
        this.speed = 300;
        this.width = 4;
        this.height = 30;
        this.removeFromWorld = false;
    }

    update() {
        this.y -= this.speed * this.game.clockTick;

        // Remove when off screen
        if (this.y < -this.height) {
            this.removeFromWorld = true;
        }
    }

    draw(ctx) {
        // Arrow shaft
        ctx.fillStyle = "#8B4513";
        ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);

        // Arrow head
        ctx.fillStyle = "#333";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - 10);
        ctx.lineTo(this.x - 6, this.y);
        ctx.lineTo(this.x + 6, this.y);
        ctx.closePath();
        ctx.fill();
    }

    getBoundingBox() {
        return {
            x: this.x - this.width / 2,
            y: this.y - 10,
            width: this.width,
            height: this.height + 10
        };
    }
}
