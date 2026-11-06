# 🤖 PROMPT CHO GEMINI 3.8 — Thiết Kế Game "Signal Factory"

> [!IMPORTANT]
> Copy toàn bộ nội dung bên dưới (từ dòng `---` đầu tiên đến hết) và paste vào Gemini 3.8 làm prompt.
> Prompt được thiết kế để Gemini hiểu 100% và triển khai ngay.

---

## PROMPT BẮT ĐẦU TỪ ĐÂY:

---

Bạn là game developer chuyên nghiệp. Hãy thiết kế và lập trình hoàn chỉnh game **"Signal Factory"** — một game giải đố logic/mạch điện lấy cảm hứng từ Human Resource Machine (Tomorrow Corporation). Game chạy trên web (HTML5 + Canvas).

## CONCEPT CỐT LÕI

Người chơi là kỹ sư tập sự tại nhà máy xử lý tín hiệu "Signal Corp". Nhiệm vụ: kéo-thả linh kiện logic (AND, OR, NOT, MUX, ADDER...) lên bảng mạch, nối dây giữa chúng, để xử lý dòng tín hiệu đầu vào cho ra đầu ra đúng yêu cầu. Game có 40 level, cốt truyện dystopia về tự động hóa, và hệ thống chấm điểm tối ưu (Speed/Size).

## KIẾN TRÚC KỸ THUẬT

### Stack công nghệ:
- HTML5 + Canvas (hoặc WebGL) cho rendering
- Vanilla JavaScript hoặc TypeScript
- Không framework nặng — game nhẹ, load nhanh
- Responsive cho cả desktop và mobile

### Cấu trúc project:
```
signal-factory/
├── index.html              # Entry point
├── css/
│   └── style.css           # UI styling
├── js/
│   ├── main.js             # Game initialization & loop
│   ├── engine/
│   │   ├── Circuit.js      # Quản lý bảng mạch (DAG graph)
│   │   ├── Component.js    # Base class cho linh kiện
│   │   ├── Wire.js         # Dây nối giữa các Pin
│   │   ├── Pin.js          # Input/Output pin
│   │   ├── Simulator.js    # Mô phỏng xung nhịp (tick-based)
│   │   └── Validator.js    # Kiểm tra output vs expected
│   ├── components/         # Từng loại linh kiện
│   │   ├── AndGate.js
│   │   ├── OrGate.js
│   │   ├── NotGate.js
│   │   ├── XorGate.js
│   │   ├── Adder.js
│   │   ├── Subtractor.js
│   │   ├── Comparator.js
│   │   ├── Mux.js
│   │   ├── Demux.js
│   │   ├── Switch.js
│   │   ├── Splitter.js
│   │   ├── Constant.js
│   │   ├── Register.js
│   │   ├── Counter.js
│   │   ├── Delay.js
│   │   └── RightShift.js
│   ├── ui/
│   │   ├── BoardRenderer.js    # Vẽ bảng mạch lên Canvas
│   │   ├── DragDrop.js         # Xử lý kéo thả linh kiện
│   │   ├── WireDrawer.js       # Vẽ và kéo dây nối
│   │   ├── DialogueBox.js      # Hộp thoại nhân vật
│   │   ├── HUD.js              # Hiển thị score, buttons
│   │   └── AnimationEngine.js  # Animation tín hiệu chạy trên dây
│   ├── data/
│   │   └── levels.json         # Dữ liệu 40 level
│   ├── story/
│   │   └── cutscenes.json      # Dữ liệu cutscene
│   └── audio/
│       └── SoundManager.js     # Quản lý âm thanh
└── assets/
    ├── sprites/                # Sprite sheet cho linh kiện, nhân vật
    ├── backgrounds/            # Ảnh nền các tầng
    └── sounds/                 # File âm thanh
```

## CẤU TRÚC DỮ LIỆU CỐT LÕI

### Signal (Gói tín hiệu):
```javascript
class Signal {
    constructor(value, type = 'INTEGER') {
        this.value = value;       // number | boolean
        this.type = type;         // 'BOOLEAN' | 'INTEGER'
        this.valid = true;        // có tín hiệu hay không
    }
}
```

