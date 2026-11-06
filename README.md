# 📦 SIGNAL FACTORY v2.0 (Shipper Logic Puzzle)

> **"Puzzle Logic × Shipping Simulation × Branching Narrative × 3D WebGL Diorama"**
> Lấy cảm hứng từ *Human Resource Machine (Tomorrow Corporation)*, nâng cấp toàn diện với nhân vật Shipper BOX 3D, hỗ trợ đa nền tảng Mobile + PC, tích hợp chuẩn CrazyGames SDK v3 (Monetization & Ads Ready), đa ngôn ngữ Anh - Việt, và đồ họa 3D Isometric sống động.

---

## 🌟 TÍNH NĂNG MỚI NÂNG CẤP (CRAZYGAMES & 3D EDITION)

1. **🌐 Đa Ngôn Ngữ Chuẩn Quốc Tế (English Default):**
   - Mặc định khởi động bằng **Tiếng Anh (EN)** để đạt chuẩn kiểm duyệt CrazyGames 100%.
   - Hỗ trợ nút chuyển nhanh sang **Tiếng Việt (VI)** trên thanh công cụ (`🌐 English` / `🌐 Tiếng Việt`).
   - Dịch toàn bộ giao diện, tên trạm xử lý, mô tả, nhiệm vụ thử thách, hội thoại Quản Đốc, gợi ý và kết thúc truyện.

2. **🧊 Đồ Họa 3D Diorama Isometric (Three.js):**
   - Nút chuyển đổi nhanh **`🧊 3D Diorama` ↔ `🗺️ 2D Blueprint`** trên thanh công cụ.
   - Sàn nhà kho công nghiệp kim loại viền an toàn phản quang, đường ray dạng ống đôi mạ kim loại phát sáng neon.
   - Trạm máy móc 3D với bánh răng xoay nhịp nhàng, hiệu ứng co giãn năng lượng khi xử lý hàng.
   - Nhân vật Shipper BOX 3D ngộ nghĩnh đội mũ Signal Corp, ba lô cam, vác thùng hàng di chuyển trên ray.
   - Tương tác 3D: Xoay tự do (Chuột trái / Touch drag), Thu phóng camera (Mouse wheel / Pinch), Di chuyển góc nhìn (Chuột phải / Two-finger drag).

3. **🎮 Tích Hợp CrazyGames SDK v3:**
   - Thư viện chính thức `crazygames-sdk-v3.js` kèm lớp bọc `CrazyGamesSDK.js` an toàn tuyệt đối khi chạy offline/sandbox.
   - Gọi `gameplayStart()` khi bắt đầu màn hoặc bấm `▶ GO`.
   - Gọi `gameplayStop()` khi tạm dừng, hoàn thành màn hoặc thất bại.
   - Gọi `happytime()` kích hoạt hiệu ứng chúc mừng khi chiến thắng.
   - Tự động gọi **Midroll Ad** khi chuyển màn chơi.
   - Xem **Rewarded Ad** khi người chơi cần mở khóa gợi ý sâu (Hint 2 & 3).

4. **🔇 Tự Động Ngắt Âm Thanh Khi Rời Tab (`visibilitychange`):**
   - Lắng nghe sự kiện `visibilitychange`, `window.blur`, `window.focus`.
   - Khi người chơi chuyển tab hoặc thu nhỏ trình duyệt: tự động suspend `AudioContext` và ngắt nhạc nền BGM để không làm phiền người dùng.
   - Khi quay lại tab: tự động resume mượt mà.

---

## 🎮 CÁCH CHƠI & MỞ GAME

Game chạy hoàn toàn bằng **HTML5 Canvas + Vanilla JavaScript**, không phụ thuộc thư viện ngoài, tối ưu tải trang cực nhanh.

### Cách 1: Chơi trực tiếp trên trình duyệt
Chỉ cần nhấp đúp vào file [`index.html`](./index.html) để mở trên trình duyệt (Chrome, Edge, Safari, Firefox).

### Cách 2: Chạy qua Local Web Server
```bash
python -m http.server 8000
```
Truy cập: `http://localhost:8000`

### ⚡ Chạy Stress Test (Kiểm thử tải cao & độ ổn định)
```bash
python stresstest.py
```

---

## 🕹️ THAO TÁC ĐIỀU KHIỂN

### 📱 Trên Điện Thoại & Tablet (Mobile Touch):
- **Nối đường ray 2-Tap:** Chạm vào chân cắm tròn của trạm phát (●), chân sẽ phát sáng cyan, sau đó chạm vào chân cắm của trạm nhận (●) để nối ray.
- **Kéo thả trạm:** Chạm và giữ trạm từ khay dưới kéo lên bản đồ, hoặc chạm 1 lần vào trạm trên khay để tự thêm vào giữa màn hình.
- **Long-press (Chạm giữ 0.5s):** Mở menu xóa trạm hoặc chỉnh sửa giá trị `KHO CỐ ĐỊNH [N]`.
- **Mèo Glitch:** Chạm vào chú mèo tím nhấp nháy để nhận gợi ý hoặc tích lũy **Glitch Token**.

