/**
 * OrGate.js - Cổng logic OR
 * Q = A OR B
 */
window.SF = window.SF || {};

(function(SF) {
    class OrGate extends SF.Component {
        constructor(id) {
            super(id, 'OR', 'OR Gate');
            this.icon = '≥1';
            this.color = '#1b3c4a';
            this.borderColor = '#2989a8';

            this.pinA = this.addInputPin('A', 'A');
            this.pinB = this.addInputPin('B', 'B');
            this.pinQ = this.addOutputPin('Q', 'Q');
        }

        evaluate() {
            if (!this.pinA.signal.valid && !this.pinB.signal.valid) {
                this.pinQ.clearSignal();
                return;
            }
            this.triggerPulse();
            const valA = this.pinA.signal.isTruthy();
            const valB = this.pinB.signal.isTruthy();
            const res = (valA || valB) ? 1 : 0;
            this.pinQ.setSignal(new SF.Signal(res, 'BOOLEAN', true));
        }
    }

    SF.OrGate = OrGate;
})(window.SF);
