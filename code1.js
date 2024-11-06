//CÓDIGO SEM O JOGO NELE MAS STYLES ATUALIZADO

// BootScene
class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Load assets
        this.load.image('background', 'assets/world/map.png');
        this.load.image('bgInit', 'assets/world/bg1.jpg');
        
        this.load.image('level1', 'assets/world/desert.png');
        this.load.image('level2', 'assets/world/snow.jpg');
        this.load.image('level3', 'assets/world/grass.png');
        this.load.image('level4', 'assets/world/cave.jpg');

        this.load.spritesheet('player1', 'assets/character/1.png', { frameWidth: 138, frameHeight: 170 });
        this.load.spritesheet('player2', 'assets/character/2.png', { frameWidth: 138, frameHeight: 170 }); 

        this.load.spritesheet('fireball', 'assets/character/fireball.png', {frameWidth: 121, frameHeight: 99});
        this.load.spritesheet('smoke', 'assets/etc/smoke.png', {frameWidth: 426, frameHeight: 497});

        this.load.audio('collect', 'assets/sounds/coin.wav');
        this.load.audio('complete', 'assets/sounds/power_up.wav');

        this.loadFont('PixelOperator8-Bold', 'assets/fonts/PixelOperator8-Bold.ttf');
    }

    create() {
        // Animation definitions
        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers("player1", { frames: [16, 17, 18, 19, 20, 21, 22, 23] }),
            frameRate: 16,
            repeat: -1
        });
        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers("player1", { frames: [0, 1, 2, 3, 4, 5, 6] }),
            frameRate: 16,
            repeat: -1
        });
        this.anims.create({
            key: "attack",
            frames: this.anims.generateFrameNumbers("player2", { frames: [0, 1, 2, 3, 4, 5, 6, 7] }),
            frameRate: 16,
            repeat: -1
        });
        this.anims.create({
            key: "dead",
            frames: this.anims.generateFrameNumbers("player2", {frames:[29,30,31,32,33,34]}),
            frameRate: 16,
            repeat: -1
        });
        this.anims.create({
            key: "fireball",
            frames: this.anims.generateFrameNumbers("fireball", { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] }),
            frameRate: 16,
            repeat: -1
        });
        this.anims.create({
            key: "smoke",
            frames: this.anims.generateFrameNumbers("smoke", { frames: [0, 1, 2, 3, 4, 5] }),
            frameRate: 16,
            repeat: -1
        });

        this.scene.start('StartScreen');
    }

    loadFont(name, url) {
        const newFont = new FontFace(name, `url(${url})`);
        newFont.load().then(function(loadedFont) {
            document.fonts.add(loadedFont);
        }).catch(function(error) {
            console.error('Error loading font', error);
        });
    }
}

// Base Scene class to manage consistent UI elements and background
class BaseScene extends Phaser.Scene {
    createBackground(darkTint = false) {
        const bg = this.add.image(400, 300, 'bgInit');
        if (darkTint) {
            bg.setTint(0x333333);
        }
    }

    applyFontStyle(size = '24px', color = '#ffffff') {
        return { fontSize: size, fill: color, fontFamily: 'PixelOperator8-Bold' };
    }
}

// StartScreen
class StartScreen extends BaseScene {
    constructor() {
        super('StartScreen');
    }

    create() {
        this.createBackground(true);
        this.add.text(400, 100, 'Energy Guardian Adventure', this.applyFontStyle('32px')).setOrigin(0.5);

        const playButton = this.add.text(400, 250, 'Play', this.applyFontStyle()).setOrigin(0.5).setInteractive();
        playButton.on('pointerdown', () => this.scene.start('LevelSelectScene'));

        const instructionsButton = this.add.text(400, 300, 'Instructions', this.applyFontStyle()).setOrigin(0.5).setInteractive();
        instructionsButton.on('pointerdown', () => this.scene.start('InstructionsScene'));

        const difficultyButton = this.add.text(400, 350, 'Difficulty', this.applyFontStyle()).setOrigin(0.5).setInteractive();
        difficultyButton.on('pointerdown', () => this.scene.start('DifficultySelectScene'));
    }
}

// InstructionsScene
class InstructionsScene extends BaseScene {
    constructor() {
        super('InstructionsScene');
    }

    create() {
        this.createBackground(true);
        this.add.text(400, 100, 'Instructions', this.applyFontStyle('32px')).setOrigin(0.5);
        this.add.text(400, 200, 'Collect renewable energy to restore the environment.', this.applyFontStyle('20px')).setOrigin(0.5);

        const backButton = this.add.text(400, 400, 'Back', this.applyFontStyle('20px')).setOrigin(0.5).setInteractive();
        backButton.on('pointerdown', () => this.scene.start('StartScreen'));
    }
}

// DifficultySelectScene
class DifficultySelectScene extends BaseScene {
    constructor() {
        super('DifficultySelectScene');
    }

