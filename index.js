// @author: t8ne
//--------------------------------------------------------------------------------------------

class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        let loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            style: {
                font: '25px PixelOperator8-Bold',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        let percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px PixelOperator8-Bold',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        let assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px PixelOperator8-Bold',
                fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        this.load.on('fileprogress', function (file) {
            assetText.setText('Carregando asset: ' + file.key);
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });

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
        this.load.audio('shootSound', 'assets/sounds/hurt.wav');
        this.load.audio('dead', 'assets/sounds/explosion.wav');

        this.load.audio('level1-song', 'assets/music/level1.mp3');
        this.load.audio('level2-song', 'assets/music/level2.mp3');
        this.load.audio('level3-song', 'assets/music/level3.mp3');
        this.load.audio('level4-song', 'assets/music/level4.mp3');

        this.load.audio('ambient', 'assets/music/bgMusic.mp3');

        this.loadFont('PixelOperator8-Bold', 'assets/fonts/PixelOperator8-Bold.ttf');

        this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true);
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
            bg.setTint(0x222222);
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

    playAmbientMusic() {
        if (!this.sound.get('ambient')) {
            const ambientVolume = parseFloat(localStorage.getItem('ambientVolume')) || 0.5;
            this.ambientMusic = this.sound.add('ambient', { loop: true, volume: ambientVolume });
            this.ambientMusic.play();
        } else if (!this.sound.get('ambient').isPlaying) {
            this.sound.get('ambient').play();
        }
    }
}

class StartScreen extends BaseScene {
    constructor() {
        super('StartScreen');
    }

    create() {
        this.createBackground('bgInit', true);
        this.add.text(400, 100, 'Energy Guardian Adventure', this.applyFontStyle('30px')).setOrigin(0.5);

        this.add.text(630, 585, 'António Rebelo - Nº28837', this.applyFontStyle('15px')).setOrigin(0.5);

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

        this.playAmbientMusic();
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
        this.playAmbientMusic();
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
        this.playAmbientMusic();
    }
}

class OptionsSelectScene extends BaseScene {
    constructor() {
        super('OptionsSelectScene');
    }

    create() {
        this.createBackground('bgInit', true);
        this.add.text(400, 100, 'Opções', this.applyFontStyle('32px')).setOrigin(0.5);

        // Music volume slider (level music only)
        this.add.text(400, 200, 'Música', this.applyFontStyle('24px')).setOrigin(0.5);
        this.musicVolume = parseFloat(localStorage.getItem('musicVolume')) || 0.5;
        this.musicSlider = this.createSlider(400, 250, this.musicVolume, (value) => {
            this.musicVolume = value;
            localStorage.setItem('musicVolume', value);
            // Update only level music volumes
            ['level1-song', 'level2-song', 'level3-song', 'level4-song'].forEach(key => {
                const music = this.sound.get(key);
                if (music) {
                    music.setVolume(value);
                }
            });
        });

        // SFX volume slider
        this.add.text(400, 300, 'Efeitos Sonoros', this.applyFontStyle('24px')).setOrigin(0.5);
        this.sfxVolume = parseFloat(localStorage.getItem('sfxVolume')) || 0.5;
        this.sfxSlider = this.createSlider(400, 350, this.sfxVolume, (value) => {
            this.sfxVolume = value;
            localStorage.setItem('sfxVolume', value);
            ['shootSound', 'collect', 'complete', 'dead'].forEach(key => {
                const sfx = this.sound.get(key);
                if (sfx) {
                    sfx.setVolume(value);
                }
            });
        });

        // Ambient sound volume slider (background music only)
        this.add.text(400, 400, 'Som Ambiente', this.applyFontStyle('24px')).setOrigin(0.5);
        this.ambientVolume = parseFloat(localStorage.getItem('ambientVolume')) || 0.5;
        this.ambientSlider = this.createSlider(400, 450, this.ambientVolume, (value) => {
            this.ambientVolume = value;
            localStorage.setItem('ambientVolume', value);
            const ambientMusic = this.sound.get('ambient');
            if (ambientMusic) {
                ambientMusic.setVolume(value);
            }
        });

        this.createBackButton('StartScreen');
        this.playAmbientMusic();
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
        this.playAmbientMusic();
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
        const darkTint = this.add.rectangle(0, 0, 800, 600, 0x000000, 0.6).setOrigin(0);
        this.add.text(400, 100, 'Selecionar Nível', this.applyFontStyle('32px')).setOrigin(0.5);

        // Load levels from localStorage, or use default if not available
        this.levels = JSON.parse(localStorage.getItem('levels')) || [
            { name: 'Nível 1', unlocked: true, energyGoal: 50, x: 180, y: 460 },
            { name: 'Nível 2', unlocked: false, energyGoal: 100, x: 385, y: 210 },
            { name: 'Nível 3', unlocked: false, energyGoal: 150, x: 460, y: 495 },
            { name: 'Nível 4', unlocked: false, energyGoal: 200, x: 650, y: 250 }
        ];

        this.levels.forEach((level, index) => {
            const color = level.unlocked ? '#ffffff' : '#ff0000';
            const levelButton = this.add.text(level.x, level.y, level.name, this.applyFontStyle('24px', color)).setOrigin(0.5);
            
            if (level.unlocked) {
                levelButton.setInteractive();
                levelButton.on('pointerdown', () => this.startLevel(index + 1, level.energyGoal));
            }
        });

        this.createBackButton('StartScreen');
        this.playAmbientMusic();
    }

