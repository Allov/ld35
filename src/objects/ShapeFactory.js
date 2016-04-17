import SquareShape from 'objects/SquareShape';
import HexagonShape from 'objects/HexagonShape';
import TriangleShape from 'objects/TriangleShape';
import Shape from 'objects/Shape';

class ShapeFactory {
    constructor(game, anaylser, length, player) {
        this.game = game;
        this.player = player;
        // this.shapes = game.add.physicsGroup(Phaser.Physics.ARCADE);
        this.shapes = [];

        this._analyser = anaylser;
        this._length = length;

        this._color1 = 0xFFBA00;
        this._color2 = 0x00BAFF;

        this._shapeCooldowns = [0, 0, 0];

        this._availableShapes = [
            SquareShape,
            HexagonShape,
            TriangleShape
        ];

        this.game.time.events.loop(64, this.createShapeFromWaveform, this).timer.start();
    }

    createShapeFromWaveform() {
        let waveformData = this._analyser.frequencies();
        let sum = 0;

        for (let i = 0; i < waveformData.length; i++) {

            sum += waveformData[i];

            if (i % this._length == 0) {
                let avg = sum / this._length + 1;

                let frequencyGroup = i / 16;
                let shapeIndex = Math.floor(frequencyGroup / this._length * 3);

                if (shapeIndex > 2) { shapeIndex = 2; }
                if (shapeIndex < 0) { shapeIndex = 0; }

                if (avg > 150 && this.game.time.now > this._shapeCooldowns[shapeIndex]) {
                    this.spawnShape(frequencyGroup, avg, shapeIndex);
                    this._shapeCooldowns[shapeIndex] = this.game.time.now + 1000;
                }

                sum = 0;
            }
        }
    }

    spawnShape(frequencyGroup, force, shapeIndex) {
        let shape = this._availableShapes[shapeIndex];
        let height = (this.game.height / 2) / this._length;

        let x = this.game.world.centerX + force;
        let y = frequencyGroup * height;

        let color = Phaser.Color.interpolateColor(this._color2, this._color1, this._length, frequencyGroup);

        //todo: optimize texture generation.
        // let shape1 = this.shapes.create(x, y, new shape(this.game, x, y, color).generateTexture());
        let shape1 = this.game.add.sprite(x, y, new shape(this.game, x, y, color).generateTexture());
        this._setShapeDefaults(shape1, shapeIndex);
        shape1.body.velocity.x = force*2;
        shape1.body.angularVelocity = force*2;

        // let shape2 = this.shapes.create(x-(force*2), y, new shape(this.game, x-(force*2), y, color).generateTexture());
        let shape2 = this.game.add.sprite(x-(force*2), y, new shape(this.game, x-(force*2), y, color).generateTexture());
        this._setShapeDefaults(shape2, shapeIndex);
        shape2.body.velocity.x = -force*2;
        shape2.body.angularVelocity = -force*2;
    }

    _setShapeDefaults(shape, shapeType) {
        this.game.physics.arcade.enable(shape);

        shape.lifespan = 6000;
        shape.shapeType = shapeType;
        shape.anchor.setTo(0.5, 0.5);
        shape.body.angularDrag = 50;
        shape.body.allowRotation = true;
        shape.body.bounce.y = 0.5;
        shape.body.bounce.x = 0.5;
        shape.body.collideWorldBounds = true;
        shape.body.setSize(10, 10, 5, 5);

        this.shapes.push(shape);
    }
}

export default ShapeFactory;
