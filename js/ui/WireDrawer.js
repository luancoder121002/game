/**
 * WireDrawer.js - Tương tác kéo nối dây & xóa dây/linh kiện bằng chuột
 */
window.SF = window.SF || {};

(function(SF) {
    class WireDrawer {
        constructor(canvas, circuit, renderer) {
            this.canvas = canvas;
            this.circuit = circuit;
            this.renderer = renderer;

            this.activePin = null;
            this.isDrawing = false;

            this.setupEvents();
        }

        setupEvents() {
            this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
            this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            window.addEventListener('mouseup', (e) => this.handleMouseUp(e));
            this.canvas.addEventListener('contextmenu', (e) => this.handleContextMenu(e));
        }

        getCanvasPos(e) {
            const rect = this.canvas.getBoundingClientRect();
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }

        handleMouseDown(e) {
            if (e.button !== 0) return; // Chỉ xử lý chuột trái
            const pos = this.getCanvasPos(e);

            const pin = this.circuit.getPinAt(pos.x, pos.y, 14);
            if (pin) {
                // Bắt đầu kéo dây
                this.activePin = pin;
                this.isDrawing = true;
                this.renderer.drawingWire = {
                    fromPin: pin,
                    currentX: pos.x,
                    currentY: pos.y
                };
                SF.soundManager.playClick();
                e.preventDefault();
            }
        }

        handleMouseMove(e) {
            const pos = this.getCanvasPos(e);

            // Cập nhật hover pin & component
            const pin = this.circuit.getPinAt(pos.x, pos.y, 14);
            this.renderer.hoveredPin = pin;

            const comp = this.circuit.getComponentAt(pos.x, pos.y);
            this.renderer.hoveredComp = comp;

            if (this.isDrawing && this.renderer.drawingWire) {
                this.renderer.drawingWire.currentX = pos.x;
                this.renderer.drawingWire.currentY = pos.y;
            }
        }

        handleMouseUp(e) {
            if (!this.isDrawing) return;
            const pos = this.getCanvasPos(e);
            const targetPin = this.circuit.getPinAt(pos.x, pos.y, 16);

            if (targetPin && targetPin !== this.activePin) {
                // Nối 2 pin
                const wire = this.circuit.addWire(this.activePin, targetPin);
                if (wire) {
                    SF.soundManager.playWireConnect();
                } else {
                    SF.soundManager.playFail();
                }
            }

            this.isDrawing = false;
            this.activePin = null;
            this.renderer.drawingWire = null;
        }

        handleContextMenu(e) {
            e.preventDefault(); // Chặn menu mặc định
            const pos = this.getCanvasPos(e);

            // Kiểm tra click vào dây trước
            const wire = this.circuit.getWireAt(pos.x, pos.y, 10);
            if (wire) {
                this.circuit.removeWire(wire);
                SF.soundManager.playDelete();
                return;
            }

            // Kiểm tra click vào linh kiện
            const comp = this.circuit.getComponentAt(pos.x, pos.y);
            if (comp && !comp.isPort) {
                this.circuit.removeComponent(comp);
                SF.soundManager.playDelete();
            }
        }
    }

    SF.WireDrawer = WireDrawer;
})(window.SF);