    startLevel(level, energyGoal) {
        const difficulty = this.scene.get('DifficultySelectScene').selectedDifficulty;
        this.sound.stopAll();
        this.scene.start('GameScene', { level, difficulty, energyGoal });
    }
}

class GameScene extends BaseScene {
    constructor() {
        super('GameScene');
    }

    create(data) {
        const { level, difficulty, energyGoal } = data;
        
        // Background setup
        const bg = this.add.image(400, 300, `level${level}`);
        const scaleX = this.cameras.main.width / bg.width;
        const scaleY = this.cameras.main.height / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale).setScrollFactor(0);

        // Player setup with precise hitbox
        this.player = this.physics.add.sprite(400, 300, 'player1');
        this.player.setCollideWorldBounds(true);
        
        const playerWidth = 40;
        const playerHeight = 120;
        this.player.body.setSize(playerWidth, playerHeight);
        this.player.body.setOffset(
            (this.player.width - playerWidth) / 2,
            (this.player.height - playerHeight) / 2
        );

        // Game state initialization
        this.score = 0;
        this.energy = 0;
        this.energyGoal = energyGoal;
        this.timeLimit = 60;
        this.lives = 3;

        // Input setup
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.on('pointerdown', this.shootFireball, this);

        // Obstacles group setup
        this.obstacles = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        // Collision setup with debug visualization
        const collider = this.physics.add.overlap(
            this.player,
            this.obstacles,
            this.handleCollision,
            null,
            this
        );

