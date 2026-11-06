/**
 * Circuit.js - Quản lý toàn bộ đồ thị mạch (DAG & Sequential graph)
 */
window.SF = window.SF || {};

(function(SF) {
    class Circuit {
        constructor(gridWidth = 10, gridHeight = 8, cellSize = 60) {
            this.gridWidth = gridWidth;
            this.gridHeight = gridHeight;
            this.cellSize = cellSize;

            this.components = [];
            this.wires = [];
            this.inputPorts = [];
            this.outputPorts = [];

            // Bounds của Board
            this.width = gridWidth * cellSize;
            this.height = gridHeight * cellSize;
        }

        clear(keepPorts = false) {
            // Hủy toàn bộ dây
            for (const wire of [...this.wires]) {
                this.removeWire(wire);
            }

            if (keepPorts) {
                // Chỉ xóa linh kiện thông thường của người chơi
                this.components = this.components.filter(c => c.isPort);
            } else {
                this.components = [];
                this.inputPorts = [];
                this.outputPorts = [];
            }
        }

        addComponent(component) {
            if (!this.components.includes(component)) {
                this.components.push(component);
            }
            if (component.type === 'INPUT_PORT' && !this.inputPorts.includes(component)) {
                this.inputPorts.push(component);
            }
            if (component.type === 'OUTPUT_PORT' && !this.outputPorts.includes(component)) {
                this.outputPorts.push(component);
            }
            return component;
        }

        removeComponent(component) {
            if (component.isPort) {
                // Không cho phép xóa port cố định của màn chơi
                return false;
            }

            // Gỡ toàn bộ dây kết nối đến các pin của component
            const allPins = [...component.inputPins, ...component.outputPins];
            for (const pin of allPins) {
                for (const wire of [...pin.connectedWires]) {
                    this.removeWire(wire);
                }
            }

            this.components = this.components.filter(c => c !== component && c.id !== component.id);
            return true;
        }

        addWire(fromPin, toPin) {
            if (!fromPin || !toPin) return null;

            // Đảm bảo fromPin là OUTPUT và toPin là INPUT
            if (fromPin.isInput() && toPin.isOutput()) {
                const temp = fromPin;
                fromPin = toPin;
                toPin = temp;
            }

            if (!fromPin.isOutput() || !toPin.isInput()) {
                console.warn('Dây phải nối từ OUTPUT Pin sang INPUT Pin!');
                return null;
            }

            // Kiểm tra không nối pin với chính nó
            if (fromPin.nodeId === toPin.nodeId) {
                console.warn('Không thể nối pin với chính cùng linh kiện!');
                return null;
            }

            // Kiểm tra xem toPin đã có dây nối vào chưa
            if (!toPin.canConnect()) {
                // Xóa dây cũ vào toPin trước
                for (const existing of [...toPin.connectedWires]) {
                    this.removeWire(existing);
                }
            }

            // Kiểm tra trùng lặp
            const existing = this.wires.find(w => w.fromPin === fromPin && w.toPin === toPin);
            if (existing) return existing;

            const wire = new SF.Wire(null, fromPin, toPin);
            this.wires.push(wire);
            return wire;
        }

        removeWire(wire) {
            if (!wire) return;
            wire.destroy();
            this.wires = this.wires.filter(w => w !== wire && w.id !== wire.id);
        }

        getComponentById(id) {
            return this.components.find(c => c.id === id);
        }

        getPinById(pinId) {
            for (const c of this.components) {
                for (const pin of [...c.inputPins, ...c.outputPins]) {
                    if (pin.id === pinId) return pin;
                }
            }
            return null;
        }

        getComponentAt(x, y) {
            // Tìm theo thứ tự ngược để ưu tiên phần tử trên cùng
            for (let i = this.components.length - 1; i >= 0; i--) {
                const comp = this.components[i];
                if (comp.containsPoint(x, y)) {
                    return comp;
                }
            }
            return null;
        }

        getPinAt(x, y, tolerance = 14) {
            for (const comp of this.components) {
                const pin = comp.getPinAt(x, y, tolerance);
                if (pin) return pin;
            }
            return null;
        }

        getWireAt(x, y, tolerance = 8) {
            for (const wire of this.wires) {
                if (this.isPointNearWire(x, y, wire, tolerance)) {
                    return wire;
                }
            }
            return null;
        }

        isPointNearWire(px, py, wire, tolerance = 8) {
            const p1 = wire.fromPin.position;
            const p2 = wire.toPin.position;
            // Kiểm tra khoảng cách đến đoạn thẳng nối 2 pin (hoặc bezier midpoint)
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const lenSq = dx * dx + dy * dy;
            if (lenSq === 0) return Math.hypot(px - p1.x, py - p1.y) <= tolerance;

            const t = Math.max(0, Math.min(1, ((px - p1.x) * dx + (py - p1.y) * dy) / lenSq));
            const projX = p1.x + t * dx;
            const projY = p1.y + t * dy;
            return Math.hypot(px - projX, py - projY) <= tolerance;
        }

        setupLevelPorts(levelData) {
            this.clear(false);

            // Xác định danh sách Input names và Output names
            const inputNames = Object.keys(levelData.inputs || {});
            const outputNames = Object.keys(levelData.expectedOutputs || {});

            const totalHeight = this.height;
            const cell = this.cellSize;

            // Đặt Input Ports ở cột trái (x = 20)
            const inCount = inputNames.length;
            inputNames.forEach((name, idx) => {
                const port = new SF.InputPort('port_in_' + name, name);
                const spacing = totalHeight / (inCount + 1);
                port.x = 20;
                port.y = spacing * (idx + 1) - port.height / 2;
                port.gridX = 0;
                port.gridY = Math.round(port.y / cell);
                port.updatePinPositions();
                this.addComponent(port);
            });

            // Đặt Output Ports ở cột phải (x = width - 120)
            const outCount = outputNames.length;
            outputNames.forEach((name, idx) => {
                const port = new SF.OutputPort('port_out_' + name, name);
                const spacing = totalHeight / (outCount + 1);
                port.x = this.width - port.width - 20;
                port.y = spacing * (idx + 1) - port.height / 2;
                port.gridX = Math.round(port.x / cell);
                port.gridY = Math.round(port.y / cell);
                port.updatePinPositions();
                this.addComponent(port);
            });
        }

        // Đếm số lượng linh kiện người chơi dùng (không tính ports)
        getUserComponentCount() {
            return this.components.filter(c => !c.isPort).length;
        }

        // Đếm số lượng dây nối
        getWireCount() {
            return this.wires.length;
        }

        resetState() {
            for (const c of this.components) {
                c.resetState();
            }
            for (const w of this.wires) {
                w.signal = SF.Signal.empty();
                w.visualState = 'IDLE';
                w.packets = [];
            }
        }
    }

    SF.Circuit = Circuit;
})(window.SF);