    create() {
        this.createBackground(true);
        this.add.text(400, 100, 'Select Difficulty', this.applyFontStyle('32px')).setOrigin(0.5);

        const difficulties = ['Easy', 'Medium', 'Hard'];
        difficulties.forEach((level, index) => {
            const button = this.add.text(400, 200 + index * 50, level, this.applyFontStyle()).setOrigin(0.5).setInteractive();
            button.on('pointerdown', () => this.selectDifficulty(level));
        });
    }

    selectDifficulty(difficulty) {
        this.selectedDifficulty = difficulty;
        this.scene.start('LevelSelectScene', { difficulty });
    }
}

// LevelSelectScene
class LevelSelectScene extends BaseScene {
    constructor() {
        super('LevelSelectScene');
    }

    create(data) {
        this.createBackground(true);
        this.add.text(400, 100, 'Select Level', this.applyFontStyle('32px')).setOrigin(0.5);

        const levels = ['Level 1', 'Level 2', 'Level 3', 'Level 4'];
        levels.forEach((name, index) => {
            const levelButton = this.add.text(400, 200 + index * 50, name, this.applyFontStyle()).setOrigin(0.5).setInteractive();
            levelButton.on('pointerdown', () => this.startLevel(index + 1, data.difficulty));
        });
    }

    startLevel(level, difficulty) {
        this.scene.start('GameScene', { level, difficulty });
    }
}

// GameScene
class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create(data) {
        const { level, difficulty } = data;
        this.add.image(400, 300, `level${level}`);

        this.player = this.physics.add.sprite(100, 500, 'player1').setBounce(0.2).setCollideWorldBounds(true);
        this.player.setGravityY(300);
        this.score = 0;
        this.energyGoal = 50 * level;
        this.timeLimit = 60;  // 1-minute timer

        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.on('pointerdown', this.shootFireball, this);

        this.obstacles = this.physics.add.group();
        this.spawnSmoke();

        this.physics.add.collider(this.player, this.obstacles, this.handleCollision, null, this);

        this.createUI();
    }

    spawnSmoke() {
        const smoke = this.obstacles.create(this.player.x, this.player.y - 50, 'smoke');
        smoke.setVelocityX(-100);
        smoke.play('smoke');
    }

    shootFireball(pointer) {
        const fireball = this.physics.add.sprite(this.player.x, this.player.y, 'fireball').setScale(0.5);
        fireball.play('fireball');
        this.physics.moveTo(fireball, pointer.x, pointer.y, 600);

        this.physics.add.collider(fireball, this.obstacles, (f, obstacle) => {
            this.sound.play('collect');
            obstacle.destroy();
            f.destroy();
            this.updateScore();
        });
    }

    updateScore() {
        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);
        if (this.score >= this.energyGoal) this.completeLevel();
    }

    completeLevel() {
        this.sound.play('complete');
        this.scene.start('LevelCompleteScene', { score: this.score });
    }

    createUI() {
        this.scoreText = this.add.text(16, 16, 'Score: 0', this.applyFontStyle());
        this.timeText = this.add.text(600, 16, 'Time: 60', this.applyFontStyle());
        this.timeEvent = this.time.addEvent({
            delay: 1000,
            callback: () => this.timeText.setText(`Time: ${--this.timeLimit}`)
        });
    }
}

// LevelCompleteScene
class LevelCompleteScene extends BaseScene {
    constructor() {
        super('LevelCompleteScene');
    }

    create(data) {
        this.createBackground(true);
        this.add.text(400, 100, 'Level Complete!', this.applyFontStyle('32px')).setOrigin(0.5);
        this.add.text(400, 200, `Score: ${data.score}`, this.applyFontStyle('24px')).setOrigin(0.5);

        const nextLevelButton = this.add.text(400, 400, 'Next Level', this.applyFontStyle()).setOrigin(0.5).setInteractive();
        nextLevelButton.on('pointerdown', () => this.scene.start('LevelSelectScene'));
    }
}

// GameOverScene
class GameOverScene extends BaseScene {
    constructor() {
        super('GameOverScene');
    }

    create(data) {
        this.createBackground(true);
        this.add.text(400, 100, 'Game Over', this.applyFontStyle('32px')).setOrigin(0.5);
        this.add.text(400, 200, `Score: ${data.score}`, this.applyFontStyle('24px')).setOrigin(0.5);

        const restartButton = this.add.text(400, 400, 'Restart', this.applyFontStyle()).setOrigin(0.5).setInteractive();
        restartButton.on('pointerdown', () => this.scene.start('StartScreen'));
    }
}

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#1d1d1d",
    scene: [BootScene, StartScreen, InstructionsScene, DifficultySelectScene, LevelSelectScene, GameScene, LevelCompleteScene, GameOverScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
};

const game = new Phaser.Game(config);
