// 8-bit audio engine using Web Audio API
class Audio8Bit {
    constructor() {
        this._ctx = null;
        this._musicNodes = [];
        this._musicPlaying = false;
        this._musicInterval = null;
        this._currentTrack = null;
        this._masterGain = null;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this._ctx = new AudioContext();
                this._masterGain = this._ctx.createGain();
                this._masterGain.gain.value = 0.3;
                this._masterGain.connect(this._ctx.destination);
            }
        } catch(e) {
            console.warn('Web Audio API not available:', e);
        }

        this.sfx = {
            jump: () => this._playSFX('jump'),
            meleeHit: () => this._playSFX('meleeHit'),
            rangedShoot: () => this._playSFX('rangedShoot'),
            enemyDie: () => this._playSFX('enemyDie'),
            playerHurt: () => this._playSFX('playerHurt'),
            levelUp: () => this._playSFX('levelUp'),
            potion: () => this._playSFX('potion'),
            bossRoar: () => this._playSFX('bossRoar')
        };
    }

    _resumeContext() {
        if (this._ctx && this._ctx.state === 'suspended') {
            this._ctx.resume();
        }
    }

    _playTone(freq, duration, type, startTime, gainVal, endFreq) {
        if (!this._ctx) return null;
        try {
            const osc = this._ctx.createOscillator();
            const gainNode = this._ctx.createGain();

            osc.type = type || 'square';
            osc.frequency.setValueAtTime(freq, startTime);
            if (endFreq !== undefined) {
                osc.frequency.linearRampToValueAtTime(endFreq, startTime + duration);
            }

            gainNode.gain.setValueAtTime(gainVal || 0.3, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

            osc.connect(gainNode);
            gainNode.connect(this._masterGain);

            osc.start(startTime);
            osc.stop(startTime + duration);
            return osc;
        } catch(e) {
            return null;
        }
    }

    _playSFX(name) {
        if (!this._ctx) return;
        this._resumeContext();
        const t = this._ctx.currentTime;

        try {
            switch(name) {
                case 'jump':
                    this._playTone(200, 0.08, 'square', t, 0.4, 400);
                    this._playTone(400, 0.08, 'square', t + 0.05, 0.3, 600);
                    break;

                case 'meleeHit':
                    this._playTone(80, 0.05, 'sawtooth', t, 0.5, 60);
                    this._playTone(120, 0.06, 'square', t, 0.3, 80);
                    break;

                case 'rangedShoot':
                    this._playTone(600, 0.06, 'square', t, 0.3, 900);
                    this._playTone(300, 0.04, 'square', t + 0.03, 0.2, 200);
                    break;

                case 'enemyDie':
                    this._playTone(300, 0.05, 'sawtooth', t, 0.4, 250);
                    this._playTone(250, 0.05, 'sawtooth', t + 0.04, 0.35, 180);
                    this._playTone(180, 0.08, 'sawtooth', t + 0.08, 0.3, 100);
                    break;

                case 'playerHurt':
                    this._playTone(100, 0.06, 'sawtooth', t, 0.5, 80);
                    this._playTone(80, 0.1, 'sawtooth', t + 0.05, 0.4, 50);
                    break;

                case 'levelUp':
                    this._playTone(300, 0.07, 'square', t, 0.4);
                    this._playTone(400, 0.07, 'square', t + 0.08, 0.4);
                    this._playTone(500, 0.07, 'square', t + 0.16, 0.4);
                    this._playTone(600, 0.07, 'square', t + 0.24, 0.4);
                    this._playTone(800, 0.15, 'square', t + 0.32, 0.5);
                    break;

                case 'potion':
                    this._playTone(600, 0.04, 'sine', t, 0.3, 800);
                    this._playTone(800, 0.04, 'sine', t + 0.05, 0.3, 1000);
                    this._playTone(1000, 0.04, 'sine', t + 0.1, 0.3, 1200);
                    this._playTone(1200, 0.06, 'sine', t + 0.15, 0.4, 1400);
                    break;

                case 'bossRoar':
                    this._playTone(60, 0.1, 'sawtooth', t, 0.6, 40);
                    this._playTone(80, 0.15, 'sawtooth', t + 0.05, 0.5, 50);
                    this._playTone(40, 0.2, 'sawtooth', t + 0.15, 0.7, 30);
                    this._playTone(100, 0.1, 'square', t + 0.2, 0.4, 60);
                    break;
            }
        } catch(e) {
            // Silent fail
        }
    }

    startMusic(track) {
        if (!this._ctx || this._musicPlaying) return;
        this._resumeContext();
        this._currentTrack = track;
        this._musicPlaying = true;
        this._playMusicLoop();
    }

    _playMusicLoop() {
        if (!this._musicPlaying || !this._ctx) return;

        try {
            const t = this._ctx.currentTime;
            // Stone age arpeggio - pentatonic scale
            const notes = [220, 261, 294, 349, 392, 440, 523, 392, 349, 294, 261, 220];
            const beatDur = 0.12;

            notes.forEach((freq, i) => {
                this._playTone(freq, beatDur * 0.8, 'square', t + i * beatDur, 0.08);
                if (i % 4 === 0) {
                    this._playTone(freq / 2, beatDur * 1.5, 'square', t + i * beatDur, 0.06);
                }
            });

            const loopDur = notes.length * beatDur * 1000;
            this._musicInterval = setTimeout(() => {
                if (this._musicPlaying) this._playMusicLoop();
            }, loopDur - 50);
        } catch(e) {
            this._musicPlaying = false;
        }
    }

    stopMusic() {
        this._musicPlaying = false;
        if (this._musicInterval) {
            clearTimeout(this._musicInterval);
            this._musicInterval = null;
        }
    }
}

const audio = new Audio8Bit();
