/**
 * Constant.js - Phát tín hiệu hằng số cố định N (có thể chỉnh sửa giá trị)
 */
window.SF = window.SF || {};

(function(SF) {
    class Constant extends SF.Component {
        constructor(id, value = 0) {
            super(id, 'CONSTANT', 'Constant');
            this.icon = 'N';
            this.color = '#33373b';
            this.borderColor = '#6b7280';
            this.customValue = value;
            this.width = 80;

            this.pinOut = this.addOutputPin('VAL', 'N');
            this.updateLabel();
        }

        setValue(val) {
            const num = Number(val);
            this.customValue = isNaN(num) ? 0 : num;
            this.updateLabel();
            this.evaluate();
        }

        updateLabel() {
            this.name = `CONST [${this.customValue}]`;
            this.pinOut.label = String(this.customValue);
        }

        evaluate() {
            this.triggerPulse();
            this.pinOut.setSignal(new SF.Signal(this.customValue, 'INTEGER', true));
        }

        resetState() {
            super.resetState();
            // Constant luôn phát tín hiệu khi reset
            this.pinOut.setSignal(new SF.Signal(this.customValue, 'INTEGER', true));
        }
    }

    SF.Constant = Constant;
})(window.SF);