### Pin (Chân cắm):
```javascript
class Pin {
    constructor(id, nodeId, direction) {
        this.id = id;
        this.nodeId = nodeId;
        this.direction = direction;  // 'INPUT' | 'OUTPUT'
        this.signal = new Signal(0);
        this.connectedWires = [];
        this.position = { x: 0, y: 0 };  // vị trí trên canvas
    }
}
```

### Component (Linh kiện — base class):
```javascript
class Component {
    constructor(id, type) {
        this.id = id;
        this.type = type;            // 'AND' | 'OR' | 'NOT' | ...
        this.inputPins = [];
        this.outputPins = [];
        this.position = { x: 0, y: 0 };  // vị trí trên grid
        this.state = {};             // bộ nhớ nội (cho Register, Counter)
    }
    evaluate() { /* Override ở class con */ }
}
```

### Wire (Dây nối):
```javascript
class Wire {
    constructor(id, fromPin, toPin) {
        this.id = id;
        this.fromPin = fromPin;   // Output Pin
        this.toPin = toPin;       // Input Pin
        this.signal = new Signal(0);
        this.visualState = 'IDLE'; // 'IDLE' | 'HIGH' | 'LOW'
    }
}
```

## LOGIC MÔ PHỎNG (SIMULATOR)

Mỗi tick thực hiện 4 pha tuần tự:

```javascript
class Simulator {
    tick() {
        // Pha 1: FETCH - đọc input tiếp theo từ hàng đợi
        this.fetchInputs();
        
        // Pha 2: PROPAGATE - truyền tín hiệu qua dây
        this.propagateSignals();
        
        // Pha 3: COMPUTE - tính toán ở mỗi linh kiện (theo thứ tự topo)
        this.computeComponents();  // Topological sort trên DAG
        
        // Pha 4: VERIFY - kiểm tra output
        return this.verifyOutputs();
    }
    
    // Sắp xếp topo để đảm bảo input được tính trước output
    topologicalSort(components, wires) {
        // Kahn's algorithm hoặc DFS
        // Phát hiện cycle → báo lỗi (trừ khi có Register/Delay)
    }
}
```

## BẢNG LINH KIỆN ĐẦY ĐỦ

Mỗi linh kiện kế thừa Component và override hàm evaluate():

| Type | Inputs | Outputs | Logic |
|------|--------|---------|-------|
| AND | A (bool), B (bool) | Q = A AND B | |
| OR | A (bool), B (bool) | Q = A OR B | |
| NOT | A (bool) | Q = NOT A | |
| XOR | A (bool), B (bool) | Q = A XOR B | |
| ADDER | A (num), B (num) | SUM = A + B | |
| SUBTRACTOR | A (num), B (num) | DIFF = A - B | |
| COMPARATOR | A (num), B (num) | GT (A>B), EQ (A==B), LT (A<B) | 3 output pin boolean |
| CONSTANT | (không có) | VALUE = N | N cấu hình được bởi player |
| SPLITTER | A | OUT1 = A, OUT2 = A | Nhân đôi tín hiệu |
| SWITCH/DEMUX | DATA, SELECT (bool) | OUT_0 (khi SEL=0), OUT_1 (khi SEL=1) | Bẻ hướng |
| MUX | A, B, SELECT (bool) | Q = (SEL==0 ? A : B) | Chọn kênh |
| FILTER | DATA, ALLOW (bool) | Q = (ALLOW ? DATA : nothing) | Chặn/cho qua |
| REGISTER | DATA, WRITE (bool), RESET | Q = stored value | Lưu giá trị, giữ qua tick |
| COUNTER | PULSE (bool), RESET | COUNT | Đếm số pulse = 1 |
| DELAY | A | Q = A (trễ 1 tick) | Buffer 1 tick |
| RIGHT_SHIFT | A (num) | Q = floor(A / 2) | Dịch phải = chia 2 |

## DỮ LIỆU 40 LEVEL

Dùng JSON format sau cho mỗi level:

