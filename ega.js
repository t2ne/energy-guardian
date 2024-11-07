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

        this.load.image('obstacle', 'assets/etc/smoke.png');
        this.load.audio('collect', 'assets/sounds/coin.wav');
        this.load.audio('complete', 'assets/sounds/power_up.wav');

        this.loadFont('PixelOperator8-Bold', 'assets/fonts/PixelOperator8-Bold.ttf');
    }

    create() {
        this.createAnimations();
        this.scene.start('StartScreen');
    }

    createAnimations() {
        const animations = [
            { key: "walk", spritesheet: "player1", frames: [16, 17, 18, 19, 20, 21, 22, 23] },
            { key: "idle", spritesheet: "player1", frames: [0, 1, 2, 3, 4, 5, 6] },
            { key: "attack", spritesheet: "player2", frames: [0, 1, 2, 3, 4, 5, 6, 7] },
            { key: "dead", spritesheet: "player2", frames: [29, 30, 31, 32, 33, 34] },
            { key: "fireball", spritesheet: "fireball", frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
            { key: "smoke", spritesheet: "smoke", frames: [0, 1, 2, 3, 4, 5] }
        ];

        animations.forEach(anim => {
            this.anims.create({
                key: anim.key,
                frames: this.anims.generateFrameNumbers(anim.spritesheet, { frames: anim.frames }),
                frameRate: 16,
                repeat: -1
            });
        });
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

class BaseScene extends Phaser.Scene {
    createBackground(imageName = 'bgInit', darkTint = false) {
        const bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, imageName);
        const scaleX = this.cameras.main.width / bg.width;
        const scaleY = this.cameras.main.height / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale).setScrollFactor(0);
        
        if (darkTint) {
            bg.setTint(0x333333);
        }
    }

    applyFontStyle(size = '24px', color = '#ffffff') {
        return { fontSize: size, fill: color, fontFamily: 'PixelOperator8-Bold' };
    }

    createBackButton(scene) {
        const backButton = this.add.text(50, 550, 'Voltar', this.applyFontStyle('20px'))
            .setInteractive()
            .on('pointerdown', () => this.scene.start(scene));
        return backButton;
    }
}

class StartScreen extends BaseScene {
    constructor() {
        super('StartScreen');
    }

    create() {
        this.createBackground('bgInit', true);
        this.add.text(400, 100, 'Energy Guardian Adventure', this.applyFontStyle('30px')).setOrigin(0.5);

        const buttons = [
            { text: 'Jogar', scene: 'LevelSelectScene' },
            { text: 'Instruções', scene: 'InstructionsScene' },
            { text: 'Controlos', scene: 'ControlsScene' },
            { text: 'Dificuldade', scene: 'DifficultySelectScene' }
        ];

        buttons.forEach((button, index) => {
            this.add.text(400, 250 + index * 50, button.text, this.applyFontStyle())
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => this.scene.start(button.scene));
        });
    }
}

class InstructionsScene extends BaseScene {
    constructor() {
        super('InstructionsScene');
    }

    create() {
        this.createBackground('bgInit', true);
        this.add.text(400, 100, 'Instruções', this.applyFontStyle('32px')).setOrigin(0.5);
        this.add.text(400, 200, 'Collect renewable energy', this.applyFontStyle('16px')).setOrigin(0.5);
        this.add.text(400, 300, 'to restore the environment.', this.applyFontStyle('16px')).setOrigin(0.5);
        this.createBackButton('StartScreen');
    }
}

class ControlosScene extends BaseScene {
    constructor() {
        super('ControlsScene');
    }


    create() {
        this.createBackground('bgInit', true);
        this.add.text(400, 100, 'Controlos', this.applyFontStyle('32px')).setOrigin(0.5);
        this.add.text(400, 200, 'Collect renewable energy', this.applyFontStyle('16px')).setOrigin(0.5);
        this.add.text(400, 300, 'to restore the environment.', this.applyFontStyle('16px')).setOrigin(0.5);
        this.createBackButton('StartScreen');
    }
}

class DifficultySelectScene extends BaseScene {
    constructor() {
        super('DifficultySelectScene');
    }

