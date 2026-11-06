/**
 * BoardRenderer.js - Vẽ bảng mạch, đường ray, trạm xử lý và nhân vật Shipper BOX v2.0
 */
window.SF = window.SF || {};

(function(SF) {
    if (!CanvasRenderingContext2D.prototype.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
            if (!radii) radii = 0;
            const r = typeof radii === 'number' ? radii : (radii[0] || 0);
            this.beginPath();
            this.moveTo(x + r, y);
            this.lineTo(x + w - r, y);
            this.quadraticCurveTo(x + w, y, x + w, y + r);
            this.lineTo(x + w, y + h - r);
            this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            this.lineTo(x + r, y + h);
            this.quadraticCurveTo(x, y + h, x, y + h - r);
            this.lineTo(x, y + r);
            this.quadraticCurveTo(x, y, x + r, y);
            this.closePath();
            return this;
        };
    }

    class BoardRenderer {
        constructor(canvas, circuit, shipperAnimator) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.circuit = circuit;
            this.shipperAnimator = shipperAnimator || new SF.ShipperAnimator();

            this.drawingWire = null;
            this.hoveredPin = null;
            this.hoveredComp = null;
            this.selectedComp = null;

            this.animTime = 0;

            // Vị trí Glitch Mèo
            this.glitchCatPos = null;
        }

        render(dt = 0.016) {
            this.animTime += dt;
            this.shipperAnimator.update(dt);

            const ctx = this.ctx;
            const w = this.canvas.width;
            const h = this.canvas.height;

            ctx.clearRect(0, 0, w, h);

            // 1. Nền kho hàng công nghiệp
            this.drawGrid(ctx, w, h);

            // 2. Vẽ các đường ray nối trạm (Rails)
            this.drawRails(ctx, dt);

            // 3. Đường ray đang vẽ dở bằng chuột / ngón tay
            if (this.drawingWire) {
                this.drawActiveDrawingRail(ctx);
            }

            // 4. Vẽ các trạm xử lý (Processing Stations)
            this.drawStations(ctx, dt);

            // 5. Vẽ nhân vật Shipper BOX và mèo Glitch
            this.drawShippersAndCharacters(ctx);

            // 6. Highlight chân cắm
            if (this.hoveredPin) {
                this.drawPinHighlight(ctx, this.hoveredPin);
            }
        }

        drawGrid(ctx, width, height) {
            const cellSize = this.circuit.cellSize || 50;

            // Nền sàn nhà kho xanh lá đậm công nghiệp
            ctx.fillStyle = '#051910';
            ctx.fillRect(0, 0, width, height);

            // Lưới ray sàn xanh rừng
            ctx.strokeStyle = '#0e3322';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let x = 0; x <= width; x += cellSize) {
                ctx.moveTo(x, 0); ctx.lineTo(x, height);
            }
            for (let y = 0; y <= height; y += cellSize) {
                ctx.moveTo(0, y); ctx.lineTo(width, y);
            }
            ctx.stroke();

            // Đinh ốc tán đồng vàng
            ctx.fillStyle = '#1e593d';
            for (let x = cellSize; x < width; x += cellSize) {
                for (let y = cellSize; y < height; y += cellSize) {
                    ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
                }
            }

            // Khung ranh giới viền an toàn vàng đồng
            ctx.strokeStyle = '#25664a';
            ctx.lineWidth = 3;
            ctx.strokeRect(10, 10, width - 20, height - 20);
        }

        drawRails(ctx, dt) {
            const simSpeed = (window.game && window.game.simulator) ? window.game.simulator.speed : 1.0;

            for (const rail of this.circuit.wires) {
                rail.updatePackets(dt * 0.72 * simSpeed);
                const p1 = rail.fromPin.position;
                const p2 = rail.toPin.position;

                const dx = Math.abs(p2.x - p1.x) * 0.5;
                const cp1x = p1.x + dx;
                const cp1y = p1.y;
                const cp2x = p2.x - dx;
                const cp2y = p2.y;

                // Màu sắc trạng thái đường ray (vàng - xanh lá đậm)
                let strokeColor = '#1a4734'; // Rỗng
                let glow = 'transparent';

                if (rail.visualState === 'carrying') {
                    strokeColor = '#f59e0b'; // Có hàng chạy qua: vàng sáng
                    glow = 'rgba(245, 158, 11, 0.5)';
                }

                ctx.save();
                if (glow !== 'transparent') {
                    ctx.shadowColor = glow;
                    ctx.shadowBlur = 12;
                }

                // Tà-vẹt ray kim loại
                ctx.strokeStyle = strokeColor;
                ctx.lineWidth = 4.5;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
                ctx.stroke();

                // Lõi ray vàng neon
                ctx.strokeStyle = (rail.visualState === 'carrying') ? '#fef08a' : '#25664a';
                ctx.lineWidth = 1.8;
                ctx.stroke();
                ctx.restore();

                // Vẽ nhân vật BOX chạy trên đường ray kèm thùng hàng
                for (const pkt of rail.packets) {
                    const t = Math.max(0, Math.min(1, pkt.progress));
                    const pt = this.getBezierPoint(t, p1, { x: cp1x, y: cp1y }, { x: cp2x, y: cp2y }, p2);
                    const flip = p2.x < p1.x;

                    // Vẽ vệt sáng dẫn đường vàng neon
                    ctx.save();
                    ctx.strokeStyle = '#fbbf24';
                    ctx.lineWidth = 2.5;
                    ctx.shadowColor = '#fbbf24';
                    ctx.shadowBlur = 10;
                    ctx.beginPath();
                    const trailSteps = 10;
                    for (let s = 0; s <= trailSteps; s++) {
                        const subT = Math.max(0, t - (s / trailSteps) * 0.25);
                        const subPt = this.getBezierPoint(subT, p1, { x: cp1x, y: cp1y }, { x: cp2x, y: cp2y }, p2);
                        if (s === 0) ctx.moveTo(subPt.x, subPt.y);
                        else ctx.lineTo(subPt.x, subPt.y);
                    }
                    ctx.stroke();
                    ctx.restore();

                    this.shipperAnimator.drawShipper(ctx, pt.x, pt.y - 10, {
                        box: pkt.box || pkt.signal,
                        flip: flip,
                        state: 'RUN'
                    });
                }
            }
        }

        drawActiveDrawingRail(ctx) {
            const p1 = this.drawingWire.fromPin.position;
            const p2 = { x: this.drawingWire.currentX, y: this.drawingWire.currentY };
            const dx = Math.abs(p2.x - p1.x) * 0.5;

            ctx.save();
            ctx.setLineDash([8, 4]);
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 3.5;
            ctx.shadowColor = '#fbbf24';
            ctx.shadowBlur = 12;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.bezierCurveTo(p1.x + dx, p1.y, p2.x - dx, p2.y, p2.x, p2.y);
            ctx.stroke();
            ctx.restore();
        }

        drawStations(ctx, dt) {
            for (const comp of this.circuit.components) {
                comp.update(dt);
                this.drawSingleStation(ctx, comp);
            }
        }

        drawSingleStation(ctx, comp) {
            const x = comp.x;
            const y = comp.y;
            const w = comp.width;
            const h = comp.height;
            const r = 8;

            ctx.save();

            if (comp.isProcessing) {
                ctx.shadowColor = '#f59e0b';
                ctx.shadowBlur = 18 * comp.pulseTimer;
            } else if (comp.hovered) {
                ctx.shadowColor = '#fbbf24';
                ctx.shadowBlur = 10;
            }

            // Nền trạm xanh lá đậm
            ctx.fillStyle = comp.color || '#0d3322';
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, r);
            ctx.fill();

            // Viền kim loại vàng - xanh
            ctx.strokeStyle = comp.selected ? '#fbbf24' : (comp.borderColor || '#1e593d');
            ctx.lineWidth = comp.selected ? 2.8 : 1.5;
            ctx.stroke();

            // Thanh tiêu đề trạm
            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.beginPath();
            ctx.roundRect(x, y, w, 20, [r, r, 0, 0]);
            ctx.fill();

            // Tên trạm
            ctx.fillStyle = '#cbd5e1';
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(comp.name, x + w / 2, y + 10);

            // Icon trạm
            ctx.font = '20px sans-serif';
            ctx.fillText(comp.icon || '📦', x + w / 2, y + h / 2 + 6);

            // Giá trị phụ
            if (comp.type === 'FIXED_SUPPLY' || comp.type === 'CONSTANT') {
                ctx.fillStyle = '#38bdf8';
                ctx.font = 'bold 14px monospace';
                ctx.fillText(`[${comp.customValue}]`, x + w / 2, y + h - 14);
            } else if (comp.type === 'COUNTER') {
                ctx.fillStyle = '#34d399';
                ctx.font = 'bold 12px monospace';
                ctx.fillText(`Số: ${comp.state ? comp.state.count : 0}`, x + w / 2, y + h - 14);
            } else if (comp.type === 'STORAGE' || comp.type === 'REGISTER') {
                const val = (comp.state && comp.state.hasValue) ? comp.state.current.value : '∅';
                ctx.fillStyle = '#60a5fa';
                ctx.font = 'bold 11px monospace';
                ctx.fillText(`Lưu: [${val}]`, x + w / 2, y + h - 14);
            }

            // Vẽ chân cắm
            for (const pin of comp.inputPins) this.drawPin(ctx, pin);
            for (const pin of comp.outputPins) this.drawPin(ctx, pin);

            ctx.restore();
        }

        drawPin(ctx, pin) {
            const px = pin.position.x;
            const py = pin.position.y;
            const r = pin.radius || 8;

            ctx.save();
            const baseColor = pin.isInput() ? '#f59e0b' : '#06b6d4';

            // Viền ngoài
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(px, py, r + 2, 0, Math.PI * 2);
            ctx.fill();

            // Chân kim loại
            ctx.fillStyle = baseColor;
            ctx.beginPath();
            ctx.arc(px, py, r, 0, Math.PI * 2);
            ctx.fill();

            // Lõi phát sáng khi có thùng
            if (pin.box && pin.box.valid) {
                ctx.fillStyle = pin.box.color || '#10b981';
                ctx.beginPath();
                ctx.arc(px, py, r - 3, 0, Math.PI * 2);
                ctx.fill();
            }

            // Nhãn chân
            if (pin.label) {
                ctx.fillStyle = '#94a3b8';
                ctx.font = '9px monospace';
                ctx.textBaseline = 'middle';
                if (pin.isInput()) {
                    ctx.textAlign = 'left';
                    ctx.fillText(pin.label, px + r + 4, py);
                } else {
                    ctx.textAlign = 'right';
                    ctx.fillText(pin.label, px - r - 4, py);
                }
            }

            ctx.restore();
        }

        drawPinHighlight(ctx, pin) {
            ctx.save();
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2.8;
            ctx.shadowColor = '#fbbf24';
            ctx.shadowBlur = 14;
            ctx.beginPath();
            ctx.arc(pin.position.x, pin.position.y, pin.radius + 6, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        drawShippersAndCharacters(ctx) {
            // Khi chưa chạy, vẽ BOX đứng chờ ở cổng IN đầu tiên
            if (this.circuit.inputPorts.length > 0 && this.circuit.wires.every(w => w.packets.length === 0)) {
                const inPort = this.circuit.inputPorts[0];
                this.shipperAnimator.drawShipper(ctx, inPort.x + inPort.width + 25, inPort.y + inPort.height / 2, {
                    state: 'IDLE'
                });
            }

            // Vẽ Mèo Glitch nếu có trạm
            if (this.circuit.components.length > 2) {
                const station = this.circuit.components[1];
                if (!station.isPort) {
                    this.drawGlitchCat(ctx, station.x + station.width - 15, station.y - 12);
                }
            }
        }

        drawGlitchCat(ctx, x, y) {
            const t = this.animTime * 8;
            ctx.save();
            ctx.translate(x, y);

            // Hiệu ứng glitch nhấp nháy pixel
            if (Math.sin(t) > 0.8) {
                ctx.fillStyle = '#ec4899'; // Glitch hồng
                ctx.fillRect(-8, -4, 16, 12);
            } else {
                ctx.fillStyle = '#a855f7'; // Mèo tím
                ctx.beginPath();
                ctx.arc(0, 0, 7, 0, Math.PI * 2);
                ctx.fill();

                // Tai mèo
                ctx.beginPath();
                ctx.moveTo(-6, -5); ctx.lineTo(-3, -11); ctx.lineTo(0, -5);
                ctx.moveTo(0, -5); ctx.lineTo(3, -11); ctx.lineTo(6, -5);
                ctx.fill();

                // Mắt mèo
                ctx.fillStyle = '#fbbf24';
                ctx.fillRect(-4, -2, 2, 2);
                ctx.fillRect(2, -2, 2, 2);

                // Đuôi vẫy
                ctx.strokeStyle = '#a855f7';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(5, 4);
                ctx.quadraticCurveTo(12, 2 + Math.sin(t) * 4, 14, -2);
                ctx.stroke();
            }

            ctx.restore();
        }

        getBezierPoint(t, p0, p1, p2, p3) {
            const u = 1 - t;
            const tt = t * t;
            const uu = u * u;
            const uuu = uu * u;
            const ttt = tt * t;

            const x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
            const y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;
            return { x, y };
        }
    }

    SF.BoardRenderer = BoardRenderer;
})(window.SF);
