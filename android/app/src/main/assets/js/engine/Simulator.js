/**
 * Simulator.js - Bộ điều khiển mô phỏng xung nhịp rời rạc (Shipper & Clock Tick Engine) v2.0
 */
window.SF = window.SF || {};

(function(SF) {
    class Simulator {
        constructor(circuit) {
            this.circuit = circuit;
            this.levelData = null;

            this.state = 'STOPPED'; // 'STOPPED' | 'RUNNING' | 'PAUSED' | 'STEPPING' | 'SUCCESS' | 'FAILED'
            this.currentTick = 0;
            this.maxTicks = 50;

            this.inputQueues = {};
            this.inputPointers = {};
            this.actualOutputs = {};
            this.expectedOutputs = {};

            this.speed = 1.0;
            this.tickIntervalMs = 1350; // Tốc độ chuẩn chậm rãi (1.35s/tick) để người chơi quan sát rõ
            this.timerId = null;

            // Hàng đợi sự kiện animation cho nhân vật BOX (Shipper)
            this.shipperEvents = [];

            // Callbacks
            this.onTick = null;
            this.onStateChange = null;
            this.onComplete = null;
            this.onFail = null;
            this.onShipperEvent = null;
        }

        loadLevel(levelData) {
            this.reset();
            this.levelData = levelData;
            this.maxTicks = (levelData.challenges && levelData.challenges.speedGoal) 
                ? Math.max(levelData.challenges.speedGoal * 4, 45) 
                : 50;

            this.inputQueues = {};
            this.inputPointers = {};
            this.actualOutputs = {};
            this.expectedOutputs = {};

            for (const key of Object.keys(levelData.inputs || {})) {
                this.inputQueues[key] = [...levelData.inputs[key]];
                this.inputPointers[key] = 0;
            }

            for (const key of Object.keys(levelData.expectedOutputs || {})) {
                this.expectedOutputs[key] = [...levelData.expectedOutputs[key]];
                this.actualOutputs[key] = [];
            }
        }

        reset() {
            this.stopTimer();
            this.state = 'STOPPED';
            this.currentTick = 0;
            this.circuit.resetState();
            this.shipperEvents = [];

            if (this.levelData) {
                for (const key of Object.keys(this.levelData.inputs || {})) {
                    this.inputPointers[key] = 0;
                }
                for (const key of Object.keys(this.levelData.expectedOutputs || {})) {
                    this.actualOutputs[key] = [];
                }
            }

            this.emitShipperEvent({ type: 'IDLE' });
            this.notifyStateChange();
        }

        start() {
            if (this.state === 'RUNNING') return;
            this.state = 'RUNNING';
            this.notifyStateChange();
            this.scheduleNextTick();
        }

        pause() {
            if (this.state !== 'RUNNING') return;
            this.stopTimer();
            this.state = 'PAUSED';
            this.notifyStateChange();
            this.emitShipperEvent({ type: 'IDLE' });
        }

        step() {
            if (this.state === 'RUNNING') {
                this.pause();
            }
            this.executeTick();
        }

        setSpeed(multiplier) {
            this.speed = Math.max(0.1, Math.min(10, multiplier));
            if (this.state === 'RUNNING') {
                this.stopTimer();
                this.scheduleNextTick();
            }
        }

        stopTimer() {
            if (this.timerId) {
                clearTimeout(this.timerId);
                this.timerId = null;
            }
        }

        scheduleNextTick() {
            this.stopTimer();
            if (this.state !== 'RUNNING') return;

            const interval = Math.max(90, this.tickIntervalMs / this.speed);
            this.timerId = setTimeout(() => {
                const finished = this.executeTick();
                if (!finished && this.state === 'RUNNING') {
                    this.scheduleNextTick();
                }
            }, interval);
        }

        executeTick() {
            this.currentTick++;

            // Pha 1: FETCH — BOX nhặt thùng hàng từ Input Belt
            const fetchedItems = this.fetchInputs();
            if (fetchedItems.length > 0) {
                this.emitShipperEvent({ type: 'PICKUP', items: fetchedItems });
            }

            // Pha 2 & 3: PROPAGATE & COMPUTE (Multi-pass relaxation để ổn định mạch tổ hợp)
            const MAX_SETTLE_PASSES = 8;
            for (let pass = 0; pass < MAX_SETTLE_PASSES; pass++) {
                for (const rail of this.circuit.wires) {
                    rail.propagate();
                }
                for (const comp of this.circuit.components) {
                    comp.evaluate();
                }
            }

            // Pha 3b: CLOCK EDGE / LATCH (Chốt kho tạm Storage / Delay / Counter)
            for (const comp of this.circuit.components) {
                if (typeof comp.latch === 'function') {
                    comp.latch();
                    this.emitShipperEvent({ type: 'PROCESS', componentId: comp.id });
                }
            }

            // Cập nhật lại đường ray sau latch
            for (const rail of this.circuit.wires) {
                rail.propagate();
            }

            // Phát sự kiện RUN cho các ray có thùng hàng đang chuyển động
            this.emitShipperEvent({ type: 'RUN', rails: this.circuit.wires.filter(w => w.visualState === 'carrying') });

            // Pha 4: OUTPUT & VERIFY
            const verifyResult = this.verifyOutputs();

            if (this.onTick) {
                this.onTick(this.currentTick, this.state, verifyResult);
            }

            if (verifyResult.failed) {
                this.state = 'FAILED';
                this.stopTimer();
                this.emitShipperEvent({ type: 'CRASH', error: verifyResult });
                this.notifyStateChange();
                if (this.onFail) this.onFail(verifyResult);
                return true;
            }

            if (verifyResult.completed) {
                this.state = 'SUCCESS';
                this.stopTimer();
                this.emitShipperEvent({ type: 'CELEBRATE' });
                this.notifyStateChange();
                if (this.onComplete) this.onComplete(this.calculateScore());
                return true;
            }

            if (this.currentTick >= this.maxTicks) {
                this.state = 'FAILED';
                this.stopTimer();
                this.emitShipperEvent({ type: 'TIRED' });
                this.notifyStateChange();
                const err = {
                    failed: true,
                    reason: `Hết thời gian ca giao hàng! Vượt quá giới hạn (${this.maxTicks} ticks) mà chưa đủ thùng hàng kỳ vọng.`
                };
                if (this.onFail) this.onFail(err);
                return true;
            }

            return false;
        }

        fetchInputs() {
            const fetched = [];
            for (const inPort of this.circuit.inputPorts) {
                const portName = inPort.portName;
                const queue = this.inputQueues[portName] || [];
                const ptr = this.inputPointers[portName] || 0;

                if (ptr < queue.length) {
                    const nextVal = queue[ptr];
                    inPort.feed(nextVal);
                    this.inputPointers[portName] = ptr + 1;
                    fetched.push({ portName, value: nextVal });
                } else {
                    inPort.feed(null);
                }
            }
            return fetched;
        }

        verifyOutputs() {
            let hasNewOutput = false;

            for (const outPort of this.circuit.outputPorts) {
                const portName = outPort.portName;
                const box = outPort.getReceivedBox();
                const expectedQueue = this.expectedOutputs[portName] || [];
                const actualQueue = this.actualOutputs[portName] || [];

                if (box && box.valid) {
                    hasNewOutput = true;
                    const val = box.value;
                    actualQueue.push(val);
                    outPort.recordValue();

                    const currentIdx = actualQueue.length - 1;
                    const expectedVal = expectedQueue[currentIdx];

                    if (expectedVal === undefined) {
                        return {
                            failed: true,
                            portName,
                            reason: `Kho [${portName}] nhận thêm thùng thừa [${val}] ngoài danh sách đơn hàng!`
                        };
                    }

                    const match = (val === expectedVal) || (Number(val) === Number(expectedVal));
                    if (!match) {
                        return {
                            failed: true,
                            portName,
                            received: val,
                            expected: expectedVal,
                            index: currentIdx,
                            reason: `Thùng số #${currentIdx + 1} tại kho [${portName}] sai hàng: nhận [${val}], nhưng đơn yêu cầu [${expectedVal}].`
                        };
                    } else {
                        this.emitShipperEvent({ type: 'DELIVER', portName, value: val });
                    }
                }
            }

            let allCompleted = true;
            for (const portName of Object.keys(this.expectedOutputs)) {
                const exp = this.expectedOutputs[portName];
                const act = this.actualOutputs[portName] || [];
                if (act.length < exp.length) {
                    allCompleted = false;
                    break;
                }
            }

            return {
                failed: false,
                completed: allCompleted,
                hasNewOutput
            };
        }

        calculateScore() {
            const challenges = this.levelData.challenges || {};
            const speedGoal = challenges.speedGoal || 10;
            const sizeGoal = challenges.sizeGoal || 5;

            const userTicks = this.currentTick;
            const userComponents = this.circuit.getUserComponentCount();
            const userWires = this.circuit.getWireCount();

            const speedStar = userTicks <= speedGoal;
            const sizeStar = userComponents <= sizeGoal;

            return {
                passed: true,
                ticks: userTicks,
                speedGoal,
                speedStar,
                components: userComponents,
                sizeGoal,
                sizeStar,
                wires: userWires,
                isPerfect: speedStar && sizeStar
            };
        }

        emitShipperEvent(evt) {
            this.shipperEvents.push(evt);
            if (this.onShipperEvent) {
                this.onShipperEvent(evt);
            }
        }

        notifyStateChange() {
            if (this.onStateChange) {
                this.onStateChange(this.state);
            }
        }
    }

    SF.Simulator = Simulator;
})(window.SF);
