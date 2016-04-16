import Button from 'objects/Button';
import WebAudioAnalyser from 'web-audio-analyser';

class GameState extends Phaser.State {

	create() {
		let center = { x: this.game.world.centerX, y: this.game.world.centerY }

        this.audio = new Audio();
        this.audio.src = 'medias/chip2.ogg';
        let analyser = new WebAudioAnalyser(this.audio);

        console.log(this);

        let button = new Button(this.game, 10, center.y+200, 'play');
        button.inputEnabled = true;
        button.events.onInputDown.add(() => {
        	if (this.audio.paused) {
        		this.startAudio();
        	} else {
        		this.stopAudio();
        	}
        }, this);

        this.audioToggler = button;
	}

    stopAudio() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.audioToggler.text = 'play';
    }

    startAudio() {
    	this.audio.play();
        this.audioToggler.text = 'stop';
    }
}

export default GameState;
