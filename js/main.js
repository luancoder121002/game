/**
 * main.js - Entry point, Game Loop & Orchestration của Signal Factory v2.0
 * Tích hợp CrazyGames SDK v3, Three.js 3D Diorama, và Hệ thống đa ngôn ngữ EN/VI
 */
window.SF = window.SF || {};

(function(SF) {
    class GameApp {
        constructor() {
            this.canvas = document.getElementById('boardCanvas');
            this.circuit = new SF.Circuit(14, 9, 60);
            this.simulator = new SF.Simulator(this.circuit);
            this.shipperAnimator = new SF.ShipperAnimator();
            this.renderer = new SF.BoardRenderer(this.canvas, this.circuit, this.shipperAnimator);
            this.threeRenderer = null;
            this.is3D = false;

            this.wireDrawer = null;
            this.dragDrop = null;
            this.dialogueBox = null;
            this.hud = null;
            this.choiceModal = null;
            this.touchHandler = null;

            this.currentLevelIndex = 0;
            this.lastTime = 0;

            this.init();
        }

        init() {
            // Khởi tạo ThreeRenderer cho chế độ 3D Isometric Diorama
            const boardContainer = document.querySelector('.board-container');
            if (typeof SF.ThreeRenderer === 'function' && boardContainer) {
                try {
                    this.threeRenderer = new SF.ThreeRenderer(boardContainer, this.circuit, this.simulator);
                } catch (e) {
                    console.warn('[GameApp] Lỗi khởi tạo ThreeRenderer (fallback về 2D):', e);
                    this.threeRenderer = null;
                }
            }

            this.setupCanvasSize();
            window.addEventListener('resize', () => {
                this.setupCanvasSize();
                if (SF.responsiveLayout) SF.responsiveLayout.updateLayout();
            });

            // Khởi tạo các hệ thống con
            this.wireDrawer = new SF.WireDrawer(this.canvas, this.circuit, this.renderer);
            this.touchHandler = new SF.TouchInputHandler(this.canvas, this.circuit, this.renderer, this.wireDrawer);

            this.dragDrop = new SF.DragDrop(
                this.canvas,
                this.circuit,
                this.renderer,
                document.getElementById('componentTray')
            );

            this.dialogueBox = new SF.DialogueBox(
                document.getElementById('dialogueContainer'),
                document.getElementById('hintModal'),
                document.getElementById('cutsceneModal')
            );

            this.choiceModal = new SF.ChoiceModal(document.getElementById('choiceModal'));

            this.hud = new SF.HUD({
                btnRun: document.getElementById('btnRun'),
                btnStep: document.getElementById('btnStep'),
                btnReset: document.getElementById('btnReset'),
                selectSpeed: document.getElementById('selectSpeed'),
                btnAudio: document.getElementById('btnAudio'),
                btnLevels: document.getElementById('btnLevels'),
                btnToggle3D: document.getElementById('btnToggle3D'),
                btnLang: document.getElementById('btnLang'),
                levelTitle: document.getElementById('levelTitle'),
                actBadge: document.getElementById('actBadge'),
                speedGoalEl: document.getElementById('speedGoal'),
                sizeGoalEl: document.getElementById('sizeGoal'),
                inputQueueContainer: document.getElementById('inputQueueStream'),
                outputQueueContainer: document.getElementById('outputQueueStream'),
                winModal: document.getElementById('winModal'),
                levelSelectModal: document.getElementById('levelSelectModal')
            }, this.simulator, this.circuit);

            // Hook chuyển đổi giữa 2D Canvas và 3D WebGL Diorama
            this.hud.onToggle3D = (is3D) => {
                this.is3D = is3D;
                if (this.is3D) {
                    this.canvas.style.display = 'none';
                    if (this.threeRenderer) {
                        this.threeRenderer.setActive(true);
                    }
                } else {
                    this.canvas.style.display = 'block';
                    if (this.threeRenderer) {
                        this.threeRenderer.setActive(false);
                    }
                }
            };

            // Hook callback từ Simulator
            this.simulator.onTick = (tick, state, verifyResult) => {
                this.hud.updateQueues();
                if (verifyResult && verifyResult.hasNewOutput) {
                    SF.soundManager.playSignalPulse();
                }
            };

            this.simulator.onStateChange = (state) => {
                this.hud.updateButtonStates(state);
                if (state === 'FAILED') {
                    this.dialogueBox.setMood(':(');
                } else if (state === 'RUNNING') {
                    this.dialogueBox.setMood(':)');
                }
            };

            this.simulator.onShipperEvent = (evt) => {
                this.shipperAnimator.handleEvent(evt);
            };

            this.simulator.onComplete = (score) => {
                const currentLvl = SF.LEVELS[this.currentLevelIndex];
                this.dialogueBox.setMood('^^');

                // Báo hiệu CrazyGames SDK
                if (SF.crazyGames) {
                    SF.crazyGames.gameplayStop();
                    SF.crazyGames.happytime();
                }

                this.hud.showWinModal(score, () => {
                    // Kích hoạt Store / CrazyGames Midroll Ad an toàn qua MonetizationManager
                    if (SF.monetization) {
                        SF.monetization.requestMidrollAd(() => {
                            this.handleLevelAdvancement(currentLvl.levelId);
                        });
                    } else {
                        this.handleLevelAdvancement(currentLvl.levelId);
                    }
                }, () => {
                    this.loadLevel(this.currentLevelIndex);
                });
            };

            this.simulator.onFail = (err) => {
                this.dialogueBox.setMood('>:(');
                if (SF.crazyGames) {
                    SF.crazyGames.gameplayStop();
                }
                this.hud.showFailModal(err, () => {
                    this.simulator.reset();
                    this.hud.updateQueues();
                });
            };

            // Phím tắt bàn phím
            window.addEventListener('keydown', (e) => {
                if (e.key === 'Delete' || e.key === 'Backspace') {
                    const selected = this.circuit.components.find(c => c.selected && !c.isPort);
                    if (selected) {
                        this.circuit.removeComponent(selected);
                        SF.soundManager.playDelete();
                    }
                } else if (e.code === 'Space') {
                    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
                    if (activeTag !== 'input' && activeTag !== 'select' && activeTag !== 'textarea') {
                        e.preventDefault();
                        if (this.simulator.state === 'RUNNING') {
                            this.simulator.pause();
                            if (SF.crazyGames) SF.crazyGames.gameplayStop();
                        } else {
                            this.simulator.start();
                            if (SF.crazyGames) SF.crazyGames.gameplayStart();
                        }
                    }
                } else if (e.key === 'h' || e.key === 'H') {
                    this.dialogueBox.showHintModal();
                } else if (e.key >= '1' && e.key <= '5') {
                    const spds = [0.25, 0.5, 1.0, 2.0, 4.0];
                    const spd = spds[parseInt(e.key, 10) - 1];
                    this.simulator.setSpeed(spd);
                    const sel = document.getElementById('selectSpeed');
                    if (sel) sel.value = String(spd);
                }
            });

            // Chọn level từ modal
            this.hud.onSelectLevel = (lvlId) => {
                const idx = SF.LEVELS.findIndex(l => l.levelId === lvlId);
                if (idx !== -1) {
                    this.loadLevel(idx);
                }
            };

            // Tải level lưu trữ (Bảo mật qua SecureStorage)
            const rawSaved = SF.storage ? SF.storage.getItem('sf_current_level_idx') : localStorage.getItem('sf_current_level_idx');
            const savedLvl = parseInt(rawSaved, 10);
            const startIdx = (!isNaN(savedLvl) && savedLvl >= 0 && savedLvl < SF.LEVELS.length) ? savedLvl : 0;
            this.loadLevel(startIdx);

            // Xử lý gián đoạn App Lifecycle (Cuộc gọi đến / Chuyển tab / Màn hình khóa)
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    if (this.simulator && this.simulator.state === 'RUNNING') {
                        this.simulator.pause();
                        if (SF.crazyGames) SF.crazyGames.gameplayStop();
                    }
                }
            });

            // Cập nhật responsive
            if (SF.responsiveLayout) SF.responsiveLayout.updateLayout();

            // Khởi động loop
            requestAnimationFrame((time) => this.loop(time));
        }

        setupCanvasSize() {
            const container = this.canvas.parentElement;
            if (!container) return;
            const w = container.clientWidth || 900;
            const h = container.clientHeight || 560;

            this.canvas.width = w;
            this.canvas.height = h;

            this.circuit.width = w;
            this.circuit.height = h;

            if (this.threeRenderer) {
                this.threeRenderer.resize();
            }

            if (this.currentLevelIndex !== undefined && SF.LEVELS[this.currentLevelIndex]) {
                const lvl = SF.LEVELS[this.currentLevelIndex];
                this.repositionPorts(lvl);
            }
        }

        repositionPorts(level) {
            const inputNames = Object.keys(level.inputs || {});
            const outputNames = Object.keys(level.expectedOutputs || {});
            const totalH = this.canvas.height;
            const totalW = this.canvas.width;

            const inCount = inputNames.length;
            this.circuit.inputPorts.forEach((port, idx) => {
                const spacing = totalH / (inCount + 1);
                port.x = 24;
                port.y = spacing * (idx + 1) - port.height / 2;
                port.updatePinPositions();
            });

            const outCount = outputNames.length;
            this.circuit.outputPorts.forEach((port, idx) => {
                const spacing = totalH / (outCount + 1);
                port.x = totalW - port.width - 24;
                port.y = spacing * (idx + 1) - port.height / 2;
                port.updatePinPositions();
            });
        }

        loadLevel(index) {
            if (index < 0 || index >= SF.LEVELS.length) return;
            this.currentLevelIndex = index;
            if (SF.storage) {
                SF.storage.setItem('sf_current_level_idx', index);
            } else {
                localStorage.setItem('sf_current_level_idx', index);
            }

            const level = SF.LEVELS[index];

            this.circuit.setupLevelPorts(level);
            this.repositionPorts(level);

            this.simulator.loadLevel(level);
            this.hud.setLevel(level);
            this.dragDrop.updateTray(level.availableComponents);
            this.dialogueBox.setLevel(level);

            if (this.threeRenderer) {
                try {
                    if (typeof this.threeRenderer.clearLevel3D === 'function') {
                        this.threeRenderer.clearLevel3D();
                    }
                    if (typeof this.threeRenderer.resetCamera === 'function') {
                        this.threeRenderer.resetCamera();
                    }
                } catch (e) {
                    console.warn('[GameApp] Lỗi clearLevel3D:', e);
                }
            }

            if (SF.crazyGames) {
                SF.crazyGames.gameplayStart();
            }

            SF.soundManager.startBGM(level.act);
        }

        async handleLevelAdvancement(completedLevelId) {
            // 1. Kiểm tra Choice Point (Phân nhánh)
            const choicePoint = SF.CHOICE_POINTS ? SF.CHOICE_POINTS.find(c => c.afterLevel === completedLevelId) : null;
            if (choicePoint) {
                this.choiceModal.show(choicePoint, (option) => {
                    this.checkCutsceneThenProceed(completedLevelId);
                });
                return;
            }

            // 2. Kiểm tra Ending tại Level 40
            if (completedLevelId === 40) {
                const ending = SF.EndingResolver.resolve(SF.storyManager.state, this.hud.completedLevels);
                if (SF.dialog) {
                    await SF.dialog.alert(`🎉 ${ending.name}\n\n${ending.summary}`, 'KẾT THÚC CỐT TRUYỆN');
                } else {
                    alert(`🎉 ${ending.name}\n\n${ending.summary}`);
                }
                if (ending.unlocksLevel41) {
                    this.loadLevel(40); // Level 41 (index 40)
                    return;
                }
            }

            this.checkCutsceneThenProceed(completedLevelId);
        }

        checkCutsceneThenProceed(completedLevelId) {
            const cutscene = SF.CUTSCENES.find(c => c.afterLevel === completedLevelId);
            if (cutscene) {
                this.dialogueBox.showCutscene(cutscene, () => {
                    this.proceedToNextLevel();
                });
            } else {
                this.proceedToNextLevel();
            }
        }

        async proceedToNextLevel() {
            if (this.currentLevelIndex < SF.LEVELS.length - 1) {
                this.loadLevel(this.currentLevelIndex + 1);
            } else {
                const t = (k) => SF.t ? SF.t(k) : k;
                if (SF.dialog) {
                    await SF.dialog.alert('CHÚC MỪNG BẠN ĐÃ HOÀN THÀNH TẤT CẢ CÁC TẦNG CỦA SIGNAL FACTORY V2.0!', 'CHIẾN THẮNG TUYỆT ĐỐI');
                } else {
                    alert('CHÚC MỪNG BẠN ĐÃ HOÀN THÀNH TẤT CẢ CÁC TẦNG CỦA SIGNAL FACTORY V2.0!');
                }
            }
        }

        loop(currentTime) {
            const dt = (this.lastTime === 0) ? 0.016 : Math.min(0.1, (currentTime - this.lastTime) / 1000);
            this.lastTime = currentTime;

            try {
                if (this.is3D && this.threeRenderer && this.threeRenderer.active) {
                    this.threeRenderer.render(dt);
                } else {
                    this.renderer.render(dt);
                }
            } catch (err) {
                console.error('[GameApp] Lỗi render loop:', err);
                if (this.is3D) {
                    this.is3D = false;
                    this.canvas.style.display = 'block';
                    if (this.threeRenderer) this.threeRenderer.setActive(false);
                }
                this.renderer.render(dt);
            }

            requestAnimationFrame((time) => this.loop(time));
        }
    }

    window.addEventListener('DOMContentLoaded', () => {
        window.game = new GameApp();
    });
})(window.SF);