        this.createUI();
        this.initGame(difficulty);
        this.setupPauseMenu();
        this.setupAudio(level);
        this.joyStickSetup();
    }

    joyStickSetup() {
        this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
            x: 700,
            y: 500,
            radius: 50,
            base: this.add.circle(0, 0, 50, 0x888888),
            thumb: this.add.circle(0, 0, 25, 0xcccccc),
        });
    }


    setupAudio(level) {
        const musicVolume = parseFloat(localStorage.getItem('musicVolume')) || 0.5;
        this.levelMusic = this.sound.add(`level${level}-song`, {
            loop: true,
            volume: musicVolume
        });
        this.levelMusic.play();

        const sfxVolume = parseFloat(localStorage.getItem('sfxVolume')) || 0.5;
        this.shootSound = this.sound.add('shootSound', { volume: sfxVolume });
        this.deadSound = this.sound.add('dead', { volume: sfxVolume });
    }

    setupPauseMenu() {
        this.isPaused = false;
        this.pauseMenu = this.add.container(400, 300);
        this.pauseMenu.add(this.add.rectangle(0, 0, 350, 250, 0x000000, 0.9));
        this.pauseMenu.add(this.add.text(0, -70, 'PAUSADO', this.applyFontStyle('32px')).setOrigin(0.5));
        this.pauseMenu.add(this.add.text(0, 0, 'ESC - Voltar', this.applyFontStyle('24px')).setOrigin(0.5));
        this.pauseMenu.add(this.add.text(0, 60, 'S - Sair', this.applyFontStyle('24px')).setOrigin(0.5));
        this.pauseMenu.setDepth(1000);
        this.pauseMenu.setVisible(false);

        this.input.keyboard.on('keydown-ESC', this.togglePause, this);
        this.input.keyboard.on('keydown-S', this.quitToLevelSelect, this);
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.pauseMenu.setVisible(true);
            this.physics.pause();
            this.levelMusic.pause();
            this.anims.pauseAll();
            this.smokeEvent.paused = true;
            this.timerEvent.paused = true;
        } else {
            this.pauseMenu.setVisible(false);
            this.physics.resume();
            this.levelMusic.resume();
            this.anims.resumeAll();
            this.smokeEvent.paused = false;
            this.timerEvent.paused = false;
        }
    }

    quitToLevelSelect() {
        if (this.isPaused) {
            this.levelMusic.stop();
            this.scene.start('LevelSelectScene');
        }
    }

    createUI() {
        const fontStyle = { fontSize: '24px', fill: '#ffffff', fontFamily: 'PixelOperator8-Bold' };
        this.scoreText = this.add.text(16, 16, 'Pontuação: 0', fontStyle);
        this.livesText = this.add.text(16, 50, 'Vidas: 3', fontStyle);
        this.timeText = this.add.text(580, 16, 'Tempo: 60', fontStyle);
        this.add.text(16, 570, 'ESC para Pausar', this.applyFontStyle('16px'));
        
        this.progressBar = this.add.graphics();
        this.progressBar.fillStyle(0x00ff00, 1);

        this.updateProgressBar();
    }

    initGame(difficulty) {
        switch(difficulty) {
            case 'Fácil':
                this.obstacleSpeed = 100;
                this.obstacleSpawnRate = 1500;
                break;
            case 'Difícil':
                this.obstacleSpeed = 300;
                this.obstacleSpawnRate = 500;
                break;
            default: // Médio
                this.obstacleSpeed = 200;
                this.obstacleSpawnRate = 1000;
        }

        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        this.smokeEvent = this.time.addEvent({
            delay: this.obstacleSpawnRate,
            callback: this.spawnSmoke,
            callbackScope: this,
            loop: true
        });
    }

    spawnSmoke() {
        if (this.isPaused) return;

        const smoke = this.obstacles.create(800, Phaser.Math.Between(100, 500), 'smoke');
        smoke.setScale(0.2);
        
        // Smoke Hitbox
        const smokeWidth = 60;
        const smokeHeight = 70;
        smoke.body.setSize(smokeWidth, smokeHeight);
        smoke.body.setOffset(
            (smoke.width * smoke.scale - smokeWidth) / 2,
            (smoke.height * smoke.scale - smokeHeight) / 2 + 5
        );
        
        smoke.setVelocityX(-this.obstacleSpeed);
        smoke.setImmovable(true);
        smoke.play('smoke');
    }

    shootFireball(pointer) {
        if (this.isPaused) return;
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
        this.shootSound.play({ volume: this.sound.volume });
    }

    updateScore() {
        this.score += 10;
        this.energy += 10;
        this.scoreText.setText(`Pontuação: ${this.score}`);
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
        if (this.isPaused) return;
        if (this.timeLimit > 0) {
            this.timeLimit--;
            this.timeText.setText(`Tempo: ${this.timeLimit}`);
            if (this.timeLimit <= 0) this.gameOver();
        }
    }

    handleCollision(player, obstacle) {
        if (!obstacle.active) return; // Prevent multiple collisions
        
        obstacle.destroy();
        this.lives--;
        this.livesText.setText(`Vidas: ${this.lives}`);
        
        if (this.lives > 0) {
            this.deadSound.play();
            // Add visual feedback
            this.player.setTint(0xff0000);
            this.time.delayedCall(200, () => {
                this.player.clearTint();
            });
        }
        
        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    completeLevel() {
        this.sound.play('complete');
        this.player.play('idle');
        this.timerEvent.remove();
        this.smokeEvent.remove();
        this.levelMusic.stop();
        this.scene.start('LevelCompleteScene', { score: this.score, level: this.scene.settings.data.level });
    }

    gameOver() {
        this.player.play('dead');
        this.deadSound.play();
        this.timerEvent.remove();
        this.smokeEvent.remove();
        this.physics.pause();
        this.levelMusic.stop();
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
}

class LevelCompleteScene extends BaseScene {
    constructor() {
        super('LevelCompleteScene');
    }

    create(data) {
        this.createBackground('bgInit', true);
        this.add.text(400, 100, 'Nível Concluído!', this.applyFontStyle('32px')).setOrigin(0.5);
        this.add.text(400, 200, `Pontuação: ${data.score}`, this.applyFontStyle('24px')).setOrigin(0.5);

        let levels = JSON.parse(localStorage.getItem('levels')) || [
            { name: 'Nível 1', unlocked: true, energyGoal: 50, x: 180, y: 460 },
            { name: 'Nível 2', unlocked: false, energyGoal: 100, x: 385, y: 210 },
            { name: 'Nível 3', unlocked: false, energyGoal: 150, x: 460, y: 495 },
            { name: 'Nível 4', unlocked: false, energyGoal: 200, x: 650, y: 250 }
        ];

        if (data.level < levels.length) {
            levels[data.level].unlocked = true;
            localStorage.setItem('levels', JSON.stringify(levels));
        }

        if (data.level < 4) {
            const nextLevelButton = this.add.text(400, 300, 'Próximo Nível', this.applyFontStyle()).setOrigin(0.5).setInteractive();
            nextLevelButton.on('pointerdown', () => {
                this.sound.stopAll();
                this.scene.start('GameScene', { level: data.level + 1, difficulty: this.scene.get('DifficultySelectScene').selectedDifficulty, energyGoal: (data.level + 1) * 50 });
            });
        }

        const backtoLevelsButton = this.add.text(400, 350, 'Seleção de Níveis', this.applyFontStyle()).setOrigin(0.5).setInteractive();
        backtoLevelsButton.on('pointerdown', () => this.scene.start('LevelSelectScene'));

        const menuButton = this.add.text(400, 450, 'Voltar ao Menu', this.applyFontStyle()).setOrigin(0.5).setInteractive();
        menuButton.on('pointerdown', () => this.scene.start('StartScreen'));

        this.playAmbientMusic();
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
        restartButton.on('pointerdown', () => {
            this.sound.stopAll(); // Stop all sounds, including ambient music
            this.scene.start('GameScene', { level: 1, difficulty: 'Medium', energyGoal: 50 });
        });

        const menuButton = this.add.text(400, 350, 'Voltar ao Menu', this.applyFontStyle()).setOrigin(0.5).setInteractive();
        menuButton.on('pointerdown', () => {
            this.sound.stopAll();
            this.scene.start('StartScreen');
        });

        this.playAmbientMusic();
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: "#1d1d1d",
    scene: [PreloadScene, StartScreen, InstructionsScene, ControlosScene, DifficultySelectScene, OptionsSelectScene, LevelSelectScene, GameScene, LevelCompleteScene, GameOverScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    plugins: {global: [{}],},
};

const game = new Phaser.Game(config);