```json
{
    "levelId": 5,
    "act": 1,
    "title": "Phân Loại Đầu Tiên",
    "titleEN": "First Sort",
    "story": "Gói hàng có nhãn 0 hoặc 1. Gửi nhãn 1 sang OUT-A, nhãn 0 sang OUT-B.",
    "dialogue": {
        "before": "Quản đốc: 'Hàng tốt sang phải, hàng lỗi sang trái. Đơn giản thôi.'",
        "hint1": "Dùng Switch để bẻ hướng dựa trên giá trị.",
        "hint2": "Nối trực tiếp giá trị gói hàng vào chân SELECT của Switch.",
        "hint3": "INPUT → SWITCH (data=INPUT, select=INPUT) → OUT_1=A, OUT_0=B.",
        "success": "Quản đốc: 'Tốt. Cậu học nhanh đấy.'",
        "fail": "Quản đốc: 'Sai rồi. Thử lại đi.'"
    },
    "inputs": {
        "IN": [1, 0, 1, 0, 0, 1]
    },
    "expectedOutputs": {
        "OUT-A": [1, 1, 1],
        "OUT-B": [0, 0, 0]
    },
    "availableComponents": ["SWITCH", "WIRE", "SPLITTER"],
    "newComponent": "SWITCH",
    "challenges": {
        "speedGoal": 6,
        "sizeGoal": 2
    },
    "gridSize": { "width": 8, "height": 6 }
}
```

### Danh sách 40 level đầy đủ:

**ACT 1: TẦNG HẦM (Level 1-10) — "Chào mừng đến Signal Corp"**
- Level 1: "Nối Thẳng" — Nối IN → OUT. [Input: 5,3,8 → Output: 5,3,8]. Mở khóa: WIRE.
- Level 2: "Song Song" — 2 luồng, nối cả hai. Concept: nhiều port.
- Level 3: "Đổi Chỗ" — 2 luồng, hoán đổi đích. Concept: wiring chéo.
- Level 4: "Chia Đôi" — 1 input → 2 output giống nhau. Mở khóa: SPLITTER.
- Level 5: "Phân Loại Đầu Tiên" — Gói 0/1, chia theo giá trị. Mở khóa: SWITCH.
- Level 6: "Kiểm Tra Kép" — 2 input bool, output AND. Mở khóa: AND.
- Level 7: "Cửa Rộng" — 2 input bool, output OR. Mở khóa: OR.
- Level 8: "Đảo Ngược" — Đảo 0↔1. Mở khóa: NOT.
- Level 9: "Báo Động Lệch Pha" — Khác nhau → báo động. Mở khóa: XOR.
- Level 10: "Khóa An Toàn" ⭐BOSS — (A AND B) OR Override. Tổng hợp Act 1.

**ACT 2: TẦNG THẤP (Level 11-20) — "Gánh nặng tăng dần"**
- Level 11: "Đường Dây Nóng" — Cộng 10 vào mỗi gói. Mở khóa: CONSTANT + ADDER.
- Level 12: "Phòng Cộng" — Tổng từng cặp. Mở khóa: ADDER.
- Level 13: "Phòng Trừ" — Hiệu từng cặp. Mở khóa: SUBTRACTOR.
- Level 14: "Nhân Ba" — ×3 bằng cộng lặp. Dùng SPLITTER + ADDER.
- Level 15: "Cân Đo" — Xuất số lớn hơn. Mở khóa: COMPARATOR + MUX.
- Level 16: "Lọc Dương" — Chỉ cho số > 0. Dùng CMP + CONST(0) + SWITCH.
- Level 17: "Giá Trị Tuyệt Đối" — |X|. Dùng CMP + SUB + MUX.
- Level 18: "Phân Loại Ngưỡng" — ≥10 sang NẶNG, <10 sang NHẸ.
- Level 19: "Chọn Kênh" — MUX chọn giữa 2 nguồn. Mở khóa: MUX.
- Level 20: "Mật Mã Đơn Giản" ⭐BOSS — Chẵn→+5, Lẻ→−3. Tổng hợp Act 2.

