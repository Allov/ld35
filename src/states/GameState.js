import Button from 'objects/Button';
import WaveForm from 'objects/WaveForm';
import Player from 'objects/Player';
import WebAudioAnalyser from 'web-audio-analyser';
import ShapeFactory from 'objects/ShapeFactory';

class GameState extends Phaser.State {

    create() {
        //64308054 - dubstep
        //121622783 - enteka
        //148884251 - chip
        //257243291 - d&b
        //get https://api.soundcloud.com/resolve.json?url=[url]&client_id=6f6d2855cb215a00d36c9af48b5f2a39

        // let ids = [64308054, 257243291];
        // let id = ids[Math.floor(Math.random() * ids.length)];

        this.songs = [
            'medias/chip2.ogg',
            'medias/DrumNBass.ogg',
            'medias/DrumNBass2.ogg',
            'medias/DrumNBass3.ogg'
        ];
        this.currentSong = Math.floor(Math.random() * this.songs.length);

        this._speed = 16; // ms

        this.game.time.advancedTiming = true;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 100;

        this.score = 0;
        this.streak = 0;
        this.ended = false;
        this.playing = false;

        this.initAudio();
        this.initSfx();
        this.initAlertText();
        this.initUi();
        this.initWaveForm();
        this.initFps();
        this.initPlayer();
        this.initShapeFactory();
        this.initPauseText();
        this.initGameTitle();

        this.pause = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        this.pause.onDown.add(() => {
            if (this.playing) {
                this.pauseGame();
            }
        });
    }

    initPauseText() {
        let center = { x: this.game.world.centerX, y: this.game.world.centerY + 30 }
        this.pauseText = this.game.add.text(center.x, center.y, '- paused -', { font: "45px Lucida Console", fill: "#fff", align: "center" });
        this.pauseText.alpha = 0;
        this.pauseText.anchor.x = 0.5;
    }

    initGameTitle() {
        let center = { x: this.game.world.centerX, y: 80 }
        this.gameTitle = this.game.add.text(center.x, center.y, 'shapeshift\nbeat\nld35', { font: "60px Lucida Console", fill: "#FFBA00", align: "center" });
        this.gameTitle.alpha = 1;
        this.gameTitle.anchor.x = 0.5;
    }

    initAudio() {
        this.audio = new Audio();
        this.audio.crossOrigin = 'Anonymous';

        this.audio.onended = () => {
            this.ended = true;
            this.playing = false;

            this.shapeFactory.shapes.setAll('lifespan', 1);

            let scoreText = 'phew... that was rough. ' + this.score + ' pts';
            if (this.score >= 10 && this.score < 20) {
                scoreText = this.score + ' pts! let\'s work these up again.';
            } else if (this.score > 20 && this.score <= 30) {
                scoreText = 'not bad... not bad at all! ' + this.score + ' pts';
            } else {
                scoreText = 'whaaaat? you basicaly crushed it... nice job! ' + this.score + ' pts';
            }

            this.showListOfTexts([
                'wow, it\'s finished!',
                'let\'s see how you did...',
                scoreText
            ]);

            this.playButton.inputEnabled = true;
            this.playButton.alpha = this.gameTitle.alpha = 1;
            this.playButton.text = 'play again';
        }

        this.analyser = new WebAudioAnalyser(this.audio);
    }

    initSfx() {
        this.comboAudio = new Audio();
        this.comboAudio.src = 'medias/powerup.wav';

        this.pickupAudio = new Audio();
        this.pickupAudio.src = 'medias/pickup.wav';

        this.hitAudio = new Audio();
        this.hitAudio.src = 'medias/hit2.wav';
    }

    playNext() {
        this.currentSong++;
        if (this.currentSong >= this.songs.length) {
            this.currentSong = 0;
        }
        //this.audio.src = 'http://api.soundcloud.com/tracks/' + id + '/stream?client_id=6f6d2855cb215a00d36c9af48b5f2a39'; //'medias/chip2.ogg';
        this.audio.src = this.songs[this.currentSong];
    }

