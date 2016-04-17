class Platform extends Phaser.Graphics {
	constructor(game, x, y) {
		super(game, x, y);

		this.beginFill(0xFFBA00, 0.6);
	    this.lineStyle(2, 0xFFBA00, 0.6);

	    this.drawRect(this.x, this.y, 100, 15);
	    this.endFill();
	}
}

export default Platform;