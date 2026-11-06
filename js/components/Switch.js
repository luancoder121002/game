/**
 * Switch.js - Van chuyển mạch điều hướng gói tin theo SELECT
 * Khi SELECT = 0 -> OUT_0
 * Khi SELECT = 1 -> OUT_1
 */
window.SF = window.SF || {};

(function(SF) {
    class Switch extends SF.Component {
        constructor(id, type = 'SWITCH', name = 'Switch') {
            super(id, type, name);
            this.icon = '⇋';
            this.color = '#453823';
            this.borderColor = '#b08a38';
            this.height = 76;

            this.pinData = this.addInputPin('DATA', 'IN');
            this.pinSelect = this.addInputPin('SELECT', 'SEL');

            this.pinOut0 = this.addOutputPin('OUT0', '0');
            this.pinOut1 = this.addOutputPin('OUT1', '1');
        }

        evaluate() {
            if (!this.pinData.signal.valid) {
                this.pinOut0.clearSignal();
                this.pinOut1.clearSignal();
                return;
            }

            // Nếu không có dây vào SELECT, mặc định theo giá trị của DATA nếu DATA là boolean/0/1
            let sel = 0;
            if (this.pinSelect.signal.valid) {
                sel = this.pinSelect.signal.isTruthy() ? 1 : 0;
            } else {
                // Tự điều hướng theo chính giá trị data nếu phù hợp
                sel = this.pinData.signal.isTruthy() ? 1 : 0;
            }

            this.triggerPulse();
            if (sel === 0) {
                this.pinOut0.setSignal(this.pinData.signal);
                this.pinOut1.clearSignal();
            } else {
                this.pinOut1.setSignal(this.pinData.signal);
                this.pinOut0.clearSignal();
            }
        }
    }

    SF.Switch = Switch;
})(window.SF);
