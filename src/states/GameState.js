import Button from 'objects/Button';
import WaveForm from 'objects/WaveForm';
import Player from 'objects/Player';
import WebAudioAnalyser from 'web-audio-analyser';
import ShapeFactory from 'objects/ShapeFactory';

class GameState extends Phaser.State {

    create() {
        this._speed = 16; // ms

        this.game.time.advancedTiming = true;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 300;

        this.initAudio();
        this.initUi();
        this.initWaveForm();
        this.initFps();
        this.initPlayer();
        this.initShapeFactory();
    }

    initAudio() {
        this.audio = new Audio();
        this.audio.crossOrigin = 'Anonymous';
        //64308054 - dubstep
        //121622783 - enteka
        //148884251 - chip
        //257243291 - d&b
        //get https://api.soundcloud.com/resolve.json?url=[url]&client_id=6f6d2855cb215a00d36c9af48b5f2a39

        let ids = [64308054, 257243291];
        let id = ids[Math.floor(Math.random() * ids.length)]

        this.audio.src = 'http://api.soundcloud.com/tracks/' + id + '/stream?client_id=6f6d2855cb215a00d36c9af48b5f2a39'; //'medias/chip2.ogg';
        this.analyser = new WebAudioAnalyser(this.audio);
        this.game.time.events.loop(this._speed, this.updateFps, this).timer.start();
    }

    initUi() {
        let center = { x: this.game.world.centerX, y: this.game.world.centerY }
        let button = this.game.add.text(center.x, center.y, 'play', { font: "45px Lucida Console", fill: "#fff", align: "center" });
        button.anchor.x = 0.5;
        button.inputEnabled = true;
        button.events.onInputDown.add(() => {
            button.inputEnabled = false;
            this.startTutorial();
            this.startAudio();
        }, this);

        this.audioToggler = button;
    }

    initFps() {
        this.fps = this.game.add.text(10, 10, '--', { font: "45px Lucida Console", fill: "#fff" });
    }

    initWaveForm() {
        this.waveform = new WaveForm(this.game, 0, 0, 16, this.analyser);
    }

    updateFps() {
        this.fps.text = this.game.time.fps;
    }

    initShapeFactory() {
        this.shapeFactory = new ShapeFactory(this.game, this.analyser, 16, this.player);
    }

    initPlayer() {
        this.player = new Player(this.game, this.game.world.centerX, this.game.world.height - 20);
    }

    startTutorial(callback) {
        let helpTexts = [
            '- welcome -',
            'left/right to move',
            'up to jump',
            'c to shapeshift',
            'ready?',
            'go!'
        ];

        let current = 0;

        this.alertText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, '', { font: "15px Lucida Console", fill: "#fff", align: 'center' });
        this.alertText.anchor.x = 0.5;

        let showText = () => {
            //wat?
            if (current >= helpTexts.length) return;

            this.alertText.alpha = 1;
            this.alertText.position.x = this.game.world.centerX;
            let tween = this.game.add.tween(this.alertText).from({ x: this.game.world.width+100 }, 500, Phaser.Easing.Bounce.Out, true);
            tween.onComplete.add(() => {
                this.game.add.tween(this.alertText).to({ x: -200 }, 200, Phaser.Easing.None, true, 500);
            }, this);
            this.alertText.text = helpTexts[current];
            current++;            
        };

        showText();
        this.game.time.events.repeat(2000, helpTexts.length, showText, this).timer.start();
    }

    stopAudio() {
        this.audio.pause();
        this.audio.crossOrigin = 'Anonymous';
        this.audio.currentTime = 0;
        this.audioToggler.text = 'play';
    }

    startAudio() {
        this.audio.play();
        this.audioToggler.text = '';
    }

    update() {
        this.game.physics.arcade.overlap(this.player, this.shapeFactory.shapes, this.killSameTypeShape, null, this);
        this.game.physics.arcade.collide(this.player, this.shapeFactory.shapes);
    }

    killSameTypeShape(player, shape) {
        if (shape.shapeType == player._currentShape) {
            shape.kill();
        }
    }

    render() {
        this.waveform.render();
    }
}

export default GameState;
