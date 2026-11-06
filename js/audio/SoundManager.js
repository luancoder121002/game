/**
 * SoundManager.js - Hệ thống âm thanh procedural & synthesizer với Web Audio API
 * Tự động tạo SFX cơ khí, bzzt điện, ding chiến thắng, buzz lỗi và Lo-fi BGM không cần file âm thanh ngoài!
 */
window.SF = window.SF || {};

(function(SF) {
    class SoundManager {
        constructor() {
            this.ctx = null;
            this.muted = false;
            this.bgmMuted = false;
            this.volume = 0.6;
            this.bgmVolume = 0.25;
            this.bgmInterval = null;
            this.currentAct = 1;
            this.wasPlayingBGM = false;

            this.initAudioContext();
            this.setupVisibilityListener();
        }

        setupVisibilityListener() {
            // CrazyGames Compliance: Tự động ngắt âm thanh khi rời tab hoặc thu nhỏ trình duyệt
            const handleHidden = () => {
                if (document.hidden) {
                    this.wasPlayingBGM = (this.bgmInterval !== null && !this.muted);
                    this.stopBGM();
                    if (this.ctx && this.ctx.state === 'running') {
                        try { this.ctx.suspend(); } catch (e) {}
                    }
                } else {
                    if (this.ctx && this.ctx.state === 'suspended') {
                        try { this.ctx.resume(); } catch (e) {}
                    }
                    if (this.wasPlayingBGM && !this.muted && !this.bgmMuted) {
                        this.startBGM(this.currentAct);
                    }
                }
            };

            document.addEventListener('visibilitychange', handleHidden);
            window.addEventListener('blur', () => {
                if (document.hidden) handleHidden();
            });
            window.addEventListener('focus', () => {
                if (!document.hidden) handleHidden();
            });
        }

        initAudioContext() {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    this.ctx = new AudioContext();
                }
            } catch (e) {
                console.warn('Web Audio API không được hỗ trợ:', e);
            }
        }

        ensureResumed() {
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        toggleMute() {
            this.muted = !this.muted;
            if (this.muted && this.bgmInterval) {
                this.stopBGM();
            } else if (!this.muted && !this.bgmInterval) {
                this.startBGM(this.currentAct);
            }
            return this.muted;
        }

        // SFX: Click cơ khí khi đặt linh kiện
        playClick() {
            if (this.muted || !this.ctx) return;
            this.ensureResumed();

            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, t);
            osc.frequency.exponentialRampToValueAtTime(120, t + 0.04);

            gain.gain.setValueAtTime(0.15 * this.volume, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.05);
        }

        // SFX: Bzzt điện khi nối dây
        playWireConnect() {
            if (this.muted || !this.ctx) return;
            this.ensureResumed();

            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(420, t);
            osc.frequency.linearRampToValueAtTime(880, t + 0.06);

            gain.gain.setValueAtTime(0.12 * this.volume, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.09);
        }

        // SFX: Gói tin di chuyển (whoosh nhẹ)
        playSignalPulse() {
            if (this.muted || !this.ctx) return;
            this.ensureResumed();

            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(320, t);
            osc.frequency.exponentialRampToValueAtTime(640, t + 0.06);

            gain.gain.setValueAtTime(0.08 * this.volume, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.08);
        }

        // SFX: Ding Ding Ding khi chiến thắng level
        playWin() {
            if (this.muted || !this.ctx) return;
            this.ensureResumed();

            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, idx) => {
                const t = this.ctx.currentTime + idx * 0.12;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, t);

                gain.gain.setValueAtTime(0.25 * this.volume, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(t);
                osc.stop(t + 0.4);
            });
        }

        // SFX: Buzz báo lỗi / thất bại
        playFail() {
            if (this.muted || !this.ctx) return;
            this.ensureResumed();

            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(140, t);
            osc.frequency.linearRampToValueAtTime(80, t + 0.3);

            gain.gain.setValueAtTime(0.2 * this.volume, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.36);
        }

        // SFX: Xóa linh kiện hoặc dây
        playDelete() {
            if (this.muted || !this.ctx) return;
            this.ensureResumed();

            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(280, t);
            osc.frequency.exponentialRampToValueAtTime(90, t + 0.08);

            gain.gain.setValueAtTime(0.12 * this.volume, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.1);
        }

        // Procedural Lo-fi Ambient BGM Loop
        startBGM(act = 1) {
            this.currentAct = act;
            if (this.muted || this.bgmMuted || !this.ctx) return;
            this.ensureResumed();
            this.stopBGM();

            // Nhạc nền thay đổi tâm trạng theo Act như GDD yêu cầu
            let scales = [261.63, 293.66, 329.63, 392.00, 440.00]; // Pentatonic Act 1
            let tempo = 500;

            if (act === 2) {
                scales = [220.00, 261.63, 293.66, 329.63, 392.00]; // Deeper
                tempo = 600;
            } else if (act === 3) {
                scales = [196.00, 220.00, 246.94, 293.66, 349.23]; // Dystopian
                tempo = 700;
            } else if (act === 4) {
                scales = [174.61, 220.00, 261.63, 329.63, 440.00]; // Mystery
                tempo = 550;
            }

            let step = 0;
            this.bgmInterval = setInterval(() => {
                if (this.muted || this.bgmMuted || !this.ctx) return;
                const freq = scales[step % scales.length];
                step++;

                const t = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = (act >= 3) ? 'sine' : 'triangle';
                osc.frequency.setValueAtTime(freq, t);

                gain.gain.setValueAtTime(0.03 * this.bgmVolume, t);
                gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(t);
                osc.stop(t + 0.5);
            }, tempo);
        }

        stopBGM() {
            if (this.bgmInterval) {
                clearInterval(this.bgmInterval);
                this.bgmInterval = null;
            }
        }
    }

    SF.soundManager = new SoundManager();
})(window.SF);
