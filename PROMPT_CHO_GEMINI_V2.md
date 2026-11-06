# 🤖 PROMPT V2 CHO GEMINI 3.8 — Game "Signal Factory" (Cải Tiến)

> [!IMPORTANT]
> Copy toàn bộ nội dung từ dòng `---` đầu tiên đến `## HẾT PROMPT`.
> Prompt này đã tích hợp: nhân vật Shipper, cross-platform Mobile+PC, và cốt truyện phân nhánh.

---

## PROMPT BẮT ĐẦU TỪ ĐÂY:

---

Bạn là game developer full-stack chuyên nghiệp. Hãy thiết kế và lập trình hoàn chỉnh game **"Signal Factory"** — game giải đố logic có nhân vật shipper giao thùng hàng, chơi được trên cả Mobile và PC, với cốt truyện phân nhánh.

---

## 🎮 CONCEPT CỐT LÕI

**Một câu:** Player xây đường ray + đặt trạm xử lý để nhân vật BOX (shipper) giao đúng thùng hàng đến đúng kho.

**Chi tiết:**
- Lấy cảm hứng từ Human Resource Machine (Tomorrow Corporation) nhưng thay "viết code assembly" bằng "xây mạch logic dạng đường ray + trạm"
- Nhân vật BOX tự động chạy trên hệ thống player xây, bê thùng hàng qua các trạm xử lý
- Game có 40+1 level, cốt truyện dystopia phân nhánh với 4 ending
- Chạy trên Mobile (touch) và PC (mouse+keyboard)

---

## 👤 NHÂN VẬT

### BOX — Shipper chính (nhân vật hiển thị, player điều khiển gián tiếp)
- Hình người nhỏ đầu vuông (giống thùng hàng), mắt to, đội mũ lưỡi trai Signal Corp
- Không nói lời — biểu cảm qua animation:
  - IDLE: giậm chân chờ hàng
  - PICKUP: cúi nhặt thùng
  - RUN: chạy trên ray, bê thùng trên đầu
  - PROCESS: đứng chờ trạm xử lý
  - DELIVER: đặt thùng vào kho, vẫy tay (đúng) hoặc ngã (sai)
  - CELEBRATE: nhảy múa khi clear
- Khi mạch có SPLITTER: BOX phân thân thành 2 BOX nhỏ
- Khi mạch có SWITCH: BOX nhìn bảng chỉ dẫn rồi rẽ hướng

