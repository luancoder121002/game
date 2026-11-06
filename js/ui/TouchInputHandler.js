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
            this.draggedComp = null;
            this.dragOffset = { x: 0, y: 0 };
            this.touchStartPos = { x: 0, y: 0 };
            this.isDraggingComp = false;

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

                // 1. Kiểm tra chạm vào pin (Tap target mở rộng 28px)
                const pin = this.circuit.getPinAt(pos.x, pos.y, 28);
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

                // 3. Chạm vào trạm để di chuyển (Touch Drag) hoặc Long-press để xóa/chỉnh sửa
                const comp = this.circuit.getComponentAt(pos.x, pos.y);
                if (comp) {
                    for (const c of this.circuit.components) {
                        c.selected = (c === comp);
                    }

                    if (!comp.isPort) {
                        this.draggedComp = comp;
                        this.touchStartPos = { x: pos.x, y: pos.y };
                        this.dragOffset = { x: pos.x - comp.x, y: pos.y - comp.y };
                        this.isDraggingComp = false;

                        this.longPressTimer = setTimeout(async () => {
                            if (this.isDraggingComp) return;
                            if (comp.type === 'FIXED_SUPPLY' || comp.type === 'CONSTANT') {
                                const val = SF.dialog
                                    ? await SF.dialog.prompt('Nhập số N:', comp.customValue)
                                    : prompt('Nhập số N:', comp.customValue);
                                if (val !== null && val.trim() !== '') comp.setValue(val.trim());
                            } else {
                                const confirmed = SF.dialog
                                    ? await SF.dialog.confirm(`Xóa trạm ${comp.name}?`)
                                    : confirm(`Xóa trạm ${comp.name}?`);
                                if (confirmed) {
                                    this.circuit.removeComponent(comp);
                                    SF.soundManager.playDelete();
                                }
                            }
                            this.draggedComp = null;
                        }, 500);
                    }
                    e.preventDefault();
                } else {
                    for (const c of this.circuit.components) c.selected = false;
                }
            }, { passive: false });

            this.canvas.addEventListener('touchmove', (e) => {
                if (e.touches.length !== 1) return;
                const pos = this.getTouchPos(e.touches[0]);

                // Xử lý di chuyển trạm trên màn hình cảm ứng
                if (this.draggedComp) {
                    const dist = Math.hypot(pos.x - this.touchStartPos.x, pos.y - this.touchStartPos.y);
                    if (dist > 8) {
                        this.isDraggingComp = true;
                        if (this.longPressTimer) {
                            clearTimeout(this.longPressTimer);
                            this.longPressTimer = null;
                        }
                    }

                    if (this.isDraggingComp) {
                        const cell = this.circuit.cellSize || 50;
                        let nx = pos.x - this.dragOffset.x;
                        let ny = pos.y - this.dragOffset.y;

                        // Giới hạn trong vùng làm việc của bảng
                        nx = Math.max(120, Math.min(this.canvas.width - this.draggedComp.width - 120, nx));
                        ny = Math.max(20, Math.min(this.canvas.height - this.draggedComp.height - 20, ny));

                        this.draggedComp.x = Math.round(nx / cell) * cell;
                        this.draggedComp.y = Math.round(ny / cell) * cell;
                        this.draggedComp.updatePinPositions();
                        e.preventDefault();
                        return;
                    }
                }

                // Xử lý vẽ dây dở
                if (this.selectedPin && this.renderer.drawingWire) {
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
                if (this.isDraggingComp && this.draggedComp) {
                    SF.soundManager.playClick();
                }
                this.draggedComp = null;
                this.isDraggingComp = false;
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
