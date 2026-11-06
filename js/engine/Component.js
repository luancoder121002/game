/**
 * Component.js - Lớp cơ sở (Base class) cho các Trạm Xử Lý (Processing Stations) v2.0
 */
window.SF = window.SF || {};

(function(SF) {
    class Component {
        constructor(id, type, name = '') {
            this.id = id || ('station_' + Math.random().toString(36).substr(2, 9));
            this.type = type;
            this.name = name || type;
            this.icon = '📦';

            this.gridX = 0;
            this.gridY = 0;
            this.x = 0;
            this.y = 0;
            this.width = 96;
            this.height = 74;
            this.color = '#1e293b';
            this.borderColor = '#475569';

            this.inputPins = [];
            this.outputPins = [];

            this.state = {};
            this.isProcessing = false;
            this.pulseTimer = 0;
            this.selected = false;
            this.hovered = false;
        }

        addInputPin(name, label = '') {
            const pinId = `${this.id}_in_${this.inputPins.length}`;
            const pin = new SF.Pin(pinId, this.id, 'IN', name, label);
            this.inputPins.push(pin);
            this.updatePinPositions();
            return pin;
        }

        addOutputPin(name, label = '') {
            const pinId = `${this.id}_out_${this.outputPins.length}`;
            const pin = new SF.Pin(pinId, this.id, 'OUT', name, label);
            this.outputPins.push(pin);
            this.updatePinPositions();
            return pin;
        }

        setPosition(x, y, isGrid = false, cellSize = 50) {
            if (isGrid) {
                this.gridX = x;
                this.gridY = y;
                this.x = x * cellSize;
                this.y = y * cellSize;
            } else {
                this.x = x;
                this.y = y;
                this.gridX = Math.round(x / cellSize);
                this.gridY = Math.round(y / cellSize);
            }
            this.updatePinPositions();
        }

        updatePinPositions() {
            const inCount = this.inputPins.length;
            for (let i = 0; i < inCount; i++) {
                const pin = this.inputPins[i];
                const spacing = this.height / (inCount + 1);
                pin.relativePos = { x: 0, y: spacing * (i + 1) };
                pin.position = { x: this.x + pin.relativePos.x, y: this.y + pin.relativePos.y };
            }

            const outCount = this.outputPins.length;
            for (let i = 0; i < outCount; i++) {
                const pin = this.outputPins[i];
                const spacing = this.height / (outCount + 1);
                pin.relativePos = { x: this.width, y: spacing * (i + 1) };
                pin.position = { x: this.x + pin.relativePos.x, y: this.y + pin.relativePos.y };
            }
        }

        getPinAt(px, py, tolerance = 18) {
            for (const pin of [...this.inputPins, ...this.outputPins]) {
                if (pin.isTapped(px, py, tolerance)) {
                    return pin;
                }
            }
            return null;
        }

        containsPoint(px, py) {
            return px >= this.x && px <= this.x + this.width &&
                   py >= this.y && py <= this.y + this.height;
        }

        triggerPulse() {
            this.isProcessing = true;
            this.pulseTimer = 1.0;
        }

        update(dt = 0.05) {
            if (this.pulseTimer > 0) {
                this.pulseTimer -= dt * 3.5;
                if (this.pulseTimer <= 0) {
                    this.pulseTimer = 0;
                    this.isProcessing = false;
                }
            }
        }

        resetState() {
            this.state = {};
            this.isProcessing = false;
            this.pulseTimer = 0;
            for (const pin of this.inputPins) pin.clearBox();
            for (const pin of this.outputPins) pin.clearBox();
        }

        evaluate() {
            // Lớp con override
        }
    }

    SF.Component = Component;
})(window.SF);
