class TriangleShape extends Phaser.Graphics {

	constructor(game, x, y, color) {
		super(game, x, y);

		this._color = color || 0xFFFFFF;

		let h = 15 * (Math.sqrt(3)/2);

	    this.lineStyle(2, this._color, 1);
        this.moveTo(0, -h / 2);
        this.lineTo(-15 / 2, h / 2);
        this.lineTo(15 / 2, h / 2);
        this.lineTo(0, -h / 2);

	}
}

export default TriangleShape;