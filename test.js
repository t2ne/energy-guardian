class MyScene extends Phaser.Scene {

    preload() {
        this.load.spritesheet('player1', 'assets/character/1.png', { frameWidth: 136, frameHeight: 170 });
        this.load.spritesheet('player2', 'assets/character/2.png', { frameWidth: 136, frameHeight: 170 }); 
        this.load.spritesheet('fireball', 'assets/character/fireball.png', {frameWidth: 121, frameHeight: 125});
    }

    create() {

        const idle = {key: "idle", 
            frames: this.anims.generateFrameNumbers("player1", { start: 0, end: 6 }),
            frameRate: 10,
            repeat: -1
        };

        const walk = {key: "walk", 
            frames: this.anims.generateFrameNumbers("player1", { start: 16, end: 23 }),
            frameRate: 10,
            repeat: -1
        };

        const attack = {key: "attack",
            frames: this.anims.generateFrameNumbers("player2", { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        };

        const dead = {key: "dead",
            frames: this.anims.generateFrameNumbers("player2", { start: 32, end: 37 }),
            frameRate: 5,
            repeat: 0
        };

        const fireball = {key: "fireball",
            frames: this.anims.generateFrameNumbers("fireball", { start: 0, end: 11 }),
            frameRate: 10,
            repeat: -1
        };

        this.anims.create(idle);
        this.anims.create(walk);
        this.anims.create(attack);
        this.anims.create(dead);
        this.anims.create(fireball);
        

        //TODO: IMPLEMENTAR ISTO NO INDEX.JS, A SET ORIGIN, METENDO PLAYER LÁ NAO FUNCIONA

        this.player = this.add.sprite(500, 500, "player1");
        this.player.play("dead", true);

        this.player.on('animationupdate', (animation) => {
            if (animation.key === 'walk') {
                this.player.setOrigin(0.6, 0.4);
            } else if (animation.key === 'dead') {
                this.player.setOrigin(0.5, 0.2);}
                else {
            }
        });
    }
}

const config = {
    // Configure the game size and renderer
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'game-container',
    // Define the game scenes
    scene: [MyScene]
};

const game = new Phaser.Game(config);