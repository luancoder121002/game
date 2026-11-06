/**
 * Box.js - Thùng hàng (Signal) trong Signal Factory v2.0
 * Biểu diễn thùng carton vật lý chứa giá trị số hoặc nhãn trạng thái (Xanh/Đỏ)
 */
window.SF = window.SF || {};

(function(SF) {
    class Box {
        constructor(value = 0, type = 'NUMBER', valid = true) {
            this.value = value;
            this.type = type; // 'NUMBER' | 'BOOL' | 'STORY'
            this.valid = valid;

            // Xác định màu sắc vật lý của thùng hàng
            if (this.type === 'BOOL') {
                this.color = value ? '#10b981' : '#ef4444'; // Xanh ✓ hoặc Đỏ ✗
            } else if (this.type === 'STORY') {
                this.color = '#f59e0b'; // Thùng hàng vàng bí mật
            } else {
                this.color = '#b45309'; // Thùng carton nâu tiêu chuẩn
            }
        }

        static empty() {
            return new Box(0, 'NUMBER', false);
        }

        static from(val, type = 'NUMBER') {
            if (val === undefined || val === null) {
                return Box.empty();
            }
            if (typeof val === 'boolean') {
                return new Box(val ? 1 : 0, 'BOOL', true);
            }
            if (typeof val === 'number') {
                return new Box(val, type, true);
            }
            if (val instanceof Box) {
                return val.clone();
            }
            const num = Number(val);
            return new Box(isNaN(num) ? 0 : num, type, true);
        }

        clone() {
            const b = new Box(this.value, this.type, this.valid);
            b.color = this.color;
            return b;
        }

        isTruthy() {
            return this.valid && Boolean(this.value);
        }

        asNumber() {
            if (!this.valid) return 0;
            return typeof this.value === 'boolean' ? (this.value ? 1 : 0) : Number(this.value);
        }

        asBoolean() {
            if (!this.valid) return false;
            return Boolean(this.value);
        }

        toString() {
            if (!this.valid) return '∅';
            return String(this.value);
        }
    }

    SF.Box = Box;
    SF.Signal = Box; // Tương thích ngược
})(window.SF);
