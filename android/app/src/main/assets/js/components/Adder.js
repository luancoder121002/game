/**
 * Adder.js - Bộ cộng số học
 * SUM = A + B
 */
window.SF = window.SF || {};

(function(SF) {
    class Adder extends SF.Component {
        constructor(id) {
            super(id, 'ADDER', 'Adder');
            this.icon = '+';
            this.color = '#1f483b';
            this.borderColor = '#2fa87b';

            this.pinA = this.addInputPin('A', 'A');
            this.pinB = this.addInputPin('B', 'B');
            this.pinSum = this.addOutputPin('SUM', '+');
        }

        evaluate() {
            if (!this.pinA.signal.valid || !this.pinB.signal.valid) {
                this.pinSum.clearSignal();
                return;
            }
            this.triggerPulse();
            const valA = this.pinA.signal.asNumber();
            const valB = this.pinB.signal.asNumber();
            const sum = valA + valB;
            this.pinSum.setSignal(new SF.Signal(sum, 'INTEGER', true));
        }
    }

    SF.Adder = Adder;
})(window.SF);
