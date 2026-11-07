/**
 * Stations.js - 17 Trạm Xử Lý (Processing Stations) theo thiết kế v2.0
 * Kết hợp đầy đủ cả định danh mới (V2) và định danh kỹ thuật (V1)
 * Hỗ trợ đa ngôn ngữ động (English & Tiếng Việt) cho tên trạm và nhãn chân cắm
 */
window.SF = window.SF || {};

(function(SF) {
    const Component = SF.Component;
    const Box = SF.Box;

    function isEn() {
        return SF.i18n ? SF.i18n.getLanguage() === 'en' : true;
    }

    // 1. Đường Ray Trực Tiếp (RAIL / WIRE)
    class RailComp extends Component {
        constructor(id) {
            super(id, 'RAIL', isEn() ? 'Rail Track' : 'Đường Ray');
            this.icon = '═';
            this.color = '#1e293b';
            this.borderColor = '#475569';
            this.width = 80;
            this.pinIn = this.addInputPin('IN', 'IN');
            this.pinOut = this.addOutputPin('OUT', 'OUT');
            this.updateLocalization();
        }
        updateLocalization() {
            this.name = isEn() ? 'Rail Track' : 'Đường Ray';
            if (this.pinIn) this.pinIn.label = isEn() ? 'IN' : 'Vào';
            if (this.pinOut) this.pinOut.label = isEn() ? 'OUT' : 'Ra';
        }
        evaluate() {
            if (!this.pinIn.box.valid) {
                this.pinOut.clearBox();
                return;
            }
            this.triggerPulse();
            this.pinOut.setBox(this.pinIn.box);
        }
    }

    // 2. Sao Chép Thùng Hàng (COPIER / SPLITTER)
    class CopierComp extends Component {
        constructor(id, type = 'COPIER', name = '') {
            super(id, type, name || (isEn() ? 'Splitter' : 'Sao Chép'));
            this.icon = '📋';
            this.color = '#1b3c4a';
            this.borderColor = '#2989a8';
            this.pinIn = this.addInputPin('IN', 'IN');
            this.pinOut1 = this.addOutputPin('OUT1', 'OUT1');
            this.pinOut2 = this.addOutputPin('OUT2', 'OUT2');
            this.updateLocalization();
        }
        updateLocalization() {
            this.name = isEn() ? 'Splitter' : 'Sao Chép';
            if (this.pinIn) this.pinIn.label = isEn() ? 'IN' : 'Vào';
            if (this.pinOut1) this.pinOut1.label = isEn() ? 'OUT1' : 'Ra 1';
            if (this.pinOut2) this.pinOut2.label = isEn() ? 'OUT2' : 'Ra 2';
        }
        evaluate() {
            if (!this.pinIn.box.valid) {
                this.pinOut1.clearBox();
                this.pinOut2.clearBox();
                return;
            }
            this.triggerPulse();
            this.pinOut1.setBox(this.pinIn.box);
            this.pinOut2.setBox(this.pinIn.box);
        }
    }

    // 3. Ngã Ba (JUNCTION / SWITCH / DEMUX)
    class JunctionComp extends Component {
        constructor(id, type = 'JUNCTION', name = '') {
            super(id, type, name || (isEn() ? 'Demux' : 'Ngã Ba'));
            this.icon = '🔀';
            this.color = '#453823';
            this.borderColor = '#b08a38';
            this.pinData = this.addInputPin('DATA', 'DATA');
            this.pinSelect = this.addInputPin('SELECT', 'SEL');
            this.pinOut0 = this.addOutputPin('OUT0', 'CH 0');
            this.pinOut1 = this.addOutputPin('OUT1', 'CH 1');
            this.updateLocalization();
        }
        updateLocalization() {
            this.name = isEn() ? 'Demux' : 'Ngã Ba';
            if (this.pinData) this.pinData.label = isEn() ? 'DATA' : 'Hàng';
            if (this.pinSelect) this.pinSelect.label = isEn() ? 'SEL' : 'Hướng';
            if (this.pinOut0) this.pinOut0.label = isEn() ? 'CH 0' : 'Đường 0';
            if (this.pinOut1) this.pinOut1.label = isEn() ? 'CH 1' : 'Đường 1';
        }
        evaluate() {
            if (!this.pinData.box.valid) {
                this.pinOut0.clearBox();
                this.pinOut1.clearBox();
                return;
            }
            let sel = 0;
            if (this.pinSelect.box.valid) {
                sel = this.pinSelect.box.isTruthy() ? 1 : 0;
            } else {
                sel = this.pinData.box.isTruthy() ? 1 : 0;
            }
            this.triggerPulse();
            if (sel === 0) {
                this.pinOut0.setBox(this.pinData.box);
                this.pinOut1.clearBox();
            } else {
                this.pinOut1.setBox(this.pinData.box);
                this.pinOut0.clearBox();
            }
        }
    }

    // 4. Kiểm Tra Kép (DUAL_CHECK / AND)
    class DualCheckComp extends Component {
        constructor(id, type = 'DUAL_CHECK', name = '') {
            super(id, type, name || (isEn() ? 'AND Gate' : 'Cổng AND'));
            this.icon = '✅✅';
            this.color = '#1f385c';
            this.borderColor = '#3a72ba';
            this.pinA = this.addInputPin('A', 'A');
            this.pinB = this.addInputPin('B', 'B');
            this.pinQ = this.addOutputPin('Q', 'AND');
            this.updateLocalization();
        }
        updateLocalization() {
            this.name = isEn() ? 'AND Gate' : 'Cổng AND';
            if (this.pinA) this.pinA.label = 'A';
            if (this.pinB) this.pinB.label = 'B';
            if (this.pinQ) this.pinQ.label = isEn() ? 'AND' : 'OK';
        }
        evaluate() {
            if (!this.pinA.box.valid || !this.pinB.box.valid) {
                this.pinQ.clearBox();
                return;
            }
            this.triggerPulse();
            const res = (this.pinA.box.isTruthy() && this.pinB.box.isTruthy()) ? 1 : 0;
            this.pinQ.setBox(new Box(res, 'BOOL', true));
        }
    }

    // 5. Cửa Rộng (ANY_PASS / OR)
    class AnyPassComp extends Component {
        constructor(id, type = 'ANY_PASS', name = '') {
            super(id, type, name || (isEn() ? 'OR Gate' : 'Cổng OR'));
            this.icon = '🚪';
            this.color = '#1c3d47';
            this.borderColor = '#2989a8';
            this.pinA = this.addInputPin('A', 'A');
            this.pinB = this.addInputPin('B', 'B');
            this.pinQ = this.addOutputPin('Q', 'OR');
            this.updateLocalization();
        }
        updateLocalization() {
            this.name = isEn() ? 'OR Gate' : 'Cổng OR';
            if (this.pinA) this.pinA.label = 'A';
            if (this.pinB) this.pinB.label = 'B';
            if (this.pinQ) this.pinQ.label = isEn() ? 'OR' : 'OK';
        }
        evaluate() {
            if (!this.pinA.box.valid && !this.pinB.box.valid) {
                this.pinQ.clearBox();
                return;
            }
            this.triggerPulse();
            const res = (this.pinA.box.isTruthy() || this.pinB.box.isTruthy()) ? 1 : 0;
            this.pinQ.setBox(new Box(res, 'BOOL', true));
        }
    }

    // 6. Đổi Nhãn (FLIP / NOT)
    class FlipComp extends Component {
        constructor(id, type = 'FLIP', name = '') {
            super(id, type, name || (isEn() ? 'NOT Gate' : 'Cổng NOT'));
            this.icon = '🔄';
            this.color = '#3d2547';
            this.borderColor = '#8a3da3';
            this.width = 84;
            this.pinA = this.addInputPin('A', 'IN');
            this.pinQ = this.addOutputPin('Q', 'NOT');
            this.updateLocalization();
        }
        updateLocalization() {
            this.name = isEn() ? 'NOT Gate' : 'Cổng NOT';
            if (this.pinA) this.pinA.label = isEn() ? 'IN' : 'Vào';
            if (this.pinQ) this.pinQ.label = isEn() ? 'NOT' : 'Đảo';
        }
        evaluate() {
            if (!this.pinA.box.valid) {
                this.pinQ.clearBox();
                return;
            }
            this.triggerPulse();
            const res = this.pinA.box.isTruthy() ? 0 : 1;
            this.pinQ.setBox(new Box(res, 'BOOL', true));
        }
    }

    // 7. So Khác (DIFF_CHECK / XOR)
    class DiffCheckComp extends Component {
        constructor(id, type = 'DIFF_CHECK', name = '') {
            super(id, type, name || (isEn() ? 'XOR Gate' : 'Cổng XOR'));
            this.icon = '≠';
            this.color = '#382552';
            this.borderColor = '#794cb5';
            this.pinA = this.addInputPin('A', 'A');
            this.pinB = this.addInputPin('B', 'B');
            this.pinQ = this.addOutputPin('Q', 'XOR');
            this.updateLocalization();
        }
        updateLocalization() {
            this.name = isEn() ? 'XOR Gate' : 'Cổng XOR';
            if (this.pinA) this.pinA.label = 'A';
            if (this.pinB) this.pinB.label = 'B';
            if (this.pinQ) this.pinQ.label = isEn() ? 'XOR' : 'Khác';
        }
        evaluate() {
            if (!this.pinA.box.valid || !this.pinB.box.valid) {
                this.pinQ.clearBox();
                return;
            }
            this.triggerPulse();
            const a = this.pinA.box.isTruthy() ? 1 : 0;
            const b = this.pinB.box.isTruthy() ? 1 : 0;
            const res = (a ^ b) ? 1 : 0;
            this.pinQ.setBox(new Box(res, 'BOOL', true));
        }
    }

    // 8. Gộp Hàng (MERGER / ADDER)
    class MergerComp extends Component {
        constructor(id, type = 'MERGER', name = '') {
            super(id, type, name || (isEn() ? 'Adder (+)' : 'Bộ Cộng (+)'));
            this.icon = '➕';
            this.color = '#1f483b';
            this.borderColor = '#2fa87b';
            this.pinA = this.addInputPin('A', 'A');
            this.pinB = this.addInputPin('B', 'B');
            this.pinSum = this.addOutputPin('SUM', 'SUM');
            this.updateLocalization();
        }
        updateLocalization() {
            this.name = isEn() ? 'Adder (+)' : 'Bộ Cộng (+)';
            if (this.pinA) this.pinA.label = 'A';
            if (this.pinB) this.pinB.label = 'B';
            if (this.pinSum) this.pinSum.label = isEn() ? 'SUM' : 'Tổng';
        }
        evaluate() {
            if (!this.pinA.box.valid || !this.pinB.box.valid) {
                this.pinSum.clearBox();
                return;
            }
            this.triggerPulse();
            const sum = this.pinA.box.asNumber() + this.pinB.box.asNumber();
            this.pinSum.setBox(new Box(sum, 'NUMBER', true));
        }
    }

    // 9. Tách Hàng (SPLITTER_VAL / SUBTRACTOR)
    class SplitterValComp extends Component {
        constructor(id, type = 'SPLITTER_VAL', name = '') {
            super(id, type, name || (isEn() ? 'Subtractor (-)' : 'Bộ Trừ (-)'));
            this.icon = '➖';
            this.color = '#452e27';
            this.borderColor = '#9c523d';
            this.pinA = this.addInputPin('A', 'A');
            this.pinB = this.addInputPin('B', 'B');
            this.pinDiff = this.addOutputPin('DIFF', 'DIFF');
            this.updateLocalization();
        }
        updateLocalization() {
            this.name = isEn() ? 'Subtractor (-)' : 'Bộ Trừ (-)';
            if (this.pinA) this.pinA.label = 'A';
            if (this.pinB) this.pinB.label = 'B';
            if (this.pinDiff) this.pinDiff.label = isEn() ? 'DIFF' : 'Hiệu';
        }
        evaluate() {
            if (!this.pinA.box.valid || !this.pinB.box.valid) {
                this.pinDiff.clearBox();
                return;
            }
            this.triggerPulse();
            const diff = this.pinA.box.asNumber() - this.pinB.box.asNumber();
            this.pinDiff.setBox(new Box(diff, 'NUMBER', true));
        }
    }

    // 10. Kho Cố Định (FIXED_SUPPLY / CONSTANT)
    class FixedSupplyComp extends Component {
        constructor(id, type = 'FIXED_SUPPLY', name = '', value = 0) {
            super(id, type, name);
            this.icon = '📦N';
            this.color = '#33373b';
            this.borderColor = '#6b7280';
            this.customValue = value;
            this.width = 86;
            this.pinOut = this.addOutputPin('VAL', String(value));
            this.updateLocalization();
        }
        setValue(val) {
            const num = Number(val);
            this.customValue = isNaN(num) ? 0 : num;
            this.updateLocalization();
            this.evaluate();
        }
        updateLocalization() {
            this.name = isEn() ? `Const [${this.customValue}]` : `Kho [${this.customValue}]`;
            if (this.pinOut) this.pinOut.label = String(this.customValue);
        }
        updateLabel() {
            this.updateLocalization();
        }
        evaluate() {
            this.triggerPulse();
            this.pinOut.setBox(new Box(this.customValue, 'NUMBER', true));
        }
        resetState() {
            super.resetState();
            this.pinOut.setBox(new Box(this.customValue, 'NUMBER', true));
        }
    }

    // 11. Cân Hàng (SCALE / COMPARATOR)
    class ScaleComp extends Component {
        constructor(id, type = 'SCALE', name = '') {
            super(id, type, name || (isEn() ? 'Comparator' : 'So Sánh'));
            this.icon = '⚖️';
            this.color = '#383623';
            this.borderColor = '#91893b';
            this.height = 80;
            this.pinA = this.addInputPin('A', 'A');
            this.pinB = this.addInputPin('B', 'B');
            this.pinGT = this.addOutputPin('GT', 'A>B');
            this.pinEQ = this.addOutputPin('EQ', 'A=B');
            this.pinLT = this.addOutputPin('LT', 'A<B');
            this.updateLocalization();
        }
        updateLocalization() {
            this.name = isEn() ? 'Comparator' : 'So Sánh';
            if (this.pinA) this.pinA.label = 'A';
            if (this.pinB) this.pinB.label = 'B';
            if (this.pinGT) this.pinGT.label = 'A>B';
            if (this.pinEQ) this.pinEQ.label = 'A=B';
            if (this.pinLT) this.pinLT.label = 'A<B';
        }
        evaluate() {
            if (!this.pinA.box.valid || !this.pinB.box.valid) {
                this.pinGT.clearBox();
                this.pinEQ.clearBox();
                this.pinLT.clearBox();
                return;
            }
            this.triggerPulse();
            const a = this.pinA.box.asNumber();
            const b = this.pinB.box.asNumber();
            this.pinGT.setBox(new Box(a > b ? 1 : 0, 'BOOL', true));
            this.pinEQ.setBox(new Box(a === b ? 1 : 0, 'BOOL', true));
            this.pinLT.setBox(new Box(a < b ? 1 : 0, 'BOOL', true));
        }
    }

    // 12. Chọn Đường (SELECTOR / MUX)
    class SelectorComp extends Component {
        constructor(id, type = 'SELECTOR', name = '') {
            super(id, type, name || (isEn() ? 'MUX' : 'Chọn Kênh (MUX)'));
            this.icon = '🎯';
            this.color = '#2d4239';
            this.borderColor = '#499c7b';
            this.height = 82;
            this.pinA = this.addInputPin('A', 'CH 0');
            this.pinB = this.addInputPin('B', 'CH 1');
            this.pinSel = this.addInputPin('SEL', 'SEL');
            this.pinQ = this.addOutputPin('Q', 'OUT');
            this.updateLocalization();
        }
        updateLocalization() {
            this.name = isEn() ? 'MUX' : 'Chọn Kênh (MUX)';
            if (this.pinA) this.pinA.label = isEn() ? 'CH 0' : 'Đường 0';
            if (this.pinB) this.pinB.label = isEn() ? 'CH 1' : 'Đường 1';
            if (this.pinSel) this.pinSel.label = isEn() ? 'SEL' : 'Chọn';
            if (this.pinQ) this.pinQ.label = isEn() ? 'OUT' : 'Đích';
        }
        evaluate() {
            const sel = this.pinSel.box.valid ? (this.pinSel.box.isTruthy() ? 1 : 0) : 0;
            const chosen = (sel === 0) ? this.pinA : this.pinB;
            if (!chosen.box.valid) {
                this.pinQ.clearBox();
                return;
            }
            this.triggerPulse();
            this.pinQ.setBox(chosen.box);
        }
    }

    // 13. Kiểm Duyệt (FILTER)
    class FilterComp extends Component {
        constructor(id, type = 'FILTER', name = '') {
            super(id, type, name || (isEn() ? 'Filter' : 'Kiểm Duyệt'));
            this.icon = '🛡️';
            this.color = '#3b3345';
            this.borderColor = '#8469a3';
            this.pinData = this.addInputPin('DATA', 'DATA');
            this.pinAllow = this.addInputPin('ALLOW', 'ALLOW');
            this.pinQ = this.addOutputPin('Q', 'OUT');
            this.updateLocalization();
        }
        updateLocalization() {
            this.name = isEn() ? 'Filter' : 'Kiểm Duyệt';
            if (this.pinData) this.pinData.label = isEn() ? 'DATA' : 'Hàng';
            if (this.pinAllow) this.pinAllow.label = isEn() ? 'ALLOW' : 'Cho qua';
            if (this.pinQ) this.pinQ.label = isEn() ? 'OUT' : 'Ra';
        }
        evaluate() {
            if (!this.pinData.box.valid) {
                this.pinQ.clearBox();
                return;
            }
            const allow = !this.pinAllow.box.valid || this.pinAllow.box.isTruthy();
            if (allow) {
                this.triggerPulse();
                this.pinQ.setBox(this.pinData.box);
            } else {
                this.pinQ.clearBox();
            }
        }
    }

    // 14. Kho Tạm (STORAGE / REGISTER)
    class StorageComp extends Component {
        constructor(id, type = 'STORAGE', name = '') {
            super(id, type, name || (isEn() ? 'Register' : 'Kho Tạm (Reg)'));
            this.icon = '🏛️';
            this.color = '#253e4f';
            this.borderColor = '#3d86ba';
            this.height = 80;
            this.pinData = this.addInputPin('DATA', 'DATA');
            this.pinWrite = this.addInputPin('WRITE', 'WRITE');
            this.pinReset = this.addInputPin('RESET', 'RESET');
            this.pinQ = this.addOutputPin('Q', 'OUT');
            this.state = { current: Box.empty(), next: Box.empty(), hasValue: false };
            this.updateLocalization();
        }
        updateLocalization() {
            this.name = isEn() ? 'Register' : 'Kho Tạm (Reg)';
            if (this.pinData) this.pinData.label = isEn() ? 'DATA' : 'Cất';
            if (this.pinWrite) this.pinWrite.label = isEn() ? 'WRITE' : 'Ghi';
            if (this.pinReset) this.pinReset.label = isEn() ? 'RESET' : 'Xóa';
            if (this.pinQ) this.pinQ.label = isEn() ? 'OUT' : 'Xuất';
        }
        evaluate() {
            if (this.state.hasValue && this.state.current.valid) {
                this.pinQ.setBox(this.state.current);
            } else {
                this.pinQ.clearBox();
            }
            if (this.pinReset.box.valid && this.pinReset.box.isTruthy()) {
                this.state.next = Box.empty();
                this.state.nextHasValue = false;
                return;
            }
            const writeEnabled = !this.pinWrite.box.valid || this.pinWrite.box.isTruthy();
            if (writeEnabled && this.pinData.box.valid) {
                this.state.next = this.pinData.box.clone();
                this.state.nextHasValue = true;
            } else {
                this.state.next = this.state.current.clone();
                this.state.nextHasValue = this.state.hasValue;
            }
        }
        latch() {
            if (this.state.nextHasValue !== undefined) {
                this.state.current = this.state.next.clone();
                this.state.hasValue = this.state.nextHasValue;
            }
            if (this.state.hasValue) {
                this.triggerPulse();
                this.pinQ.setBox(this.state.current);
            }
        }
        resetState() {
            super.resetState();
            this.state = { current: Box.empty(), next: Box.empty(), hasValue: false };
        }
    }

    // 15. Máy Đếm (COUNTER)
    class CounterComp extends Component {
        constructor(id, type = 'COUNTER', name = '') {
            super(id, type, name || (isEn() ? 'Counter' : 'Bộ Đếm'));
            this.icon = '🔢';
            this.color = '#254a3f';
            this.borderColor = '#389e7a';
            this.height = 76;
            this.pinPulse = this.addInputPin('PULSE', 'PULSE');
            this.pinReset = this.addInputPin('RESET', 'RESET');
            this.pinCount = this.addOutputPin('COUNT', 'COUNT');
            this.state = { count: 0, nextCount: 0 };
            this.updateOutput();
            this.updateLocalization();
        }
        updateLocalization() {
            this.name = isEn() ? 'Counter' : 'Bộ Đếm';
            if (this.pinPulse) this.pinPulse.label = isEn() ? 'PULSE' : 'Đếm';
            if (this.pinReset) this.pinReset.label = isEn() ? 'RESET' : 'Về 0';
            if (this.pinCount) this.pinCount.label = isEn() ? 'COUNT' : 'Số lượng';
        }
        updateOutput() {
            this.pinCount.setBox(new Box(this.state.count, 'NUMBER', true));
        }
        evaluate() {
            let next = this.state.count;
            if (this.pinReset.box.valid && this.pinReset.box.isTruthy()) {
                next = 0;
            } else if (this.pinPulse.box.valid && this.pinPulse.box.isTruthy()) {
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
            this.state = { count: 0, nextCount: 0 };
            this.updateOutput();
        }
    }

    // 16. Trạm Nghỉ (REST_STOP / DELAY)
    class RestStopComp extends Component {
        constructor(id, type = 'REST_STOP', name = '') {
            super(id, type, name || (isEn() ? 'Delay' : 'Trạm Nghỉ'));
            this.icon = '☕';
            this.color = '#38334a';
            this.borderColor = '#7965ad';
            this.width = 84;
            this.pinA = this.addInputPin('IN', 'IN');
            this.pinQ = this.addOutputPin('OUT', 'OUT');
            this.state = {
                current: new Box(0, 'NUMBER', true),
                next: new Box(0, 'NUMBER', true)
            };
            this.pinQ.setBox(this.state.current);
            this.updateLocalization();
        }
        updateLocalization() {
            this.name = isEn() ? 'Delay' : 'Trạm Nghỉ';
            if (this.pinA) this.pinA.label = isEn() ? 'IN' : 'Vào';
            if (this.pinQ) this.pinQ.label = isEn() ? 'OUT' : 'Nghỉ 1';
        }
        evaluate() {
            this.pinQ.setBox(this.state.current);
            if (this.pinA.box.valid) {
                this.state.next = this.pinA.box.clone();
            } else {
                this.state.next = new Box(0, 'NUMBER', true);
            }
        }
        latch() {
            this.state.current = this.state.next.clone();
            this.pinQ.setBox(this.state.current);
            this.triggerPulse();
        }
        resetState() {
            super.resetState();
            this.state = {
                current: new Box(0, 'NUMBER', true),
                next: new Box(0, 'NUMBER', true)
            };
            this.pinQ.setBox(this.state.current);
        }
    }

    // 17. Chia Đôi Giá Trị (HALVER / RIGHT_SHIFT)
    class HalverComp extends Component {
        constructor(id, type = 'HALVER', name = '') {
            super(id, type, name || (isEn() ? 'Shift (÷2)' : 'Chia Đôi (>>1)'));
            this.icon = '✂️';
            this.color = '#382c42';
            this.borderColor = '#8a59aa';
            this.width = 84;
            this.pinA = this.addInputPin('IN', 'IN');
            this.pinQ = this.addOutputPin('OUT', '÷2');
            this.updateLocalization();
        }
        updateLocalization() {
            this.name = isEn() ? 'Shift (÷2)' : 'Chia Đôi (>>1)';
            if (this.pinA) this.pinA.label = isEn() ? 'IN' : 'Vào';
            if (this.pinQ) this.pinQ.label = isEn() ? '÷2' : '÷2';
        }
        evaluate() {
            if (!this.pinA.box.valid) {
                this.pinQ.clearBox();
                return;
            }
            this.triggerPulse();
            const res = Math.floor(this.pinA.box.asNumber() / 2);
            this.pinQ.setBox(new Box(res, 'NUMBER', true));
        }
    }

    // Băng chuyền IN Belt và Kho OUT Belt
    class InputBelt extends Component {
        constructor(id, portName = 'IN') {
            const defaultName = isEn() ? `Inlet [${portName}]` : `Băng Vào [${portName}]`;
            super(id, 'INPUT_PORT', defaultName);
            this.icon = '📥';
            this.portName = portName;
            this.color = '#183638';
            this.borderColor = '#1fb8a8';
            this.width = 96;
            this.height = 58;
            this.isPort = true;
            this.pinOut = this.addOutputPin(portName, portName);
            this.updateLocalization();
        }
        updateLocalization() {
            this.name = isEn() ? `Inlet [${this.portName}]` : `Băng Vào [${this.portName}]`;
            if (this.pinOut) this.pinOut.label = this.portName;
        }
        feed(value) {
            if (value === undefined || value === null) {
                this.pinOut.clearBox();
            } else {
                this.pinOut.setBox(Box.from(value));
                this.triggerPulse();
            }
        }
    }

    class OutputBelt extends Component {
        constructor(id, portName = 'OUT') {
            const defaultName = isEn() ? `Outlet [${portName}]` : `Kho Ra [${portName}]`;
            super(id, 'OUTPUT_PORT', defaultName);
            this.icon = '📬';
            this.portName = portName;
            this.color = '#382025';
            this.borderColor = '#d94158';
            this.width = 96;
            this.height = 58;
            this.isPort = true;
            this.pinIn = this.addInputPin(portName, portName);
            this.receivedBoxes = [];
            this.updateLocalization();
        }
        updateLocalization() {
            this.name = isEn() ? `Outlet [${this.portName}]` : `Kho Ra [${this.portName}]`;
            if (this.pinIn) this.pinIn.label = this.portName;
        }
        getReceivedBox() {
            return this.pinIn.box;
        }
        getReceivedSignal() {
            return this.pinIn.box;
        }
        recordValue() {
            if (this.pinIn.box.valid) {
                this.receivedBoxes.push(this.pinIn.box.value);
                this.triggerPulse();
                return this.pinIn.box.value;
            }
            return null;
        }
        resetState() {
            super.resetState();
            this.receivedBoxes = [];
        }
    }

    // Registry ánh xạ cả V2 và V1
    const REGISTRY = {
        // V2 Names
        'RAIL': RailComp,
        'COPIER': CopierComp,
        'JUNCTION': JunctionComp,
        'DUAL_CHECK': DualCheckComp,
        'ANY_PASS': AnyPassComp,
        'FLIP': FlipComp,
        'DIFF_CHECK': DiffCheckComp,
        'MERGER': MergerComp,
        'SPLITTER_VAL': SplitterValComp,
        'FIXED_SUPPLY': FixedSupplyComp,
        'SCALE': ScaleComp,
        'SELECTOR': SelectorComp,
        'FILTER': FilterComp,
        'STORAGE': StorageComp,
        'COUNTER': CounterComp,
        'REST_STOP': RestStopComp,
        'HALVER': HalverComp,

        // V1 Names (Ánh xạ tương thích)
        'WIRE': RailComp,
        'SPLITTER': CopierComp,
        'SWITCH': JunctionComp,
        'DEMUX': JunctionComp,
        'AND': DualCheckComp,
        'OR': AnyPassComp,
        'NOT': FlipComp,
        'XOR': DiffCheckComp,
        'ADDER': MergerComp,
        'SUBTRACTOR': SplitterValComp,
        'CONSTANT': FixedSupplyComp,
        'COMPARATOR': ScaleComp,
        'MUX': SelectorComp,
        'REGISTER': StorageComp,
        'DELAY': RestStopComp,
        'RIGHT_SHIFT': HalverComp,

        // Ports
        'INPUT_PORT': InputBelt,
        'OUTPUT_PORT': OutputBelt
    };

    SF.RailComp = RailComp;
    SF.CopierComp = CopierComp;
    SF.JunctionComp = JunctionComp;
    SF.DualCheckComp = DualCheckComp;
    SF.AnyPassComp = AnyPassComp;
    SF.FlipComp = FlipComp;
    SF.DiffCheckComp = DiffCheckComp;
    SF.MergerComp = MergerComp;
    SF.SplitterValComp = SplitterValComp;
    SF.FixedSupplyComp = FixedSupplyComp;
    SF.ScaleComp = ScaleComp;
    SF.SelectorComp = SelectorComp;
    SF.FilterComp = FilterComp;
    SF.StorageComp = StorageComp;
    SF.CounterComp = CounterComp;
    SF.RestStopComp = RestStopComp;
    SF.HalverComp = HalverComp;
    SF.InputBelt = InputBelt;
    SF.OutputBelt = OutputBelt;
    SF.InputPort = InputBelt;
    SF.OutputPort = OutputBelt;

    SF.COMPONENT_REGISTRY = REGISTRY;

    SF.createComponent = function(type, id, ...args) {
        const Cls = REGISTRY[type];
        if (!Cls) {
            console.error(`Không tìm thấy linh kiện loại "${type}".`);
            return null;
        }
        return new Cls(id, ...args);
    };
})(window.SF);
