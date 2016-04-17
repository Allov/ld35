class WaveForm extends Phaser.Graphics {

	constructor(game, x, y, length, analyser) {
		super(game, x, y);
		
		this._speed = 16; // ms
		this._length = length;
		this._waves = Array.apply(null, Array(length)).map(() => { return 1; });
		this._analyser = analyser;

		this._height = this.game.height / 2;

		this._color1 = 0xFFBA00;
		this._color2 = 0x00BAFF;

		this.game.stage.addChild(this);
        this.game.time.events.loop(this._speed, this.updateWaveform, this).timer.start();
	}

    updateWaveform() {
        let waveformData = this._analyser.frequencies();
        let waves = this._waves;
        let sum = 0;
        let groupCount = waveformData.length / this._length;

        for (let i = 0; i < waveformData.length; i++) {

            sum += waveformData[i];

            if (i % groupCount == 0) {
                waves[i / groupCount] = sum / groupCount + 1;
                sum = 0;
            }
        }
    }

	render() {
		this.clear();
		let height = this._height / this._length;
		let width = this.game.width/2;

		for(let i = 0; i < this._length; i++) {
			let l = (this._waves[i]/200);

			let color = Phaser.Color.interpolateColor(this._color1, this._color2, this._length, i);

			this.beginFill(color, l*0.6);
		    this.lineStyle(2, color, l*0.6);

		    this.drawRect((this.x+this.game.world.centerX)-(l*width/2), this.y+i*height, l*width, height/2);
		    this.endFill();
		}		
	}
	
}

export default WaveForm;