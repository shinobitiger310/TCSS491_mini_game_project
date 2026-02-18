class SoundManager {
    constructor() {
        this.bgMusic = null;

        this.levelTracks = [
            "./sound/level1_music.mp3",
            "./sound/level2_music.mp3",
            "./sound/level3_music.mp3",
            "./sound/level4_music.mp3",
            "./sound/level5_music.mp3",
        ].map(src => {
            const a = new Audio(src);
            a.loop = true;
            a.volume = 0.4;
            return a;
        });

        this.arrowSound = new Audio("./sound/arrow_shot.mp3");
        this.arrowSound.volume = 0.7;

        this.birdSound = new Audio("./sound/bird_scream.mp3");
        this.birdSound.volume = 0.8;

        this.mainMenuSound = new Audio("./sound/main_menu_music.mp3");
        this.mainMenuSound.volume = 0.8;
        this.mainMenuSound.loop = true;
    }

    playLevel(index) {
        this.mainMenuSound.pause();
        this.mainMenuSound.currentTime = 0;
        if (this.bgMusic) {
            this.bgMusic.pause();
            this.bgMusic.currentTime = 0;
        }
        this.bgMusic = this.levelTracks[index];
        this.bgMusic.play().catch(() => {}); // suppress autoplay errors
    }

    playMainMenu() {
        this.mainMenuSound.play().catch(() => {});
    }

    playArrow() {
        // Clone so rapid firing doesn't cut off the previous shot
        const sfx = this.arrowSound.cloneNode();
        sfx.volume = this.arrowSound.volume;
        sfx.play().catch(() => {});
    }

    playBirdHit() {
        const sfx = this.birdSound.cloneNode();
        sfx.volume = this.birdSound.volume;
        sfx.play().catch(() => {});
        setTimeout(() => sfx.pause(), 500);
    }

    stopAll() {
        if (this.bgMusic) {
            this.bgMusic.pause();
            this.bgMusic.currentTime = 0;
        }
    }
}
