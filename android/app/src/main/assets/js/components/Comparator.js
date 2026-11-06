/**
 * Comparator.js - Bộ so sánh 2 số
 * Outputs: GT (A > B), EQ (A == B), LT (A < B)
 */
window.SF = window.SF || {};

(function(SF) {
    class Comparator extends SF.Component {
        constructor(id) {
            super(id, 'COMPARATOR', 'Comparator');
            this.icon = '⋛';
            this.color = '#383623';
            this.borderColor = '#91893b';
            this.height = 80;

            this.pinA = this.addInputPin('A', 'A');
            this.pinB = this.addInputPin('B', 'B');

            this.pinGT = this.addOutputPin('GT', '>');
            this.pinEQ = this.addOutputPin('EQ', '=');
            this.pinLT = this.addOutputPin('LT', '<');
        }

        evaluate() {
            if (!this.pinA.signal.valid || !this.pinB.signal.valid) {
                this.pinGT.clearSignal();
                this.pinEQ.clearSignal();
                this.pinLT.clearSignal();
                return;
            }
            this.triggerPulse();
            const valA = this.pinA.signal.asNumber();
            const valB = this.pinB.signal.asNumber();

            this.pinGT.setSignal(new SF.Signal(valA > valB ? 1 : 0, 'BOOLEAN', true));
            this.pinEQ.setSignal(new SF.Signal(valA === valB ? 1 : 0, 'BOOLEAN', true));
            this.pinLT.setSignal(new SF.Signal(valA < valB ? 1 : 0, 'BOOLEAN', true));
        }
    }

    SF.Comparator = Comparator;
})(window.SF);
