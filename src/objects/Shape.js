class Shape extends Phaser.Sprite {

    constructor(game, x, y, shape, shapeType) {
        super(game, x, y);
        this.texture = shape.generateTexture();
        this.lifespan = 6000;
        this.shapeType = shapeType;

        this.anchor.setTo(0.5, 0.5);

        this.game.stage.addChild(this);

        this.game.physics.arcade.enable(this);

        this.body.drag.y = 0;
        this.body.angularDrag = 50;
        this.body.allowRotation = true;
        this.body.bounce.y = 0.5;
        this.body.bounce.x = 0.5;
        this.body.collideWorldBounds = true;
        this.body.setSize(10, 10, 5, 5);
    }
}

export default Shape;
