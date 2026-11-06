# ⚡ SIGNAL FACTORY — Game Design Document Hoàn Chỉnh
## (Lấy cảm hứng từ Human Resource Machine, thể loại Logic Wire Puzzle)

---

## 1. TỔNG QUAN GAME (GAME OVERVIEW)

### 1.1. Concept một dòng
> Bạn là một Kỹ sư tập sự tại nhà máy xử lý tín hiệu khổng lồ. Nhiệm vụ: nối dây, lắp linh kiện, xây mạch logic để xử lý các gói hàng (tín hiệu) đúng yêu cầu của Quản đốc.

### 1.2. Thể loại & Nền tảng
- **Thể loại:** Puzzle / Programming / Logic
- **Nền tảng:** Web (HTML5 + Canvas/WebGL), có thể mở rộng Mobile
- **Đối tượng:** Người chơi casual yêu thích giải đố, học sinh/sinh viên muốn học logic số
- **Thời lượng:** 40 level chính + level bonus

### 1.3. Điểm khác biệt với HRM
| Human Resource Machine | Signal Factory |
|------------------------|---------------|
| Lập trình assembly (tuần tự) | Xây mạch logic (song song, DAG) |
| Kéo thả lệnh text | Kéo thả linh kiện + nối dây |
| Inbox → Worker → Outbox | Input Port → Mạch → Output Port |
| Floor tiles = Memory | Register = Memory |
| 11 lệnh | ~12 loại linh kiện (mở khóa dần) |

---

## 2. CỐT TRUYỆN & THẾ GIỚI (NARRATIVE & WORLD)

### 2.1. Bối cảnh
Năm 20XX. Thế giới vận hành bằng **Tín Hiệu Số** — mọi thứ từ thư từ, hàng hóa, đến cảm xúc đều được mã hóa thành các gói tín hiệu (Signal Packets) chạy qua mạng lưới ống dẫn khổng lồ.

**SIGNAL CORP** là tập đoàn độc quyền xử lý tín hiệu lớn nhất thế giới. Nhà máy của họ là một tòa tháp 40 tầng, mỗi tầng là một phòng xử lý tín hiệu với độ phức tạp tăng dần.

### 2.2. Nhân vật chính

#### 🧑‍🔧 WORKER (Người chơi)
- Kỹ sư tập sự mới vào Signal Corp
- Không nói, biểu cảm qua animation (vui khi pass, buồn khi fail, sốc khi thấy cutscene)
- Đầu to, mắt tròn, mặc đồng phục xanh dương nhà máy
- Cầm cờ-lê và cuộn dây luôn bên mình

#### 🤖 QUẢN ĐỐC (The Foreman)
- Robot hình người cũ kỹ, nửa mặt bị tróc sơn lộ mạch bên trong
- Giao nhiệm vụ đầu mỗi level bằng giọng đơn điệu + bong bóng hội thoại
- Thỉnh thoảng lộ ra cảm xúc bất thường (cười, buồn) rồi lập tức "reset" lại
- Twist: Quản đốc dần tự hỏi liệu mình có phải cũng chỉ là một "tín hiệu"

#### 📺 MÀN HÌNH TIN TỨC (News Screen)
- TV cũ treo ở góc mỗi phòng, phát tin tức giữa các cụm level
- Đưa tin về thế giới bên ngoài: tự động hóa thay thế con người, biểu tình, Signal Corp mở rộng...
- Dark humor, châm biếm corporate culture

#### 🐱 MÈO MÁY (Circuit Cat)
- Con mèo robot nhỏ lẩn quẩn trong nhà máy
- Xuất hiện ngẫu nhiên, đôi khi ngồi lên linh kiện cản đường
- Nếu click vào: cho hint hoặc nói câu triết lý ngớ ngẩn
- Easter egg character

### 2.3. Cốt truyện theo Act

#### ACT 1: TẦNG HẦM — "Chào mừng đến Signal Corp" (Level 1-10)
- Worker được tuyển dụng, Quản đốc dạy cơ bản
- Phòng xử lý đơn giản, ánh sáng ấm, không khí thân thiện
- Cutscene: TV chiếu quảng cáo Signal Corp tươi sáng, "Nơi tín hiệu của bạn luôn đúng đích!"
- **Mood:** Lạc quan, tutorial nhẹ nhàng

#### ACT 2: TẦNG THẤP — "Gánh nặng tăng dần" (Level 11-20)
- Công việc phức tạp hơn, Worker bắt đầu mệt mỏi
- Cutscene: TV chiếu tin "Signal Corp vượt 1 tỷ gói tin/ngày", nhưng cũng thấy nhân viên cũ biến mất
- Quản đốc bắt đầu có "glitch" — nói những câu lạ rồi reset
- **Mood:** Áp lực tăng, hài hước đen bắt đầu xuất hiện

#### ACT 3: TẦNG GIỮA — "Hệ thống kiểm soát" (Level 21-30)
- Xuất hiện các bài toán về lọc, phân loại, kiểm duyệt tín hiệu
- Cutscene: TV chiếu tin biểu tình bên ngoài, "Máy móc đang cướp việc!"
- Worker nhìn qua cửa sổ thấy thành phố u ám
- Quản đốc hỏi: "Cậu có bao giờ tự hỏi... tín hiệu đi đâu không?"
- **Mood:** U ám, dystopian