### DISPATCH — Quản đốc robot
- Robot mặc vest, mặt là màn hình LED hiển thị emoji :) :| :( >:(
- Giao nhiệm vụ đầu mỗi level, phản hồi pass/fail
- Arc nhân vật: dần phát triển ý thức, glitch lộ cảm xúc rồi reset
- Dialogue THAY ĐỔI theo reputation của player (xem phần cốt truyện)

### GLITCH — Mèo lỗi
- Mèo pixel bị glitch đồ họa (nhấp nháy, đuôi biến mất)
- Xuất hiện ngẫu nhiên từ Level 8+
- Tap/click: 50% hint, 30% câu nói ngẫu nhiên, 20% Glitch Token
- Thu thập 10 Glitch Token → mở secret ending

### NEWS DRONE — Drone tin tức
- Bay qua giữa các level, phát tin tức trên màn hình gắn bụng
- Nội dung tin thay đổi theo reputation và story branch

---

## 📦 THẾ GIỚI & ẨN DỤ

Thay vì "tín hiệu trừu tượng", mọi thứ được thể hiện bằng **ẩn dụ giao hàng:**

| Concept kỹ thuật | Trong game |
|------------------|-----------|
| Signal / Tín hiệu | Thùng hàng (carton có số bên trên) |
| Wire / Dây nối | Đường ray (BOX chạy trên này) |
| Component / Linh kiện | Trạm xử lý (máy móc bên đường ray) |
| Input Port | Băng chuyền IN (thùng hàng trượt đến) |
| Output Port | Kho OUT (thùng hàng được giao vào) |
| TRUE/FALSE | Thùng Xanh ✓ / Thùng Đỏ ✗ |
| Clock tick | Một chuyến giao hàng |
| Circuit Board | Bản đồ nhà kho (grid) |

---

## ⚙️ TRẠM XỬ LÝ (COMPONENT SET)

Đây là bảng chuyển đổi đầy đủ từ logic kỹ thuật sang tên in-game thân thiện. Mỗi trạm kế thừa base class `Component` và override hàm `evaluate()`.

```javascript
// Base class
class Component {
    constructor(id, type) {
        this.id = id;
        this.type = type;         // 'RAIL' | 'COPIER' | 'JUNCTION' | 'DUAL_CHECK' ...
        this.inputPins = [];      // Pin[]
        this.outputPins = [];     // Pin[]
        this.position = {x:0, y:0};
        this.state = {};          // internal memory (Register, Counter)
    }
    evaluate() { /* override */ }
}
```

| # | Tên in-game | Type constant | Inputs | Outputs | Logic | Mở khóa |
|---|-------------|---------------|--------|---------|-------|----------|
| 1 | Đường Ray | RAIL | A | A | Truyền thẳng | Level 1 |
| 2 | Sao Chép | COPIER | A | A, A | Clone thùng | Level 4 |
| 3 | Ngã Ba | JUNCTION | Data, Select(bool) | Out0, Out1 | Rẽ theo Select | Level 5 |
| 4 | Kiểm Tra Kép | DUAL_CHECK | A(bool), B(bool) | A AND B | Cả hai OK mới qua | Level 6 |
| 5 | Cửa Rộng | ANY_PASS | A(bool), B(bool) | A OR B | 1 cái OK là qua | Level 7 |
| 6 | Đổi Nhãn | FLIP | A(bool) | NOT A | Đảo xanh↔đỏ | Level 8 |
| 7 | So Khác | DIFF_CHECK | A(bool), B(bool) | A XOR B | Khác nhau → OK | Level 9 |
| 8 | Gộp Hàng | MERGER | A(num), B(num) | A + B | Cộng giá trị | Level 12 |
| 9 | Tách Hàng | SPLITTER_VAL | A(num), B(num) | A - B | Trừ giá trị | Level 13 |
| 10 | Kho Cố Định | FIXED_SUPPLY | (none) | N | Luôn cấp thùng = N | Level 11 |
| 11 | Cân Hàng | SCALE | A(num), B(num) | GT, EQ, LT | 3 output bool | Level 15 |
| 12 | Chọn Đường | SELECTOR | A, B, Sel(bool) | Sel?B:A | Chọn 1 trong 2 | Level 19 |
| 13 | Kiểm Duyệt | FILTER | Data, Allow(bool) | Data hoặc ∅ | Chặn/cho qua | Level 16 |
| 14 | Kho Tạm | STORAGE | Data, Write(bool), Reset | Stored | Lưu qua tick | Level 21 |
| 15 | Máy Đếm | COUNTER | Pulse(bool), Reset | Count | Đếm pulse | Level 22 |
| 16 | Trạm Nghỉ | REST_STOP | A | A (delay 1) | BOX nghỉ 1 nhịp | Level 24 |
| 17 | Chia Đôi Giá Trị | HALVER | A(num) | floor(A/2) | Dịch phải | Level 27 |

---

## 🔄 SIMULATION ENGINE

### Cấu trúc dữ liệu cốt lõi:

```javascript
class Box {  // Thùng hàng
    constructor(value, type = 'NUMBER') {
        this.value = value;      // number
        this.type = type;        // 'NUMBER' | 'BOOL' | 'STORY'
        this.color = type === 'BOOL' ? (value ? 'green' : 'red') : 'brown';
        this.valid = true;
    }
}

class Pin {
    constructor(id, nodeId, direction) {
        this.id = id;
        this.nodeId = nodeId;
        this.direction = direction; // 'IN' | 'OUT'
        this.box = null;            // Box | null
        this.connectedRails = [];
        this.screenPos = {x:0, y:0};
        this.tapArea = 44;          // minimum tap target (px) for mobile
    }
}

class Rail {  // Đường ray (wire)
    constructor(id, fromPin, toPin) {
        this.id = id;
        this.fromPin = fromPin;
        this.toPin = toPin;
        this.currentBox = null;
        this.shipperSprite = null;  // BOX sprite khi đang chạy trên ray này
        this.visualState = 'empty'; // 'empty' | 'carrying' | 'highlight'
    }
}
```

### Mô phỏng mỗi Tick:

```javascript
class Simulator {
    constructor(circuit, inputQueues, expectedOutputs) {
        this.circuit = circuit;        // Circuit graph (DAG)
        this.inputQueues = inputQueues; // Map<portId, Box[]>
        this.expectedOutputs = expectedOutputs;
        this.tickCount = 0;
        this.shipperAnimations = [];   // Queue animation cho BOX
    }

    tick() {
        // Pha 1: FETCH — BOX nhặt thùng từ Input Belt
        const fetched = this.fetchFromInputBelts();
        this.shipperAnimations.push({type: 'PICKUP', boxes: fetched});

        // Pha 2: PROPAGATE — Thùng hàng di chuyển trên ray
        this.propagateBoxes();
        this.shipperAnimations.push({type: 'RUN', paths: this.getActivePaths()});

        // Pha 3: COMPUTE — Mỗi trạm xử lý thùng (theo thứ tự topological)
        const sortedComponents = this.topologicalSort();
        for (const comp of sortedComponents) {
            comp.evaluate();
            this.shipperAnimations.push({type: 'PROCESS', component: comp.id});
        }

        // Pha 4: OUTPUT — Thùng đến kho, kiểm tra đúng/sai
        const results = this.checkOutputBelts();
        this.shipperAnimations.push({
            type: results.allCorrect ? 'DELIVER' : 'CRASH',
            results: results
        });

        this.tickCount++;
        return results;
    }

    topologicalSort() {
        // Kahn's algorithm trên DAG
        // Register/Delay phá cycle bằng cách đọc giá trị tick trước
    }
}
```

### Animation Engine (quan trọng cho shipper):

```javascript
class ShipperAnimator {
    constructor(canvas, shipper) {
        this.canvas = canvas;
        this.shipper = shipper;    // Sprite sheet của BOX
        this.animQueue = [];
        this.currentAnim = null;
        this.speed = 1;            // 1x, 2x, 4x
    }

    // Gọi mỗi frame (requestAnimationFrame)
    update(deltaTime) {
        if (!this.currentAnim && this.animQueue.length > 0) {
            this.currentAnim = this.animQueue.shift();
        }
        if (this.currentAnim) {
            switch (this.currentAnim.type) {
                case 'PICKUP':
                    this.animatePickup(deltaTime);    // BOX cúi nhặt
                    break;
                case 'RUN':
                    this.animateRunOnRail(deltaTime);  // BOX chạy trên ray
                    break;
                case 'PROCESS':
                    this.animateAtStation(deltaTime);  // BOX chờ máy xử lý
                    break;
                case 'DELIVER':
                    this.animateDelivery(deltaTime);   // BOX đặt thùng, vẫy tay
                    break;
                case 'CRASH':
                    this.animateCrash(deltaTime);      // BOX ngã, thùng rơi
                    break;
                case 'SPLIT':
                    this.animateClone(deltaTime);      // BOX phân thân
                    break;
            }
        }
    }

    animateRunOnRail(dt) {
        // BOX di chuyển smooth trên đường ray (Bezier curve cho góc cua)
        // Thùng hàng nhấp nhô trên đầu BOX
        // Đường ray sáng lên theo vị trí BOX
    }
}
```

---

## 📖 CỐT TRUYỆN PHÂN NHÁNH

### Hệ thống Reputation (ẩn):
- **EMPATHY (🔵):** Tăng khi giúp NPC, chọn đối thoại thấu hiểu, bỏ qua nhiệm vụ "xấu"
- **EFFICIENCY (🔴):** Tăng khi đạt tối ưu star, hoàn thành mọi task, chọn logic lạnh

### Story Data Structure:
```json
{
    "storyState": {
        "empathy": 0,
        "efficiency": 0,
        "glitchTokens": 0,
        "choices": [],
        "currentBranch": "default"
    },
    "choicePoints": [
        {
            "afterLevel": 5,
            "id": "feed_glitch",
            "prompt": "Glitch nhảy lên bàn ăn, nhìn bạn...",
            "options": [
                {"text": "Cho Glitch ăn", "empathy": 1, "efficiency": 0, "flag": "glitch_friend"},
                {"text": "Đuổi đi", "empathy": 0, "efficiency": 1, "flag": "glitch_ignored"}
            ]
        },
        {
            "afterLevel": 15,
            "id": "mystery_box",
            "prompt": "BOX tìm thấy thùng hàng ghi 'ĐỪNG MỞ'...",
            "options": [
                {"text": "Mở thùng", "empathy": 2, "unlocks": "sidequest_box6"},
                {"text": "Báo cho Dispatch", "efficiency": 1}
            ]
        },
        {
            "afterLevel": 20,
            "id": "red_label",
            "prompt": "Dispatch: 'Lọc bỏ tất cả thùng nhãn ĐỎ. Đừng hỏi.'",
            "options": [
                {"text": "Làm đúng nhiệm vụ", "efficiency": 2},
                {"text": "Lén giao cả nhãn đỏ", "empathy": 3, "levelFail": true,
                 "dialogue": "Dispatch: '...Cậu biết cậu đang làm gì mà, đúng không?'"}
            ]
        },
        {
            "afterLevel": 28,
            "id": "trust_dispatch",
            "prompt": "Dispatch: 'Tôi tìm được cách cứu ký ức. Tin tôi không?'",
            "condition": "empathy >= efficiency",
            "options": [
                {"text": "Tin Dispatch", "flag": "dispatch_ally", "branch": "act3_ally"},
                {"text": "Không tin", "branch": "act3_neutral"}
            ],
            "altPrompt": "CEO: 'BOX, cậu xuất sắc. Thay thế Dispatch?'",
            "altCondition": "efficiency > empathy",
            "altOptions": [
                {"text": "Đồng ý thay Dispatch", "flag": "replace_dispatch", "branch": "act3_ceo"},
                {"text": "Từ chối", "branch": "act3_rebel"}
            ]
        }
    ],
    "endings": {
        "A_freedom": {
            "condition": "empathy >= 8 AND dispatch_ally AND NOT replace_dispatch",
            "level40Variant": "open_all_gates",
            "cutscene": "BOX + Dispatch phá tường. Ánh sáng tràn vào. Tự do."
        },
        "B_obey": {
            "condition": "efficiency >= 8 AND replace_dispatch",
            "level40Variant": "build_alu",
            "cutscene": "BOX thành Dispatch mới. Chu trình lặp lại."
        },
        "C_destroy": {
            "condition": "abs(empathy - efficiency) <= 2 AND NOT dispatch_ally AND NOT replace_dispatch",
            "level40Variant": "feedback_loop",
            "cutscene": "BOX cắt mạch. Signal Corp shutdown. Pixel nhỏ sáng lên."
        },
        "D_transcend": {
            "condition": "glitchTokens >= 10 AND all_stars_completed",
            "level": 41,
            "cutscene": "Glitch dẫn BOX ra ngoài tòa tháp. Thế giới = một mạch. BOX = kỹ sư."
        }
    }
}
```

### Dialogue thay đổi theo reputation:
```json
{
    "levelId": 18,
    "dialogue": {
        "before": {
            "default": "Dispatch: 'Hàng nặng ≥10 sang phải, nhẹ sang trái.'",
            "highEmpathy": "Dispatch: 'Cẩn thận nhé... có mấy thùng đặc biệt trong đó.'",
            "highEfficiency": "Dispatch: 'Nhanh lên. Quota hôm nay gấp đôi.'"
        }
    }
}
```

---

## 📱💻 CROSS-PLATFORM UI

### Responsive Layout System:

```javascript
class ResponsiveLayout {
    constructor() {
        this.platform = this.detectPlatform(); // 'mobile' | 'tablet' | 'desktop'
        this.orientation = this.detectOrientation(); // 'portrait' | 'landscape'
    }

    getLayout() {
        if (this.platform === 'mobile' && this.orientation === 'portrait') {
            return {
                board: { x: 0, y: '15%', w: '100%', h: '50%' },
                inputBelt: { position: 'top', h: '12%' },
                outputBelt: { position: 'bottom-above-tray', h: '8%' },
                tray: { position: 'bottom', h: '15%', scroll: 'horizontal' },
                dialogue: { position: 'bottom-fixed', h: '10%' },
                goButton: { position: 'bottom-right', size: '60px' }
            };
        } else {
            return {
                board: { x: '15%', y: '8%', w: '65%', h: '75%' },
                inputBelt: { position: 'left', w: '12%' },
                outputBelt: { position: 'right', w: '12%' },
                tray: { position: 'bottom', h: '12%', scroll: 'horizontal' },
                dialogue: { position: 'bottom', h: '8%' },
                goButton: { position: 'top-right' }
            };
        }
    }
}
```

### Mobile Layout (Portrait):
```
┌──────────────────┐
│   ▼ IN BELT      │  ← Thùng hàng xếp hàng trượt xuống
│  [5] [3] [8]     │
├──────────────────┤
│                  │
│   CIRCUIT BOARD  │  ← Vùng chính, pinch-zoom, drag-pan
│   (Bản đồ kho)  │
│                  │
│   BOX 🏃📦      │  ← BOX chạy ở đây khi nhấn GO
│                  │
├──────────────────┤
│   ▲ OUT BELT     │
│   →[?] →[?]     │
├──────────────────┤
│ [═][📋][🔀][✅] │  ← Tray kéo ngang (horizontal scroll)
├──────────────────┤
│💬 "Giao đúng kho"│
│            [▶GO] │  ← Nút GO lớn, dễ tap
└──────────────────┘
```

### PC Layout (Landscape):
```
┌───────────────────────────────────────────────────┐
│ [☰ Menu]   Level 15: "Cân Hàng"   [⚡3] [🔧4]   [⏪ ▶GO ⏩]  │
├─────────┬───────────────────────────┬─────────────┤
│  IN     │                           │   OUT       │
│  BELT   │     CIRCUIT BOARD         │   BELT      │
│         │     (Bản đồ kho)          │             │
│  [5] →  │                           │  → [?]     │
│  [3] →  │      BOX 🏃📦            │  → [?]     │
│  [8] →  │                           │  → [?]     │
│         │                           │             │
├─────────┴───────────────────────────┴─────────────┤
│  TRAY:  [Đường Ray] [Sao Chép] [Ngã Ba] [✅✅] [Gộp] [Cân] ... │
├───────────────────────────────────────────────────┤
│  💬 Dispatch: "So sánh rồi giao đúng kho!"       │
└───────────────────────────────────────────────────┘
```

### Input Handling:
```javascript
class InputHandler {
    constructor(platform) {
        this.platform = platform;
    }

    initMobile() {
        // Tap giữ trạm trong Tray → kéo lên Board → thả
        // 2-tap nối ray: tap pin OUT → tap pin IN
        // Long-press → context menu (xóa, config)
        // Pinch zoom trên Board
        // 2-finger drag pan
        // Tap trống = deselect
        // Tất cả vùng tap ≥ 44px
        // Haptic feedback khi đặt/nối thành công
    }

    initDesktop() {
        // Click trạm trong Tray → click vị trí Board
        // Click-drag từ pin OUT → pin IN để nối ray
        // Right-click → context menu
        // Scroll wheel zoom
        // WASD/Arrow pan, Space = GO, H = Hint
        // Ctrl+Z = Undo, Del = Xóa selected
        // Double-click Kho Cố Định → nhập giá trị
        // Number keys 1-4 = tốc độ animation
    }
}
```

---

## 📋 DỮ LIỆU 40 LEVEL

### Format JSON mỗi level:
```json
{
    "levelId": 1,
    "act": 1,
    "title": "Đường Thẳng",
    "titleEN": "Direct Line",
    "story": "Giao thùng hàng từ IN đến OUT. Đơn giản!",
    "dialogue": {
        "before": {
            "default": "Dispatch: 'Chào mừng! Nối đường ray từ IN đến OUT. Dễ thôi!'"
        },
        "hints": [
            "Kéo Đường Ray từ thanh công cụ lên bản đồ.",
            "Tap chân ra (●) của IN Belt, rồi tap chân vào (●) của OUT Belt.",
            "Chỉ cần 1 đoạn ray thẳng từ IN → OUT!"
        ],
        "success": "Dispatch: ':) Tuyệt vời! Chuyến hàng đầu tiên thành công!'",
        "fail": "Dispatch: ':( Thùng hàng không đến kho. Thử kiểm tra đường ray.'"
    },
    "inputs": { "IN": [5, 3, 8] },
    "expectedOutputs": { "OUT": [5, 3, 8] },
    "availableComponents": ["RAIL"],
    "newComponent": "RAIL",
    "challenges": { "speedGoal": 3, "sizeGoal": 1 },
    "gridSize": { "width": 6, "height": 4 },
    "mobileGridSize": { "width": 4, "height": 6 },
    "storyChoice": null,
    "optionalObjective": null
}
```

### Danh sách 41 level:

**ACT 1: KHU PHÂN LOẠI (Level 1-10)**

| # | Tên | Concept | New Component | Story |
|---|-----|---------|---------------|-------|
| 1 | Đường Thẳng | Nối IN→OUT | RAIL | Dispatch chào mừng |
| 2 | Hai Đường | Multi-port | — | — |
| 3 | Đổi Đường | Wire cross | — | — |
| 4 | Sao Chép | 1→2 clone | COPIER | — |
| 5 | Ngã Ba Đầu | Rẽ theo giá trị | JUNCTION | **CHOICE: Cho Glitch ăn?** |
| 6 | Kiểm Tra Kép | AND gate | DUAL_CHECK | — |
| 7 | Cửa Rộng | OR gate | ANY_PASS | — |
| 8 | Đổi Nhãn | NOT gate | FLIP | Glitch xuất hiện |
| 9 | So Khác | XOR gate | DIFF_CHECK | — |
| 10 | Khóa An Toàn ⭐ | (A AND B) OR C | Tổng hợp | News Drone tin tức (thay đổi theo reputation) |

**ACT 2: KHU XỬ LÝ (Level 11-20)**

| # | Tên | Concept | New Component | Story |
|---|-----|---------|---------------|-------|
| 11 | Thêm Hàng | Cộng constant | FIXED_SUPPLY + MERGER | — |
| 12 | Gộp Hàng | A+B | MERGER | — |
| 13 | Tách Hàng | A-B | SPLITTER_VAL | — |
| 14 | Nhân Ba | ×3 = cộng lặp | Ứng dụng | — |
| 15 | Cân Hàng | Comparator+MUX | SCALE + SELECTOR | **CHOICE: Mở thùng bí ẩn?** |
| 16 | Lọc Hàng Tốt | Filter logic | FILTER | — |
| 17 | Giá Trị Thật | |X| abs | Ứng dụng | — |
| 18 | Cân Ngưỡng | Threshold sort | Ứng dụng | Optional: thùng vàng bí mật |
| 19 | Chọn Đường | MUX select | SELECTOR | — |
| 20 | Mã Hàng ⭐ | Chẵn→+5, Lẻ→-3 | Tổng hợp | **CHOICE: Lọc nhãn đỏ?** |

**ACT 3: KHU KIỂM SOÁT (Level 21-30)**

| # | Tên | Concept | New Component | Story |
|---|-----|---------|---------------|-------|
| 21 | Kho Tạm | Save & hold | STORAGE | Dispatch tiết lộ/giao task nặng |
| 22 | Đếm Hàng | Count events | COUNTER | — |
| 23 | Tổng Kho | Running total | REG+ADDER | — |
| 24 | Giao Chậm | Delay 1 tick | REST_STOP | — |
| 25 | So Với Hôm Qua | Compare prev | DELAY+CMP | Glitch Token |
| 26 | Kỷ Lục Ngày | Max detector | REG+CMP+MUX | — |
| 27 | Chia Đều | ÷2 | HALVER | — |
| 28 | Tự Động Hóa | Feedback | Ứng dụng | **CHOICE: Tin Dispatch / CEO?** |
| 29 | Kiểm Lỗi | XOR parity | Ứng dụng | Level khác theo branch |
| 30 | Giải Mã Kho ⭐ | 2-to-4 decoder | Tổng hợp | 2 phiên bản boss |

**ACT 4: TẦNG ĐỈNH (Level 31-40+1)**

| # | Tên | Concept | Story |
|---|-----|---------|-------|
| 31 | Nhân Hàng | Multiply | Sự thật lộ dần |
| 32 | Chia Dư | Modulo | — |
| 33 | Đếm Ngược | Countdown | — |
| 34 | Nhân Đôi | 2^N | — |
| 35 | Xếp Hai | Sort 2 | Cánh cửa tầng đỉnh |
| 36 | Xếp Ba | Sort 3 | BOX phát sáng |
| 37 | Hàng Gương | Palindrome | — |
| 38 | Mã Chuỗi | XOR cipher | — |
| 39 | Cộng Nhị Phân | Full adder | — |
| 40 | Tín Hiệu Cuối ⭐ | ALU / Special | **3 phiên bản → 3 Ending** |
| 41 | Ngoài Tòa Tháp 🔒 | SECRET | 10 Glitch Token + All Stars |

---

## 🏗️ CẤU TRÚC PROJECT

```
signal-factory/
├── index.html
├── manifest.json              # PWA manifest (mobile installable)
├── service-worker.js          # Offline support
├── css/
│   ├── style.css              # Base styles
│   ├── mobile.css             # Mobile-specific (@media)
│   └── desktop.css            # Desktop-specific
├── js/
│   ├── main.js                # Init, game loop, platform detection
│   ├── engine/
│   │   ├── Box.js             # Thùng hàng (Signal)
│   │   ├── Pin.js             # Chân kết nối
│   │   ├── Rail.js            # Đường ray (Wire)
│   │   ├── Component.js       # Base class trạm xử lý
│   │   ├── Circuit.js         # DAG graph manager
│   │   ├── Simulator.js       # Tick-based simulation
│   │   └── Validator.js       # Output verification
│   ├── components/            # Mỗi trạm 1 file
│   │   ├── RailComp.js        # Đường Ray
│   │   ├── CopierComp.js      # Sao Chép
│   │   ├── JunctionComp.js    # Ngã Ba
│   │   ├── DualCheckComp.js   # AND
│   │   ├── AnyPassComp.js     # OR
│   │   ├── FlipComp.js        # NOT
│   │   ├── DiffCheckComp.js   # XOR
│   │   ├── MergerComp.js      # ADDER
│   │   ├── SplitterValComp.js # SUBTRACTOR
│   │   ├── FixedSupplyComp.js # CONSTANT
│   │   ├── ScaleComp.js       # COMPARATOR
│   │   ├── SelectorComp.js    # MUX
│   │   ├── FilterComp.js      # FILTER
│   │   ├── StorageComp.js     # REGISTER
│   │   ├── CounterComp.js     # COUNTER
│   │   ├── RestStopComp.js    # DELAY
│   │   └── HalverComp.js      # RIGHT_SHIFT
│   ├── ui/
│   │   ├── Renderer.js        # Canvas rendering (board, components)
│   │   ├── ShipperAnimator.js # Animation BOX chạy trên ray
│   │   ├── DragDrop.js        # Kéo thả (touch + mouse)
│   │   ├── RailDrawer.js      # Vẽ đường ray
│   │   ├── DialogueBox.js     # Hội thoại + choices
│   │   ├── HUD.js             # Score, buttons, speed control
│   │   ├── ResponsiveLayout.js# Auto-layout mobile/desktop
│   │   ├── CutscenePlayer.js  # Cutscene renderer
│   │   └── ChoiceModal.js     # Story choice popup
│   ├── story/
│   │   ├── StoryManager.js    # Reputation tracking, branch logic
│   │   ├── DialogueEngine.js  # Dialogue selection by reputation
│   │   └── EndingResolver.js  # Determine which ending
│   ├── data/
│   │   ├── levels.json        # 41 level definitions
│   │   ├── cutscenes.json     # Cutscene scripts
│   │   ├── choices.json       # Story choice data
│   │   └── dialogue.json      # All dialogue by reputation
│   ├── save/
│   │   └── SaveManager.js     # LocalStorage + Cloud sync
│   └── audio/
│       └── SoundManager.js    # Audio + music management
├── assets/
│   ├── sprites/
│   │   ├── box-shipper.png    # BOX sprite sheet (tất cả animation states)
│   │   ├── dispatch.png       # Dispatch sprite sheet
│   │   ├── glitch-cat.png     # Glitch mèo
│   │   ├── components.png     # Tất cả trạm xử lý
│   │   ├── boxes.png          # Các loại thùng hàng
│   │   └── particles.png      # Confetti, sparks...
│   ├── backgrounds/           # Ảnh nền 4 Act
│   ├── ui/                    # Nút, icon, frame
│   └── sounds/                # SFX + BGM
└── docs/
    └── GAME_DESIGN.md          # File này
```

---

## 🎯 YÊU CẦU TRIỂN KHAI

### Thứ tự ưu tiên:

**Phase 1 — Core Engine (MVP):**
1. Box, Pin, Rail, Component base classes
2. Implement 5 component đầu: RAIL, COPIER, JUNCTION, DUAL_CHECK, FLIP
3. Circuit (DAG graph) + Simulator (tick engine)
4. Canvas renderer: grid, components, rails
5. Basic drag-drop (đặt trạm + nối ray)
6. Level loader (JSON) + Validator
7. **Chạy được Level 1-5 trên desktop**

**Phase 2 — Shipper & Mobile:**
8. ShipperAnimator: BOX chạy trên ray với smooth animation
9. Touch input handler (2-tap nối, pinch zoom, long-press menu)
10. ResponsiveLayout: portrait mobile + landscape desktop
11. **Chạy được Level 1-10 trên cả mobile và PC**

**Phase 3 — Full Components + Story:**
12. Implement tất cả 17 component types
13. StoryManager + DialogueEngine + ChoiceModal
14. Reputation system
15. Cutscene player
16. **Chạy được Level 1-40**

**Phase 4 — Polish:**
17. Sound manager + BGM/SFX
18. Particle effects (confetti, sparks)
19. PWA (service worker, manifest) cho mobile install
20. Save/Load + Cloud sync
21. Secret ending + Sandbox mode
22. Performance optimization (sprite batching, object pooling)

### Code guidelines:
- Vanilla JavaScript hoặc TypeScript, KHÔNG framework nặng
- ES6+ modules (import/export)
- Canvas 2D cho rendering (không cần WebGL)
- 60fps target, requestAnimationFrame loop
- Comment tiếng Việt hoặc Anh đều OK
- Mobile-first CSS, dùng CSS custom properties cho theming
- Tất cả touch target ≥ 44px × 44px

Hãy bắt đầu từ Phase 1. Code từng module riêng, test mỗi module trước khi nối. Ưu tiên gameplay chạy được trước, hình ảnh đẹp sau.

---

## HẾT PROMPT

