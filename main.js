let keyA;
let keyS;
let keyD;
let keyW;
let space;
let isPunching = false;
let canJump = true;
let velocity;
let facing_left = false;
let facing_right = true;
let attackCooldown = false;
const gameState = {};

class MyGame extends Phaser.Scene {
    attack() {
        if (attackCooldown) {
            return
        }
        gameState.enemy.health = gameState.enemy.health - 1;
        console.log(gameState.enemy.health)
        this.time.delayedCall(2000, () => {
            this.isHitboxActive = false;
            gameState.hitbox.destroy()
        });
    }

    preload() {
        this.load.image("bg", "assets/bg.png");
        this.load.image('player', 'assets/character.png');
        this.load.image('enemy', 'assets/enemy.png');
        this.load.image("ground", "assets/platform.png")
        this.load.spritesheet('idle', 'assets/idle_animation.png', {frameWidth: 240, frameHeight: 240});
        this.load.spritesheet('right', 'assets/walk_right_animation.png', {frameWidth: 240, frameHeight: 240});
        this.load.spritesheet('left', 'assets/walk_left_animation.png', {frameWidth: 240, frameHeight: 240});
        this.load.spritesheet('punch-right', 'assets/punch_right_animation.png', {frameWidth: 240, frameHeight: 240});
        this.load.spritesheet('punch-left', 'assets/punch_left_animation.png', {frameWidth: 240, frameHeight: 240});
        this.load.image("hitbox", "assets/hitbox.png");
    }

    create() {
        // Keyboard inputs
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        
        gameState.background = this.add.image(950, 470, "bg");
        
        const platforms = this.physics.add.staticGroup();

        platforms.create(700,928, "ground").setScale(6).refreshBody();

        gameState.player = this.physics.add.sprite(100,450,"player")
        gameState.enemy = this.physics.add.sprite(100,700,"enemy")
        gameState.hitbox = this.physics.add.sprite(-500,0,"hitbox")
        gameState.damage = this.physics.add.overlap(gameState.enemy, gameState.hitbox, this.attack, null, this)

        gameState.enemy.health = 10


        gameState.player.setBounce(0.2);
        gameState.player.setCollideWorldBounds(true)
        this.input.keyboard.on('keydown-SPACE', this.attack, this);
        this.physics.add.collider(gameState.player, platforms)
        this.physics.add.collider(gameState.enemy, platforms)
        
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
        this.anims.create({
            key: 'punch-right',
            frames: this.anims.generateFrameNumbers('punch-right', {start: 0, end: 3}),
            frameRate: 8,
        })
        this.anims.create({
            key: 'punch-left',
            frames: this.anims.generateFrameNumbers('punch-left', {start: 0, end: 3}),
            frameRate: 8,
        })
        gameState.player.on('animationcomplete-punch-right', function (animation) {
            if (animation.key === 'punch-right') {
                isPunching = false;
                gameState.player.anims.play('idle', true);
            }
        });
        gameState.player.on('animationcomplete-punch-left', function (animation) {
            if (animation.key === 'punch-left') {
                isPunching = false;
                gameState.player.anims.play('idle', true);
            }
        });

    } 
    
 
    update() {
        // player movement vvvv
        if (!isPunching) {
            if (keyA.isDown) {

                gameState.player.setVelocityX(-380);
                gameState.player.anims.play('left', true);

                facing_left = true;
                facing_right = false;

            } else if (keyD.isDown) {

                gameState.player.setVelocityX(380);
                gameState.player.anims.play('right', true);

                facing_right = true;
                facing_left = false;

            } else if (keyW.isDown && canJump) {

                canJump = false;
                gameState.player.setVelocityY(-380);
                setTimeout(() => {
                    canJump = true;
                }, 2200);

            } else if (space.isDown) {
                if (facing_right || keyD.isDown) {
                    gameState.player.anims.play('punch-right', true);
                    gameState.hitbox.setPosition(gameState.player.x+200, gameState.player.y)
                } else if (facing_left || keyA.isDown) {
                    gameState.player.anims.play('punch-left', true);
                    gameState.hitbox.setPosition(gameState.player.x-200, gameState.player.y)
                }
                gameState.player.setVelocityX(0);
                isPunching = true;

            } else if (keyW.isUp && keyA.isUp && keyD.isUp && space.isUp) {

                gameState.player.anims.play('idle', true);
                gameState.player.setVelocityX(0);

            }
        }
        //player movement ^^^^
        //enemy movement vvvv
        if (gameState.player.x > gameState.enemy.x) {
            gameState.enemy.setVelocityX(70);
        } else if (gameState.player.x < gameState.enemy.x)  {
            gameState.enemy.setVelocityX(-70);
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
