/**
 * TouchInputHandler.js - Xử lý cảm ứng chạm (Touch) cho Mobile & Tablet v2.0
 * Hỗ trợ: 2-tap nối ray (tap chân 1 rồi tap chân 2), long-press xóa, tap target >= 44px
 */
window.SF = window.SF || {};

(function(SF) {
    class TouchInputHandler {
        constructor(canvas, circuit, renderer, wireDrawer) {
            this.canvas = canvas;
            this.circuit = circuit;
            this.renderer = renderer;
            this.wireDrawer = wireDrawer;

            this.selectedPin = null;
            this.longPressTimer = null;

            this.setupTouch();
        }

        getTouchPos(touch) {
            const rect = this.canvas.getBoundingClientRect();
            return {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top
            };
        }

        setupTouch() {
            // Chạm bắt đầu (Touch Start)
            this.canvas.addEventListener('touchstart', (e) => {
                if (e.touches.length !== 1) return;
                const pos = this.getTouchPos(e.touches[0]);

                // 1. Kiểm tra chạm vào pin (Tap target 44px)
                const pin = this.circuit.getPinAt(pos.x, pos.y, 22);
                if (pin) {
                    if (!this.selectedPin) {
                        // Chọn chân thứ nhất
                        this.selectedPin = pin;
                        this.renderer.hoveredPin = pin;
                        this.renderer.drawingWire = {
                            fromPin: pin,
                            currentX: pos.x,
                            currentY: pos.y
                        };
                        SF.soundManager.playClick();
                    } else if (this.selectedPin === pin) {
                        // Huỷ chọn
                        this.selectedPin = null;
                        this.renderer.hoveredPin = null;
                        this.renderer.drawingWire = null;
                    } else {
                        // Nối chân thứ nhất với chân thứ hai (2-tap connect)
                        const rail = this.circuit.addWire(this.selectedPin, pin);
                        if (rail) {
                            SF.soundManager.playWireConnect();
                        } else {
                            SF.soundManager.playFail();
                        }
                        this.selectedPin = null;
                        this.renderer.hoveredPin = null;
                        this.renderer.drawingWire = null;
                    }
                    e.preventDefault();
                    return;
                }

                // 2. Chạm vào Mèo Glitch để nhận Hint hoặc Glitch Token
                if (this.renderer.glitchCatPos) {
                    const dx = pos.x - this.renderer.glitchCatPos.x;
                    const dy = pos.y - this.renderer.glitchCatPos.y;
                    if (Math.hypot(dx, dy) <= 30) {
                        this.handleGlitchCatTap();
                        e.preventDefault();
                        return;
                    }
                }

                // 3. Long-press để xóa hoặc chỉnh sửa trạm
                const comp = this.circuit.getComponentAt(pos.x, pos.y);
                if (comp) {
                    this.longPressTimer = setTimeout(async () => {
                        if (comp.type === 'FIXED_SUPPLY' || comp.type === 'CONSTANT') {
                            const val = SF.dialog
                                ? await SF.dialog.prompt('Nhập số N:', comp.customValue)
                                : prompt('Nhập số N:', comp.customValue);
                            if (val !== null) comp.setValue(val.trim());
                        } else if (!comp.isPort) {
                            const confirmed = SF.dialog
                                ? await SF.dialog.confirm(`Xóa trạm ${comp.name}?`)
                                : confirm(`Xóa trạm ${comp.name}?`);
                            if (confirmed) {
                                this.circuit.removeComponent(comp);
                                SF.soundManager.playDelete();
                            }
                        }
                    }, 500);
                }
            }, { passive: false });

            this.canvas.addEventListener('touchmove', (e) => {
                if (this.longPressTimer) {
                    clearTimeout(this.longPressTimer);
                    this.longPressTimer = null;
                }
                if (this.selectedPin && this.renderer.drawingWire && e.touches.length === 1) {
                    const pos = this.getTouchPos(e.touches[0]);
                    this.renderer.drawingWire.currentX = pos.x;
                    this.renderer.drawingWire.currentY = pos.y;
                    e.preventDefault();
                }
            }, { passive: false });

            this.canvas.addEventListener('touchend', () => {
                if (this.longPressTimer) {
                    clearTimeout(this.longPressTimer);
                    this.longPressTimer = null;
                }
            });
        }

        async handleGlitchCatTap() {
            const rand = Math.random();
            if (rand < 0.2) {
                const total = SF.storyManager.addGlitchToken();
                if (SF.dialog) {
                    await SF.dialog.alert(`✨ BẠN NHẬN ĐƯỢC 1 GLITCH TOKEN! (Tổng: ${total}/10)\nThu thập đủ 10 token để mở Secret Ending D!`, 'GLITCH TOKEN');
                }
                SF.soundManager.playWin();
            } else if (rand < 0.7) {
                if (SF.dialog) {
                    await SF.dialog.alert('🐱 Glitch: "Meo... Bạn có thể nối dây chéo nhau thoải mái, chúng không va chạm đâu!"', 'MÈO GLITCH');
                }
                SF.soundManager.playClick();
            } else {
                if (SF.dialog) {
                    await SF.dialog.alert('🐱 Glitch: "01101101 01100101 01101111... Ký ức không bao giờ mất đi, nó chỉ được đóng gói lại."', 'MÈO GLITCH');
                }
                SF.soundManager.playClick();
            }
        }
    }

    SF.TouchInputHandler = TouchInputHandler;
})(window.SF);
