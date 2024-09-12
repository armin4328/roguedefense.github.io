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
        this.load.spritesheet('idle', 'assets/idle_animation.png', {frameWidth: 150, frameHeight: 250})
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

    } 

    update() {
        gameState.player.anims.play('idle', true)
        if(keyA.isDown) {
            gameState.player.setVelocityX(-280);
        }
        if(keyD.isDown) {
            gameState.player.setVelocityX(280);
        }
        if(keyW.isDown && this.player.body.touching.down) {
            gameState.player.setVelocityY(-280);
        }
        if (keyW.isUp && keyA.isUp && keyD.isUp) {
            gameState.player.setVelocityX(0);
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
