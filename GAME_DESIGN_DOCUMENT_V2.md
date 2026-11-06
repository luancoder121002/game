# 📦 SIGNAL FACTORY v2.0 — Game Design Document (Cải Tiến)
## Puzzle Logic × Shipping Simulation × Branching Narrative

---

## CHANGELOG SO VỚI V1

| Thay đổi | V1 (cũ) | V2 (mới) |
|----------|---------|----------|
| Nhân vật chính | Kỹ sư tĩnh đứng ngoài | **SHIPPER — nhân vật chạy ship thùng hàng trực tiếp trên mạch** |
| Nền tảng | Web only | **Mobile-first + PC adaptive** (touch + mouse/keyboard) |
| Cốt truyện | Tuyến tính 1 ending | **Phân nhánh — 3 ending dựa trên lựa chọn player** |
| Ẩn dụ game | Tín hiệu trừu tượng | **Thùng hàng vật lý — dễ hiểu, nhìn là biết** |
| Tương tác | Chỉ kéo thả linh kiện | **Kéo thả + nhìn Shipper chạy giao hàng trên mạch** |
| UI | Desktop layout cố định | **Responsive: portrait (mobile) / landscape (PC)** |

---

## 1. TỔNG QUAN GAME

### 1.1. Concept
> Bạn là **BOX** — shipper nhỏ bé tại tập đoàn giao hàng **SIGNAL CORP**. Nhiệm vụ: xây đường đi (mạch logic) để giao đúng thùng hàng đến đúng kho. Đặt trạm xử lý (linh kiện), nối đường ray (dây), rồi nhấn GO để xem BOX chạy giao hàng!

### 1.2. Tại sao thêm Shipper?
- **Trực quan hơn 10x:** Thay vì "tín hiệu trừu tượng chạy trên dây", player **nhìn thấy nhân vật bê thùng hàng chạy** qua các trạm xử lý → dễ hiểu ngay cả với người chưa biết logic số
- **Gắn kết cảm xúc:** Player quan tâm đến nhân vật BOX hơn là "gói tin số 5"
- **Feedback tức thì:** BOX vui khi giao đúng, buồn khi giao sai, mệt khi chạy nhiều
- **Mobile-friendly:** Tap/kéo thả trên mobile dễ dàng vì có nhân vật quen thuộc

### 1.3. Nền tảng & Công nghệ
- **Mobile (iOS/Android):** Touch-first, portrait mode chính, landscape tùy chọn
- **PC (Web/Desktop):** Mouse + keyboard shortcuts, landscape
- **Engine:** HTML5 Canvas + responsive CSS (hoặc Godot/Unity export multi-platform)
- **Sync:** Cloud save, chơi trên điện thoại → tiếp tục trên PC

---

## 2. NHÂN VẬT (CHARACTERS)

### 2.1. 📦 BOX — Nhân vật Shipper (Người chơi điều khiển gián tiếp)

**Ngoại hình:**
- Hình người nhỏ đầu vuông (giống thùng hàng), chân ngắn, tay ngắn
- Đội mũ lưỡi trai có logo Signal Corp
- Ba lô giao hàng trên lưng (chứa thùng hàng)
- Mắt to tròn, rất biểu cảm
- Chiều cao ~2 ô trên grid

**Animation states (quan trọng cho gameplay):**
| State | Mô tả | Khi nào |
|-------|--------|---------|
| 🚶 IDLE | Đứng giậm chân tại Input Port, chờ hàng | Chưa nhấn RUN |
| 📦 PICKUP | Cúi xuống nhặt thùng hàng từ Input Belt | Pha FETCH |
| 🏃 RUN | Chạy trên đường ray (dây), bê thùng trên đầu | Pha PROPAGATE |
| 🔧 PROCESS | Đứng tại trạm xử lý, xem máy xử lý thùng hàng | Pha COMPUTE |
| 📬 DELIVER | Đặt thùng vào Output Belt, vẫy tay | Output đúng |
| 😱 CRASH | Ngã, thùng hàng rơi vỡ | Output sai |
| 🎉 CELEBRATE | Nhảy múa, confetti | Clear level |
| 😓 TIRED | Lau mồ hôi, thở gấp | Chạy nhiều tick |
| 💤 SLEEP | Ngồi ngủ gật | AFK lâu |

