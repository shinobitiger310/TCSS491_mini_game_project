class PauseMenu {
    constructor(game, canvas) {
        this.game   = game;
        this.canvas = canvas;

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const bw = 240, bh = 50, gap = 20;
        const startY = cy - (3 * bh + 2 * gap) / 2;

        this.buttons = [
            { label: "Resume",         y: startY,                action: "resume"   },
            { label: "Main Menu",      y: startY + bh + gap,     action: "mainmenu" },
            { label: "Start New Game", y: startY + 2*(bh + gap), action: "newgame"  },
        ].map(b => ({ ...b, x: cx - bw / 2, w: bw, h: bh }));

        this._clickHandler = this._onClick.bind(this);
        canvas.addEventListener("click", this._clickHandler);
    }

    _onClick(e) {
        if (!this.game.paused) return;
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        for (const btn of this.buttons) {
            if (mx >= btn.x && mx <= btn.x + btn.w && my >= btn.y && my <= btn.y + btn.h) {
                if (btn.action === "resume") {
                    this.game.paused = false;
                } else if (btn.action === "mainmenu") {
                    location.reload();
                } else if (btn.action === "newgame") {
                    localStorage.removeItem("birdHunterLevel");
                    location.reload();
                }
                return;
            }
        }
    }

    update() {}

    draw(ctx) {
        if (!this.game.paused) return;

        // Dark overlay
        ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Title
        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";
        ctx.font         = "bold 44px Arial";
        ctx.fillStyle    = "#fff";
        ctx.fillText("Paused", ctx.canvas.width / 2, ctx.canvas.height / 2 - 130);

        // Buttons
        for (const btn of this.buttons) {
            ctx.fillStyle = "#1976d2";
            ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
            ctx.font      = "bold 20px Arial";
            ctx.fillStyle = "#fff";
            ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);
        }
    }

    destroy() {
        this.canvas.removeEventListener("click", this._clickHandler);
    }
}