**ACT 3: TẦNG GIỮA (Level 21-30) — "Hệ thống kiểm soát"**
- Level 21: "Bộ Nhớ Đầu Tiên" — Lưu và giữ giá trị. Mở khóa: REGISTER.
- Level 22: "Bộ Đếm" — Đếm gói = 1. Mở khóa: COUNTER.
- Level 23: "Tổng Dồn" — Tổng tích lũy. Dùng REG + ADDER feedback.
- Level 24: "Trễ Một Nhịp" — Xuất giá trị tick trước. Mở khóa: DELAY.
- Level 25: "So Với Trước" — So sánh với tick trước. Dùng DELAY + CMP.
- Level 26: "Phát Hiện Đỉnh" — Max từng thấy. Dùng REG + CMP + MUX.
- Level 27: "Trung Bình Hai" — (A+B)/2. Mở khóa: RIGHT_SHIFT.
- Level 28: "Fibonacci Mini" — Tự tạo 1,1,2,3,5,8... Dùng 2 REG + ADDER.
- Level 29: "Mã Chẵn Lẻ" — Parity check 3 bit. Dùng XOR chain.
- Level 30: "Bộ Giải Mã" ⭐BOSS — 2-to-4 decoder. AND + NOT tổng hợp.

**ACT 4: TẦNG CAO (Level 31-40) — "Sự thật"**
- Level 31: "Nhân Hai Số" — A×B bằng cộng lặp + counter.
- Level 32: "Chia Lấy Dư" — A mod B bằng trừ lặp.
- Level 33: "Đếm Ngược" — N, N-1, ..., 0. Dùng REG + SUB feedback.
- Level 34: "Lũy Thừa 2" — 2^N.
- Level 35: "Sắp Xếp Hai" — Min/Max 2 số. Dùng CMP + 2 MUX.
- Level 36: "Sắp Xếp Ba" — Sort 3 số. Sorting network.
- Level 37: "Kiểm Tra Đối Xứng" — Palindrome check.
- Level 38: "Mã Hóa XOR" — XOR cipher chain. Dùng XOR + REG feedback.
- Level 39: "Bộ Cộng Nhị Phân" — Full adder: Sum + Carry.
- Level 40: "Tín Hiệu Cuối Cùng" ⭐FINAL — ALU mini: 4 phép toán chọn bằng opcode.

## CỐT TRUYỆN & CUTSCENE

### Nhân vật:
1. **WORKER** (người chơi): Kỹ sư tập sự, đầu to mắt tròn, đồng phục xanh. Không nói, biểu cảm bằng animation.
2. **QUẢN ĐỐC (Foreman Unit-7)**: Robot cũ kỹ, nửa mặt lộ mạch. Giao nhiệm vụ. Dần "glitch" — lộ cảm xúc rồi reset. Twist: từng là con người.
3. **MÈO MÁY (Circuit Cat)**: Easter egg, cho hint khi click.
4. **MÀN HÌNH TV**: Phát tin tức châm biếm giữa các cụm level.

### Arc cốt truyện:
- **Act 1 (1-10):** Lạc quan, tutorial. TV quảng cáo Signal Corp tươi sáng.
- **Act 2 (11-20):** Áp lực. Nhân viên biến mất. Quản đốc bắt đầu glitch. TV: "Sa thải 30%."
- **Act 3 (21-30):** U ám. "Mỗi dòng số là một con người." Biểu tình. Quản đốc hỏi về bản chất tín hiệu.
- **Act 4 (31-40):** Sự thật. Worker phát hiện mình cũng là tín hiệu. Kết thúc mở: cycle lặp lại.

