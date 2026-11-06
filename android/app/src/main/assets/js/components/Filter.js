/**
 * Filter.js - Bộ lọc tín hiệu
 * Q = (ALLOW ? DATA : empty)
 */
window.SF = window.SF || {};

(function(SF) {
    class Filter extends SF.Component {
        constructor(id) {
            super(id, 'FILTER', 'Filter');
            this.icon = '▽';
            this.color = '#3b3345';
            this.borderColor = '#8469a3';

            this.pinData = this.addInputPin('DATA', 'IN');
            this.pinAllow = this.addInputPin('ALLOW', 'EN');
            this.pinQ = this.addOutputPin('Q', 'OUT');
        }

        evaluate() {
            if (!this.pinData.signal.valid) {
                this.pinQ.clearSignal();
                return;
            }

            const allow = !this.pinAllow.signal.valid || this.pinAllow.signal.isTruthy();
            if (allow) {
                this.triggerPulse();
                this.pinQ.setSignal(this.pinData.signal);
            } else {
                this.pinQ.clearSignal();
            }
        }
    }

    SF.Filter = Filter;
})(window.SF);
