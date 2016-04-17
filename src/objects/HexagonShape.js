class HexagonShape extends Phaser.Graphics {

	constructor(game, x, y, color) {
		super(game, x, y);

		this._color = color || 0xFFFFFF;

	    this.lineStyle(2, this._color, 1);
	    for (let i = 0; i <= 6; i++) {
	        let angle = 2 * Math.PI / 6 * (i + 0.5);
	        let x_i = 7 + 7 * Math.cos(angle);
	        let y_i = 7 + 7 * Math.sin(angle);
	        if (i == 0) {
	            this.moveTo(x_i, y_i);
	        } else {
	            this.lineTo(x_i, y_i);
	        }
	    }

	}
}

export default HexagonShape;