#### ACT 4: TẦNG CAO — "Sự thật" (Level 31-40)
- Bài toán cực khó: mã hóa, sắp xếp, thuật toán phức tạp
- Cutscene cuối: Worker lên tầng đỉnh, phát hiện... chính mình cũng là tín hiệu
- Quản đốc nói: "Chào mừng. Bây giờ cậu hiểu rồi."
- Màn hình cuối: Worker mới bước vào nhà máy, chu trình lặp lại
- **Mood:** Triết lý, kết thúc mở

---

## 3. CƠ CHẾ GAMEPLAY CHI TIẾT (CORE MECHANICS)

### 3.1. Vòng lặp gameplay cốt lõi

```
[Quản đốc giao nhiệm vụ] 
    → [Player kéo linh kiện vào bảng mạch]
    → [Player nối dây giữa các chân (pin)]
    → [Nhấn RUN: tín hiệu chạy từ Input qua mạch đến Output]
    → [Hệ thống kiểm tra Output vs Expected]
    → [Pass → chấm điểm tối ưu → level tiếp]
    → [Fail → hiển thị lỗi tại bước sai → sửa lại]
```

### 3.2. Bảng mạch (Circuit Board)
- Lưới ô vuông (grid), kích thước tăng theo level
- Player đặt linh kiện vào ô trống
- Nối dây bằng cách click-drag từ Output Pin → Input Pin
- Dây tự động tìm đường đi trên grid (auto-routing) hoặc player kéo thủ công
- **Giới hạn:** Một Input Pin chỉ nhận 1 dây; Output Pin có thể phát nhiều dây

### 3.3. Luồng tín hiệu (Signal Flow)
Mỗi "tick" (nhịp xung clock):
1. **FETCH:** Đọc gói tin tiếp theo từ hàng đợi Input
2. **PROPAGATE:** Tín hiệu lan truyền qua dây đến các linh kiện
3. **COMPUTE:** Mỗi linh kiện tính toán output từ input
4. **OUTPUT:** Kết quả đến Output Port, so sánh với expected

**Hiển thị trực quan:**
- Gói tin là hình hộp nhỏ có số/chữ, di chuyển trên dây với animation
- Dây sáng lên khi có tín hiệu chạy qua (xanh = 1/TRUE, đỏ = 0/FALSE)
- Linh kiện nhấp nháy khi đang xử lý

### 3.4. Bộ linh kiện (Component Set)
Mở khóa dần qua các level, chia thành 5 nhóm:

#### NHÓM A — Cơ bản (Level 1-5)
| Linh kiện | Icon | Mô tả đơn giản | Input → Output |
|-----------|------|-----------------|----------------|
| WIRE (Dây) | ─── | Truyền tín hiệu thẳng | A → A |
| SPLITTER (Chia) | ─┬─ | Chia 1 tín hiệu thành 2 bản sao | A → A, A |
| SWITCH (Công tắc) | ⇋ | Bẻ hướng gói tin theo tín hiệu điều khiển | Data + Select → Out₀ hoặc Out₁ |

#### NHÓM B — Logic (Level 6-15)
| Linh kiện | Icon | Mô tả | Input → Output |
|-----------|------|-------|----------------|
| AND Gate | & | Cả hai đúng mới đúng | A, B → A VÀ B |
| OR Gate | ≥1 | Một trong hai đúng là đúng | A, B → A HOẶC B |
| NOT Gate | ¬ | Đảo ngược | A → KHÔNG A |
| XOR Gate | ⊕ | Khác nhau mới đúng | A, B → A KHÁC B |

#### NHÓM C — Số học (Level 11-20)
| Linh kiện | Icon | Mô tả | Input → Output |
|-----------|------|-------|----------------|
| ADDER (Cộng) | + | Cộng hai số | A, B → A + B |
| SUBTRACTOR (Trừ) | − | Trừ hai số | A, B → A − B |
| CONSTANT (Hằng số) | [N] | Phát ra một số cố định | → N |
| COMPARATOR (So sánh) | ⋛ | So sánh hai số | A, B → GT / EQ / LT |

#### NHÓM D — Điều khiển (Level 16-30)
| Linh kiện | Icon | Mô tả | Input → Output |
|-----------|------|-------|----------------|
| MUX (Chọn kênh) | M | Chọn 1 trong 2 input theo tín hiệu | A, B, Select → A hoặc B |
| DEMUX (Phân kênh) | D | Gửi input đến 1 trong 2 output | Data, Select → Out₀ hoặc Out₁ |
| FILTER (Lọc) | ▽ | Chỉ cho qua nếu điều kiện đúng | Data, Allow → Data hoặc ∅ |

#### NHÓM E — Bộ nhớ (Level 21-40)
| Linh kiện | Icon | Mô tả | Input → Output |
|-----------|------|-------|----------------|
| REGISTER (Thanh ghi) | □₊ | Lưu giá trị, giữ qua các tick | Data, Write, Reset → Stored |
| COUNTER (Bộ đếm) | #₊ | Đếm số lần nhận tín hiệu | Pulse, Reset → Count |
| DELAY (Trễ) | ⏱ | Giữ tín hiệu lại 1 tick | A → A (chậm 1 tick) |

---

