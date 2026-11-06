/**
 * Validator.js - Kiểm tra tĩnh mạch điện & xác thực kết quả
 */
window.SF = window.SF || {};

(function(SF) {
    class Validator {
        static preflightCheck(circuit) {
            const warnings = [];

            // Kiểm tra các Output Port có được nối dây hay không
            for (const outPort of circuit.outputPorts) {
                if (outPort.pinIn.connectedWires.length === 0) {
                    warnings.push(`Cổng đầu ra [${outPort.portName}] chưa được nối dây.`);
                }
            }

            // Kiểm tra linh kiện lơ lửng không có dây
            for (const comp of circuit.components) {
                if (comp.isPort) continue;
                const totalWires = [...comp.inputPins, ...comp.outputPins]
                    .reduce((sum, p) => sum + p.connectedWires.length, 0);
                if (totalWires === 0) {
                    warnings.push(`Linh kiện ${comp.name} chưa được nối dây nào.`);
                }
            }

            return {
                valid: warnings.length === 0,
                warnings
            };
        }
    }

    SF.Validator = Validator;
})(window.SF);
