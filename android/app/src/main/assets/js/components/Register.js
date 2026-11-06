/**
 * Register.js - Thanh ghi lưu trữ giá trị qua các xung clock
 * Output: giá trị đang lưu
 * Latch: chốt dữ liệu mới vào cuối tick
 */
window.SF = window.SF || {};

(function(SF) {
    class Register extends SF.Component {
        constructor(id) {
            super(id, 'REGISTER', 'Register');
            this.icon = '□₊';
            this.color = '#253e4f';
            this.borderColor = '#3d86ba';
            this.height = 80;

            this.pinData = this.addInputPin('DATA', 'D');
            this.pinWrite = this.addInputPin('WRITE', 'WE');
            this.pinReset = this.addInputPin('RESET', 'R');

            this.pinQ = this.addOutputPin('Q', 'Q');

            this.state = {
                current: SF.Signal.empty(),
                next: SF.Signal.empty(),
                hasValue: false
            };
        }

        evaluate() {
            // Phát ra giá trị hiện đang lưu
            if (this.state.hasValue && this.state.current.valid) {
                this.pinQ.setSignal(this.state.current);
            } else {
                this.pinQ.clearSignal();
            }

            // Chuẩn bị giá trị kế tiếp cho pha chốt (latch)
            if (this.pinReset.signal.valid && this.pinReset.signal.isTruthy()) {
                this.state.next = SF.Signal.empty();
                this.state.nextHasValue = false;
                return;
            }

            const writeEnabled = !this.pinWrite.signal.valid || this.pinWrite.signal.isTruthy();
            if (writeEnabled && this.pinData.signal.valid) {
                this.state.next = this.pinData.signal.clone();
                this.state.nextHasValue = true;
            } else {
                // Giữ nguyên giá trị cũ nếu không ghi đè
                this.state.next = this.state.current.clone();
                this.state.nextHasValue = this.state.hasValue;
            }
        }

        // Gọi ở cuối chu kỳ xung nhịp (Clock Edge / Latch)
        latch() {
            if (this.state.nextHasValue !== undefined) {
                this.state.current = this.state.next.clone();
                this.state.hasValue = this.state.nextHasValue;
            }
            if (this.state.hasValue) {
                this.triggerPulse();
                this.pinQ.setSignal(this.state.current);
            }
        }

        resetState() {
            super.resetState();
            this.state = {
                current: SF.Signal.empty(),
                next: SF.Signal.empty(),
                hasValue: false
            };
        }
    }

    SF.Register = Register;
})(window.SF);