## 4. THIẾT KẾ 40 LEVEL CHI TIẾT

### Quy tắc thiết kế level (Theo triết lý HRM)
1. Mỗi level chỉ giới thiệu TỐI ĐA 1 concept/linh kiện mới
2. Level tiếp theo phải dùng lại concept cũ + concept mới
3. Có 2 thử thách tối ưu: ⚡ Speed (ít tick) và 🔧 Size (ít linh kiện)
4. Hint hệ thống 3 cấp: gợi ý nhẹ → gợi ý rõ → gần như lời giải

---

### ACT 1: TẦNG HẦM — "Chào mừng đến Signal Corp" (Level 1-10)

**🎬 Cutscene mở đầu:**
*Worker bước vào tòa tháp Signal Corp. Quản đốc robot đứng đợi ở sảnh.*
*"Chào mừng. Tôi là Foreman Unit-7. Cậu bắt đầu từ tầng hầm. Đừng lo, rất đơn giản."*

---

#### Level 1: "Nối Thẳng" (Direct Line)
- **Mở khóa:** WIRE
- **Nhiệm vụ:** "Nối Input với Output. Chỉ vậy thôi."
- **Input:** [5, 3, 8]
- **Expected Output:** [5, 3, 8]
- **Giải pháp:** Kéo 1 dây từ IN → OUT
- **Concept:** Làm quen giao diện, hiểu Input/Output
- **⚡ Speed goal:** 3 ticks | **🔧 Size goal:** 1 wire

#### Level 2: "Song Song" (Double Line)  
- **Mở khóa:** Cách dùng nhiều Input/Output port
- **Nhiệm vụ:** "Có 2 luồng hàng. Nối cả hai."
- **Input A:** [1, 2] | **Input B:** [3, 4]
- **Expected Output A:** [1, 2] | **Expected Output B:** [3, 4]
- **Concept:** Nhiều port, mạch song song
- **⚡ 2 ticks | 🔧 2 wires**

#### Level 3: "Đổi Chỗ" (The Swap)
- **Mở khóa:** Không có gì mới (ứng dụng wire)
- **Nhiệm vụ:** "2 luồng hàng. Đổi đích cho nhau."
- **Input A:** [1, 2] → Output B | **Input B:** [3, 4] → Output A
- **Concept:** Wiring có thể chéo nhau, hiểu rõ hơn mapping
- **⚡ 2 ticks | 🔧 2 wires**

#### Level 4: "Chia Đôi" (The Split)
- **Mở khóa:** SPLITTER
- **Nhiệm vụ:** "1 luồng hàng, nhưng gửi cho CẢ HAI cổng ra."
- **Input:** [7, 2, 9]
- **Expected Output A:** [7, 2, 9] | **Expected Output B:** [7, 2, 9]
- **Concept:** Splitter — 1 input → 2 output giống nhau
- **⚡ 3 ticks | 🔧 1 splitter + 2 wires**

#### Level 5: "Phân Loại Đầu Tiên" (First Sort)
- **Mở khóa:** SWITCH (Công tắc / DEMUX đơn giản)
- **Nhiệm vụ:** "Gói hàng có nhãn 0 hoặc 1. Gửi nhãn 1 sang OUT-A, nhãn 0 sang OUT-B."
- **Input:** [1, 0, 1, 0, 0, 1]
- **Expected OUT-A:** [1, 1, 1] | **Expected OUT-B:** [0, 0, 0]
- **Gợi ý:** "Dùng chính giá trị của gói hàng làm tín hiệu điều khiển cho Switch!"
- **Concept:** Switch/DEMUX — bẻ hướng theo điều kiện
- **⚡ 6 ticks | 🔧 1 switch + 3 wires**

**🎬 Cutscene sau Level 5:**
*TV phát: "Signal Corp — Chúng tôi phân loại 10 triệu gói tin mỗi giây! Hãy tin tưởng tín hiệu của bạn."*
*Quản đốc: "Cậu làm tốt. Hãy tiếp tục."*

#### Level 6: "Kiểm Tra Kép" (Double Check)
- **Mở khóa:** AND Gate
- **Nhiệm vụ:** "2 luồng kiểm tra. Chỉ cho gói hàng qua khi CẢ HAI luồng báo OK (1)."
- **Input A:** [1, 0, 1, 1] | **Input B:** [1, 1, 0, 1]
- **Expected Output:** [1, 0, 0, 1]
- **Concept:** AND — chỉ đúng khi cả hai đúng
- **⚡ 4 ticks | 🔧 1 AND + 3 wires**

#### Level 7: "Cửa Rộng" (Open Gate)
- **Mở khóa:** OR Gate
- **Nhiệm vụ:** "Cho gói qua nếu BẤT KỲ luồng nào báo OK."
- **Input A:** [0, 0, 1, 1] | **Input B:** [0, 1, 0, 1]
- **Expected Output:** [0, 1, 1, 1]
- **Concept:** OR — đúng khi ít nhất 1 cái đúng
- **⚡ 4 ticks | 🔧 1 OR + 3 wires**

#### Level 8: "Đảo Ngược" (The Inverter)
- **Mở khóa:** NOT Gate
- **Nhiệm vụ:** "Đảo ngược tất cả: 1 thành 0, 0 thành 1."
- **Input:** [1, 0, 1, 1, 0]
- **Expected Output:** [0, 1, 0, 0, 1]
- **Concept:** NOT — đảo ngược tín hiệu
- **⚡ 5 ticks | 🔧 1 NOT + 2 wires**

