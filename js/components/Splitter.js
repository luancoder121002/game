/**
 * Splitter.js - Nhân đôi tín hiệu đầu vào thành 2 đầu ra giống nhau
 */
window.SF = window.SF || {};

(function(SF) {
    class Splitter extends SF.Component {
        constructor(id) {
            super(id, 'SPLITTER', 'Splitter');
            this.icon = '─┬─';
            this.color = '#25444a';
            this.borderColor = '#3faab8';
            this.width = 80;

            this.pinA = this.addInputPin('IN', 'A');
            this.pinOut1 = this.addOutputPin('OUT1', '1');
            this.pinOut2 = this.addOutputPin('OUT2', '2');
        }

        evaluate() {
            if (!this.pinA.signal.valid) {
                this.pinOut1.clearSignal();
                this.pinOut2.clearSignal();
                return;
            }
            this.triggerPulse();
            this.pinOut1.setSignal(this.pinA.signal);
            this.pinOut2.setSignal(this.pinA.signal);
        }
    }

    SF.Splitter = Splitter;
})(window.SF);
