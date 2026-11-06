# 📦 SIGNAL FACTORY v2.0 (3D Cyberpunk Shipper Logic Puzzle)

> **"Puzzle Logic × Logistics Simulation × Branching Narrative × 3D Cyberpunk Diorama × Android Ready"**
> Lấy cảm hứng từ *Human Resource Machine (Tomorrow Corporation)*, nâng cấp toàn diện với nhân vật Robot Shipper BOX 3D, hỗ trợ đa nền tảng Web + Mobile Android (APK & AAB), tích hợp chuẩn CrazyGames SDK v3 (Monetization & Ads Ready), đa ngôn ngữ Anh - Việt, và đồ họa 3D Isometric Cyberpunk sống động.

---

## 📱 TẢI VÀ CÀI ĐẶT APP ANDROID (APK & AAB)

Game đã được đóng gói hoàn chỉnh thành ứng dụng Android native, chạy offline 100% không cần internet hay máy chủ:

| Định dạng file | Tên file | Dung lượng | Mục đích sử dụng |
|---|---|---|---|
| **Android APK** | [`dist_android/SignalFactory-release.apk`](./dist_android/SignalFactory-release.apk) | ~265 KB | Cài đặt trực tiếp lên mọi điện thoại / tablet Android |
| **Android APK (Debug)** | [`dist_android/SignalFactory-debug.apk`](./dist_android/SignalFactory-debug.apk) | ~313 KB | Dành cho thử nghiệm và test tính năng |
| **Android App Bundle** | [`dist_android/SignalFactory-release.aab`](./dist_android/SignalFactory-release.aab) | ~269 KB | Dành cho xuất bản chính thức lên **Google Play Store** |

### Cách cài đặt APK trên điện thoại:
1. Copy file `SignalFactory-release.apk` vào điện thoại (hoặc tải qua link GitHub / Zalo / Drive).
2. Chạm vào file `.apk` để cài đặt.
3. Cho phép "Cài đặt ứng dụng từ nguồn không xác định" nếu Android hỏi.
4. Mở game và trải nghiệm đồ họa 3D toàn màn hình cực mượt!

---

## 🌟 CÁC TÍNH NĂNG NỔI BẬT

### 1. 🧊 Đồ Họa 3D Diorama Isometric Cyberpunk & Hero Robot:
- **Tỉ lệ khung hình chuẩn diorama:** Tối ưu khoảng cách camera và FOV, hiển thị trọn vẹn sa bàn công xưởng vừa vặn trên mọi kích thước màn hình mà không bị phóng to quá cỡ.
- **Robot Shipper BOX có animation sống động:**
  - **Trạng thái IDLE:** Thở nhịp nhàng, lắc đầu quan sát, xoay ăng-ten, đèn beacon nhấp nháy, tay cầm máy quét hologram.
  - **Trạng thái RUN:** Bước chân sải nhịp nhàng, gối gập, người nhún nhẩy, hai tay ôm kiện hàng di chuyển dọc theo đường ray phát sáng neon.
- **Cảnh quan nhà kho Cyberpunk chi tiết:**
  - Các container hàng hóa xếp tầng in stencil thương hiệu `SIGNAL CORP` & `SECTOR-07`.
  - Cụm tháp tủ máy chủ (Data Server Racks) với hệ thống đèn LED nhấp nháy tuần tự.
  - Cần cẩu trục gantry trên cao với tời nâng hàng kim loại.
  - Tháp quạt thông gió làm mát với cánh quạt xoay cơ học liên tục.
  - Xe vận chuyển tự hành (Patrol AGV) tuần tra viền ngoài sa bàn.
  - Biển hiệu hologram neon cyberpunk `SIGNAL CORP - FOUNDRY SECTOR 7`.

### 2. 🌐 Đa Ngôn Ngữ Chuẩn Quốc Tế (English Default):
- Mặc định khởi động bằng **Tiếng Anh (EN)** để đạt chuẩn kiểm duyệt CrazyGames 100%.
- Hỗ trợ nút chuyển nhanh sang **Tiếng Việt (VI)** trên thanh công cụ (`🌐 English` / `🌐 Tiếng Việt`).
- Dịch toàn bộ giao diện, tên trạm xử lý, mô tả, nhiệm vụ thử thách, hội thoại Quản Đốc, gợi ý và kết thúc truyện.

