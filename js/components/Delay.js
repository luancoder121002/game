/**
 * Delay.js - Giữ tín hiệu trễ 1 tick
 * Tick đầu tiên xuất 0
 */
window.SF = window.SF || {};

(function(SF) {
    class Delay extends SF.Component {
        constructor(id) {
            super(id, 'DELAY', 'Delay');
            this.icon = '⏱';
            this.color = '#38334a';
            this.borderColor = '#7965ad';
            this.width = 80;

            this.pinA = this.addInputPin('IN', 'A');
            this.pinQ = this.addOutputPin('OUT', 'Q');

            this.state = {
                current: new SF.Signal(0, 'INTEGER', true),
                next: new SF.Signal(0, 'INTEGER', true)
            };
            this.pinQ.setSignal(this.state.current);
        }

        evaluate() {
            this.pinQ.setSignal(this.state.current);
            if (this.pinA.signal.valid) {
                this.state.next = this.pinA.signal.clone();
            } else {
                this.state.next = new SF.Signal(0, 'INTEGER', true);
            }
        }

        latch() {
            this.state.current = this.state.next.clone();
            this.pinQ.setSignal(this.state.current);
            this.triggerPulse();
        }

        resetState() {
            super.resetState();
            this.state = {
                current: new SF.Signal(0, 'INTEGER', true),
                next: new SF.Signal(0, 'INTEGER', true)
            };
            this.pinQ.setSignal(this.state.current);
        }
    }

    SF.Delay = Delay;
})(window.SF);