    initUi() {
        let center = { x: this.game.world.centerX, y: this.game.world.centerY + 30 }
        this.playButton = this.game.add.text(center.x, center.y, 'play', { font: "45px Lucida Console", fill: "#fff", align: "center" });
        this.playButton.anchor.x = 0.5;
        this.playButton.inputEnabled = true;
        this.playButton.events.onInputDown.add(() => {
            this.playButton.inputEnabled = false;
            this.playButton.alpha = this.gameTitle.alpha = 0;

            this.score = 0;
            this.streak = 0;
            this.ended = false;
            this.playing = true;

            if (!this.doneTutorial) {
                this.startTutorial();
            }
            this.playNext();
            this.startAudio();
            this.game.time.events.loop(15000, () => {
                if (!this.ended) {
                    this.showText('current score: ' + this.score + ' pts');
                }
            }, this);
        }, this);
    }

    initFps() {
        //this.fps = this.game.add.text(10, 10, '--', { font: "45px Lucida Console", fill: "#fff" });
    }

    initWaveForm() {
        this.waveform = new WaveForm(this.game, 0, 0, 16, this.analyser);
    }

    updateFps() {
        //this.fps.text = this.game.time.fps;
    }

    initShapeFactory() {
        this.shapeFactory = new ShapeFactory(this.game, this.analyser, 16, this.player);
    }

    initPlayer() {
        this.player = new Player(this.game, this.game.world.centerX, this.game.world.height - 20);
    }

    initAlertText() {
        this.alertText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, '', { font: "15px Lucida Console", fill: "#fff", align: 'center' });
        this.alertText.anchor.x = 0.5;
    }

    pauseGame() {
        this.game.paused = !this.game.paused;
        this.pauseText.alpha = this.gameTitle.alpha = this.game.paused ? 1 : 0;

        if (!this.audio.paused) {
            this.audio.pause();
        } else {
            this.audio.play();
        }
    }

    startTutorial() {
        this.showListOfTexts([
            '- welcome -',
            'left/right to move',
            'up to jump',
            'c to shapeshift',
            'try and grab shapes of your type',
            'ready?',
            'go!'
        ]);

        this.doneTutorial = true;
    }

    showText(text) {
        this.alertText.alpha = 1;
        this.alertText.position.x = this.game.world.centerX;
        let tween = this.game.add.tween(this.alertText).from({ x: this.game.world.width + 100 }, 500, Phaser.Easing.Bounce.Out, true);
        tween.onComplete.add(() => {
            let tweenOut = this.game.add.tween(this.alertText).to({ x: -200 }, 200, Phaser.Easing.None, true, 500);
            tweenOut.onComplete.add(() => {
                this.alertText.text = '';
            }, this);
        }, this);
        this.alertText.text = text;
    }

    showListOfTexts(texts) {
        let current = 0;

        let showText = () => {
            //wat?
            if (current >= texts.length) return;

            this.showText(texts[current]);

            current++;
        };

        showText();
        this.game.time.events.repeat(2000, texts.length, showText, this).timer.start();
    }

    stopAudio() {
        this.audio.pause();
        this.audio.crossOrigin = 'Anonymous';
        this.audio.currentTime = 0;
    }

    startAudio() {
        this.audio.play();
    }

    update() {
        this.game.physics.arcade.overlap(this.player, this.shapeFactory.shapes, this.killSameTypeShape, null, this);
        this.game.physics.arcade.collide(this.player, this.shapeFactory.shapes, this.collided, null, this);
        this.game.physics.arcade.collide(this.shapeFactory.shapes, this.shapeFactory.shapes);
    }

    killSameTypeShape(player, shape) {
        if (shape.shapeType == player._currentShape) {
            shape.kill();
            this.score++;
            this.streak++;

            if (this.streak == 3) {
                this.showText('3 hits combo');
                this.score += 3;
                this.comboAudio.play();
            } else if (this.streak == 6) {
                this.showText('6 in a row!')
                this.score += 3;
                this.comboAudio.play();
            } else {
                this.pickupAudio.play();
            }
        }
    }

    collided(player, shape) {
        if (shape.shapeType != player._currentShape) {
            if (this.streak > 6) {
                this.showText('c-c-c-combo break =(');
            }

            this.streak = 0;
            this.hitAudio.play();
        }
    }

    render() {
        this.waveform.render();
    }
}

export default GameState;
