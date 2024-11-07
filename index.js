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
        this.load.audio('backgroundMusic', 'assets/sounds/background.mp3'); // Added background music
        this.load.audio('shootSound', 'assets/sounds/hurt.wav'); // Added shoot sound

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
            { text: 'Dificuldade', scene: 'DifficultySelectScene' },
            { text: 'Opções', scene: 'OptionsSelectScene' }
        ];

        buttons.forEach((button, index) => {
            this.add.text(400, 210 + index * 50, button.text, this.applyFontStyle())
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
        this.add.text(400, 200, 'Apanhe energias renováveis', this.applyFontStyle('20px')).setOrigin(0.5);
        this.add.text(400, 240, 'para restaurar o meio ambiente.', this.applyFontStyle('20px')).setOrigin(0.5);
        this.add.text(400, 300, 'Desvie dos obstáculos', this.applyFontStyle('20px')).setOrigin(0.5);
        this.add.text(400, 340, 'para não perder energia.', this.applyFontStyle('20px')).setOrigin(0.5);
        this.add.text(400, 400, 'Complete a meta de energia', this.applyFontStyle('20px')).setOrigin(0.5);
        this.add.text(400, 440, 'antes que o tempo acabe!', this.applyFontStyle('20px')).setOrigin(0.5);
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
        this.add.text(400, 200, 'Movimentação:', this.applyFontStyle('21px')).setOrigin(0.5);
        this.add.text(200, 260, '← - Esquerda', this.applyFontStyle('21px')).setOrigin(0.5);
        this.add.text(600, 260, '→ - Direita', this.applyFontStyle('21px')).setOrigin(0.5);
        this.add.text(200, 330, '↑ - Cima', this.applyFontStyle('21px')).setOrigin(0.5);
        this.add.text(600, 330, '↓ - Baixo.', this.applyFontStyle('21px')).setOrigin(0.5);
        this.add.text(400, 380, 'Ações:', this.applyFontStyle('21px')).setOrigin(0.5);
        this.add.text(400, 440, 'Click - Atacar', this.applyFontStyle('21px')).setOrigin(0.5);
        this.createBackButton('StartScreen');
    }
}

class OptionsSelectScene extends BaseScene {
    constructor() {
        super('OptionsSelectScene');
    }

    create() {
        this.createBackground('bgInit', true);
        this.add.text(400, 100, 'Opções', this.applyFontStyle('32px')).setOrigin(0.5);

        // Music volume slider
        this.add.text(400, 200, 'Música', this.applyFontStyle('24px')).setOrigin(0.5);
        this.musicVolume = localStorage.getItem('musicVolume') || 0.5;
        this.musicSlider = this.createSlider(400, 250, this.musicVolume, (value) => {
            this.musicVolume = value;
            localStorage.setItem('musicVolume', value);
            // TODO: Implement actual music volume change
        });

        // SFX volume slider
        this.add.text(400, 350, 'Efeitos Sonoros', this.applyFontStyle('24px')).setOrigin(0.5);
        this.sfxVolume = localStorage.getItem('sfxVolume') || 0.5;
        this.sfxSlider = this.createSlider(400, 400, this.sfxVolume, (value) => {
            this.sfxVolume = value;
            localStorage.setItem('sfxVolume', value);
            // TODO: Implement actual SFX volume change
        });

        this.createBackButton('StartScreen');
    }