    create() {
        this.createBackground('bgInit', true);
        this.add.text(400, 100, 'Selecionar Dificuldade', this.applyFontStyle('32px')).setOrigin(0.5);

        const difficulties = ['Fácil', 'Médio', 'Difícil'];
        this.difficulties = difficulties.map((level, index) => ({
            name: level,
            button: this.add.text(400, 200 + index * 50, level, this.applyFontStyle()).setOrigin(0.5).setInteractive()
        }));

        this.difficulties.forEach(difficulty => {
            difficulty.button.on('pointerdown', () => this.selectDifficulty(difficulty.name));
        });

        this.selectedDifficulty = 'Médio';
        this.updateDifficultyVisuals();

        this.createBackButton('StartScreen');
    }

    selectDifficulty(difficulty) {
        this.selectedDifficulty = difficulty;
        this.updateDifficultyVisuals();
    }

    updateDifficultyVisuals() {
        this.difficulties.forEach(difficulty => {
            const color = difficulty.name === this.selectedDifficulty ? '#ff0000' : '#ffffff';
            difficulty.button.setStyle(this.applyFontStyle('24px', color));
        });
    }
}

class LevelSelectScene extends BaseScene {
    constructor() {
        super('LevelSelectScene');
    }

    create() {
        this.createBackground('background');
        this.add.text(400, 100, 'Selecionar Nível', this.applyFontStyle('32px')).setOrigin(0.5);

        this.levels = [
            { name: 'Nível 1', unlocked: true, energyGoal: 50 },
            { name: 'Nível 2', unlocked: false, energyGoal: 100 },
            { name: 'Nível 3', unlocked: false, energyGoal: 150 },
            { name: 'Nível 4', unlocked: false, energyGoal: 200 }
        ];

        this.levels.forEach((level, index) => {
            const text = level.unlocked ? level.name : `${level.name} (Locked)`;
            const color = level.unlocked ? '#ffffff' : '#ff0000';
            const levelButton = this.add.text(400, 200 + index * 50, text, this.applyFontStyle('24px', color)).setOrigin(0.5);
            
            if (level.unlocked) {
                levelButton.setInteractive();
                levelButton.on('pointerdown', () => this.startLevel(index + 1, level.energyGoal));
            }
        });

        this.createBackButton('StartScreen');
    }