#### Level 9: "Báo Động Lệch Pha" (Phase Mismatch Alarm)
- **Mở khóa:** XOR Gate
- **Nhiệm vụ:** "Hai cảm biến. Báo động (1) khi hai cảm biến đọc KHÁC nhau."
- **Input A:** [0, 1, 1, 0] | **Input B:** [0, 0, 1, 1]
- **Expected Output:** [0, 1, 0, 1]
- **Concept:** XOR — khác nhau → đúng
- **⚡ 4 ticks | 🔧 1 XOR + 3 wires**

#### Level 10: "Khóa An Toàn" (Safety Lock) ⭐ BOSS LEVEL ACT 1
- **Mở khóa:** Không có gì mới — kết hợp tất cả
- **Nhiệm vụ:** "Cửa chỉ mở khi: Sensor A BẬT VÀ Sensor B BẬT, HOẶC Override BẬT. Xuất tín hiệu mở cửa."
- **Input A:** [1,0,1,0] | **Input B:** [0,0,1,1] | **Override:** [0,1,0,0]
- **Expected:** [0,1,1,0]  (A AND B) OR Override
- **Concept:** Kết hợp AND + OR, thiết kế mạch nhiều tầng
- **⚡ 4 ticks | 🔧 1 AND + 1 OR + 6 wires**

**🎬 Cutscene sau Level 10:**
*Worker lên thang máy lên tầng cao hơn. Quản đốc nhìn theo, mắt nhấp nháy.*
*"Cậu đã qua tầng hầm. Phía trên... phức tạp hơn một chút."*
*TV: "Tin mới: Signal Corp tuyên bố sa thải 30% nhân sự. 'Chúng tôi đang tối ưu hóa.'"*

---

### ACT 2: TẦNG THẤP — "Gánh nặng tăng dần" (Level 11-20)

#### Level 11: "Đường Dây Nóng" (Hotline)
- **Mở khóa:** CONSTANT (Hằng số)
- **Nhiệm vụ:** "Cộng thêm 10 vào mỗi gói hàng." (thực chất dùng ADDER + CONST)
- **Input:** [5, 3, 12]
- **Expected:** [15, 13, 22]
- **Gợi ý:** "Hằng số luôn phát ra cùng 1 giá trị. Kết hợp với bộ cộng!"
- **Concept:** CONSTANT + nhập môn phép cộng
- **⚡ 3 ticks | 🔧 1 CONST + 1 ADDER + 3 wires**

#### Level 12: "Phòng Cộng" (The Adder Room)
- **Mở khóa:** ADDER
- **Nhiệm vụ:** "Hai luồng số. Xuất tổng của từng cặp."
- **Input A:** [3, 7, -2] | **Input B:** [4, -3, 8]
- **Expected:** [7, 4, 6]
- **Concept:** ADDER — phép cộng
- **⚡ 3 ticks | 🔧 1 ADDER + 3 wires**

#### Level 13: "Phòng Trừ" (The Subtractor Room)
- **Mở khóa:** SUBTRACTOR
- **Nhiệm vụ:** "Xuất hiệu A − B của từng cặp."
- **Input A:** [10, 3, 5] | **Input B:** [4, 7, 5]
- **Expected:** [6, -4, 0]
- **Concept:** SUBTRACTOR
- **⚡ 3 ticks | 🔧 1 SUB + 3 wires**

#### Level 14: "Nhân Ba" (The Tripler)
- **Mở khóa:** Không mới — ứng dụng ADDER + SPLITTER
- **Nhiệm vụ:** "Nhân mỗi gói hàng cho 3."
- **Input:** [2, 5, -1]
- **Expected:** [6, 15, -3]
- **Gợi ý:** "X × 3 = X + X + X. Chia tín hiệu ra rồi cộng lại!"
- **Concept:** Sáng tạo — dùng SPLITTER + nhiều ADDER
- **⚡ 3 ticks | 🔧 2 SPLITTER + 2 ADDER + wires**

#### Level 15: "Cân Đo" (The Scale)
- **Mở khóa:** COMPARATOR
- **Nhiệm vụ:** "So sánh hai gói. Xuất số LỚN HƠN. Nếu bằng, xuất một trong hai."
- **Input A:** [5, 3, 7] | **Input B:** [3, 8, 7]
- **Expected:** [5, 8, 7]
- **Gợi ý:** "Comparator cho biết ai lớn hơn. Dùng kết quả đó để điều khiển MUX!"
- **Concept:** COMPARATOR + kết hợp MUX
- **⚡ 3 ticks | 🔧 1 CMP + 1 MUX + wires**

**🎬 Cutscene sau Level 15:**
*Quản đốc đang đứng nhìn ra cửa sổ. Mưa.*
*"Trước cậu... có nhiều kỹ sư. Họ... không còn ở đây nữa."*
*TV: "Signal Corp phát triển AI tự xây mạch. 'Tương lai không cần kỹ sư.'"*
*Quản đốc glitch: "Tôi... nhớ... ERROR. Reset."*

