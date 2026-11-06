/**
 * Rail.js - Đường ray (Wire) dẫn truyền thùng hàng trong Signal Factory v2.0
 * Nối giữa các trạm xử lý để nhân vật BOX chạy giao hàng
 * 
 * Tối ưu hóa QA/QC:
 * - Khắc phục nghẽn bộ nhớ do multi-pass relaxation loop (8 passes/tick).
 * - Debouncing cho spawnShipperRun và chặn rò rỉ mảng packets.
 */
window.SF = window.SF || {};

(function(SF) {
    'use strict';

    class Rail {
        constructor(id, fromPin, toPin) {
            this.id = id || ('rail_' + Math.random().toString(36).substr(2, 9));
            this.fromPin = fromPin; // Pin OUT
            this.toPin = toPin;     // Pin IN
            this.currentBox = SF.Box.empty();
            this.signal = this.currentBox; // Tương thích

            this.visualState = 'empty'; // 'empty' | 'carrying' | 'highlight'
            this.packets = []; // Các chuyến hàng BOX đang chạy trên ray { progress, box, shipperId }

            if (this.fromPin && typeof this.fromPin.connectRail === 'function') {
                this.fromPin.connectRail(this);
            }
            if (this.toPin && typeof this.toPin.connectRail === 'function') {
                this.toPin.connectRail(this);
            }
        }

        propagate() {
            if (!this.fromPin) return;
            const sourceBox = this.fromPin.box || this.fromPin.signal;
            if (sourceBox && sourceBox.valid) {
                // Kiểm tra xem giá trị có phải là một kiện hàng mới hoặc chuyển tiếp hợp lệ không
                const isNewBox = !this.currentBox.valid || (this.currentBox.value !== sourceBox.value);
                this.currentBox = sourceBox.clone();
                this.signal = this.currentBox;
                this.visualState = 'carrying';

                // Chỉ spawn animation khi có kiện hàng mới được kích hoạt, tránh spawn 8 lần trong cùng 1 tick
                if (isNewBox) {
                    this.spawnShipperRun(this.currentBox);
                }
            } else {
                this.currentBox = SF.Box.empty();
                this.signal = this.currentBox;
                this.visualState = 'empty';
            }

            if (this.toPin) {
                this.toPin.setBox(this.currentBox);
            }
        }

        spawnShipperRun(box) {
            // Không spawn dồn dập nếu packet trước vừa mới xuất phát (progress < 0.25)
            if (this.packets.length > 0 && this.packets[this.packets.length - 1].progress < 0.25) {
                return;
            }

            this.packets.push({
                progress: 0,
                box: box.clone(),
                signal: box.clone() // Tương thích
            });

            // Giữ tối đa 6 packets trên 1 tuyến ray để bảo toàn hiệu năng và bộ nhớ
            if (this.packets.length > 6) {
                this.packets.shift();
            }
        }

        updatePackets(dt = 0.05) {
            for (let i = this.packets.length - 1; i >= 0; i--) {
                this.packets[i].progress += dt;
                if (this.packets[i].progress >= 1) {
                    this.packets.splice(i, 1);
                }
            }
        }

        destroy() {
            if (this.fromPin) {
                this.fromPin.disconnectRail(this);
            }
            if (this.toPin) {
                this.toPin.disconnectRail(this);
            }
            this.packets = [];
        }
    }

    SF.Rail = Rail;
    SF.Wire = Rail; // Tương thích ngược
})(window.SF);