### 3. 🎮 Tích Hợp CrazyGames SDK v3:
- Thư viện chính thức `crazygames-sdk-v3.js` kèm lớp bọc `CrazyGamesSDK.js` an toàn tuyệt đối khi chạy offline/sandbox.
- Gọi `gameplayStart()` khi bắt đầu màn hoặc bấm `▶ GO`.
- Gọi `gameplayStop()` khi tạm dừng, hoàn thành màn hoặc thất bại.
- Gọi `happytime()` kích hoạt hiệu ứng chúc mừng khi chiến thắng.
- Tự động gọi **Midroll Ad** khi chuyển màn chơi.
- Xem **Rewarded Ad** khi người chơi cần mở khóa gợi ý sâu (Hint 2 & 3).

### 4. 🔇 Tự Động Ngắt Âm Thanh Khi Rời Tab (`visibilitychange`):
- Khi người chơi chuyển tab hoặc thu nhỏ trình duyệt: tự động suspend `AudioContext` và ngắt nhạc nền BGM để không làm phiền người dùng.
- Khi quay lại tab: tự động resume mượt mà.

---

## 🎮 CÁCH CHƠI & MỞ GAME

### Cách 1: Chơi trực tiếp trên trình duyệt
Chỉ cần nhấp đúp vào file [`index.html`](./index.html) để mở trên trình duyệt (Chrome, Edge, Safari, Firefox).

### Cách 2: Chạy qua Local Web Server
```bash
python -m http.server 8000
```
Truy cập: `http://localhost:8000`

### ⚡ Chạy Stress Test & Kiểm Tra Cú Pháp
```bash
python verify_syntax.py
python stresstest.py
```

### 📊 Xem Báo Cáo Giải Thuật Toàn Diện 41 Màn Chơi
Mở file [`solution_report.html`](./solution_report.html) trên trình duyệt để xem toàn bộ 41 sơ đồ mạch điện logic SVG cùng lời giải chi tiết.

---

## 🕹️ THAO TÁC ĐIỀU KHIỂN

### 📱 Trên Điện Thoại & Tablet (Mobile Touch):
- **Nối đường ray 2-Tap:** Chạm vào chân cắm tròn của trạm phát (●), chân sẽ phát sáng cyan, sau đó chạm vào chân cắm của trạm nhận (●) để nối ray.
- **Kéo thả trạm:** Chạm và giữ trạm từ khay dưới kéo lên bản đồ, hoặc chạm 1 lần vào trạm trên khay để tự thêm vào giữa màn hình.
- **Long-press (Chạm giữ 0.5s):** Mở menu xóa trạm hoặc chỉnh sửa giá trị `KHO CỐ ĐỊNH [N]`.
- **Mèo Glitch:** Chạm vào chú mèo tím nhấp nháy để nhận gợi ý hoặc tích lũy **Glitch Token**.
- **Điều khiển 3D:** Dùng 1 ngón tay vuốt để xoay góc nhìn, 2 ngón tay chụm để phóng to / thu nhỏ.

### 💻 Trên Máy Tính (PC Mouse & Keyboard):
- **Click-drag nối ray:** Bấm chuột trái vào chân phát kéo sang chân nhận.
- **Xoay camera 3D:** Giữ chuột trái kéo tự do để xoay quanh trung tâm sa bàn.
- **Thu phóng 3D:** Cuộn con lăn chuột (Mouse wheel) để zoom gần/xa.
- **Dời camera 3D:** Giữ chuột phải kéo để pan góc nhìn.
- **Xóa:** Chuột phải vào đường ray hoặc trạm xử lý; hoặc click chọn trạm rồi nhấn `Delete` / `Backspace`.
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

## 🚀 DỰ ÁN ANDROID & TỰ ĐỘNG HÓA CI/CD

- Thư mục Android source: [`android/`](./android)
- Gradle wrapper tích hợp sẵn: `.\gradlew assembleRelease` hoặc `.\gradlew bundleRelease`
- GitHub Actions workflow tự động: [`.github/workflows/android-build.yml`](./.github/workflows/android-build.yml)
- Khi đẩy code lên GitHub, GitHub Actions sẽ tự động biên dịch và tạo artifact APK + AAB để mọi người tải về trực tiếp từ trang Releases/Actions.