### Cutscene triggers (hiện giữa các level):
```json
[
    {"after": 5, "text": "TV: 'Signal Corp — 10 triệu gói tin/giây!'"},
    {"after": 10, "text": "Quản đốc: 'Phía trên... phức tạp hơn.' TV: 'Sa thải 30% nhân sự.'"},
    {"after": 15, "text": "Quản đốc glitch: 'Tôi... nhớ... ERROR.' TV: 'AI tự xây mạch.'"},
    {"after": 20, "text": "Worker thấy tay phát sáng. TV: 'Cảm xúc được mã hóa thành công.'"},
    {"after": 25, "text": "Mèo máy: '01101101 01100101 01101111'. TV: 'Ngừng số hóa ký ức!'"},
    {"after": 30, "text": "Quản đốc: 'Tôi cũng từng là... ERROR ERROR.' TV tắt."},
    {"after": 35, "text": "Quản đốc: 'Cậu có muốn biết tín hiệu đi đâu không?'"},
    {"after": 40, "text": "ENDING: Worker = tín hiệu. Tòa tháp = con chip. Chu trình lặp lại."}
]
```

## GIAO DIỆN NGƯỜI DÙNG

### Layout chính:
```
┌─────────────────────────────────────────────────┐
│ [☰]  Level XX: "Tên Level"  [⚡N] [🔧M]  [▶▐▐]│  Top Bar
├────────┬───────────────────────────┬────────────┤
│        │                           │            │
│  INPUT │    CIRCUIT BOARD (Grid)   │  OUTPUT    │
│  QUEUE │    - Kéo thả linh kiện   │  QUEUE     │
│        │    - Click-drag nối dây   │            │
│  [5]→  │                           │  →[?]     │
│  [3]→  │                           │  →[?]     │
│        │                           │            │
├────────┴───────────────────────────┴────────────┤
│ COMPONENT TRAY: [AND] [OR] [NOT] [MUX] [+] ... │
├─────────────────────────────────────────────────┤
│ 💬 "Dialogue text from Foreman"    [?Hint]      │
└─────────────────────────────────────────────────┘
```

### Tương tác:
- **Đặt linh kiện:** Kéo từ Component Tray → thả vào ô trống trên Board
- **Nối dây:** Click Output Pin (tròn) → kéo đến Input Pin → thả
- **Xóa:** Right-click linh kiện/dây → Delete, hoặc kéo ra khỏi board
- **Chạy:** Nút ▶ chạy mô phỏng, ▐▐ tạm dừng, ⏭ bước từng tick
- **Tốc độ:** Slider điều chỉnh tốc độ animation (1x, 2x, 4x, Max)
- **Cấu hình CONSTANT:** Double-click → nhập số

### Animation khi chạy:
- Gói tin (hình hộp nhỏ có số bên trong) di chuyển trên dây
- Dây phát sáng: xanh lá = 1/TRUE, đỏ = 0/FALSE, xám = không tín hiệu
- Linh kiện "pulse" khi xử lý
- Output đúng: tick xanh ✓, sai: X đỏ ✗

## PHONG CÁCH NGHỆ THUẬT

- **Pixel art retro-industrial**, palette ~32 màu
- Nền tối (nhà máy công nghiệp), linh kiện sáng nổi bật
- Linh kiện bo tròn, dễ thương, có icon rõ ràng
- Dây nối phát sáng neon
- Nhân vật: đầu to, mắt tròn, phong cách Tomorrow Corporation

## ÂM THANH

- BGM: Lo-fi electronic + ambient factory. Thay đổi mood theo Act.
- SFX: Click cơ khí (đặt), bzzt (nối dây), whoosh (tín hiệu chạy), ding (pass), buzz (fail).

## YÊU CẦU TRIỂN KHAI

1. Bắt đầu bằng engine core: Signal, Pin, Component, Wire, Circuit, Simulator
2. Implement từng loại Component (AND, OR, NOT... theo bảng trên)
3. Xây UI: Canvas rendering, drag-drop, wire drawing
4. Tạo level loader từ JSON
5. Thêm animation engine cho tín hiệu chạy trên dây
6. Thêm dialogue system cho cutscene
7. Thêm scoring system (Speed/Size stars)
8. Polish: sound, particle effects, transitions

Hãy bắt đầu triển khai từng bước. Code mỗi module riêng, có comment rõ ràng. Ưu tiên gameplay hoạt động trước, polish sau.

---

## HẾT PROMPT

