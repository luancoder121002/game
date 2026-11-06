/**
 * RightShift.js - Dịch phải 1 bit (tương đương chia 2 lấy phần nguyên)
 * Q = floor(A / 2)
 */
window.SF = window.SF || {};

(function(SF) {
    class RightShift extends SF.Component {
        constructor(id) {
            super(id, 'RIGHT_SHIFT', 'Right Shift');
            this.icon = '>>1';
            this.color = '#382c42';
            this.borderColor = '#8a59aa';
            this.width = 80;

            this.pinA = this.addInputPin('IN', 'A');
            this.pinQ = this.addOutputPin('OUT', '>>1');
        }

        evaluate() {
            if (!this.pinA.signal.valid) {
                this.pinQ.clearSignal();
                return;
            }
            this.triggerPulse();
            const val = this.pinA.signal.asNumber();
            const res = Math.floor(val / 2);
            this.pinQ.setSignal(new SF.Signal(res, 'INTEGER', true));
        }
    }

    SF.RightShift = RightShift;
})(window.SF);
