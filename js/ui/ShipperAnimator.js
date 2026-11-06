/**
 * ShipperAnimator.js - Quản lý nhân vật Shipper "BOX" chạy giao hàng trên đường ray v2.0
 * Vẽ nhân vật procedural bằng Canvas: đầu vuông, đội mũ Signal Corp, ba lô, biểu cảm mắt, hoạt họa bước chân
 */
window.SF = window.SF || {};

(function(SF) {
    class ShipperAnimator {
        constructor() {
            this.state = 'IDLE'; // 'IDLE' | 'PICKUP' | 'RUN' | 'PROCESS' | 'DELIVER' | 'CRASH' | 'CELEBRATE' | 'TIRED'
            this.animTime = 0;
            this.shippers = []; // Danh sách các shipper đang chạy trên ray
            this.activeAnimations = [];
        }

        handleEvent(evt) {
            this.state = evt.type;
            if (evt.type === 'RUN' && evt.rails) {
                // Tạo các shipper chạy dọc theo các ray đang hoạt động
                for (const rail of evt.rails) {
                    for (const pkt of rail.packets) {
                        this.shippers.push({
                            rail: rail,
                            packet: pkt,
                            progress: pkt.progress
                        });
                    }
                }
            } else if (evt.type === 'IDLE' || evt.type === 'STOPPED') {
                this.shippers = [];
            }
        }

        update(dt = 0.016) {
            this.animTime += dt;
        }

        /**
         * Vẽ nhân vật BOX tại vị trí cụ thể (x, y) với thùng hàng trên đầu
         */
        drawShipper(ctx, x, y, options = {}) {
            const size = options.size || 28;
            const carryingBox = options.box || null;
            const flip = options.flip || false;
            const state = options.state || this.state;
            const simSpeed = (window.game && window.game.simulator) ? window.game.simulator.speed : 1.0;
            const t = this.animTime * (6.5 * Math.min(2.5, Math.max(0.6, Math.sqrt(simSpeed))));

            ctx.save();
            ctx.translate(x, y);
            if (flip) ctx.scale(-1, 1);

            // Hoạt họa nhấp nhô bước chạy / giậm chân
            let bobY = 0;
            let legSwing = 0;
            if (state === 'RUN') {
                bobY = Math.sin(t) * 3;
                legSwing = Math.sin(t) * 6;
            } else if (state === 'IDLE') {
                bobY = Math.sin(t * 0.4) * 1.5;
            } else if (state === 'CELEBRATE') {
                bobY = -Math.abs(Math.sin(t * 1.5) * 12);
            } else if (state === 'CRASH') {
                bobY = 6;
            }

            // 1. Chân của BOX (Hai chân nhỏ màu xanh xám)
            ctx.fillStyle = '#334155';
            if (state === 'RUN') {
                // Chân trái
                ctx.fillRect(-6 - legSwing * 0.5, 12, 4, 8 + bobY * 0.3);
                // Chân phải
                ctx.fillRect(2 + legSwing * 0.5, 12, 4, 8 - bobY * 0.3);
            } else if (state === 'CRASH') {
                // Chân ngã chổng vó
                ctx.fillRect(-10, 10, 8, 4);
                ctx.fillRect(3, 10, 8, 4);
            } else {
                ctx.fillRect(-6, 12 + bobY, 4, 6);
                ctx.fillRect(2, 12 + bobY, 4, 6);
            }

            // 2. Ba lô giao hàng (màu cam đất phía sau)
            ctx.fillStyle = '#b45309';
            ctx.fillRect(-size / 2 - 4, -size / 2 + 6 + bobY, 4, size * 0.65);

            // 3. Thân người hình hộp vuông của BOX (màu xanh lá đậm đồng phục xưởng Foundry)
            ctx.fillStyle = '#047857';
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(-size / 2, -size / 2 + bobY, size, size, 5);
            ctx.fill();
            ctx.stroke();

            // 4. Mũ lưỡi trai Signal Corp (Vành mũ vàng cam công nghiệp)
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.roundRect(-size / 2 - 2, -size / 2 - 4 + bobY, size + 8, 5, 2);
            ctx.fill();
            // Đỉnh mũ xanh
            ctx.fillStyle = '#0369a1';
            ctx.fillRect(-size / 2 + 2, -size / 2 - 8 + bobY, size - 4, 4);

            // 5. Khuôn mặt & Mắt biểu cảm
            ctx.fillStyle = '#ffffff';
            if (state === 'CRASH') {
                // Mắt "X X" khi bị va chạm / lỗi
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 2;
                // Mắt trái X
                ctx.beginPath();
                ctx.moveTo(-7, -4 + bobY); ctx.lineTo(-3, 0 + bobY);
                ctx.moveTo(-3, -4 + bobY); ctx.lineTo(-7, 0 + bobY);
                ctx.stroke();
                // Mắt phải X
                ctx.beginPath();
                ctx.moveTo(3, -4 + bobY); ctx.lineTo(7, 0 + bobY);
                ctx.moveTo(7, -4 + bobY); ctx.lineTo(3, 0 + bobY);
                ctx.stroke();
            } else if (state === 'CELEBRATE') {
                // Mắt cười híp hình vòng cung ^^
                ctx.strokeStyle = '#f8fafc';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(-5, -2 + bobY, 3, Math.PI, 0);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(5, -2 + bobY, 3, Math.PI, 0);
                ctx.stroke();
            } else {
                // Mắt to tròn thân thiện
                ctx.beginPath();
                ctx.arc(-5, -2 + bobY, 3, 0, Math.PI * 2);
                ctx.arc(5, -2 + bobY, 3, 0, Math.PI * 2);
                ctx.fill();
                // Tròng đen nhìn về phía trước
                ctx.fillStyle = '#0f172a';
                ctx.beginPath();
                ctx.arc(-4, -2 + bobY, 1.5, 0, Math.PI * 2);
                ctx.arc(6, -2 + bobY, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }

            // Má hồng dễ thương
            ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
            ctx.fillRect(-8, 3 + bobY, 3, 2);
            ctx.fillRect(5, 3 + bobY, 3, 2);

            // 6. Hai tay giơ lên bê thùng hàng
            ctx.fillStyle = '#38bdf8';
            if (carryingBox && state !== 'CRASH') {
                // Tay giơ lên đỡ thùng
                ctx.fillRect(-size / 2 - 3, -size / 2 - 6 + bobY, 3, 10);
                ctx.fillRect(size / 2, -size / 2 - 6 + bobY, 3, 10);

                // Thùng hàng carton nằm trên đầu BOX
                this.drawCarriedBox(ctx, 0, -size / 2 - 16 + bobY, carryingBox);
            } else if (state === 'CELEBRATE') {
                // Tay giơ chữ V ăn mừng
                ctx.fillRect(-size / 2 - 4, -size / 2 - 8 + bobY, 3, 12);
                ctx.fillRect(size / 2 + 1, -size / 2 - 8 + bobY, 3, 12);
            } else {
                // Tay buông thõng
                ctx.fillRect(-size / 2 - 2, 0 + bobY, 3, 8);
                ctx.fillRect(size / 2 - 1, 0 + bobY, 3, 8);
            }

            ctx.restore();
        }

        drawCarriedBox(ctx, bx, by, box) {
            const bsize = 22;
            const isBool = box.type === 'BOOL';
            const color = isBool ? (box.value ? '#10b981' : '#ef4444') : '#d97706';

            ctx.save();
            ctx.fillStyle = color;
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 1.5;

            // Nền thùng
            ctx.beginPath();
            ctx.roundRect(bx - bsize / 2, by - bsize / 2, bsize, bsize, 3);
            ctx.fill();
            ctx.stroke();

            // Băng dính niêm phong thùng
            ctx.fillStyle = '#fef3c7';
            ctx.fillRect(bx - 3, by - bsize / 2, 6, bsize);

            // Nhãn giá trị thùng
            ctx.fillStyle = '#0f172a';
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(box.toString(), bx, by);

            ctx.restore();
        }
    }

    SF.ShipperAnimator = ShipperAnimator;
})(window.SF);
