/**
 * Mux.js - Bộ chọn kênh (Multiplexer 2-to-1)
 * Q = (SELECT == 0 ? A : B)
 */
window.SF = window.SF || {};

(function(SF) {
    class Mux extends SF.Component {
        constructor(id) {
            super(id, 'MUX', 'Multiplexer');
            this.icon = 'M';
            this.color = '#2d4239';
            this.borderColor = '#499c7b';
            this.height = 80;

            this.pinA = this.addInputPin('A', '0');
            this.pinB = this.addInputPin('B', '1');
            this.pinSel = this.addInputPin('SEL', 'S');

            this.pinQ = this.addOutputPin('Q', 'Q');
        }

        evaluate() {
            const sel = this.pinSel.signal.valid ? (this.pinSel.signal.isTruthy() ? 1 : 0) : 0;
            const chosenPin = (sel === 0) ? this.pinA : this.pinB;

            if (!chosenPin.signal.valid) {
                this.pinQ.clearSignal();
                return;
            }

            this.triggerPulse();
            this.pinQ.setSignal(chosenPin.signal);
        }
    }

    SF.Mux = Mux;
})(window.SF);