#### Level 16: "Lọc Dương" (Positive Filter)
- **Mở khóa:** FILTER (kết hợp COMPARATOR + SWITCH)
- **Nhiệm vụ:** "Chỉ cho qua các số DƯƠNG (> 0). Bỏ số 0 và âm."
- **Input:** [5, -3, 0, 8, -1, 2]
- **Expected:** [5, 8, 2]
- **Concept:** COMPARATOR với CONSTANT(0) + SWITCH để lọc
- **⚡ 6 ticks | 🔧 1 CMP + 1 CONST + 1 SWITCH + wires**

#### Level 17: "Giá Trị Tuyệt Đối" (Absolute Value)
- **Mở khóa:** Không mới — kết hợp CMP + SUB + MUX
- **Nhiệm vụ:** "Biến tất cả số âm thành dương. Số dương giữ nguyên."
- **Input:** [-5, 3, -8, 0, 7]
- **Expected:** [5, 3, 8, 0, 7]
- **Gợi ý:** "|X| = nếu X < 0 thì 0 − X, ngược lại X"
- **Concept:** Rẽ nhánh + tính toán có điều kiện
- **⚡ 5 ticks | 🔧 CMP + CONST(0) + SUB + MUX + wires**

#### Level 18: "Phân Loại Ngưỡng" (Threshold Sort)
- **Mở khóa:** Không mới — ứng dụng tổng hợp
- **Nhiệm vụ:** "Gói hàng ≥ 10 kg sang cổng NẶNG, < 10 kg sang cổng NHẸ."
- **Input:** [5, 12, 3, 15, 10, 8]
- **Expected NẶNG:** [12, 15, 10] | **Expected NHẸ:** [5, 3, 8]
- **Concept:** COMPARATOR + CONSTANT(10) + DEMUX
- **⚡ 6 ticks | 🔧 1 CMP + 1 CONST + 1 DEMUX + wires**

#### Level 19: "Chọn Kênh" (Channel Select)
- **Mở khóa:** MUX (Multiplexer chính thức)
- **Nhiệm vụ:** "2 luồng dữ liệu, 1 luồng điều khiển (0/1). Khi control=0 → lấy từ A, control=1 → lấy từ B."
- **Input A:** [10, 20, 30] | **Input B:** [40, 50, 60] | **Control:** [0, 1, 0]
- **Expected:** [10, 50, 30]
- **Concept:** MUX — chọn giữa nhiều nguồn dữ liệu
- **⚡ 3 ticks | 🔧 1 MUX + 4 wires**

#### Level 20: "Mật Mã Đơn Giản" (Simple Cipher) ⭐ BOSS LEVEL ACT 2
- **Mở khóa:** Không mới — boss level tổng hợp
- **Nhiệm vụ:** "Mã hóa: Nếu số chẵn → cộng 5, số lẻ → trừ 3. Xuất kết quả."
- **Input:** [4, 7, 2, 11, 6]
- **Expected:** [9, 4, 7, 8, 11]
- **Gợi ý:** "Kiểm tra chẵn/lẻ bằng cách lấy bit cuối (AND với CONST 1). Rồi dùng MUX chọn kênh cộng hoặc trừ."
- **Concept:** Tổng hợp: AND + CONST + ADDER + SUB + MUX
- **⚡ 5 ticks | 🔧 ≤ 8 linh kiện**

**🎬 Cutscene sau Level 20:**
*Thang máy lên tầng giữa. Ánh sáng chuyển lạnh.*
*Quản đốc: "Tầng trên xử lý... những thứ quan trọng hơn. Tín hiệu từ... con người."*
*TV: "Breaking: Cảm xúc con người đã được mã hóa thành công. Signal Corp nắm bản quyền."*
*Worker nhìn tay mình — tay đang phát sáng nhẹ.*

---

### ACT 3: TẦNG GIỮA — "Hệ thống kiểm soát" (Level 21-30)

#### Level 21: "Bộ Nhớ Đầu Tiên" (First Memory)
- **Mở khóa:** REGISTER
- **Nhiệm vụ:** "Nhận chuỗi tín hiệu. Lưu giá trị đầu tiên, sau đó xuất nó liên tục cho mỗi tick."
- **Input:** [42, -, -, -, -] (chỉ có giá trị ở tick 1)
- **Expected:** [42, 42, 42, 42, 42]
- **Concept:** REGISTER — lưu và giữ giá trị qua nhiều tick
- **⚡ 5 ticks | 🔧 1 REG + wires**

#### Level 22: "Bộ Đếm" (The Counter)
- **Mở khóa:** COUNTER
- **Nhiệm vụ:** "Đếm số gói hàng có giá trị = 1 đi qua. Xuất tổng đếm mỗi tick."
- **Input:** [1, 0, 1, 1, 0, 1]
- **Expected:** [1, 1, 2, 3, 3, 4]
- **Concept:** COUNTER — đếm sự kiện
- **⚡ 6 ticks | 🔧 1 COUNTER + wires**

#### Level 23: "Tổng Dồn" (Running Total)
- **Mở khóa:** Không mới — REGISTER + ADDER
- **Nhiệm vụ:** "Tính tổng tích lũy: mỗi tick xuất tổng tất cả số đã nhận."
- **Input:** [3, 5, 2, 10]
- **Expected:** [3, 8, 10, 20]
- **Concept:** Feedback loop — output ADDER → REGISTER → quay lại input ADDER
- **⚡ 4 ticks | 🔧 1 REG + 1 ADDER + wires**

