class MainMenu {
    constructor(canvas, savedLevel, onStart) {
        gameEngine.soundManager = new SoundManager();
        this.canvas     = canvas;
        this.ctx        = canvas.getContext("2d");
        this.savedLevel = savedLevel;
        this.onStart    = onStart;
        this._done      = false;

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const bw = 240, bh = 50;

        this.buttons = [
            { label: "Start New Game", x: cx - bw / 2, y: cy - 10,      w: bw, h: bh, action: "new",      disabled: false },
            { label: "Continue",       x: cx - bw / 2, y: cy + bh + 10, w: bw, h: bh, action: "continue", disabled: savedLevel === null }
        ];

        this._clickHandler = this._onClick.bind(this);
        canvas.addEventListener("click", this._clickHandler);

        // Play music on first real interaction (browser autoplay policy)
        this._musicHandler = () => {
            gameEngine.soundManager.playMainMenu();
            canvas.removeEventListener("mousemove", this._musicHandler);
            canvas.removeEventListener("mousedown", this._musicHandler);
        };
        canvas.addEventListener("mousemove", this._musicHandler);
        canvas.addEventListener("mousedown", this._musicHandler);

        this._loop();
    }

    _onClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        for (const btn of this.buttons) {
            if (btn.disabled) continue;
            if (mx >= btn.x && mx <= btn.x + btn.w && my >= btn.y && my <= btn.y + btn.h) {
                this.destroy();
                this.onStart(btn.action === "new" ? 0 : this.savedLevel);
                return;
            }
        }
    }

    _loop() {
        if (this._done) return;
        this._draw();
        requestAnimationFrame(this._loop.bind(this));
    }

    _draw() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.clearRect(0, 0, w, h);

        // Title
        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";
        ctx.font         = "bold 60px Arial";
        ctx.fillStyle    = "#222";
        ctx.fillText("Bird Hunter", w / 2, h / 2 - 130);

        // Buttons
        for (const btn of this.buttons) {
            ctx.fillStyle = btn.disabled ? "#aaa" : "#1976d2";
            ctx.fillRect(btn.x, btn.y, btn.w, btn.h);

            ctx.font      = "bold 20px Arial";
            ctx.fillStyle = btn.disabled ? "#666" : "#fff";
            ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);

            if (btn.action === "continue" && !btn.disabled) {
                ctx.font      = "14px Arial";
                ctx.fillStyle = "#555";
                ctx.fillText(`Level ${this.savedLevel + 1}`, btn.x + btn.w / 2, btn.y + btn.h + 18);
            }
        }
    }

    destroy() {
        this._done = true;
        this.canvas.removeEventListener("click",     this._clickHandler);
        this.canvas.removeEventListener("mousemove", this._musicHandler);
        this.canvas.removeEventListener("mousedown", this._musicHandler);
    }
}
