let keyA;
let keyS;
let keyD;
let keyW;

const gameState = {};

class MyGame extends Phaser.Scene {

    preload() {
        this.load.image("bg", "assets/bg.png");
        this.load.image('mc', 'assets/character.png');
        this.load.image("ground", "assets/platform.png")
    }

    create() {
        // Keyboard inputs
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        gameState.background = this.add.image(950, 470, "bg");

        // Ground
        const platforms = this.physics.add.staticGroup();
        platforms.create(700,928, "ground").setScale(6).refreshBody();

        // Physics
        gameState.character = this.physics.add.sprite(100,450,"mc")
        gameState.character.setBounce(0.2);
        gameState.character.setCollideWorldBounds(true)
        this.physics.add.collider(gameState.character, platforms)
    } 

    update() {
        // Player movement
        if(keyA.isDown) {
            gameState.character.setVelocityX(-160);
        }
        if(keyD.isDown) {
            gameState.character.setVelocityX(160);
        }
        if(keyW.isDown) {
            gameState.character.setVelocityY(-160);
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