    createSlider(x, y, initialValue, onUpdate) {
        const width = 200;
        const height = 20;
        const bar = this.add.rectangle(x, y, width, height, 0x888888).setOrigin(0.5);
        const slider = this.add.rectangle(x + (width * initialValue) - (width / 2), y, 20, 30, 0xffffff).setInteractive();
        
        this.input.setDraggable(slider);

        slider.on('drag', (pointer, dragX) => {
            const newX = Phaser.Math.Clamp(dragX, x - (width / 2), x + (width / 2));
            slider.x = newX;
            const value = (newX - (x - width / 2)) / width;
            onUpdate(value);
        });

        return { bar, slider };
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
            button: this.add.text(400, 250 + index * 50, level, this.applyFontStyle()).setOrigin(0.5).setInteractive()
        }));

        this.difficulties.forEach(difficulty => {
            difficulty.button.on('pointerdown', () => this.selectDifficulty(difficulty.name));
        });

        this.selectedDifficulty = localStorage.getItem('selectedDifficulty') || 'Médio';
        this.updateDifficultyVisuals();

        this.createBackButton('StartScreen');
    }

    selectDifficulty(difficulty) {
        this.selectedDifficulty = difficulty;
        localStorage.setItem('selectedDifficulty', difficulty);
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

        this.levels = JSON.parse(localStorage.getItem('levels')) || [
            { name: 'Nível 1', unlocked: true, energyGoal: 50 },
            { name: 'Nível 2', unlocked: true, energyGoal: 100 },
            { name: 'Nível 3', unlocked: true, energyGoal: 150 },
            { name: 'Nível 4', unlocked: true, energyGoal: 200 }
        ];

        this.levels.forEach((level, index) => {
            const text = level.unlocked ? level.name : `${level.name} (Bloqueado)`;
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
        this.musicVolume = 1; // Initialize music volume
        this.sfxVolume = 1; // Initialize sfx volume
    }

    create(data) {
        const { level, difficulty, energyGoal } = data;
        
        // Adjust background image to fit screen
        const bg = this.add.image(400, 300, `level${level}`);
        const scaleX = this.cameras.main.width / bg.width;
        const scaleY = this.cameras.main.height / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale).setScrollFactor(0);

        this.player = this.physics.add.sprite(400, 300, 'player1');
        this.player.setCollideWorldBounds(true);
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

        // Pause menu setup
        this.isPaused = false;
        this.pauseMenu = this.add.container(400, 300).setAlpha(0);
        this.pauseMenu.add(this.add.rectangle(0, 0, 300, 200, 0x000000, 0.8));
        this.pauseMenu.add(this.add.text(0, -50, 'PAUSED', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5));
        this.pauseMenu.add(this.add.text(0, 0, 'ESC - Resume', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5));
        this.pauseMenu.add(this.add.text(0, 50, 'S - Quit to Level Select', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5));

        this.input.keyboard.on('keydown-ESC', this.togglePause, this);
        this.input.keyboard.on('keydown-S', this.quitToLevelSelect, this);

        this.backgroundMusic = this.sound.add('backgroundMusic', { loop: true, volume: this.musicVolume });
        this.backgroundMusic.play();

        this.shootSound = this.sound.add('shootSound');
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.pauseMenu.setAlpha(1);
            this.physics.pause();
            this.scene.pause();
        } else {
            this.pauseMenu.setAlpha(0);
            this.physics.resume();
            this.scene.resume();
        }
    }

    quitToLevelSelect() {
        if (this.isPaused) {
            this.scene.start('LevelSelectScene');
        }
    }

    createUI() {
        const fontStyle = { fontSize: '24px', fill: '#ffffff', fontFamily: 'PixelOperator8-Bold' };
        this.scoreText = this.add.text(16, 16, 'Pontuação: 0', fontStyle);
        this.energyText = this.add.text(16, 50, 'Energia: 0', fontStyle);
        this.livesText = this.add.text(16, 84, 'Vidas: 3', fontStyle);
        this.timeText = this.add.text(580, 16, 'Tempo: 60', fontStyle);
        
        this.progressBar = this.add.graphics();
        this.progressBar.fillStyle(0x00ff00, 1);
        // Start with an empty progress bar
        this.updateProgressBar();
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
        smoke.setScale(0.2);
        smoke.setVelocityX(-this.obstacleSpeed);
        smoke.setGravityY(0);
        smoke.play('smoke');

        // Improve smoke hitbox
        smoke.body.setSize(smoke.width * 0.8, smoke.height * 0.8);
        smoke.body.setOffset(smoke.width * 0.1, smoke.height * 0.1);
    }
    shootFireball(pointer) {
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, pointer.x, pointer.y);
        const fireball = this.physics.add.sprite(this.player.x, this.player.y, 'fireball').setScale(0.5);
        fireball.setRotation(angle);
        fireball.play('fireball');
        this.physics.moveTo(fireball, pointer.x, pointer.y, 600);

        this.physics.add.collider(fireball, this.obstacles, (f, obstacle) => {
            this.sound.play('collect');
            obstacle.destroy();
            f.destroy();
            this.updateScore();
        });

        this.player.play('attack', true);
        this.shootSound.play({ volume: this.sfxVolume }); // Added sound effect
    }

    updateScore() {
        this.score += 10;
        this.energy += 10;
        this.scoreText.setText(`Pontuação: ${this.score}`);
        this.energyText.setText(`Energia: ${this.energy}`);
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
        this.timeText.setText(`Tempo: ${this.timeLimit}`);
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
        if (this.isPaused) return;

        const speed = 160;
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.play('walk', true);
            this.player.flipX = true;
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
            this.player.play('walk', true);
            this.player.flipX = false;
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed);
            this.player.play('walk', true);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed);
            this.player.play('walk', true);
        } else {
            this.player.setVelocityY(0);
        }

        if (this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0) {
            this.player.play('idle', true);
        }
    }
    updateMusicVolume(volume) {
        this.musicVolume = volume;
        this.backgroundMusic.setVolume(volume);
    }

    updateSFXVolume(volume) {
        this.sfxVolume = volume;
    }
}