#### Level 24: "Trễ Một Nhịp" (One Beat Late)
- **Mở khóa:** DELAY
- **Nhiệm vụ:** "Xuất giá trị của tick TRƯỚC ĐÓ. Tick đầu tiên xuất 0."
- **Input:** [5, 3, 8, 1]
- **Expected:** [0, 5, 3, 8]
- **Concept:** DELAY — giữ tín hiệu lại 1 tick
- **⚡ 4 ticks | 🔧 1 DELAY + wires**

#### Level 25: "So Với Trước" (Compare With Previous)
- **Mở khóa:** Không mới — DELAY + COMPARATOR
- **Nhiệm vụ:** "Xuất 1 nếu giá trị hiện tại LỚN HƠN giá trị trước đó, ngược lại 0."
- **Input:** [3, 7, 2, 9, 9]
- **Expected:** [1, 1, 0, 1, 0] (tick đầu: 3 > 0 → 1)
- **Concept:** Dùng DELAY để so sánh giá trị hiện tại với giá trị cũ
- **⚡ 5 ticks | 🔧 1 DELAY + 1 CMP + wires**

**🎬 Cutscene sau Level 25:**
*Mèo máy chạy qua, dừng lại nhìn Worker.*
*Mèo: "Meo... 01101101 01100101 01101111..." (mã binary của "meo")*
*Quản đốc xuất hiện: "Đừng nói chuyện với nó. Nó chỉ là... noise."*
*TV: "Biểu tình ngày thứ 47. Người dân yêu cầu Signal Corp ngừng 'số hóa' ký ức."*

#### Level 26: "Phát Hiện Đỉnh" (Peak Detector)
- **Nhiệm vụ:** "Xuất giá trị LỚN NHẤT từng thấy tính đến tick hiện tại."
- **Input:** [3, 7, 2, 9, 5]
- **Expected:** [3, 7, 7, 9, 9]
- **Concept:** REGISTER + COMPARATOR + MUX (lưu max, so sánh, cập nhật)
- **⚡ 5 ticks | 🔧 1 REG + 1 CMP + 1 MUX + wires**

#### Level 27: "Trung Bình Hai" (Average of Two)
- **Nhiệm vụ:** "Nhận 2 số mỗi cặp. Xuất trung bình (làm tròn xuống)."
- **Input A:** [6, 10, 3] | **Input B:** [4, 3, 8]
- **Expected:** [5, 6, 5] (5, 6.5→6, 5.5→5)
- **Gợi ý:** "(A+B) / 2. Chia 2 = dịch phải 1 bit. Dùng SHIFT-RIGHT!"
- **Mở khóa:** RIGHT-SHIFT (dịch phải = chia 2)
- **⚡ 3 ticks | 🔧 1 ADDER + 1 RSHIFT + wires**

#### Level 28: "Chuỗi Fibonacci Mini" (Mini Fibonacci)
- **Nhiệm vụ:** "Không input. Tự tạo chuỗi Fibonacci: 1, 1, 2, 3, 5, 8..."
- **Expected:** [1, 1, 2, 3, 5, 8, 13, 21]
- **Concept:** 2 REGISTER + ADDER + feedback loop phức tạp
- **⚡ 8 ticks | 🔧 2 REG + 1 ADDER + wires**

#### Level 29: "Mã Chẵn Lẻ" (Parity Checker)
- **Nhiệm vụ:** "Nhận 3 bit. Xuất 1 nếu tổng số bit 1 là LẺ (odd parity)."
- **Input A:** [1,0,1,0] | **B:** [0,1,1,1] | **C:** [1,1,0,0]
- **Expected:** [0, 0, 0, 1]
- **Concept:** XOR chain (A XOR B XOR C)
- **⚡ 4 ticks | 🔧 2 XOR + wires**

#### Level 30: "Bộ Giải Mã" (The Decoder) ⭐ BOSS LEVEL ACT 3
- **Nhiệm vụ:** "Nhận 2-bit input (A, B). Xuất tín hiệu trên 1 trong 4 kênh tương ứng: kênh 0 (00), kênh 1 (01), kênh 2 (10), kênh 3 (11)."
- **Input A:** [0,0,1,1] | **B:** [0,1,0,1]
- **Expected OUT-0:** [1,0,0,0] | **OUT-1:** [0,1,0,0] | **OUT-2:** [0,0,1,0] | **OUT-3:** [0,0,0,1]
- **Concept:** Kết hợp AND + NOT + nhiều cổng → 2-to-4 decoder
- **⚡ 4 ticks | 🔧 2 NOT + 4 AND + wires**

**🎬 Cutscene sau Level 30:**
*Worker bước vào phòng tối. Hàng trăm màn hình hiện dữ liệu.*
*Quản đốc: "Cậu thấy không? Mỗi dòng số đó... là một con người."*
*Quản đốc glitch nặng: "Tôi... cũng từng là... ERROR ERROR ERROR."*
*TV tắt đi, chỉ còn nhiễu tĩnh.*

---

### ACT 4: TẦNG CAO — "Sự thật" (Level 31-40)

