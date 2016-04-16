import GameState from 'states/GameState';
import WebAudioAnalyser from 'web-audio-analyser';

class Game extends Phaser.Game {

	constructor() {
		super(500, 500, Phaser.AUTO, 'content', null);
		this.state.add('GameState', GameState, false);
		this.state.start('GameState');


		let audio = new Audio();
		audio.src = 'medias/chip2.ogg';
		let analyser = new WebAudioAnalyser(audio);
		audio.play();

		setInterval(() => {
			console.log(analyser.waveform());
		}, 500);

	}

}

new Game();