**Cơ chế Shipper trong gameplay:**
- BOX **không phải nhân vật điều khiển trực tiếp** — player xây mạch, BOX tự chạy theo mạch
- Giống HRM: player thiết kế hệ thống, nhân vật thực thi
- BOX chạy từ **Input Port → qua dây → qua trạm xử lý → đến Output Port**
- Khi mạch có **SPLITTER**: BOX phân thân (clone) chạy 2 đường
- Khi mạch có **SWITCH/MUX**: BOX đứng tại ngã rẽ, nhìn bảng chỉ dẫn rồi rẽ
- Khi mạch có **REGISTER**: BOX đặt thùng vào kho tạm, lấy lại sau

### 2.2. 🤖 DISPATCH — Quản Đốc Giao Hàng

**Ngoại hình:**
- Robot hình người cao gấp 3 BOX
- Mặc vest công sở, cà vạt, nhưng thân robot rõ ràng
- Mặt là màn hình LED hiển thị emoji biểu cảm :) :| :( >:(
- Tay phải cầm clipboard, tay trái có anten
- Nửa thân bị rỉ sét (lộ dần qua các Act)

**Vai trò:**
- Giao nhiệm vụ đầu mỗi level (bong bóng hội thoại)
- Phản hồi khi pass/fail
- Trong cốt truyện: dần phát triển **ý thức tự chủ**
- **CÓ THỂ TRỞ THÀNH ĐỒNG MINH HOẶC ĐỐI THỦ** tùy lựa chọn player

### 2.3. 🐱 GLITCH — Mèo Lỗi

- Mèo pixel bị "lỗi đồ họa" — body nhấp nháy, đuôi biến mất rồi hiện lại
- Xuất hiện từ Level 8+, ngồi trên linh kiện ngẫu nhiên
- **Tap/click vào Glitch:**
  - 50%: Cho hint hữu ích
  - 30%: Nói câu triết lý ngớ ngẩn ("Meo... thùng hàng rỗng cũng là hàng...")
  - 20%: Tặng 1 "Glitch Token" (dùng cho story choices)
- **Easter egg:** Thu thập đủ 10 Glitch Token → mở khóa secret ending

### 2.4. 📺 NEWS DRONE — Drone Tin Tức

- Drone bay nhỏ với màn hình gắn dưới bụng
- Bay qua giữa các level, phát tin tức
- Thay thế "TV treo tường" của V1 — linh hoạt hơn, có thể bay vào trong gameplay
- Tin tức **thay đổi dựa trên lựa chọn player** (cốt truyện phân nhánh)

---

## 3. CỐT TRUYỆN PHÂN NHÁNH (BRANCHING NARRATIVE)

### 3.1. Tổng quan hệ thống

Thay vì tuyến tính, cốt truyện V2 có **hệ thống Reputation + Choice Points:**

```
                         ┌─→ ENDING A: "Tự Do"
                         │
[ACT 1] → [ACT 2] → [CHOICE 1] → [ACT 3a/3b] → [CHOICE 2] → [ACT 4] → [CHOICE 3]
                                                                          ├─→ ENDING B: "Phục Tùng"
                                                                          └─→ ENDING C: "Phá Hủy"
                                                                     (Secret) ENDING D: "Siêu Việt"
```

### 3.2. Hệ thống Reputation (Ẩn)

Player tích lũy 2 thanh reputation ẩn dựa trên hành vi:

| Thanh | Tăng khi | Giảm khi |
|-------|----------|----------|
| 🔵 **EMPATHY** (Đồng cảm) | Giúp Glitch, chọn đối thoại thấu hiểu, KHÔNG hoàn thành "nhiệm vụ xấu" | Bỏ qua NPC, chọn efficiency trên tất cả |
| 🔴 **EFFICIENCY** (Hiệu suất) | Đạt tối ưu Speed+Size, hoàn thành mọi nhiệm vụ phụ, chọn logic lạnh lùng | Chậm, dùng nhiều linh kiện, bỏ qua tối ưu |

**Reputation ảnh hưởng đến:**
- Dialogue của Dispatch (thân thiện vs lạnh lùng vs lo lắng)
- Tin tức trên News Drone
- Difficulty/nội dung một số level
- Ending nào được mở khóa

### 3.3. Chi tiết cốt truyện theo Act

#### ACT 1: KHU VỰC PHÂN LOẠI — "Ngày đầu đi ship" (Level 1-10)

**Bối cảnh:** BOX mới được tuyển vào Signal Corp — tập đoàn giao hàng lớn nhất thế giới. Mọi thứ trên thế giới đều được đóng gói thành "thùng hàng số" và giao qua hệ thống ống/ray tự động.

**Cutscene mở đầu:**
> *BOX bước vào nhà kho tầng trệt. Ánh sáng ấm, nhạc vui.*
> *Dispatch: "Chào mừng, nhân viên mới! Tôi là Dispatch, quản đốc khu vực này."*
> *"Công việc rất đơn giản: XÂY ĐƯỜNG, GIAO HÀNG. Hàng vào từ băng chuyền IN, cậu chuyển đến kho OUT."*
> *"Bắt đầu nào!"*

**Cutscene sau Level 5 — "Bữa trưa":**
> *BOX ngồi ăn cơm hộp. Glitch nhảy lên bàn, ngửi hộp cơm.*
> *Dispatch từ xa: "Đừng cho mèo ăn. Nó là lỗi hệ thống."*
>
> **🔵 CHOICE:** [Cho Glitch ăn] vs [Đuổi Glitch đi]
> - Cho ăn: EMPATHY +1, Glitch sẽ giúp nhiều hơn về sau
> - Đuổi: EFFICIENCY +1, Dispatch nói "Tốt, cậu chuyên nghiệp đấy"

**Cutscene sau Level 10 (Boss clear):**
> *Dispatch: "Ấn tượng! Cậu lên khu vực tiếp nhé."*
> *News Drone bay qua: "Signal Corp mở rộng hệ thống. Cần tuyển thêm shipper."*
> *Hoặc (nếu EMPATHY > EFFICIENCY): "Signal Corp mở rộng. Một số shipper cũ đã... nghỉ việc."*

---

#### ACT 2: KHU VỰC XỬ LÝ — "Hàng ngày càng nặng" (Level 11-20)

**Bối cảnh:** BOX được thăng cấp lên khu xử lý. Nơi đây phải tính toán, cân đo, phân loại hàng phức tạp.

**Story beats:**
- Level 11-12: Dispatch vẫn vui vẻ, dạy cách dùng bộ cộng/trừ
- Level 13-14: BOX bắt đầu thấy "thùng hàng bỏ lại" — hàng không ai nhận
- Level 15: Dispatch lần đầu glitch — *"Trước cậu có BOX-6... nó rất giỏi... ERROR."*

**Cutscene sau Level 15 — "Thùng hàng kỳ lạ":**
> *BOX tìm thấy thùng hàng bí ẩn có dòng chữ "ĐỪNG MỞ"*
>
> **🔵 CHOICE:** [Mở thùng] vs [Báo cho Dispatch]
> - Mở thùng: Thấy ảnh của BOX-6 (shipper cũ). EMPATHY +2. Mở khóa side-quest.
> - Báo Dispatch: Dispatch lấy thùng đi. EFFICIENCY +1. *"Hàng không phải của mình thì đừng đụng."*

**Cutscene sau Level 18 — "Hàng bị chặn":**
> *Dispatch ra lệnh: "Level này: lọc bỏ tất cả thùng có nhãn ĐỎ. Đừng hỏi tại sao."*
>
> **Gameplay choice:** Player CÓ THỂ:
> - (A) Làm đúng nhiệm vụ: lọc bỏ nhãn đỏ → EFFICIENCY +2
> - (B) "Lén" giao cả nhãn đỏ → Level fail nhưng EMPATHY +3, mở khóa dialogue bí mật

**Cutscene sau Level 20 (Boss clear):**
> *Dispatch: "Cậu... xứng đáng lên tầng tiếp."*
> *Dispatch glitch nặng: mặt LED hiện 😢 trong 0.5 giây rồi reset về :)*
> *News Drone: "Signal Corp tự động hóa 60% hệ thống giao hàng. 'Shipper là quá khứ.'"*

---

#### ACT 3: KHU VỰC KIỂM SOÁT — "Ai kiểm soát ai?" (Level 21-30)

**Phân nhánh chính — dựa trên EMPATHY vs EFFICIENCY:**

##### NHÁNH 3A — Đường Đồng Cảm (EMPATHY ≥ EFFICIENCY)
- Dispatch bắt đầu **tin tưởng BOX**, tiết lộ bí mật
- Level 21-25: Dispatch nói: *"Thùng hàng nhãn đỏ... là ký ức của shipper bị 'nghỉ việc'. Signal Corp xóa chúng."*
- Level 26-28: BOX phải xử lý thùng hàng chứa "ký ức" — gameplay y hệt nhưng story context khác
- **CHOICE sau Level 28:** Dispatch hỏi: *"Tôi tìm được cách cứu ký ức. Nhưng cần cậu giúp. Cậu có... tin tôi không?"*
  - [Tin] → Mở khóa Level 29-30 đặc biệt (cứu ký ức)
  - [Không tin] → Level 29-30 tiêu chuẩn

##### NHÁNH 3B — Đường Hiệu Suất (EFFICIENCY > EMPATHY)
- Dispatch coi BOX là **công cụ hiệu quả**, giao nhiệm vụ khó hơn
- Level 21-25: Signal Corp "thưởng" BOX — mở khóa linh kiện mạnh hơn sớm hơn
- Level 26-28: Nhiệm vụ: xây hệ thống tự động thay thế... shipper khác
- **CHOICE sau Level 28:** CEO (giọng nói qua loa) nói: *"BOX, cậu xuất sắc. Tôi muốn cậu lên vị trí... Quản đốc. Thay thế Dispatch."*
  - [Đồng ý] → Level 29-30: BOX xây mạch "decommission" Dispatch
  - [Từ chối] → Level 29-30: Phải trốn khỏi hệ thống kiểm soát

**Cutscene sau Level 30 (Boss):**
> Cả hai nhánh đều dẫn đến: BOX phát hiện **tầng đỉnh tòa nhà** có thứ gì đó
> *Thang máy mở. Ánh sáng trắng tràn ra.*

---

#### ACT 4: TẦNG ĐỈNH — "Sự thật về thùng hàng" (Level 31-40)

**Bài toán khó nhất, kết hợp tất cả kiến thức.**

**Sự thật được tiết lộ dần:**
- Level 31-35: Mỗi level hoàn thành → 1 mảnh ghép câu chuyện
  - "Signal Corp không giao hàng cho khách hàng. Signal Corp giao hàng cho... chính nó."
  - "Thùng hàng là dữ liệu. Shipper là processor. Cả tòa nhà là... một cỗ máy tính."
  - "BOX... cũng là thùng hàng."

**Level 36-39: Gameplay thay đổi nhẹ**
- BOX bắt đầu **phát sáng** — nhận ra mình cũng là tín hiệu
- Một số thùng hàng có hình BOX bên trong
- Dispatch (nếu còn sống/đồng minh) giúp giải thích

---

### 3.4. Ba Ending + Secret Ending

#### ENDING A: "TỰ DO" 🕊️
**Điều kiện:** EMPATHY cao + giúp Dispatch + từ chối CEO

**Level 40 — "Thoát Ra Ngoài":**
> Nhiệm vụ: Xây mạch **mở tất cả cổng** — giải phóng mọi shipper
> BOX + Dispatch phá tường tòa nhà. Ánh sáng mặt trời tràn vào.
> *"Thùng hàng cũng có quyền chọn đích đến."*
> **Cảnh cuối:** BOX đi trên con đường xanh, ba lô trên lưng, tự do.

#### ENDING B: "PHỤC TÙNG" ⚙️
**Điều kiện:** EFFICIENCY cao + thay thế Dispatch + phục vụ CEO

**Level 40 — "Quản Đốc Mới":**
> Nhiệm vụ: Xây ALU hoàn chỉnh — hệ thống tự động ultimate
> BOX trở thành Dispatch mới. Mặt BOX chuyển thành màn hình LED.
> *"Hệ thống cần ai đó vận hành. Đó là cậu."*
> **Cảnh cuối:** BOX-mới (nhân viên mới) bước vào. Chu trình lặp lại.
> BOX (nay là Dispatch) nói: *"Chào mừng, nhân viên mới."*

#### ENDING C: "PHÁ HỦY" 💥
**Điều kiện:** Cân bằng EMPATHY/EFFICIENCY + từ chối cả Dispatch lẫn CEO

**Level 40 — "Cắt Mạch":**
> Nhiệm vụ: Xây mạch TỰ HỦY — feedback loop vô hạn
> BOX kéo dây cuối cùng. Toàn bộ Signal Corp... shutdown.
> *"Nếu hệ thống không phục vụ ai, tại sao nó phải tồn tại?"*
> **Cảnh cuối:** Màn hình tối. Rồi... một pixel nhỏ sáng lên. BOX mới?

#### SECRET ENDING D: "SIÊU VIỆT" ✨
**Điều kiện:** Thu thập 10 Glitch Token + Hoàn thành tất cả optimization star

**Level 41 (Secret) — "Ngoài Tòa Tháp":**
> Glitch dẫn BOX đến cánh cửa ẩn.
> Bên ngoài: thế giới rộng lớn, đầy tòa tháp Signal Corp khác.
> BOX nhìn xuống tay — có thể kéo dây, đặt linh kiện **ngoài** tòa tháp.
> *"Thế giới cũng là một mạch. Và bạn... là kỹ sư."*
> **Cảnh cuối:** BOX bay lên trời, trở thành ngôi sao trong constellation hình mạch logic.
> **Mở khóa: Sandbox Mode không giới hạn**

---

## 4. GAMEPLAY MECHANICS CẢI TIẾN

### 4.1. Vòng lặp cốt lõi (có Shipper)

```
[Dispatch giao nhiệm vụ — bong bóng hội thoại]
    → [Player kéo TRẠM XỬ LÝ (linh kiện) lên bản đồ]
    → [Player vẽ ĐƯỜNG RAY (dây nối) giữa các trạm]
    → [Nhấn GO: BOX bắt đầu giao hàng!]
        → BOX nhặt thùng từ IN Belt
        → BOX chạy trên ray, qua từng trạm
        → Tại mỗi trạm: thùng hàng được xử lý (visual animation)
        → BOX đặt thùng vào OUT Belt
    → [Hệ thống kiểm tra: đúng kho chưa?]
    → [Pass → ⭐ chấm điểm → dialogue → level tiếp]
    → [Fail → BOX ngã → hiển thị lỗi tại trạm sai → sửa mạch]
```

### 4.2. Thùng hàng (thay thế "Signal" trừu tượng)

**Hình dạng:** Hộp carton vuông, trên mặt ghi số/ký hiệu

| Loại thùng | Hình dáng | Ý nghĩa |
|------------|-----------|----------|
| 📦 Thùng Số | Carton nâu, số lớn | Giá trị integer (5, -3, 42...) |
| 🟢 Thùng Xanh | Carton xanh, dấu ✓ | Boolean TRUE (1) |
| 🔴 Thùng Đỏ | Carton đỏ, dấu ✗ | Boolean FALSE (0) |
| 🟡 Thùng Vàng | Carton vàng, dấu ? | Story item (trigger cutscene) |
| ⬛ Thùng Đen | Carton đen, khóa | Không mở được (chỉ chuyển tiếp) |

### 4.3. Trạm xử lý (thay thế "linh kiện" kỹ thuật)

Mỗi linh kiện được rebrand thành **trạm xử lý** với tên dễ hiểu:

| Tên kỹ thuật | Tên trong game | Icon | Mô tả player-friendly |
|-------------|----------------|------|----------------------|
| WIRE | Đường Ray | ═══ | BOX chạy trên này |
| SPLITTER | Trạm Sao Chép | 📋 | Sao chép thùng hàng, gửi 2 hướng |
| SWITCH/DEMUX | Ngã Ba | 🔀 | BOX rẽ trái/phải tùy nhãn thùng |
| AND Gate | Trạm Kiểm Tra Kép | ✅✅ | Chỉ qua khi CẢ HAI ticket OK |
| OR Gate | Trạm Vé Linh Hoạt | ✅❓ | Qua nếu CÓ ÍT NHẤT 1 ticket |
| NOT Gate | Trạm Đổi Nhãn | 🔄 | Đổi xanh↔đỏ, TRUE↔FALSE |
| XOR Gate | Trạm So Khác | ≠ | Báo khi 2 thùng KHÁC nhau |
| ADDER | Trạm Gộp Hàng | ➕ | Gộp giá trị 2 thùng |
| SUBTRACTOR | Trạm Tách Hàng | ➖ | Trừ giá trị |
| CONSTANT | Kho Cố Định | 🏪 | Luôn cấp thùng có giá trị N |
| COMPARATOR | Trạm Cân Hàng | ⚖️ | So sánh 2 thùng: nặng/nhẹ/bằng |
| MUX | Trạm Chọn Đường | 🎯 | Chọn lấy hàng từ đường A hoặc B |
| FILTER | Trạm Kiểm Duyệt | 🚫 | Chặn thùng không đạt điều kiện |
| REGISTER | Kho Tạm | 📦🏠 | BOX gửi thùng, lấy lại sau |
| COUNTER | Máy Đếm | 🔢 | Đếm số thùng đi qua |
| DELAY | Trạm Nghỉ | ⏸️ | BOX nghỉ 1 nhịp rồi chạy tiếp |

### 4.4. Hiển thị trực quan khi RUN

Khi nhấn GO, camera theo dõi BOX:

1. **BOX đứng tại IN Belt** → thùng hàng trượt trên belt đến BOX
2. **BOX nhặt thùng** → bê trên đầu, số hiện rõ
3. **BOX chạy trên ray** → chân chạy animation, thùng nhấp nhô
4. **Đến trạm xử lý** → trạm "ăn" thùng vào, xử lý (animation máy), "nhả" thùng mới ra
5. **Đến ngã ba** → BOX nhìn trái-phải, bảng chỉ dẫn sáng, rẽ đúng hướng
6. **Đến Splitter** → BOX phân thân: 2 BOX nhỏ chạy 2 hướng
7. **Đến OUT Belt** → BOX đặt thùng, thùng trượt vào kho
   - ✅ Đúng kho: Kho sáng xanh, BOX nhảy vui
   - ❌ Sai kho: Kho sáng đỏ, thùng nổ confetti buồn, BOX gãi đầu

---

## 5. THIẾT KẾ UI CROSS-PLATFORM

### 5.1. Nguyên tắc Responsive

```
MOBILE (Portrait)                    PC (Landscape)
┌──────────────┐                     ┌──────────────────────────────────┐
│  ▼ IN Belt   │                     │ [☰] Level 15  [⚡3][🔧4] [▶GO] │
│  [5] [3] [8] │                     ├────────┬────────────────┬───────┤
├──────────────┤                     │ IN     │                │  OUT  │
│              │                     │ Belt   │  CIRCUIT BOARD │  Belt │
│   CIRCUIT    │                     │        │  (Bản đồ)      │       │
│   BOARD      │                     │ [5]→   │                │ →[?]  │
│   (Bản đồ)  │                     │ [3]→   │   BOX 🏃📦     │ →[?]  │
│              │                     │        │                │       │
│  BOX 🏃📦   │                     ├────────┴────────────────┴───────┤
│              │                     │  TRAY: [═][📋][🔀][✅✅][➕]... │
├──────────────┤                     ├─────────────────────────────────┤
│ ▲ OUT Belt   │                     │ 💬 Dispatch: "Giao đúng kho!"  │
│ →[?] →[?]    │                     └─────────────────────────────────┘
├──────────────┤
│ TRAY (scroll)│
│ [═][📋][🔀] │
├──────────────┤
│💬 "Giao hàng │
│  đúng kho!"  │
│    [▶ GO]    │
└──────────────┘
```

### 5.2. Tương tác Mobile vs PC

| Hành động | Mobile (Touch) | PC (Mouse + Keyboard) |
|-----------|---------------|----------------------|
| Đặt trạm | Tap giữ từ Tray → kéo lên Board → thả | Click từ Tray → click vị trí Board |
| Nối ray | Tap pin OUT → tap pin IN (2 tap) | Click-drag từ pin OUT → pin IN |
| Xóa | Long-press → menu xóa | Right-click → Delete, hoặc phím Del |
| Di chuyển | Drag trên Board (2 ngón zoom) | WASD/Arrow pan, Scroll zoom |
| Chạy | Nút GO lớn ở dưới | Spacebar hoặc nút GO |
| Tốc độ | Nút ×1 ×2 ×4 | Phím 1, 2, 3, 4 |
| Cấu hình | Tap vào trạm → popup nhập số | Double-click → inline input |
| Hint | Nút ? ở góc | Phím H |
| Undo | Nút ↩ ở góc | Ctrl+Z |

### 5.3. Touch-Friendly Design Rules
- Tất cả nút/vùng tap ≥ 44px × 44px
- Pin linh kiện có vùng snap lớn (dễ nối dây trên mobile)
- Pinch-to-zoom mượt trên board
- Tray có thể kéo xuống/ẩn để mở rộng board
- Haptic feedback nhẹ khi đặt/nối thành công
- Dialogue có thể tap-to-skip hoặc auto-advance

---

## 6. THIẾT KẾ 40 LEVEL (CẬP NHẬT)

Level giữ nguyên logic như V1 nhưng cập nhật dialogue phân nhánh và thêm story choices.

### Quy tắc:
1. Mỗi level dạy 1 concept (giữ từ V1)
2. **MỚI:** Mỗi 5 level có 1 Story Choice Point
3. **MỚI:** Boss level cuối Act có 2 phiên bản dựa trên nhánh story
4. **MỚI:** Level có thể có "nhiệm vụ phụ" (optional objective) ảnh hưởng reputation

### Format level (cập nhật):

```json
{
    "levelId": 18,
    "act": 2,
    "title": "Phân Loại Ngưỡng",
    "titleEN": "Threshold Sort",
    "story": "Hàng nặng ≥ 10kg sang kho NẶNG, hàng nhẹ sang kho NHẸ.",
    "dialogue": {
        "before": {
            "default": "Dispatch: 'Hàng nặng sang phải, nhẹ sang trái.'",
            "highEmpathy": "Dispatch: 'Cẩn thận nhé, có mấy thùng... đặc biệt trong đó.'",
            "highEfficiency": "Dispatch: 'Nhanh lên. Quota hôm nay gấp đôi.'"
        },
        "hints": [
            "Dùng Trạm Cân Hàng so sánh với Kho Cố Định (10).",
            "Nối kết quả cân vào chân điều khiển của Ngã Ba.",
            "INPUT → CÂN(A=input, B=CONST:10) → kết quả GT/LT → NGÃ BA → 2 kho"
        ],
        "success": "Dispatch: 'Hoàn hảo.'",
        "fail": "Dispatch: 'Có thùng vào nhầm kho rồi.'"
    },
    "inputs": { "IN": [5, 12, 3, 15, 10, 8] },
    "expectedOutputs": {
        "HEAVY": [12, 15, 10],
        "LIGHT": [5, 3, 8]
    },
    "availableComponents": ["COMPARATOR", "CONSTANT", "DEMUX", "WIRE"],
    "newComponent": null,
    "challenges": {
        "speedGoal": 6,
        "sizeGoal": 4
    },
    "optionalObjective": {
        "description": "Giao cả thùng vàng bí ẩn (ẩn trong input) đến kho NẶNG",
        "reward": "EMPATHY +1, mở khóa dialogue bí mật level tiếp",
        "hint": "Có 1 thùng vàng giá trị = 10, nó thuộc về đâu?"
    },
    "storyChoice": null,
    "gridSize": { "width": 10, "height": 8 },
    "mobileGridSize": { "width": 8, "height": 10 }
}
```

### Bảng tổng hợp level + story integration:

| Level | Tên | Concept mới | Story Beat |
|-------|-----|-------------|------------|
| 1 | Đường Thẳng | WIRE (Đường ray) | Dispatch chào mừng |
| 2 | Hai Đường | Multi-port | — |
| 3 | Đổi Đường | Wire crossing | — |
| 4 | Sao Chép | SPLITTER | — |
| 5 | Ngã Ba Đầu | SWITCH | **CHOICE: Cho Glitch ăn?** |
| 6 | Kiểm Tra Kép | AND | — |
| 7 | Cửa Rộng | OR | — |
| 8 | Đổi Nhãn | NOT | Glitch xuất hiện |
| 9 | So Khác | XOR | — |
| 10 | Khóa An Toàn ⭐ | Tổng hợp | News Drone: "Signal Corp tuyển thêm/sa thải" |
| 11 | Thêm Hàng | CONSTANT + ADDER | — |
| 12 | Gộp Hàng | ADDER | — |
| 13 | Tách Hàng | SUBTRACTOR | — |
| 14 | Nhân Ba | Ứng dụng | — |
| 15 | Cân Hàng | COMPARATOR | **CHOICE: Mở thùng bí ẩn?** Dispatch glitch |
| 16 | Lọc Hàng Tốt | FILTER logic | — |
| 17 | Giá Trị Thật | Abs value | — |
| 18 | Cân Ngưỡng | Ứng dụng | Optional: thùng vàng |
| 19 | Chọn Đường | MUX | — |
| 20 | Mã Hàng ⭐ | Tổng hợp | **CHOICE: Lọc bỏ nhãn đỏ?** Dispatch glitch 😢 |
| 21 | Kho Tạm | REGISTER | Dispatch tiết lộ / giao task nặng |
| 22 | Đếm Hàng | COUNTER | — |
| 23 | Tổng Kho | REG+ADDER | — |
| 24 | Giao Chậm | DELAY | — |
| 25 | So Với Hôm Qua | DELAY+CMP | Glitch cho Glitch Token |
| 26 | Kỷ Lục Ngày | REG+CMP+MUX | — |
| 27 | Chia Đều | RIGHT_SHIFT | — |
| 28 | Tự Động Hóa | Feedback loop | **CHOICE: Tin Dispatch / Thay thế Dispatch?** |
| 29 | Kiểm Lỗi | XOR chain | Level khác nhau theo nhánh |
| 30 | Giải Mã Kho ⭐ | Decoder | Boss level — 2 phiên bản |
| 31 | Nhân Hàng | Multiply loop | Sự thật bắt đầu lộ |
| 32 | Chia Dư | Modulo | — |
| 33 | Đếm Ngược | Countdown | — |
| 34 | Nhân Đôi Liên Tục | Power of 2 | — |
| 35 | Xếp Hàng Hai | Sort 2 | **Cutscene: cánh cửa tầng đỉnh** |
| 36 | Xếp Hàng Ba | Sort 3 | BOX phát sáng |
| 37 | Hàng Gương | Palindrome | — |
| 38 | Mã Hóa Chuỗi | XOR cipher | — |
| 39 | Bộ Cộng Nhị Phân | Full adder | — |
| 40 | Tín Hiệu Cuối ⭐ | ALU / Special | **3 phiên bản → 3 Ending** |
| 41 | Ngoài Tòa Tháp 🔒 | SECRET | Secret ending (Glitch Token) |

---

## 7. ÂM THANH & NHẠC

| Thành phần | Chi tiết |
|-----------|---------|
| BGM Act 1 | Lo-fi chill, ukulele + electronic, vui tươi |
| BGM Act 2 | Deeper bass, synth pad, hơi tense |
| BGM Act 3 | Dark ambient, industrial drone, occasional piano |
| BGM Act 4 | Epic orchestral + glitch electronic, emotional |
| SFX Đặt trạm | "Clunk" cơ khí nhẹ |
| SFX Nối ray | "Click-click" kim loại |
| SFX BOX chạy | Bước chân "tap tap tap" nhỏ |
| SFX Trạm xử lý | "Whirr-chunk" máy xử lý |
| SFX Giao đúng | "Cha-ching!" + BOX nói "Yay!" |
| SFX Giao sai | "Bonk!" + BOX nói "Ối!" |
| SFX Story choice | Nhạc dừng 0.5s → piano note trầm |
| SFX Glitch xuất hiện | Static noise nhẹ + mèo kêu điện tử |

---

## 8. MONETIZATION & PROGRESSION (Tùy chọn)

### Free-to-Play friendly:
- **40 level chính MIỄN PHÍ**
- **Quảng cáo:** Rewarded ad = thêm 1 hint, hoặc skip 1 level
- **IAP (In-App Purchase):**
  - Gói "Signal Premium" (\$2.99): Không quảng cáo + Sandbox Mode sớm
  - Skin BOX (\$0.99 mỗi set): Robot BOX, Ninja BOX, Space BOX...
  - Gói Level Bonus (\$1.99): 10 level thêm với story mở rộng

### Hoặc Premium:
- Bán game \$4.99, bao gồm tất cả
- Không quảng cáo, không IAP

---

## 9. TÓM TẮT CẢI TIẾN V2 vs V1

| Tiêu chí | V1 | V2 |
|---------|-----|-----|
| Nhân vật | Worker tĩnh, không tương tác | **BOX shipper chạy giao hàng trên mạch** |
| Ẩn dụ | Tín hiệu trừu tượng | **Thùng hàng + đường ray = trực quan** |
| Platform | Web only | **Mobile-first + PC** |
| Touch | Không tối ưu | **Touch-native: 2-tap nối, pinch zoom, haptic** |
| Story | 1 tuyến, 1 ending | **Phân nhánh, 3+1 ending, reputation system** |
| Player agency | Không có choice | **Choice points mỗi 5 level, optional objectives** |
| Replay value | Thấp | **Cao: 4 ending, optimization stars, Glitch Token** |
| Monetization | Không đề cập | **F2P hoặc Premium, cả hai viable** |
| Nhân vật phụ | Mèo + TV | **Glitch (tương tác), Drone (dynamic), CEO (voice)** |

