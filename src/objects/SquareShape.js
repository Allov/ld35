class SquareShape extends Phaser.Graphics {

	constructor(game, x, y, color) {
		super(game, x, y);

		this._color = color || 0xFFFFFF;

	    this.lineStyle(2, this._color, 1);
	    this.drawRect(this.x, this.y, 10, 10);
	    //this.anchor = new Phaser.Point(0, 0);
	}
}

export default SquareShape;