#### Level 31: "Nhân Hai Số" (The Multiplier)
- **Nhiệm vụ:** "Nhân A × B (cả hai dương, ≤ 15). Xuất tích."
- **Input A:** [3, 5, 2] | **B:** [4, 3, 7]
- **Expected:** [12, 15, 14]
- **Gợi ý:** "Nhân = cộng lặp. A × B = A + A + A... (B lần). Dùng COUNTER + REGISTER + loop."
- **Concept:** Thuật toán: vòng lặp qua feedback + bộ đếm + so sánh
- **⚡ Tùy input | 🔧 ≤ 10 linh kiện**

#### Level 32: "Chia Lấy Dư" (Modulo)
- **Nhiệm vụ:** "Tính A mod B (phần dư khi chia)."
- **Input A:** [17, 10, 7] | **B:** [5, 3, 4]
- **Expected:** [2, 1, 3]
- **Concept:** Trừ lặp cho đến khi < B, kết quả là phần dư
- **⚡ Tùy input | 🔧 ≤ 12 linh kiện**

#### Level 33: "Đếm Ngược" (Countdown Timer)
- **Nhiệm vụ:** "Nhận 1 số N. Xuất N, N-1, N-2, ..., 1, 0."
- **Input:** [5]
- **Expected:** [5, 4, 3, 2, 1, 0]
- **Concept:** REGISTER + SUBTRACTOR + CONST(1) + feedback + điều kiện dừng
- **⚡ 6 ticks | 🔧 ≤ 6 linh kiện**

#### Level 34: "Lũy Thừa 2" (Power of Two)
- **Nhiệm vụ:** "Nhận N. Xuất 2^N."
- **Input:** [0, 1, 2, 3, 4]
- **Expected:** [1, 2, 4, 8, 16]
- **Concept:** LEFT-SHIFT hoặc nhân lặp
- **⚡ 5 ticks | 🔧 ≤ 8 linh kiện**

#### Level 35: "Sắp Xếp Hai" (Sort Two)
- **Nhiệm vụ:** "Nhận 2 số. Xuất số nhỏ trước, số lớn sau."
- **Input A:** [8, 2, 5] | **B:** [3, 9, 5]
- **Expected OUT-MIN:** [3, 2, 5] | **OUT-MAX:** [8, 9, 5]
- **Concept:** COMPARATOR + 2 MUX (đổi chỗ có điều kiện)
- **⚡ 3 ticks | 🔧 1 CMP + 2 MUX + wires**

**🎬 Cutscene sau Level 35:**
*Quản đốc dẫn Worker đến cánh cửa cuối.*
*"Đằng sau cánh cửa này... là tầng đỉnh. Nơi mọi tín hiệu kết thúc."*
*"Cậu có muốn biết... tín hiệu đi đâu không?"*
*Worker gật đầu.*

#### Level 36: "Sắp Xếp Ba" (Sort Three)
- **Nhiệm vụ:** "Nhận 3 số. Xuất theo thứ tự tăng dần."
- **Input:** [7, 2, 5]
- **Expected:** [2, 5, 7]
- **Concept:** Mạng sắp xếp (sorting network) — 3 bộ compare-and-swap
- **⚡ Nhiều tick | 🔧 3 CMP + 6 MUX + wires**

#### Level 37: "Kiểm Tra Đối Xứng" (Palindrome Check)
- **Nhiệm vụ:** "Nhận chuỗi 4 số (kết thúc bằng 0). Xuất 1 nếu đối xứng, 0 nếu không."
- **Input:** [1, 2, 2, 1, 0] rồi [1, 2, 3, 4, 0]
- **Expected:** [1] rồi [0]
- **Concept:** Lưu vào register, so sánh đầu-cuối
- **⚡ Tùy input | 🔧 ≤ 15 linh kiện**

#### Level 38: "Mã Hóa XOR" (XOR Cipher)
- **Nhiệm vụ:** "Mã hóa mỗi gói bằng XOR với key. Key thay đổi: bắt đầu = 1, key mới = output trước đó."
- **Input:** [5, 3, 8, 2]
- **Expected:** [5 XOR 1, 3 XOR 4, 8 XOR 7, 2 XOR 15] = [4, 7, 15, 13]
- **Concept:** XOR + REGISTER feedback (cipher chain)
- **⚡ 4 ticks | 🔧 1 XOR + 1 REG + wires**

#### Level 39: "Bộ Cộng Nhị Phân" (Binary Full Adder)
- **Nhiệm vụ:** "Xây full adder: Input A, B, Carry-In. Output: Sum, Carry-Out."
- **Bảng chân trị hoàn chỉnh phải đúng cho tất cả 8 tổ hợp**
- **Concept:** Mạch cổng kinh điển: XOR + AND + OR
- **⚡ 8 ticks | 🔧 2 XOR + 2 AND + 1 OR + wires**

#### Level 40: "Tín Hiệu Cuối Cùng" (The Last Signal) ⭐ FINAL BOSS
- **Nhiệm vụ:** "Xây bộ ALU mini: nhận 2 số A, B và 2 bit điều khiển OP. OP=00 → A+B, OP=01 → A−B, OP=10 → A AND B, OP=11 → A XOR B."
- **Input:** Nhiều bộ test case
- **Concept:** Tổng hợp TẤT CẢ kiến thức: ADDER + SUB + AND + XOR + MUX chuỗi + DECODER
- **⚡ Tùy input | 🔧 ≤ 15 linh kiện**

