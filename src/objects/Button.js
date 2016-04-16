class Button extends Phaser.Text {

	constructor(game, x, y, text) {
		super(game, x, y, text, { font: "45px Lucida Console", fill: "#fff", align: "center" });

		this.game.stage.addChild(this);
	}
}

export default Button;