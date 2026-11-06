/**
 * Counter.js - Bộ đếm số lần nhận xung (pulse)
 * COUNT tăng 1 mỗi khi PULSE = 1
 */
window.SF = window.SF || {};

(function(SF) {
    class Counter extends SF.Component {
        constructor(id) {
            super(id, 'COUNTER', 'Counter');
            this.icon = '#₊';
            this.color = '#254a3f';
            this.borderColor = '#389e7a';
            this.height = 76;

            this.pinPulse = this.addInputPin('PULSE', 'P');
            this.pinReset = this.addInputPin('RESET', 'R');

            this.pinCount = this.addOutputPin('COUNT', '#');

            this.state = {
                count: 0,
                nextCount: 0
            };
            this.updateOutput();
        }

        updateOutput() {
            this.pinCount.setSignal(new SF.Signal(this.state.count, 'INTEGER', true));
        }

        evaluate() {
            let next = this.state.count;
            if (this.pinReset.signal.valid && this.pinReset.signal.isTruthy()) {
                next = 0;
            } else if (this.pinPulse.signal.valid && this.pinPulse.signal.isTruthy()) {
                next = this.state.count + 1;
            }
            this.state.nextCount = next;
            this.updateOutput();
        }

        latch() {
            if (this.state.nextCount !== this.state.count) {
                this.state.count = this.state.nextCount;
                this.triggerPulse();
            }
            this.updateOutput();
        }

        resetState() {
            super.resetState();
            this.state = {
                count: 0,
                nextCount: 0
            };
            this.updateOutput();
        }
    }

    SF.Counter = Counter;
})(window.SF);
