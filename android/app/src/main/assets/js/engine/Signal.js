/**
 * Signal.js - Gói tín hiệu trong Signal Factory
 */
window.SF = window.SF || {};

(function(SF) {
    class Signal {
        constructor(value = 0, type = 'INTEGER', valid = true) {
            this.value = value;
            this.type = type; // 'BOOLEAN' | 'INTEGER'
            this.valid = valid;
        }

        static empty() {
            const sig = new Signal(0, 'INTEGER', false);
            return sig;
        }

        static from(val) {
            if (val === undefined || val === null) {
                return Signal.empty();
            }
            if (typeof val === 'boolean') {
                return new Signal(val ? 1 : 0, 'BOOLEAN', true);
            }
            if (typeof val === 'number') {
                return new Signal(val, 'INTEGER', true);
            }
            if (val instanceof Signal) {
                return val.clone();
            }
            const num = Number(val);
            return new Signal(isNaN(num) ? 0 : num, 'INTEGER', true);
        }

        clone() {
            return new Signal(this.value, this.type, this.valid);
        }

        isTruthy() {
            return this.valid && Boolean(this.value);
        }

        asNumber() {
            if (!this.valid) return 0;
            return typeof this.value === 'boolean' ? (this.value ? 1 : 0) : Number(this.value);
        }

        asBoolean() {
            if (!this.valid) return false;
            return Boolean(this.value);
        }

        toString() {
            if (!this.valid) return '∅';
            return String(this.value);
        }
    }

    SF.Signal = Signal;
})(window.SF);