class LevelCompleteScene extends BaseScene {
    constructor() {
        super('LevelCompleteScene');
    }

    create(data) {
        this.createBackground('bgInit', true);
        this.add.text(400, 100, 'Nível Concluído!', this.applyFontStyle('32px')).setOrigin(0.5);
        this.add.text(400, 200, `Pontuação: ${data.score}`, this.applyFontStyle('24px')).setOrigin(0.5);

        const nextLevelButton = this.add.text(400, 300, 'Próximo Nível', this.applyFontStyle()).setOrigin(0.5).setInteractive();
        nextLevelButton.on('pointerdown', () => {
            const levels = JSON.parse(localStorage.getItem('levels'));
            if (data.level < levels.length) {
                levels[data.level].unlocked = true;
                localStorage.setItem('levels', JSON.stringify(levels));
            }
            this.scene.start('LevelSelectScene');
        });

        const backtoLevelsButton = this.add.text(400, 350, 'Seleção de Níveis', this.applyFontStyle()).setOrigin(0.5).setInteractive();
        backtoLevelsButton.on('pointerdown', () => this.scene.start('LevelSelectScene'));

        const menuButton = this.add.text(400, 450, 'Voltar ao Menu', this.applyFontStyle()).setOrigin(0.5).setInteractive();
        menuButton.on('pointerdown', () => this.scene.start('StartScreen'));
    }
}

class GameOverScene extends BaseScene {
    constructor() {
        super('GameOverScene');
    }

    create(data) {
        this.createBackground('bgInit', true);
        this.add.text(400, 100, 'Game Over!', this.applyFontStyle('32px')).setOrigin(0.5);
        this.add.text(400, 200, `Pontuação: ${data.score}`, this.applyFontStyle('24px')).setOrigin(0.5);

        const restartButton = this.add.text(400, 300, 'Reiniciar', this.applyFontStyle()).setOrigin(0.5).setInteractive();
        restartButton.on('pointerdown', () => this.scene.start('GameScene', { level: 1, difficulty: 'Medium', energyGoal: 50 }));

        const menuButton = this.add.text(400, 350, 'Voltar ao Menu', this.applyFontStyle()).setOrigin(0.5).setInteractive();
        menuButton.on('pointerdown', () => this.scene.start('StartScreen'));
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: "#1d1d1d",
    scene: [BootScene, StartScreen, InstructionsScene,ControlosScene, DifficultySelectScene, OptionsSelectScene, LevelSelectScene, GameScene, LevelCompleteScene, GameOverScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
};

const game = new Phaser.Game(config);