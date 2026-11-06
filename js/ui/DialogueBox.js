/**
 * DialogueBox.js - Hộp thoại Quản Đốc Dispatch, Hỗ trợ Đa Ngôn Ngữ (EN/VI) & Rewarded Ad Hint v2.0
 */
window.SF = window.SF || {};

(function(SF) {
    class DialogueBox {
        constructor(containerEl, hintModalEl, cutsceneModalEl) {
            this.container = containerEl;
            this.hintModal = hintModalEl;
            this.cutsceneModal = cutsceneModalEl;

            this.currentDialogue = null;
            this.typewriterTimer = null;
            this.currentHintTier = 0;
            this.currentLevel = null;

            this.setupUI();
            if (SF.i18n) {
                SF.i18n.addListener(() => this.updateLocalizedUI());
            }
        }

        setupUI() {
            if (!this.container) return;
            const t = (k, p) => SF.t ? SF.t(k, p) : k;

            this.container.innerHTML = `
                <div class="foreman-avatar-box">
                    <div class="foreman-avatar" id="foremanAvatar">🤖</div>
                    <div class="dispatch-led-face" id="dispatchLedFace">:)</div>
                    <div class="foreman-status-led"></div>
                </div>
                <div class="dialogue-content">
                    <div class="dialogue-speaker" id="dialogueSpeaker">${t('SPEAKER_DISPATCH')}</div>
                    <div class="dialogue-text" id="dialogueText">Connecting warehouse telemetry...</div>
                </div>
                <div class="dialogue-actions">
                    <button class="btn btn-hint" id="btnHint">💡 Hint (<span id="hintCount">3</span>)</button>
                    <button class="btn btn-cat" id="btnCat" title="Glitch Cat">🐱</button>
                </div>
            `;

            document.getElementById('btnHint')?.addEventListener('click', () => this.showHintModal());
            document.getElementById('btnCat')?.addEventListener('click', () => this.triggerCatEasterEgg());

            this.updateLocalizedUI();
        }

        updateLocalizedUI() {
            const speaker = document.getElementById('dialogueSpeaker');
            if (speaker && SF.t) speaker.textContent = SF.t('SPEAKER_DISPATCH');

            const btnHint = document.getElementById('btnHint');
            if (btnHint && SF.t) {
                btnHint.innerHTML = SF.t('BTN_HINT', { n: `<span id="hintCount">${3 - this.currentHintTier}</span>` });
            }

            if (this.currentLevel) {
                this.setLevel(this.currentLevel);
            }
        }

        setMood(emoji) {
            const led = document.getElementById('dispatchLedFace');
            if (led) {
                led.textContent = emoji;
            }
        }

        say(text, isGlitch = false, mood = ':)') {
            const textEl = document.getElementById('dialogueText');
            const avatarEl = document.getElementById('foremanAvatar');
            this.setMood(mood);
            if (!textEl) return;

            if (this.typewriterTimer) {
                clearInterval(this.typewriterTimer);
            }

            if (isGlitch && avatarEl) {
                avatarEl.classList.add('glitch');
                setTimeout(() => avatarEl.classList.remove('glitch'), 1200);
            }

            let idx = 0;
            textEl.textContent = '';
            this.typewriterTimer = setInterval(() => {
                if (idx < text.length) {
                    textEl.textContent += text[idx];
                    idx++;
                } else {
                    clearInterval(this.typewriterTimer);
                    this.typewriterTimer = null;
                }
            }, 18);
        }

        setLevel(level) {
            this.currentLevel = level;
            const lang = SF.i18n ? SF.i18n.getLanguage() : 'en';

            let msg = '';
            if (lang === 'en') {
                msg = level.dialogue?.beforeEN || level.dialogue?.before || level.storyEN || level.story;
            } else {
                msg = level.dialogue?.before || level.story;
            }

            this.say(msg);
        }

        updateHintBadge() {
            const countEl = document.getElementById('hintCount');
            if (countEl) {
                countEl.textContent = 3 - this.currentHintTier;
            }
        }

        showHintModal() {
            if (!this.currentLevel || !this.currentLevel.dialogue) return;
            const lang = SF.i18n ? SF.i18n.getLanguage() : 'en';
            const t = (k, p) => SF.t ? SF.t(k, p) : k;

            // Song ngữ gợi ý
            const hints = [
                (lang === 'en' ? (this.currentLevel.dialogue.hint1EN || "Inspect the truth table of the processing stations.") : this.currentLevel.dialogue.hint1),
                (lang === 'en' ? (this.currentLevel.dialogue.hint2EN || "Route direct rails from input ports to the correct targets.") : this.currentLevel.dialogue.hint2),
                (lang === 'en' ? (this.currentLevel.dialogue.hint3EN || "Connect stations according to the logical graph topology.") : this.currentLevel.dialogue.hint3)
            ];

            if (!this.hintModal) return;
            this.hintModal.style.display = 'flex';
            this.renderHintModalBody(hints);
        }

        renderHintModalBody(hints) {
            const t = (k, p) => SF.t ? SF.t(k, p) : k;

            this.hintModal.innerHTML = `
                <div class="modal-box hint-box">
                    <div class="modal-header">
                        <h3>${t('HINT_TITLE', { n: this.currentHintTier })}</h3>
                        <button class="modal-close" id="btnCloseHint">✕</button>
                    </div>
                    <div class="modal-body">
                        <div class="hint-tier ${this.currentHintTier >= 1 ? 'revealed' : 'locked'}">
                            <strong>${t('HINT_TIER1_TITLE')}</strong>
                            <p>${this.currentHintTier >= 1 ? hints[0] : t('HINT_LOCKED')}</p>
                        </div>
                        <div class="hint-tier ${this.currentHintTier >= 2 ? 'revealed' : 'locked'}">
                            <strong>${t('HINT_TIER2_TITLE')}</strong>
                            <p>${this.currentHintTier >= 2 ? hints[1] : t('HINT_LOCKED')}</p>
                        </div>
                        <div class="hint-tier ${this.currentHintTier >= 3 ? 'revealed' : 'locked'}">
                            <strong>${t('HINT_TIER3_TITLE')}</strong>
                            <p>${this.currentHintTier >= 3 ? hints[2] : t('HINT_LOCKED')}</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        ${this.currentHintTier < 3 ? `
                            <button class="btn btn-primary" id="btnNextHint">
                                🎬 ${t('HINT_WATCH_AD')}
                            </button>
                        ` : ''}
                        <button class="btn btn-secondary" id="btnDismissHint">${t('BTN_DISMISS_HINT')}</button>
                    </div>
                </div>
            `;

            document.getElementById('btnCloseHint')?.addEventListener('click', () => this.hideHintModal());
            document.getElementById('btnDismissHint')?.addEventListener('click', () => this.hideHintModal());

            document.getElementById('btnNextHint')?.addEventListener('click', () => {
                // Tích hợp CrazyGames Rewarded Ad trước khi mở khóa gợi ý tiếp theo
                if (SF.crazyGames) {
                    SF.crazyGames.requestRewardedAd(() => {
                        if (this.currentHintTier < 3) {
                            this.currentHintTier++;
                            this.updateHintBadge();
                            SF.soundManager.playClick();
                            this.renderHintModalBody(hints);
                        }
                    }, () => {
                        // Fallback nếu chặn ad: vẫn mở cho người chơi
                        if (this.currentHintTier < 3) {
                            this.currentHintTier++;
                            this.updateHintBadge();
                            this.renderHintModalBody(hints);
                        }
                    });
                } else {
                    if (this.currentHintTier < 3) {
                        this.currentHintTier++;
                        this.updateHintBadge();
                        this.renderHintModalBody(hints);
                    }
                }
            });
        }

        hideHintModal() {
            if (this.hintModal) {
                this.hintModal.style.display = 'none';
            }
        }

        triggerCatEasterEgg() {
            const lang = SF.i18n ? SF.i18n.getLanguage() : 'en';
            const catQuotes = (lang === 'en') ? [
                "🐱 Glitch Cat: 'Meow... 01101101 01100101 01101111 (meow in binary).'",
                "🐱 Glitch Cat: 'Rails can cross each other freely without short-circuiting!'",
                "🐱 Glitch Cat: 'Collect 10 Glitch Tokens to reveal the Secret 41st Floor!'",
                "🐱 Glitch Cat: 'Dispatch was once a human engineer... Keep it a secret!'"
            ] : [
                "🐱 Mèo máy Glitch: 'Meo... 01101101 01100101 01101111 (meo trong nhị phân).'",
                "🐱 Mèo máy Glitch: 'Các đường ray có thể cắt chéo nhau tự do mà không làm nhiễu hàng!'",
                "🐱 Mèo máy Glitch: 'Thu thập đủ 10 Glitch Token để mở khóa Tầng 41 Bí Mật!'",
                "🐱 Mèo máy Glitch: 'Quản đốc Dispatch trước đây từng là một kỹ sư con người... đừng nói với ai nhé!'"
            ];

            const rand = catQuotes[Math.floor(Math.random() * catQuotes.length)];
            this.say(rand, true, 'o_O');
            SF.soundManager.playWireConnect();
        }

        showCutscene(cutscene, onFinish) {
            if (!this.cutsceneModal) return;
            this.cutsceneModal.style.display = 'flex';
            const lang = SF.i18n ? SF.i18n.getLanguage() : 'en';

            let lineIndex = 0;
            const renderSlide = () => {
                const line = cutscene.lines[lineIndex];
                const text = (lang === 'en' && line.textEN) ? line.textEN : line.text;

                this.cutsceneModal.innerHTML = `
                    <div class="modal-box cutscene-box">
                        <div class="cutscene-act-badge">STORY SEQUENCE - ACT ${cutscene.act}</div>
                        <h2 class="cutscene-title">${(lang === 'en' && cutscene.titleEN) ? cutscene.titleEN : cutscene.title}</h2>
                        <div class="cutscene-screen">
                            <div class="cutscene-speaker-tag">${line.speaker}</div>
                            <div class="cutscene-dialogue">${text}</div>
                        </div>
                        <div class="modal-footer">
                            <span class="slide-indicator">${lineIndex + 1} / ${cutscene.lines.length}</span>
                            <button class="btn btn-primary" id="btnCutsceneNext">
                                ${lineIndex < cutscene.lines.length - 1 ? 'Next ▶' : 'Enter Shift ⚡'}
                            </button>
                        </div>
                    </div>
                `;

                document.getElementById('btnCutsceneNext')?.addEventListener('click', () => {
                    SF.soundManager.playClick();
                    lineIndex++;
                    if (lineIndex < cutscene.lines.length) {
                        renderSlide();
                    } else {
                        this.cutsceneModal.style.display = 'none';
                        if (onFinish) onFinish();
                    }
                });
            };

            renderSlide();
        }
    }

    SF.DialogueBox = DialogueBox;
})(window.SF);