### 💻 Trên Máy Tính (PC Mouse & Keyboard):
- **Click-drag nối ray:** Bấm chuột trái vào chân phát kéo sang chân nhận.
- **Xóa:** Chuột phải vào đường ray hoặc trạm xử lý; hoặc click chọn trạm rồi nhấn `Delete` / `Backspace`.
- **Cấu hình số:** Nhấp đúp (Double-click) vào trạm `Kho Cố Định` để nhập số N.
- **Phím tắt:**
  - `Space`: Chạy / Tạm dừng mô phỏng (GO / Pause).
  - `H`: Mở bảng gợi ý 3 cấp.
  - `1`, `2`, `3`, `4`: Đổi tốc độ mô phỏng (`0.5x`, `1.0x`, `2.0x`, `4.0x`).

---

## 🏢 HỆ THỐNG 17 TRẠM XỬ LÝ (PROCESSING STATIONS)

| # | Tên Trạm (V2) | Mã Loại | Chức Năng |
|---|---------------|---------|-----------|
| 1 | **Đường Ray** | `RAIL` | Dẫn truyền thùng hàng trực tiếp |
| 2 | **Sao Chép** | `COPIER` | Nhân đôi 1 thùng thành 2 thùng giống hệt |
| 3 | **Ngã Ba** | `JUNCTION` | Bẻ hướng thùng hàng theo tín hiệu Select |
| 4 | **Kiểm Tra Kép** | `DUAL_CHECK` | Cổng AND: cả 2 cùng OK (1) mới cho qua |
| 5 | **Cửa Rộng** | `ANY_PASS` | Cổng OR: chỉ cần 1 bên OK (1) là cho qua |
| 6 | **Đổi Nhãn** | `FLIP` | Cổng NOT: đảo ngược nhãn Xanh ↔ Đỏ |
| 7 | **So Khác** | `DIFF_CHECK` | Cổng XOR: hai bên khác nhau mới phát tín hiệu |
| 8 | **Gộp Hàng** | `MERGER` | Cổng ADDER: cộng giá trị A + B |
| 9 | **Tách Hàng** | `SPLITTER_VAL` | Cổng SUBTRACTOR: trừ giá trị A − B |
| 10 | **Kho Cố Định** | `FIXED_SUPPLY` | Cổng CONSTANT: luôn cấp thùng mang giá trị N cố định |
| 11 | **Cân Hàng** | `SCALE` | Cổng COMPARATOR: so sánh GT (A>B), EQ (A=B), LT (A<B) |
| 12 | **Chọn Đường** | `SELECTOR` | Cổng MUX: chọn luồng thùng theo tín hiệu điều khiển |
| 13 | **Kiểm Duyệt** | `FILTER` | Cho qua thùng khi thỏa điều kiện cho phép |
| 14 | **Kho Tạm** | `STORAGE` | Cổng REGISTER: lưu giữ thùng hàng qua các nhịp clock |
| 15 | **Máy Đếm** | `COUNTER` | Đếm số lượng thùng hàng đi qua |
| 16 | **Trạm Nghỉ** | `REST_STOP` | Cổng DELAY: giữ hàng lại đúng 1 nhịp |
| 17 | **Chia Đôi** | `HALVER` | Dịch phải bit: chia đôi giá trị làm tròn xuống |

---

## 📖 CỐT TRUYỆN PHÂN NHÁNH & 4 KẾT THÚC (ENDINGS)

Hệ thống theo dõi 2 chỉ số Reputation ẩn:
- 🔵 **EMPATHY (Đồng Cảm):** Giúp đỡ mèo Glitch, bảo vệ ký ức con người, lựa chọn thấu hiểu.
- 🔴 **EFFICIENCY (Hiệu Suất):** Đạt tối ưu Speed/Size star, tuân thủ kỷ luật nhà máy, xử lý lạnh lùng.

### 4 Kết Thúc:
1. **ENDING A: "TỰ DO"** — Liên minh với Quản Đốc Dispatch, phá vỡ nhà máy, giải phóng toàn bộ tín hiệu ra thế giới bên ngoài.
2. **ENDING B: "PHỤC TÙNG"** — Chấp nhận thăng chức từ CEO, thay thế vị trí Dispatch, tiếp tục chu trình công nghiệp.
3. **ENDING C: "PHÁ HỦY"** — Cắt đứt mạch điện trung tâm, đưa Signal Corp vào bóng tối hoàn toàn.
4. **ENDING D: "SIÊU VIỆT" (SECRET)** — Thu thập đủ 10 Glitch Token và hoàn thành xuất sắc các màn chơi, mở khóa **Level 41: Ngoài Tòa Tháp**.

---

## 🧪 KẾT QUẢ STRESS TEST
Bộ kiểm thử tự động `stresstest.py` đã vượt qua 100% các bài kiểm tra:
- **17/17 trạm xử lý** đúng chuẩn chân trị logic và số học.
- **41/41 màn chơi** toàn vẹn dữ liệu, thử thách và hội thoại.
- **Xử lý 50,000 phép tính logic** chỉ trong **0.005 giây** (~9.8 triệu phép tính/giây).
- **Vòng phản hồi hồi tiếp (Feedback Accumulator)** chạy mượt mà 500 nhịp xung clock không rò rỉ bộ nhớ.
