/**
 * HUD.js - Quản lý thanh điều khiển trên đỉnh (TopBar), hàng đợi Input/Output,
 * Modal Chiến Thắng/Thất Bại, Chuyển Đổi 3D/2D, và Tích Hợp CrazyGames SDK v2.0
 */
window.SF = window.SF || {};

(function(SF) {
    class HUD {
        constructor(domElements, simulator, circuit) {
            this.dom = domElements;
            this.simulator = simulator;
            this.circuit = circuit;

            this.currentLevel = null;
            this.onSelectLevel = null;
            this.onToggle3D = null;
            this.is3D = false;

            this.completedLevels = SF.storage ? SF.storage.getItem('sf_completed_levels', {}) : {};

            this.setupTopBarEvents();

            if (SF.i18n) {
                SF.i18n.addListener(() => this.updateLocalizedText());
            }
            this.updateLocalizedText();
        }

        setupTopBarEvents() {
            // Nút GO / Tạm dừng (CrazyGames SDK gameplayStart / gameplayStop)
            this.dom.btnRun?.addEventListener('click', () => {
                SF.soundManager.ensureResumed();
                if (this.simulator.state === 'RUNNING') {
                    this.simulator.pause();
                    if (SF.crazyGames) SF.crazyGames.gameplayStop();
                } else {
                    this.simulator.start();
                    if (SF.crazyGames) SF.crazyGames.gameplayStart();
                }
                SF.soundManager.playClick();
            });

            // Nút Step
            this.dom.btnStep?.addEventListener('click', () => {
                SF.soundManager.ensureResumed();
                this.simulator.step();
                SF.soundManager.playClick();
            });

            // Nút Reset
            this.dom.btnReset?.addEventListener('click', () => {
                this.simulator.reset();
                if (SF.crazyGames) SF.crazyGames.gameplayStop();
                this.updateQueues();
                SF.soundManager.playClick();
            });

            // Nút Tốc độ (Speed)
            this.dom.selectSpeed?.addEventListener('change', (e) => {
                const spd = parseFloat(e.target.value) || 1.0;
                this.simulator.setSpeed(spd);
            });

            // Nút Âm thanh (Audio Mute)
            this.dom.btnAudio?.addEventListener('click', () => {
                SF.soundManager.ensureResumed();
                const muted = SF.soundManager.toggleMute();
                if (this.dom.btnAudio) {
                    this.dom.btnAudio.textContent = muted ? SF.t('BTN_AUDIO_OFF') : SF.t('BTN_AUDIO_ON');
                }
            });

            // Nút Danh Sách Level (Level Select Modal)
            this.dom.btnLevels?.addEventListener('click', () => {
                this.showLevelSelectModal(this.onSelectLevel);
            });

            // Nút Chuyển Đổi 3D / 2D
            this.dom.btnToggle3D?.addEventListener('click', () => {
                this.is3D = !this.is3D;
                if (this.onToggle3D) {
                    this.onToggle3D(this.is3D);
                }
                this.updateViewModeButton();
                SF.soundManager.playClick();
            });

            // Nút Chuyển Đổi Ngôn Ngữ EN / VI
            this.dom.btnLang?.addEventListener('click', () => {
                if (SF.i18n) {
                    SF.i18n.toggleLanguage();
                    SF.soundManager.playClick();
                }
            });
        }

        updateViewModeButton() {
            if (this.dom.btnToggle3D) {
                this.dom.btnToggle3D.textContent = this.is3D ? SF.t('VIEW_2D') : SF.t('VIEW_3D');
            }
        }

        updateLocalizedText() {
            const t = (k, p) => SF.t ? SF.t(k, p) : k;

            if (this.dom.btnLevels) this.dom.btnLevels.textContent = t('SELECT_LEVEL');
            if (this.dom.btnAudio) {
                const muted = SF.soundManager ? SF.soundManager.muted : false;
                this.dom.btnAudio.textContent = muted ? t('BTN_AUDIO_OFF') : t('BTN_AUDIO_ON');
            }
            if (this.dom.btnLang) {
                this.dom.btnLang.textContent = SF.i18n.getLanguage() === 'en' ? '🌐 English' : '🌐 Tiếng Việt';
            }
            this.updateViewModeButton();

            // Cập nhật nhãn Tray và Speed
            const trayLabel = document.getElementById('trayLabel');
            if (trayLabel) trayLabel.textContent = t('TRAY_LABEL');

            const speedLabel = document.querySelector('.speed-control label');
            if (speedLabel) speedLabel.textContent = t('SPEED_LABEL');

            if (this.currentLevel) {
                this.setLevel(this.currentLevel);
            }
        }

        setLevel(level) {
            this.currentLevel = level;
            const lang = SF.i18n ? SF.i18n.getLanguage() : 'en';
            const t = (k, p) => SF.t ? SF.t(k, p) : k;

            const title = (lang === 'en' && level.titleEN) ? level.titleEN : level.title;
            if (this.dom.levelTitle) {
                this.dom.levelTitle.textContent = `${t('LEVEL_PREFIX')} ${level.levelId}: "${title}"`;
            }
            if (this.dom.actBadge) {
                this.dom.actBadge.textContent = level.isSecret ? t('SECRET_TAG') : `ACT ${level.act}`;
            }

            // Điểm Reputation HUD
            const rep = SF.storyManager ? SF.storyManager.getReputation() : { empathy: 0, efficiency: 0, glitchTokens: 0 };
            const repEl = document.getElementById('reputationHud');
            if (repEl) {
                repEl.innerHTML = `<span title="Empathy">🔵 ${rep.empathy}</span> | <span title="Efficiency">🔴 ${rep.efficiency}</span> | <span title="Glitch Tokens">🐱 ${rep.glitchTokens}/10</span>`;
            }

            // Mục tiêu Speed và Size
            const challenges = level.challenges || {};
            if (this.dom.speedGoalEl) {
                this.dom.speedGoalEl.textContent = t('SPEED_GOAL', { n: challenges.speedGoal || '?' });
            }
            if (this.dom.sizeGoalEl) {
                this.dom.sizeGoalEl.textContent = t('SIZE_GOAL', { n: challenges.sizeGoal || '?' });
            }

            this.updateQueues();
            this.updateButtonStates('STOPPED');
        }

        updateButtonStates(state) {
            if (!this.dom.btnRun) return;
            const t = (k, p) => SF.t ? SF.t(k, p) : k;
            if (state === 'RUNNING') {
                this.dom.btnRun.innerHTML = t('BTN_PAUSE');
                this.dom.btnRun.classList.add('running');
            } else {
                this.dom.btnRun.innerHTML = t('BTN_GO');
                this.dom.btnRun.classList.remove('running');
            }
        }

        updateQueues() {
            if (!this.currentLevel) return;
            const t = (k, p) => SF.t ? SF.t(k, p) : k;

            // Render Input Queue (bên trái / trên mobile)
            if (this.dom.inputQueueContainer) {
                let html = `<div class="queue-header">${t('INPUT_STREAM')}</div>`;
                const inputs = this.currentLevel.inputs || {};

                for (const port of Object.keys(inputs)) {
                    const queue = inputs[port] || [];
                    const ptr = this.simulator.inputPointers[port] || 0;

                    html += `<div class="queue-port-group">
                        <div class="port-label">${t('PORT_IN')} [${port}]</div>
                        <div class="packet-stream">`;

                    queue.forEach((val, idx) => {
                        const statusClass = (idx < ptr) ? 'dispatched' : (idx === ptr ? 'active' : 'pending');
                        const displayVal = (val === null || val === undefined) ? '∅' : val;
                        html += `<span class="packet-badge ${statusClass}">[${displayVal}]</span>`;
                    });

                    html += `</div></div>`;
                }
                this.dom.inputQueueContainer.innerHTML = html;
            }

            // Render Output Queue (bên phải / dưới mobile)
            if (this.dom.outputQueueContainer) {
                let html = `<div class="queue-header">${t('EXPECTED_OUTPUT')}</div>`;
                const expected = this.currentLevel.expectedOutputs || {};
                const actual = this.simulator.actualOutputs || {};

                for (const port of Object.keys(expected)) {
                    const expList = expected[port] || [];
                    const actList = actual[port] || [];

                    html += `<div class="queue-port-group">
                        <div class="port-label">${t('PORT_OUT')} [${port}]</div>
                        <div class="packet-stream">`;

                    expList.forEach((expVal, idx) => {
                        const actVal = actList[idx];
                        let statusClass = 'pending';
                        let display = `[${expVal}]`;

                        if (actVal !== undefined) {
                            if (Number(actVal) === Number(expVal)) {
                                statusClass = 'matched';
                                display = `[${actVal}] ✓`;
                            } else {
                                statusClass = 'mismatched';
                                display = `[${actVal}≠${expVal}] ✗`;
                            }
                        }

                        html += `<span class="packet-badge ${statusClass}">${display}</span>`;
                    });

                    html += `</div></div>`;
                }
                this.dom.outputQueueContainer.innerHTML = html;
            }
        }

        showWinModal(score, onNextLevel, onReplay) {
            SF.soundManager.playWin();

            // CrazyGames SDK: Gameplay stop & Happytime celebration
            if (SF.crazyGames) {
                SF.crazyGames.gameplayStop();
                SF.crazyGames.happytime();
            }

            const t = (k, p) => SF.t ? SF.t(k, p) : k;
            const lang = SF.i18n ? SF.i18n.getLanguage() : 'en';

            const lvlId = this.currentLevel.levelId;
            const prev = this.completedLevels[lvlId] || { passed: false, speedStar: false, sizeStar: false };
            this.completedLevels[lvlId] = {
                passed: true,
                speedStar: prev.speedStar || score.speedStar,
                sizeStar: prev.sizeStar || score.sizeStar
            };
            if (SF.storage) {
                SF.storage.setItem('sf_completed_levels', this.completedLevels);
            } else {
                localStorage.setItem('sf_completed_levels', JSON.stringify(this.completedLevels));
            }

            const title = (lang === 'en' && this.currentLevel.titleEN) ? this.currentLevel.titleEN : this.currentLevel.title;

            if (!this.dom.winModal) return;
            this.dom.winModal.style.display = 'flex';
            this.dom.winModal.innerHTML = `
                <div class="modal-box win-box">
                    <div class="win-header">
                        <div class="worker-celebrate">🧑‍🔧🎉</div>
                        <h2>${t('WIN_TITLE')}</h2>
                        <div class="level-sub">${title} (${t('LEVEL_PREFIX')} ${lvlId})</div>
                    </div>

                    <div class="star-rating">
                        <div class="star-item earned">
                            <div class="star-icon">⭐</div>
                            <div class="star-label">${t('STAR_PASS')}</div>
                        </div>
                        <div class="star-item ${score.speedStar ? 'earned' : 'missed'}">
                            <div class="star-icon">⚡</div>
                            <div class="star-label">${t('STAR_SPEED', { curr: score.ticks, goal: score.speedGoal })}</div>
                        </div>
                        <div class="star-item ${score.sizeStar ? 'earned' : 'missed'}">
                            <div class="star-icon">🔧</div>
                            <div class="star-label">${t('STAR_SIZE', { curr: score.components, goal: score.sizeGoal })}</div>
                        </div>
                    </div>

                    <div class="win-stats">
                        <div class="stat-row">
                            <span>${t('STAT_TICKS')}</span>
                            <strong>${score.ticks} / ${t('SPEED_GOAL', { n: score.speedGoal })}</strong>
                        </div>
                        <div class="stat-row">
                            <span>${t('STAT_STATIONS')}</span>
                            <strong>${score.components} / ${t('SIZE_GOAL', { n: score.sizeGoal })}</strong>
                        </div>
                        <div class="stat-row">
                            <span>${t('STAT_RAILS')}</span>
                            <strong>${score.wires}</strong>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button class="btn btn-secondary" id="btnReplayWin">${t('BTN_REPLAY')}</button>
                        ${lvlId < 40 ? `<button class="btn btn-primary" id="btnNextLevel">${t('BTN_NEXT_LEVEL')}</button>` : `<button class="btn btn-primary" id="btnNextLevel">${t('BTN_VIEW_ENDING')}</button>`}
                    </div>
                </div>
            `;

            document.getElementById('btnReplayWin')?.addEventListener('click', () => {
                this.dom.winModal.style.display = 'none';
                if (onReplay) onReplay();
            });

            document.getElementById('btnNextLevel')?.addEventListener('click', () => {
                this.dom.winModal.style.display = 'none';
                if (onNextLevel) onNextLevel();
            });
        }

        showFailModal(err, onRetry) {
            SF.soundManager.playFail();
            if (SF.crazyGames) SF.crazyGames.gameplayStop();

            const t = (k, p) => SF.t ? SF.t(k, p) : k;

            if (!this.dom.winModal) return;
            this.dom.winModal.style.display = 'flex';
            this.dom.winModal.innerHTML = `
                <div class="modal-box fail-box">
                    <div class="fail-header">
                        <div class="worker-fail">🤖⚠️</div>
                        <h2>${t('FAIL_TITLE')}</h2>
                    </div>
                    <div class="fail-reason">
                        <p>${err.reason || 'Package routing mismatch. Check connections.'}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" id="btnRetry">${t('BTN_RETRY')}</button>
                    </div>
                </div>
            `;

            document.getElementById('btnRetry')?.addEventListener('click', () => {
                this.dom.winModal.style.display = 'none';
                if (onRetry) onRetry();
            });
        }

        showLevelSelectModal(onSelectLevel) {
            if (!this.dom.levelSelectModal) return;
            this.dom.levelSelectModal.style.display = 'flex';
            const t = (k, p) => SF.t ? SF.t(k, p) : k;
            const lang = SF.i18n ? SF.i18n.getLanguage() : 'en';

            let gridHtml = '';
            SF.LEVELS.forEach(lvl => {
                const rec = this.completedLevels[lvl.levelId] || {};
                const passed = rec.passed;
                const stars = (passed ? '⭐' : '') + (rec.speedStar ? '⚡' : '') + (rec.sizeStar ? '🔧' : '');
                const title = (lang === 'en' && lvl.titleEN) ? lvl.titleEN : lvl.title;

                gridHtml += `
                    <div class="level-card ${passed ? 'cleared' : ''} ${lvl.levelId === this.currentLevel.levelId ? 'current' : ''}" data-id="${lvl.levelId}">
                        <div class="lvl-act">${lvl.isSecret ? t('SECRET_TAG') : `Act ${lvl.act}`}</div>
                        <div class="lvl-num">${lvl.levelId}</div>
                        <div class="lvl-name">${title}</div>
                        <div class="lvl-stars">${stars || '—'}</div>
                    </div>
                `;
            });

            this.dom.levelSelectModal.innerHTML = `
                <div class="modal-box level-select-box">
                    <div class="modal-header">
                        <h3>${t('LEVEL_SELECT_TITLE')}</h3>
                        <button class="modal-close" id="btnCloseLevelSelect">✕</button>
                    </div>
                    <div class="level-grid-scroll">
                        ${gridHtml}
                    </div>
                </div>
            `;

            document.getElementById('btnCloseLevelSelect')?.addEventListener('click', () => {
                this.dom.levelSelectModal.style.display = 'none';
            });

            this.dom.levelSelectModal.querySelectorAll('.level-card').forEach(card => {
                card.addEventListener('click', () => {
                    const id = parseInt(card.dataset.id, 10);
                    this.dom.levelSelectModal.style.display = 'none';
                    if (onSelectLevel) onSelectLevel(id);
                });
            });
        }
    }

    SF.HUD = HUD;
})(window.SF);
