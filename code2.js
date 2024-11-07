//CÓDIGO COM O JOGO MAS STYLES DESATUALIZADO

// BootScene
class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
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

        this.load.image('obstacle', 'assets/obstacle.png');
        this.load.audio('collect', 'assets/sounds/coin.wav');
        this.load.audio('complete', 'assets/sounds/power_up.wav');

        this.loadFont('PixelOperator8-Bold', 'assets/fonts/PixelOperator8-Bold.ttf');
    }

    create() {
        const walk= {
            key: "walk",
            frames: this.anims.generateFrameNumbers("player1", {frames:[16,17,18,19,20,21,22,23]}),
            frameRate: 16,
            repeat: -1
        }
        const idle= {
            key: "idle",
            frames: this.anims.generateFrameNumbers("player1", {frames:[0,1,2,3,4,5,6]}),
            frameRate: 16,
            repeat: -1
        }
        const attack= {
            key: "attack",
            frames: this.anims.generateFrameNumbers("player2", {frames:[0,1,2,3,4,5,6,7]}),
            frameRate: 16,
            repeat: -1
        }
        const dead= {
            key: "dead",
            frames: this.anims.generateFrameNumbers("player2", {frames:[,30,31,32,33,34]}),
            frameRate: 16,
            repeat: -1
        }
        const fireball= {
            key: "fireball",
            frames: this.anims.generateFrameNumbers("fireball", {frames:[0,1,2,3,4,5,6,7,8,9,10,11]}),
            frameRate: 16,
            repeat: -1
        }
        const smoke= {
            key: "smoke",
            frames: this.anims.generateFrameNumbers("smoke", {frames:[0,1,2,3,4,5]}),
            frameRate: 16,
            repeat: -1
        }

        this.anims.create(walk);
        this.anims.create(idle);
        this.anims.create(attack);
        this.anims.create(dead);
        this.anims.create(fireball);
        this.anims.create(smoke);

        this.player = this.add.sprite(400,300,"player1")
        this.player.play("walk", true);

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

// StartScreen
class StartScreen extends Phaser.Scene {
    constructor() {
        super('StartScreen');
    }

    create() {
        this.add.image(400, 300, 'background');
        this.add.text(400, 100, 'Energy Guardian Adventure', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        const playButton = this.add.text(400, 250, 'Play', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();

        playButton.on('pointerdown', () => {
            this.scene.start('LevelSelectScene');
        });

        const instructionsButton = this.add.text(400, 300, 'Instructions', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();

        instructionsButton.on('pointerdown', () => {
            this.scene.start('InstructionsScene');
        });

        const difficultyButton = this.add.text(400, 350, 'Difficulty', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();

        difficultyButton.on('pointerdown', () => {
            this.scene.start('DifficultySelectScene');
        });
    }
}

// InstructionsScene
class InstructionsScene extends Phaser.Scene {
    constructor() {
        super('InstructionsScene');
    }

    create() {
        this.add.image(400, 300, 'background');
        this.add.text(400, 100, 'Instructions', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(400, 200, 'Collect renewable energy to restore the environment.', {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        const backButton = this.add.text(400, 400, 'Back', {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();

        backButton.on('pointerdown', () => {
            this.scene.start('StartScreen');
        });
    }
}

// DifficultySelectScene
class DifficultySelectScene extends Phaser.Scene {
    constructor() {
        super('DifficultySelectScene');
    }

    create() {
        this.add.image(400, 300, 'background');
        this.add.text(400, 100, 'Select Difficulty', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.difficulties = [
            { name: 'Easy', button: null },
            { name: 'Medium', button: null },
            { name: 'Hard', button: null }
        ];

        this.difficulties.forEach((difficulty, index) => {
            difficulty.button = this.add.text(400, 250 + (index * 50), difficulty.name, {
                fontSize: '24px',
                fill: '#ffffff'
            }).setOrigin(0.5).setInteractive();

            difficulty.button.on('pointerdown', () => {
                this.selectDifficulty(difficulty);
            });
        });

        const backButton = this.add.text(400, 400, 'Back', {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();

        backButton.on('pointerdown', () => {
            this.scene.start('StartScreen');
        });

        this.selectedDifficulty = 'Medium'; // Default difficulty
        this.updateDifficultyVisuals();
    }

    selectDifficulty(selected) {
        this.selectedDifficulty = selected.name;
        this.updateDifficultyVisuals();
    }

    updateDifficultyVisuals() {
        this.difficulties.forEach(difficulty => {
            const color = difficulty.name === this.selectedDifficulty ? '#ff0000' : '#ffffff';
            difficulty.button.setFill(color);
        });
    }
}

// LevelSelectScene
class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super('LevelSelectScene');
    }

    create(data) {
        this.add.image(400, 300, 'background');
        this.add.text(400, 100, 'Select Level', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.levels = [
            { name: 'Level 1', unlocked: true, energyGoal: 50 },
            { name: 'Level 2', unlocked: false, energyGoal: 100 },
            { name: 'Level 3', unlocked: false, energyGoal: 150 }
        ];

        this.levels.forEach((level, index) => {
            if (level.unlocked) {
                this.add.text(400, 200 + index * 50, level.name, {
                    fontSize: '24px',
                    fill: '#ffffff'
                }).setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => {
                    this.scene.start('GameScene', { level: index + 1, difficulty: data.difficulty, energyGoal: level.energyGoal });
                });
            } else {
                this.add.text(400, 200 + index * 50, level.name + ' (Locked)', {
                    fontSize: '24px',
                    fill: '#ff0000'
                }).setOrigin(0.5);
            }
        });

        const backButton = this.add.text(400, 400, 'Back', {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();

        backButton.on('pointerdown', () => {
            this.scene.start('StartScreen');
        });
    }
}

// GameScene
class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create(data) {
        this.level = data.level;
        this.difficulty = data.difficulty;
        this.energyGoal = data.energyGoal; // Energy goal for this level
        this.lives = 3;
        this.score = 0;
        this.energy = 0;
        this.timeLimit = 300; // Set a time limit for the level in seconds
        this.timeRemaining = this.timeLimit;

        this.add.image(400, 300, 'background');
        this.player = this.physics.add.sprite(100, 500, 'player');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(300); // Add gravity

        this.cursors = this.input.keyboard.createCursorKeys();

        this.createUI();
        this.initGame();
    }

    initGame() {
        // Progress bar setup
        this.progressBar = this.add.graphics();
        this.progressBar.fillStyle(0x00ff00, 1); // Green color
        this.progressBar.fillRect(100, 550, 600, 20); // Progress bar

        this.time.addEvent({
            delay: 1000,
            callback: this.updateEnergy,
            callbackScope: this,
            loop: true
        });

        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        this.obstacles = this.physics.add.group({
            key: 'obstacle',
            repeat: 5,
            setXY: { x: 400, y: 0, stepX: 100 }
        });
        this.obstacles.children.iterate(obstacle => {
            obstacle.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(this.player, this.obstacles, this.handleCollision, null, this);
    }

    createUI() {
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
        this.livesText = this.add.text(16, 50, 'Lives: 3', { fontSize: '32px', fill: '#fff' });
        this.energyText = this.add.text(16, 84, 'Energy: 0', { fontSize: '32px', fill: '#fff' });
        this.timerText = this.add.text(16, 118, 'Time: ' + this.timeRemaining, { fontSize: '32px', fill: '#fff' });
    }

    updateEnergy() {
        this.energy += 5; // Increment energy
        this.energyText.setText('Energy: ' + this.energy);
        if (this.energy >= this.energyGoal) {
            this.completeLevel();
        }
        this.updateProgressBar();
    }

    updateTimer() {
        this.timeRemaining--;
        this.timerText.setText('Time: ' + this.timeRemaining);
        if (this.timeRemaining <= 0) {
            this.scene.start('GameOverScene', { score: this.score });
        }
    }

    updateProgressBar() {
        const progress = (this.energy / this.energyGoal) * 600; // Calculate progress
        this.progressBar.clear();
        this.progressBar.fillStyle(0x00ff00, 1);
        this.progressBar.fillRect(100, 550, progress, 20); // Update progress bar display
    }

    completeLevel() {
        this.sound.play('complete'); // Play level completion sound if added
        this.scene.start('LevelCompleteScene', { score: this.score, level: this.level });
    }

    handleCollision(player, obstacle) {
        this.lives--;
        this.livesText.setText('Lives: ' + this.lives);
        if (this.lives <= 0) {
            this.scene.start('GameOverScene', { score: this.score });
        }
    }

    update() {
        // Reset velocity
        this.player.setVelocity(0);
    
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        }
    
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-160);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(160);
        }
    }
    

    restartLevel() {
        this.scene.restart(); // Restart the current level
    }
}

// LevelCompleteScene
class LevelCompleteScene extends Phaser.Scene {
    constructor() {
        super('LevelCompleteScene');
    }

    create(data) {
        this.add.image(400, 300, 'background');
        this.add.text(400, 100, 'Level Complete!', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(400, 200, 'Score: ' + data.score, {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        const nextButton = this.add.text(400, 300, 'Next Level', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();

        nextButton.on('pointerdown', () => {
            this.scene.start('LevelSelectScene'); // You may need to manage level unlocking here
        });

        const restartButton = this.add.text(400, 350, 'Restart Level', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('GameScene', { level: data.level, difficulty: 'Medium', energyGoal: 50 }); // Restart with defaults
        });

        const backButton = this.add.text(400, 400, 'Back to Menu', {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();

        backButton.on('pointerdown', () => {
            this.scene.start('StartScreen');
        });
    }
}

// GameOverScene
class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create(data) {
        this.add.image(400, 300, 'background');
        this.add.text(400, 100, 'Game Over', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(400, 200, 'Score: ' + data.score, {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        const restartButton = this.add.text(400, 300, 'Restart', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('GameScene', { level: 1, difficulty: 'Medium', energyGoal: 50 }); // Restart with defaults
        });

        const backButton = this.add.text(400, 350, 'Back to Menu', {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();

        backButton.on('pointerdown', () => {
            this.scene.start('StartScreen');
        });
    }
}

// Main game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [BootScene, StartScreen, InstructionsScene, DifficultySelectScene, LevelSelectScene, GameScene, LevelCompleteScene, GameOverScene]
};

const game = new Phaser.Game(config);
