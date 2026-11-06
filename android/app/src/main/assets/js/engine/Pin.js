/**
 * Pin.js - Chân cắm trên trạm xử lý & băng chuyền
 * Hỗ trợ vùng chạm (Tap Target) tối thiểu 44px theo tiêu chuẩn Mobile
 */
window.SF = window.SF || {};

(function(SF) {
    class Pin {
        constructor(id, nodeId, direction, name = '', label = '') {
            this.id = id;
            this.nodeId = nodeId;
            this.direction = (direction === 'IN' || direction === 'INPUT') ? 'IN' : 'OUT';
            this.name = name;
            this.label = label || name;
            this.box = SF.Box.empty();
            this.signal = this.box; // Tương thích ngược

            this.connectedRails = [];
            this.connectedWires = this.connectedRails; // Tương thích

            this.position = { x: 0, y: 0 };
            this.relativePos = { x: 0, y: 0 };
            this.radius = 8;
            this.tapArea = 44; // Vùng chạm 44px cho mobile
        }

        isInput() {
            return this.direction === 'IN' || this.direction === 'INPUT';
        }

        isOutput() {
            return this.direction === 'OUT' || this.direction === 'OUTPUT';
        }

        canConnect() {
            if (this.isInput()) {
                return this.connectedRails.length === 0;
            }
            return true;
        }

        connectRail(rail) {
            if (!this.connectedRails.includes(rail)) {
                this.connectedRails.push(rail);
            }
        }

        connectWire(w) { this.connectRail(w); }

        disconnectRail(rail) {
            this.connectedRails = this.connectedRails.filter(r => r !== rail && r.id !== rail.id);
            this.connectedWires = this.connectedRails;
        }

        disconnectWire(w) { this.disconnectRail(w); }

        setBox(box) {
            this.box = box ? box.clone() : SF.Box.empty();
            this.signal = this.box;
        }

        setSignal(sig) { this.setBox(sig); }

        clearBox() {
            this.box = SF.Box.empty();
            this.signal = this.box;
        }

        clearSignal() { this.clearBox(); }

        isTapped(x, y, tolerance = 24) {
            const dx = x - this.position.x;
            const dy = y - this.position.y;
            return Math.hypot(dx, dy) <= Math.max(tolerance, this.tapArea / 2);
        }
    }

    SF.Pin = Pin;
})(window.SF);
