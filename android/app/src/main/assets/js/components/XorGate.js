/**
 * XorGate.js - Cổng logic XOR
 * Q = A XOR B
 */
window.SF = window.SF || {};

(function(SF) {
    class XorGate extends SF.Component {
        constructor(id) {
            super(id, 'XOR', 'XOR Gate');
            this.icon = '⊕';
            this.color = '#382552';
            this.borderColor = '#794cb5';

            this.pinA = this.addInputPin('A', 'A');
            this.pinB = this.addInputPin('B', 'B');
            this.pinQ = this.addOutputPin('Q', 'Q');
        }

        evaluate() {
            if (!this.pinA.signal.valid || !this.pinB.signal.valid) {
                this.pinQ.clearSignal();
                return;
            }
            this.triggerPulse();
            const valA = this.pinA.signal.isTruthy() ? 1 : 0;
            const valB = this.pinB.signal.isTruthy() ? 1 : 0;
            const res = (valA ^ valB) ? 1 : 0;
            this.pinQ.setSignal(new SF.Signal(res, 'BOOLEAN', true));
        }
    }

    SF.XorGate = XorGate;
})(window.SF);