**🎬 Cutscene kết thúc:**
*Worker hoàn thành. Cánh cửa tầng đỉnh mở ra.*
*Bên trong: một căn phòng trắng, chỉ có 1 màn hình.*
*Màn hình hiện: mạch logic — và ở giữa mạch... là hình Worker.*
*Quản đốc: "Bây giờ cậu hiểu rồi. Cậu cũng là tín hiệu. Và tôi... cũng vậy."*
*"Nhưng tín hiệu... cũng có thể chọn con đường của mình."*
*Camera zoom out: cả tòa tháp Signal Corp là một con chip khổng lồ.*
*Credit rolls. Một Worker MỚI bước vào sảnh...*

---

## 5. GIAO DIỆN & PHONG CÁCH NGHỆ THUẬT

### 5.1. Art Style
- **Pixel art phong cách retro-industrial**, palette hạn chế (~32 màu)
- Nhà máy có ống dẫn, hơi nước, đèn neon nhấp nháy
- Linh kiện thiết kế dễ thương, bo tròn, có "mắt" hoặc icon biểu cảm
- Dây nối phát sáng neon khi có tín hiệu chạy qua
- Background tối, linh kiện và dây sáng nổi bật

### 5.2. Layout màn hình gameplay
```
┌──────────────────────────────────────────────────┐
│ [☰Menu]  Level 15: "Cân Đo"  [⚡3] [🔧4]  [▶RUN]│  ← Top Bar
├────────┬─────────────────────────────┬───────────┤
│        │                             │           │
│  IN    │     CIRCUIT BOARD           │   OUT     │
│  PORT  │     (Khu vực đặt mạch)     │   PORT    │
│        │                             │           │
│ [5]→   │  ┌───┐    ┌───┐            │   →[5]    │
│ [3]→   │  │CMP│────│MUX│            │   →[8]    │
│ [8]→   │  └───┘    └───┘            │   →[7]    │
│        │                             │           │
├────────┴─────────────────────────────┴───────────┤
│  COMPONENT TRAY (Kéo thả linh kiện từ đây)       │
│  [AND] [OR] [NOT] [CMP] [MUX] [CONST] [WIRE]    │
├──────────────────────────────────────────────────┤
│  💬 Quản đốc: "So sánh và chọn số lớn hơn."     │  ← Dialogue
└──────────────────────────────────────────────────┘
```

### 5.3. Hiệu ứng & Animation
- **Run mode:** Gói tin (hình hộp có số) chạy trên dây với animation mượt
- **Dây sáng:** Xanh lá = TRUE/cao, Đỏ = FALSE/thấp, Xám = không tín hiệu
- **Linh kiện xử lý:** Nhấp nháy + hiệu ứng "pulse" khi compute
- **Pass level:** Confetti + Worker nhảy vui + Quản đốc vỗ tay (robot style)
- **Fail:** Dây đỏ lóe + Worker gãi đầu + Quản đốc lắc đầu

### 5.4. Âm thanh
- **BGM:** Lo-fi electronic + tiếng máy móc nhẹ, thay đổi theo Act
  - Act 1: Vui tươi, upbeat
  - Act 2: Trầm hơn, thêm bass
  - Act 3: U ám, ambient
  - Act 4: Epic, emotional
- **SFX:**
  - Đặt linh kiện: "Click" cơ khí
  - Nối dây: "Bzzt" nhẹ
  - Tín hiệu chạy: "Whoosh" nhỏ
  - Pass: "Ding ding ding!" + tiếng vỗ tay
  - Fail: "Buzzzz" + tiếng static

---

## 6. HỆ THỐNG TỐI ƯU & TIẾN TRÌNH

### 6.1. Chấm điểm mỗi level
- **⭐ Hoàn thành:** Giải đúng (bắt buộc)
- **⚡ Speed Star:** Hoàn thành trong ≤ N ticks
- **🔧 Size Star:** Dùng ≤ M linh kiện
- **✨ Perfect:** Đạt cả Speed + Size → mở khóa skin linh kiện đặc biệt

### 6.2. Progression
- Tổng sao mở khóa bonus level
- Mỗi Act hoàn thành → mở khóa bộ skin (theme linh kiện)
- 100% completion → ending bí mật

### 6.3. Sandbox Mode
- Mở khóa sau khi clear Level 20
- Tất cả linh kiện, không giới hạn
- Player tự do xây mạch, share screenshot

---

## 7. KẾT LUẬN

Game **Signal Factory** giữ nguyên tinh thần cốt lõi của Human Resource Machine:
1. ✅ Ẩn dụ cụ thể cho khái niệm trừu tượng (nhà máy → logic số)
2. ✅ Onboarding từ từ (1 concept/level)
3. ✅ Visual feedback tức thì (thấy tín hiệu chạy)
4. ✅ Tối ưu kép (Speed vs Size)
5. ✅ Cốt truyện dark humor giữ chân người chơi
6. ✅ 40 level với progression curve hoàn chỉnh

Nhưng mang đến trải nghiệm KHÁC BIỆT:
- Tư duy SONG SONG thay vì tuần tự
- Xây dựng MẠCH thay vì viết CODE
- Dạy LOGIC SỐ thay vì assembly

