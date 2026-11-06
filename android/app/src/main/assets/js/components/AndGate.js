/**
 * AndGate.js - Cổng logic AND
 * Q = A AND B
 */
window.SF = window.SF || {};

(function(SF) {
    class AndGate extends SF.Component {
        constructor(id) {
            super(id, 'AND', 'AND Gate');
            this.icon = '&';
            this.color = '#1f385c';
            this.borderColor = '#3a72ba';

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
            const valA = this.pinA.signal.isTruthy();
            const valB = this.pinB.signal.isTruthy();
            const res = (valA && valB) ? 1 : 0;
            this.pinQ.setSignal(new SF.Signal(res, 'BOOLEAN', true));
        }
    }

    SF.AndGate = AndGate;
})(window.SF);
