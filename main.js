let keyA;
let keyS;
let keyD;
let keyW;

const gameState = {};

class MyGame extends Phaser.Scene {

    preload() {
        this.load.image("bg", "assets/bg.png");
        this.load.image('player', 'assets/character.png');
        this.load.image("ground", "assets/platform.png")
        this.load.spritesheet('idle', 'assets/idle_animation.png', {frameWidth: 240, frameHeight: 240})
        this.load.spritesheet('right', 'assets/walk_right_animation.png', {frameWidth: 240, frameHeight: 240})
        this.load.spritesheet('left', 'assets/walk_left_animation.png', {frameWidth: 240, frameHeight: 240})
    }

    create() {
        // Keyboard inputs
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        gameState.background = this.add.image(950, 470, "bg");
        
        const platforms = this.physics.add.staticGroup();

        platforms.create(700,928, "ground").setScale(6).refreshBody();


        gameState.player = this.physics.add.sprite(100,450,"player")
        gameState.player.setBounce(0.2);
        gameState.player.setCollideWorldBounds(true)
        this.physics.add.collider(gameState.player, platforms)

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('idle', {start: 0, end: 1}),
            frameRate: 1,
            repeat: -1
        })
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('right', {start: 0, end: 6}),
            frameRate: 8,
            repeat: -1
        })
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('left', {start: 0, end: 6}),
            frameRate: 8,
            repeat: -1
        })

    } 

    update() {
    
        if(keyA.isDown) {
            gameState.player.setVelocityX(-380);
            gameState.player.anims.play('left', true)
        }
        if(keyD.isDown) {
            gameState.player.setVelocityX(380);
            gameState.player.anims.play('right', true)
        }
        if(keyW.isDown) {
            gameState.player.setVelocityY(-380);
        }
        if (keyW.isUp && keyA.isUp && keyD.isUp) {
            gameState.player.setVelocityX(0);
            gameState.player.anims.play('idle', true)
        }
    }
}


var config = {
    type: Phaser.AUTO,
    width: 1900,
    height: 933,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y : 450},
            debug:true,
        },
    },
    scene: MyGame,
};

// Initialize Phaser game
const game = new Phaser.Game(config);