    startLevel(level, energyGoal) {
        const difficulty = this.scene.get('DifficultySelectScene').selectedDifficulty;
        this.scene.start('GameScene', { level, difficulty, energyGoal });
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create(data) {
        const { level, difficulty, energyGoal } = data;
        this.add.image(400, 300, `level${level}`);

        this.player = this.physics.add.sprite(100, 500, 'player1').setBounce(0.2).setCollideWorldBounds(true);
        this.player.setGravityY(300);
        this.score = 0;
        this.energy = 0;
        this.energyGoal = energyGoal;
        this.timeLimit = 60;
        this.lives = 3;

        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.on('pointerdown', this.shootFireball, this);

        this.obstacles = this.physics.add.group();
        this.spawnSmoke();

        this.physics.add.collider(this.player, this.obstacles, this.handleCollision, null, this);

        this.createUI();
        this.initGame(difficulty);
    }

    createUI() {
        const fontStyle = { fontSize: '24px', fill: '#ffffff', fontFamily: 'PixelOperator8-Bold' };
        this.scoreText = this.add.text(16, 16, 'Score: 0', fontStyle);
        this.energyText = this.add.text(16, 50, 'Energy: 0', fontStyle);
        this.livesText = this.add.text(16, 84, 'Lives: 3', fontStyle);
        this.timeText = this.add.text(600, 16, 'Time: 60', fontStyle);
        
        this.progressBar = this.add.graphics();
        this.progressBar.fillStyle(0x00ff00, 1);
        this.progressBar.fillRect(100, 550, 600, 20);
    }

    initGame(difficulty) {
        switch(difficulty) {
            case 'Easy':
                this.obstacleSpeed = 100;
                this.obstacleSpawnRate = 3000;
                break;
            case 'Hard':
                this.obstacleSpeed = 300;
                this.obstacleSpawnRate = 1000;
                break;
            default: // Medium
                this.obstacleSpeed = 200;
                this.obstacleSpawnRate = 2000;
        }

        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        this.time.addEvent({
            delay: this.obstacleSpawnRate,
            callback: this.spawnSmoke,
            callbackScope: this,
            loop: true
        });
    }

    spawnSmoke() {
        const smoke = this.obstacles.create(800, Phaser.Math.Between(100, 500), 'smoke');
        smoke.setVelocityX(-this.obstacleSpeed);
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
        this.energy += 10;
        this.scoreText.setText(`Score: ${this.score}`);
        this.energyText.setText(`Energy: ${this.energy}`);
        this.updateProgressBar();
        if (this.energy >= this.energyGoal) this.completeLevel();
    }

    updateProgressBar() {
        const progress = (this.energy / this.energyGoal) * 600;
        this.progressBar.clear();
        this.progressBar.fillStyle(0x00ff00, 1);
        this.progressBar.fillRect(100, 550, progress, 20);
    }

    updateTimer() {
        this.timeLimit--;
        this.timeText.setText(`Time: ${this.timeLimit}`);
        if (this.timeLimit <= 0) this.gameOver();
    }

    handleCollision(player, obstacle) {
        obstacle.destroy();
        this.lives--;
        this.livesText.setText(`Lives: ${this.lives}`);
        if (this.lives <= 0) this.gameOver();
    }

    completeLevel() {
        this.sound.play('complete');
        this.scene.start('LevelCompleteScene', { score: this.score, level: this.scene.settings.data.level });
    }

    gameOver() {
        this.scene.start('GameOverScene', { score: this.score });
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.play('walk', true);
            this.player.flipX = true;
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.play('walk', true);
            this.player.flipX = false;
        } else {
            this.player.setVelocityX(0);
            this.player.play('idle', true);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }
}

class LevelCompleteScene extends BaseScene {
    constructor() {
        super('LevelCompleteScene');
    }

    create(data) {
        this.createBackground('bgInit', true);
        this.add.text(400, 100, 'Level Complete!', this.applyFontStyle('32px')).setOrigin(0.5);
        this.add.text(400, 200, `Score: ${data.score}`, this.applyFontStyle('24px')).setOrigin(0.5);

        const nextLevelButton = this.add.text(400, 300, 'Next Level', this.applyFontStyle()).setOrigin(0.5).setInteractive();
        nextLevelButton.on('pointerdown', () => {
            const levelSelectScene = this.scene.get('LevelSelectScene');
            if (data.level < levelSelectScene.levels.length) {
                levelSelectScene.levels[data.level].unlocked = true;
            }
            this.scene.start('LevelSelectScene');
        });

        const menuButton = this.add.text(400, 350, 'Back to Menu', this.applyFontStyle()).setOrigin(0.5).setInteractive();
        menuButton.on('pointerdown', () => this.scene.start('StartScreen'));
    }
}

class GameOverScene extends BaseScene {
    constructor() {
        super('GameOverScene');
    }

    create(data) {
        this.createBackground('bgInit', true);
        this.add.text(400, 100, 'Game Over', this.applyFontStyle('32px')).setOrigin(0.5);
        this.add.text(400, 200, `Score: ${data.score}`, this.applyFontStyle('24px')).setOrigin(0.5);

        const restartButton = this.add.text(400, 300, 'Restart', this.applyFontStyle()).setOrigin(0.5).setInteractive();
        restartButton.on('pointerdown', () => this.scene.start('GameScene', { level: 1, difficulty: 'Medium', energyGoal: 50 }));

        const menuButton = this.add.text(400, 350, 'Back to Menu', this.applyFontStyle()).setOrigin(0.5).setInteractive();
        menuButton.on('pointerdown', () => this.scene.start('StartScreen'));
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: "#1d1d1d",
    scene: [BootScene, StartScreen, InstructionsScene,ControlosScene, DifficultySelectScene, LevelSelectScene, GameScene, LevelCompleteScene, GameOverScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
};

const game = new Phaser.Game(config);