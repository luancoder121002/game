/**
 * NotGate.js - Cổng logic NOT (Inverter)
 * Q = NOT A
 */
window.SF = window.SF || {};

(function(SF) {
    class NotGate extends SF.Component {
        constructor(id) {
            super(id, 'NOT', 'NOT Gate');
            this.icon = '¬';
            this.color = '#3d2547';
            this.borderColor = '#8a3da3';
            this.width = 80;

            this.pinA = this.addInputPin('A', 'A');
            this.pinQ = this.addOutputPin('Q', 'Q');
        }

        evaluate() {
            if (!this.pinA.signal.valid) {
                this.pinQ.clearSignal();
                return;
            }
            this.triggerPulse();
            const valA = this.pinA.signal.isTruthy();
            const res = valA ? 0 : 1;
            this.pinQ.setSignal(new SF.Signal(res, 'BOOLEAN', true));
        }
    }

    SF.NotGate = NotGate;
})(window.SF);
