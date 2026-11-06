/**
 * Subtractor.js - Bộ trừ số học
 * DIFF = A - B
 */
window.SF = window.SF || {};

(function(SF) {
    class Subtractor extends SF.Component {
        constructor(id) {
            super(id, 'SUBTRACTOR', 'Subtractor');
            this.icon = '−';
            this.color = '#452e27';
            this.borderColor = '#9c523d';

            this.pinA = this.addInputPin('A', 'A');
            this.pinB = this.addInputPin('B', 'B');
            this.pinDiff = this.addOutputPin('DIFF', '−');
        }

        evaluate() {
            if (!this.pinA.signal.valid || !this.pinB.signal.valid) {
                this.pinDiff.clearSignal();
                return;
            }
            this.triggerPulse();
            const valA = this.pinA.signal.asNumber();
            const valB = this.pinB.signal.asNumber();
            const diff = valA - valB;
            this.pinDiff.setSignal(new SF.Signal(diff, 'INTEGER', true));
        }
    }

    SF.Subtractor = Subtractor;
})(window.SF);
