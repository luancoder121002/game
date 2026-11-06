/**
 * PortComponent.js - Các cổng Input và Output trên bảng mạch
 */
window.SF = window.SF || {};

(function(SF) {
    class InputPort extends SF.Component {
        constructor(id, portName = 'IN') {
            super(id, 'INPUT_PORT', portName);
            this.icon = '▶';
            this.portName = portName;
            this.color = '#183638';
            this.borderColor = '#1fb8a8';
            this.width = 95;
            this.height = 55;
            this.isPort = true;

            this.pinOut = this.addOutputPin(portName, portName);
        }

        feed(value) {
            if (value === undefined || value === null) {
                this.pinOut.clearSignal();
            } else {
                this.pinOut.setSignal(SF.Signal.from(value));
                this.triggerPulse();
            }
        }

        evaluate() {
            // Tín hiệu đã được nạp qua hàm feed()
        }
    }

    class OutputPort extends SF.Component {
        constructor(id, portName = 'OUT') {
            super(id, 'OUTPUT_PORT', portName);
            this.icon = '🏁';
            this.portName = portName;
            this.color = '#382025';
            this.borderColor = '#d94158';
            this.width = 95;
            this.height = 55;
            this.isPort = true;

            this.pinIn = this.addInputPin(portName, portName);
            this.receivedValues = [];
        }

        evaluate() {
            // Không làm gì, giá trị được đọc tại Verify phase
        }

        getReceivedSignal() {
            return this.pinIn.signal;
        }

        recordValue() {
            if (this.pinIn.signal.valid) {
                this.receivedValues.push(this.pinIn.signal.value);
                this.triggerPulse();
                return this.pinIn.signal.value;
            }
            return null;
        }

        resetState() {
            super.resetState();
            this.receivedValues = [];
        }
    }

    SF.InputPort = InputPort;
    SF.OutputPort = OutputPort;
})(window.SF);
