import SquareShape from 'objects/SquareShape';
import HexagonShape from 'objects/HexagonShape';
import TriangleShape from 'objects/TriangleShape';

class Player extends Phaser.Sprite {
	constructor(game, x, y) {
		super(game, x, y);

        this._shapeshiftCooldown = 0;
        this._jumpCooldown = 0;
        this._jumpCount = 0;

		this.shapes = [
			new SquareShape(game, 0, 0), 
			new HexagonShape(game, 0, 0), 
			new TriangleShape(game, 0, 0)
		];

        this._velocitySettings = {
            x: 400,
            xAerial: 300,
            rotation: 800
        };

		this._currentShape = 0;
		this.anchor.setTo(0.5, 0.5);

		this._setCurrentShape(this._currentShape);

		this.game.stage.addChild(this);

        this.game.physics.arcade.enable(this);

        this.body.drag.y = 0;
        this.body.angularDrag = 500;
        this.body.allowRotation = true;
        this.body.bounce.y = 0.2;
        this.body.collideWorldBounds = true;
        this.body.setSize(10, 10, 5, 5);

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.morph = this.game.input.keyboard.addKey(Phaser.Keyboard.C);
	}

	_setCurrentShape(i) {
		this.texture = this.shapes[i].generateTexture();
	}

	nextShape() {
		this._currentShape++;
		if (this._currentShape >= this.shapes.length) {
			this._currentShape = 0;
		}
		this._setCurrentShape(this._currentShape);
	}

    update() {
        if (this.body.onFloor()) {
            this.body.drag.x = 450;
        } else {
            this.body.drag.x = 200;
        }

        if (this.body.angularVelocity == 0) {
            this.body.rotation += 0;
        }

        if (this.cursors.left.isDown) {
            if (this.body.onFloor()) {
                this.body.velocity.x = -this._velocitySettings.x;
            } else {
                this.body.velocity.x = -this._velocitySettings.xAerial;
            }
            this.body.angularVelocity = -this._velocitySettings.rotation;
        } else if (this.cursors.right.isDown) {
            if (this.body.onFloor()) {
                this.body.velocity.x = this._velocitySettings.x;
            } else {
                this.body.velocity.x = this._velocitySettings.xAerial;
            }

            this.body.angularVelocity = this._velocitySettings.rotation;
        }

        if (this.cursors.up.isDown 
            && (this.body.onFloor() || this.body.onWall() || this._jumpCount < 2) 
            && this._jumpCount < 2
            && this.game.time.now > this._jumpCooldown) {
            this.body.velocity.y = -200;
            this._jumpCount += 1;
            this._jumpCooldown = this.game.time.now + 500;
        }

        if (this.body.onFloor() && this.game.time.now > this._jumpCooldown) {
            this._jumpCount = 0;
        }

        if (this.morph.isDown && this.game.time.now > this._shapeshiftCooldown) {
            this.nextShape();
            this._shapeshiftCooldown = this.game.time.now + 150;
        }
    }
}

export default Player;