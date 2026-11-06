/**
 * DragDrop.js - Kéo thả linh kiện từ khay lên bảng mạch và di chuyển linh kiện trên bảng
 */
window.SF = window.SF || {};

(function(SF) {
    class DragDrop {
        constructor(canvas, circuit, renderer, trayContainer) {
            this.canvas = canvas;
            this.circuit = circuit;
            this.renderer = renderer;
            this.trayContainer = trayContainer;

            this.draggedComp = null;
            this.dragOffset = { x: 0, y: 0 };
            this.isDraggingExisting = false;

            this.lastAvailable = [];
            this.setupBoardEvents();
            this.setupTrayEvents();

            if (SF.i18n) {
                SF.i18n.addListener(() => {
                    if (this.lastAvailable) this.updateTray(this.lastAvailable);
                });
            }
        }

        getCanvasPos(e) {
            const rect = this.canvas.getBoundingClientRect();
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }

        setupBoardEvents() {
            this.canvas.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return;
                const pos = this.getCanvasPos(e);

                // Ưu tiên: nếu click trúng pin, để WireDrawer xử lý
                if (this.circuit.getPinAt(pos.x, pos.y, 14)) return;

                const comp = this.circuit.getComponentAt(pos.x, pos.y);
                if (comp && !comp.isPort) {
                    this.draggedComp = comp;
                    this.isDraggingExisting = true;
                    this.dragOffset = {
                        x: pos.x - comp.x,
                        y: pos.y - comp.y
                    };
                    comp.selected = true;
                    SF.soundManager.playClick();
                } else if (comp && comp.isPort) {
                    // Port cố định, không kéo
                    comp.selected = true;
                } else {
                    // Bỏ chọn
                    for (const c of this.circuit.components) {
                        c.selected = false;
                    }
                }
            });

            this.canvas.addEventListener('mousemove', (e) => {
                if (this.isDraggingExisting && this.draggedComp) {
                    const pos = this.getCanvasPos(e);
                    const cell = this.circuit.cellSize || 50;
                    
                    // Giữ trong giới hạn canvas
                    let nx = pos.x - this.dragOffset.x;
                    let ny = pos.y - this.dragOffset.y;

                    // Giới hạn không đè lên hàng cột port
                    nx = Math.max(120, Math.min(this.canvas.width - this.draggedComp.width - 120, nx));
                    ny = Math.max(20, Math.min(this.canvas.height - this.draggedComp.height - 20, ny));

                    // Hút vào lưới (Grid Snapping)
                    const snappedX = Math.round(nx / cell) * cell;
                    const snappedY = Math.round(ny / cell) * cell;

                    this.draggedComp.x = snappedX;
                    this.draggedComp.y = snappedY;
                    this.draggedComp.updatePinPositions();
                }
            });

            window.addEventListener('mouseup', () => {
                if (this.isDraggingExisting && this.draggedComp) {
                    SF.soundManager.playClick();
                }
                this.isDraggingExisting = false;
                this.draggedComp = null;
            });

            // Double click để đổi giá trị của CONSTANT / FIXED_SUPPLY
            this.canvas.addEventListener('dblclick', async (e) => {
                const pos = this.getCanvasPos(e);
                const comp = this.circuit.getComponentAt(pos.x, pos.y);
                if (comp && (comp.type === 'CONSTANT' || comp.type === 'FIXED_SUPPLY')) {
                    const val = SF.dialog 
                        ? await SF.dialog.prompt('Nhập giá trị hằng số N cho linh kiện:', comp.customValue)
                        : prompt('Nhập giá trị hằng số N cho linh kiện:', comp.customValue);
                    if (val !== null && val.trim() !== '') {
                        comp.setValue(val.trim());
                        SF.soundManager.playClick();
                    }
                }
            });
        }

        setupTrayEvents() {
            if (!this.trayContainer) return;

            // Xử lý kéo thả từ HTML tray items vào Canvas
            this.trayContainer.addEventListener('dragstart', (e) => {
                const target = e.target.closest('.tray-item');
                if (target) {
                    const type = target.dataset.type;
                    e.dataTransfer.setData('text/plain', type);
                    SF.soundManager.playClick();
                }
            });

            // Cho phép click vào linh kiện trên khay để tự thêm vào màn hình (tự động né các trạm đã có)
            this.trayContainer.addEventListener('click', (e) => {
                const target = e.target.closest('.tray-item');
                if (target) {
                    const type = target.dataset.type;
                    if (type) {
                        const comp = SF.createComponent(type);
                        if (comp) {
                            const cell = this.circuit.cellSize || 50;
                            let cx = Math.round((this.canvas.width / 2 - comp.width / 2) / cell) * cell;
                            let cy = Math.round((this.canvas.height / 2 - comp.height / 2) / cell) * cell;

                            // Tự động tìm vị trí trống trên lưới, không bao giờ đặt chồng lên nhau
                            let attempts = 0;
                            while (this.circuit.components.some(c => !c.isPort && Math.hypot(c.x - cx, c.y - cy) < 45) && attempts < 25) {
                                cx += cell * 2;
                                if (cx > this.canvas.width - comp.width - 130) {
                                    cx = 140;
                                    cy += cell * 1.5;
                                }
                                if (cy > this.canvas.height - comp.height - 40) {
                                    cy = 40;
                                }
                                attempts++;
                            }

                            comp.x = cx;
                            comp.y = cy;
                            comp.updatePinPositions();
                            this.circuit.addComponent(comp);
                            SF.soundManager.playClick();
                        }
                    }
                }
            });

            this.canvas.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
            });

            this.canvas.addEventListener('drop', (e) => {
                e.preventDefault();
                const type = e.dataTransfer.getData('text/plain');
                if (!type) return;

                const pos = this.getCanvasPos(e);
                const cell = this.circuit.cellSize || 50;

                const comp = SF.createComponent(type);
                if (comp) {
                    let nx = Math.max(120, Math.min(this.canvas.width - comp.width - 120, pos.x - comp.width / 2));
                    let ny = Math.max(20, Math.min(this.canvas.height - comp.height - 20, pos.y - comp.height / 2));

                    comp.x = Math.round(nx / cell) * cell;
                    comp.y = Math.round(ny / cell) * cell;
                    comp.updatePinPositions();

                    this.circuit.addComponent(comp);
                    SF.soundManager.playClick();
                }
            });
        }

        updateTray(availableComponents = []) {
            this.lastAvailable = availableComponents;
            if (!this.trayContainer) return;
            this.trayContainer.innerHTML = '';

            const t = (k, p) => SF.t ? SF.t(k, p) : k;

            if (availableComponents.length === 0) {
                this.trayContainer.innerHTML = `<span class="tray-empty">${t('WAITING_CARGO')}</span>`;
                return;
            }

            const infoMap = {
                // V2 Trạm Xử Lý
                'RAIL': { icon: '═', nameKey: 'STATION_RAIL', descKey: 'STATION_RAIL_DESC' },
                'COPIER': { icon: '📋', nameKey: 'STATION_COPIER', descKey: 'STATION_COPIER_DESC' },
                'JUNCTION': { icon: '🔀', nameKey: 'STATION_JUNCTION', descKey: 'STATION_JUNCTION_DESC' },
                'DUAL_CHECK': { icon: '✅✅', nameKey: 'STATION_DUAL_CHECK', descKey: 'STATION_DUAL_CHECK_DESC' },
                'ANY_PASS': { icon: '🚪', nameKey: 'STATION_ANY_PASS', descKey: 'STATION_ANY_PASS_DESC' },
                'FLIP': { icon: '🔄', nameKey: 'STATION_FLIP', descKey: 'STATION_FLIP_DESC' },
                'DIFF_CHECK': { icon: '≠', nameKey: 'STATION_DIFF_CHECK', descKey: 'STATION_DIFF_CHECK_DESC' },
                'MERGER': { icon: '➕', nameKey: 'STATION_MERGER', descKey: 'STATION_MERGER_DESC' },
                'SPLITTER_VAL': { icon: '➖', nameKey: 'STATION_SPLITTER_VAL', descKey: 'STATION_SPLITTER_VAL_DESC' },
                'FIXED_SUPPLY': { icon: '📦N', nameKey: 'STATION_FIXED_SUPPLY', descKey: 'STATION_FIXED_SUPPLY_DESC' },
                'SCALE': { icon: '⚖️', nameKey: 'STATION_SCALE', descKey: 'STATION_SCALE_DESC' },
                'SELECTOR': { icon: '🎯', nameKey: 'STATION_SELECTOR', descKey: 'STATION_SELECTOR_DESC' },
                'FILTER': { icon: '🛡️', nameKey: 'STATION_FILTER', descKey: 'STATION_FILTER_DESC' },
                'STORAGE': { icon: '🏛️', nameKey: 'STATION_STORAGE', descKey: 'STATION_STORAGE_DESC' },
                'COUNTER': { icon: '🔢', nameKey: 'STATION_COUNTER', descKey: 'STATION_COUNTER_DESC' },
                'REST_STOP': { icon: '☕', nameKey: 'STATION_REST_STOP', descKey: 'STATION_REST_STOP_DESC' },
                'HALVER': { icon: '✂️', nameKey: 'STATION_HALVER', descKey: 'STATION_HALVER_DESC' },

                // V1 Mappings
                'SPLITTER': { icon: '📋', nameKey: 'STATION_COPIER', descKey: 'STATION_COPIER_DESC' },
                'SWITCH': { icon: '🔀', nameKey: 'STATION_JUNCTION', descKey: 'STATION_JUNCTION_DESC' },
                'AND': { icon: '✅✅', nameKey: 'STATION_DUAL_CHECK', descKey: 'STATION_DUAL_CHECK_DESC' },
                'OR': { icon: '🚪', nameKey: 'STATION_ANY_PASS', descKey: 'STATION_ANY_PASS_DESC' },
                'NOT': { icon: '🔄', nameKey: 'STATION_FLIP', descKey: 'STATION_FLIP_DESC' },
                'XOR': { icon: '≠', nameKey: 'STATION_DIFF_CHECK', descKey: 'STATION_DIFF_CHECK_DESC' },
                'ADDER': { icon: '➕', nameKey: 'STATION_MERGER', descKey: 'STATION_MERGER_DESC' },
                'SUBTRACTOR': { icon: '➖', nameKey: 'STATION_SPLITTER_VAL', descKey: 'STATION_SPLITTER_VAL_DESC' },
                'COMPARATOR': { icon: '⚖️', nameKey: 'STATION_SCALE', descKey: 'STATION_SCALE_DESC' },
                'CONSTANT': { icon: '📦N', nameKey: 'STATION_FIXED_SUPPLY', descKey: 'STATION_FIXED_SUPPLY_DESC' },
                'MUX': { icon: '🎯', nameKey: 'STATION_SELECTOR', descKey: 'STATION_SELECTOR_DESC' },
                'REGISTER': { icon: '🏛️', nameKey: 'STATION_STORAGE', descKey: 'STATION_STORAGE_DESC' },
                'DELAY': { icon: '☕', nameKey: 'STATION_REST_STOP', descKey: 'STATION_REST_STOP_DESC' },
                'RIGHT_SHIFT': { icon: '✂️', nameKey: 'STATION_HALVER', descKey: 'STATION_HALVER_DESC' }
            };

            for (const type of availableComponents) {
                if (type === 'WIRE') continue;
                const info = infoMap[type] || { icon: '📦', nameKey: null, descKey: null };
                const name = (info.nameKey && SF.t) ? SF.t(info.nameKey) : type;
                const desc = (info.descKey && SF.t) ? SF.t(info.descKey) : type;

                const item = document.createElement('div');
                item.className = 'tray-item';
                item.draggable = true;
                item.dataset.type = type;
                item.title = `${name}: ${desc}`;
                item.innerHTML = `
                    <div class="tray-item-icon">${info.icon}</div>
                    <div class="tray-item-name">${name}</div>
                `;
                this.trayContainer.appendChild(item);
            }
        }
    }

    SF.DragDrop = DragDrop;
})(window.SF);
