/**
 * levels.js - Dữ liệu toàn bộ 40 level của Signal Factory
 */
window.SF = window.SF || {};

(function(SF) {
    const LEVELS = [
        // ==================== ACT 1: TẦNG HẦM (Level 1-10) ====================
        {
            levelId: 1,
            act: 1,
            title: "Nối Thẳng",
            titleEN: "Direct Line",
            story: "Chào mừng đến Signal Corp. Hãy nối cổng IN thẳng vào cổng OUT để chuyển các gói tín hiệu.",
            dialogue: {
                before: "Foreman Unit-7: 'Cậu bắt đầu từ việc cơ bản nhất: dùng chuột kéo một sợi dây từ IN sang OUT.'",
                hint1: "Click vào chân tròn của cổng IN rồi kéo thả sang chân của cổng OUT.",
                hint2: "Sau khi nối xong, bấm nút ▶ RUN ở thanh công cụ phía trên để chạy mô phỏng.",
                hint3: "Đường dây phát sáng và gói tin sẽ chạy thẳng từ trái sang phải.",
                success: "Foreman: 'Tốt lắm. Đường truyền đã thông suốt.'",
                fail: "Foreman: 'Tín hiệu chưa đến đích. Hãy kiểm tra lại dây nối.'"
            },
            inputs: { "IN": [5, 3, 8] },
            expectedOutputs: { "OUT": [5, 3, 8] },
            availableComponents: [],
            newComponent: "WIRE",
            challenges: { speedGoal: 3, sizeGoal: 0 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 2,
            act: 1,
            title: "Song Song",
            titleEN: "Double Line",
            story: "Có hai luồng hàng độc lập. Nối cả hai sang hai cổng đích tương ứng.",
            dialogue: {
                before: "Foreman: 'Nhà máy mở rộng thành 2 luồng hàng: IN-A và IN-B. Hãy nối đúng cổng.'",
                hint1: "Nối IN-A sang OUT-A, và nối IN-B sang OUT-B.",
                hint2: "Các dây chạy song song không làm nhiễu tín hiệu của nhau.",
                hint3: "Kéo 2 sợi dây thẳng hàng.",
                success: "Foreman: 'Rất gọn gàng. Hai luồng vận hành song song.'",
                fail: "Foreman: 'Cổng ra nhận nhầm gói tin rồi. Kiểm tra lại cổng nối!'"
            },
            inputs: { "IN-A": [1, 2], "IN-B": [3, 4] },
            expectedOutputs: { "OUT-A": [1, 2], "OUT-B": [3, 4] },
            availableComponents: [],
            newComponent: "PORTS",
            challenges: { speedGoal: 2, sizeGoal: 0 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 3,
            act: 1,
            title: "Đổi Chỗ",
            titleEN: "The Swap",
            story: "Hai luồng hàng bị đảo thứ tự. Hãy hoán đổi đích đến: A sang B, B sang A.",
            dialogue: {
                before: "Foreman: 'Đơn hàng bị dán nhầm tem. Nối chéo: IN-A sang OUT-B, IN-B sang OUT-A.'",
                hint1: "Dây nối có thể cắt chéo nhau trên bảng mạch.",
                hint2: "Kéo từ chân IN-A xuống OUT-B, và từ IN-B lên OUT-A.",
                hint3: "Hai đường chéo sẽ hoán đổi 2 dòng dữ liệu hoàn hảo.",
                success: "Foreman: 'Tem đã được định tuyến chính xác.'",
                fail: "Foreman: 'Gói tin vẫn vào nhầm địa chỉ.'"
            },
            inputs: { "IN-A": [1, 2], "IN-B": [3, 4] },
            expectedOutputs: { "OUT-A": [3, 4], "OUT-B": [1, 2] },
            availableComponents: [],
            challenges: { speedGoal: 2, sizeGoal: 0 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 4,
            act: 1,
            title: "Chia Đôi",
            titleEN: "The Split",
            story: "Chỉ có một luồng đầu vào nhưng cả hai phân xưởng OUT-A và OUT-B đều cần bản sao.",
            dialogue: {
                before: "Foreman: 'Ta cần nhân đôi gói hàng. Hãy kéo linh kiện SPLITTER từ thanh dưới lên bảng mạch.'",
                hint1: "Kéo SPLITTER vào giữa bảng, nối IN vào chân trái của Splitter.",
                hint2: "Nối 2 chân phải của Splitter lần lượt vào OUT-A và OUT-B.",
                hint3: "Splitter sao chép nguyên vẹn 1 gói tin thành 2 bản sao cùng lúc.",
                success: "Foreman: 'Hiệu quả nhân đôi. Tiến độ tốt.'",
                fail: "Foreman: 'Chưa đủ 2 bản sao cho 2 xưởng.'"
            },
            inputs: { "IN": [7, 2, 9] },
            expectedOutputs: { "OUT-A": [7, 2, 9], "OUT-B": [7, 2, 9] },
            availableComponents: ["SPLITTER"],
            newComponent: "SPLITTER",
            challenges: { speedGoal: 3, sizeGoal: 1 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 5,
            act: 1,
            title: "Phân Loại Đầu Tiên",
            titleEN: "First Sort",
            story: "Gói hàng có nhãn 0 hoặc 1. Gửi nhãn 1 sang OUT-A, nhãn 0 sang OUT-B.",
            dialogue: {
                before: "Foreman: 'Hàng tốt nhãn 1 sang OUT-A, hàng loại 0 sang OUT-B. Dùng SWITCH!'",
                hint1: "Dùng linh kiện SWITCH. Nối IN vào chân IN của Switch.",
                hint2: "Dùng chính giá trị gói hàng nối vào chân SEL (Select) của Switch.",
                hint3: "Nối OUT0 của Switch sang OUT-B, và OUT1 của Switch sang OUT-A.",
                success: "Foreman: 'Tốt lắm. Cậu học phân loại rất nhanh.'",
                fail: "Foreman: 'Phân loại sai! Kiểm tra lại chân điều khiển SEL.'"
            },
            inputs: { "IN": [1, 0, 1, 0, 0, 1] },
            expectedOutputs: { "OUT-A": [1, 1, 1], "OUT-B": [0, 0, 0] },
            availableComponents: ["SWITCH", "SPLITTER"],
            newComponent: "SWITCH",
            challenges: { speedGoal: 6, sizeGoal: 1 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 6,
            act: 1,
            title: "Kiểm Tra Kép",
            titleEN: "Double Check",
            story: "Hai luồng kiểm tra logic. Chỉ xuất tín hiệu 1 khi CẢ HAI luồng đều là 1.",
            dialogue: {
                before: "Foreman: 'Cổng an toàn AND: cả hai cảm biến A và B phải đồng thanh hô 1.'",
                hint1: "Đặt cổng AND Gate lên bảng mạch.",
                hint2: "Nối IN-A vào chân A, IN-B vào chân B của cổng AND.",
                hint3: "Nối chân Q của cổng AND vào cổng OUT.",
                success: "Foreman: 'Cổng logic AND chuẩn xác.'",
                fail: "Foreman: 'Kết quả logic chưa đúng với chân trị AND.'"
            },
            inputs: { "IN-A": [1, 0, 1, 1], "IN-B": [1, 1, 0, 1] },
            expectedOutputs: { "OUT": [1, 0, 0, 1] },
            availableComponents: ["AND"],
            newComponent: "AND",
            challenges: { speedGoal: 4, sizeGoal: 1 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 7,
            act: 1,
            title: "Cửa Rộng",
            titleEN: "Open Gate",
            story: "Cho gói qua (xuất 1) nếu BẤT KỲ luồng nào trong hai luồng có giá trị 1.",
            dialogue: {
                before: "Foreman: 'Cổng OR: chỉ cần một trong hai bên có tín hiệu 1 là mở.'",
                hint1: "Dùng cổng OR Gate.",
                hint2: "Nối IN-A và IN-B vào 2 chân vào của OR Gate.",
                hint3: "Nối đầu ra của OR Gate đến OUT.",
                success: "Foreman: 'Cổng OR đã thông suốt.'",
                fail: "Foreman: 'Bảng chân trị OR: 0 OR 0 = 0, còn lại là 1.'"
            },
            inputs: { "IN-A": [0, 0, 1, 1], "IN-B": [0, 1, 0, 1] },
            expectedOutputs: { "OUT": [0, 1, 1, 1] },
            availableComponents: ["OR", "AND"],
            newComponent: "OR",
            challenges: { speedGoal: 4, sizeGoal: 1 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 8,
            act: 1,
            title: "Đảo Ngược",
            titleEN: "The Inverter",
            story: "Đảo ngược tất cả tín hiệu: 1 biến thành 0, 0 biến thành 1.",
            dialogue: {
                before: "Foreman: 'Cổng NOT là bộ đảo. Nó biến đúng thành sai, bật thành tắt.'",
                hint1: "Kéo cổng NOT Gate vào bảng.",
                hint2: "Nối IN → NOT → OUT.",
                hint3: "Chỉ cần 1 cổng NOT duy nhất.",
                success: "Foreman: 'Đảo tín hiệu hoàn hảo.'",
                fail: "Foreman: 'Tín hiệu chưa bị đảo!'"
            },
            inputs: { "IN": [1, 0, 1, 1, 0] },
            expectedOutputs: { "OUT": [0, 1, 0, 0, 1] },
            availableComponents: ["NOT"],
            newComponent: "NOT",
            challenges: { speedGoal: 5, sizeGoal: 1 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 9,
            act: 1,
            title: "Báo Động Lệch Pha",
            titleEN: "Phase Mismatch Alarm",
            story: "Hai cảm biến. Xuất 1 (báo động) khi hai cảm biến đọc KHÁC nhau.",
            dialogue: {
                before: "Foreman: 'Cổng XOR chỉ phát tín hiệu khi hai đầu vào bất đồng (khác nhau).'",
                hint1: "Kéo cổng XOR Gate.",
                hint2: "Nối IN-A và IN-B vào XOR Gate, nối ra OUT.",
                hint3: "Khi A != B thì XOR = 1.",
                success: "Foreman: 'Hệ thống báo động lệch pha hoạt động chuẩn xác.'",
                fail: "Foreman: 'Sai rồi. Cùng bằng 0 hoặc cùng bằng 1 thì XOR phải bằng 0.'"
            },
            inputs: { "IN-A": [0, 1, 1, 0], "IN-B": [0, 0, 1, 1] },
            expectedOutputs: { "OUT": [0, 1, 0, 1] },
            availableComponents: ["XOR", "AND", "OR", "NOT"],
            newComponent: "XOR",
            challenges: { speedGoal: 4, sizeGoal: 1 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 10,
            act: 1,
            title: "Khóa An Toàn",
            titleEN: "Safety Lock",
            story: "Cửa chỉ mở khi: (Sensor A VÀ Sensor B) HOẶC Override khẩn cấp bật.",
            dialogue: {
                before: "Foreman: 'Boss Level tầng hầm! Hãy phối hợp (A AND B) OR OVERRIDE.'",
                hint1: "Dùng 1 cổng AND và 1 cổng OR.",
                hint2: "Nối IN-A và IN-B vào AND. Nối output của AND vào 1 chân của OR.",
                hint3: "Nối OVERRIDE vào chân còn lại của OR, rồi ra OUT.",
                success: "Foreman: 'Xuất sắc! Cậu đã hoàn thành toàn bộ bài tập tầng hầm!'",
                fail: "Foreman: 'Mạch khóa chưa mở đúng tổ hợp an toàn.'"
            },
            inputs: { "IN-A": [1, 0, 1, 0], "IN-B": [0, 0, 1, 1], "OVERRIDE": [0, 1, 0, 0] },
            expectedOutputs: { "OUT": [0, 1, 1, 0] },
            availableComponents: ["AND", "OR", "NOT", "XOR"],
            challenges: { speedGoal: 4, sizeGoal: 2 },
            gridSize: { width: 10, height: 7 }
        },

        // ==================== ACT 2: TẦNG THẤP (Level 11-20) ====================
        {
            levelId: 11,
            act: 2,
            title: "Đường Dây Nóng",
            titleEN: "Hotline",
            story: "Tín hiệu bước vào miền số học. Hãy cộng thêm 10 vào mỗi gói hàng.",
            dialogue: {
                before: "Foreman: 'Chào mừng lên tầng 2. Ta dùng CONSTANT và ADDER để cộng số.'",
                hint1: "Đặt 1 khối CONSTANT và 1 khối ADDER.",
                hint2: "Double click vào CONSTANT chỉnh số thành 10.",
                hint3: "Nối IN vào chân A của ADDER, CONST(10) vào chân B của ADDER, ra OUT.",
                success: "Foreman: 'Mỗi gói hàng đều đã được cộng 10.'",
                fail: "Foreman: 'Kết quả cộng chưa đúng. Nhớ chỉnh Constant thành 10!'"
            },
            inputs: { "IN": [5, 3, 12] },
            expectedOutputs: { "OUT": [15, 13, 22] },
            availableComponents: ["ADDER", "CONSTANT"],
            newComponent: "ADDER",
            challenges: { speedGoal: 3, sizeGoal: 2 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 12,
            act: 2,
            title: "Phòng Cộng",
            titleEN: "The Adder Room",
            story: "Hai luồng số tự nhiên và số âm. Xuất tổng A + B của từng cặp tương ứng.",
            dialogue: {
                before: "Foreman: 'Cộng từng cặp từ IN-A và IN-B. ADDER xử lý cả số nguyên âm.'",
                hint1: "Kéo 1 khối ADDER.",
                hint2: "Nối IN-A vào chân A, IN-B vào chân B.",
                hint3: "Nối SUM vào OUT.",
                success: "Foreman: 'Các tổng số học đều chính xác.'",
                fail: "Foreman: 'Phép cộng bị lệch cặp. Hãy kiểm tra lại dây.'"
            },
            inputs: { "IN-A": [3, 7, -2], "IN-B": [4, -3, 8] },
            expectedOutputs: { "OUT": [7, 4, 6] },
            availableComponents: ["ADDER", "CONSTANT"],
            challenges: { speedGoal: 3, sizeGoal: 1 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 13,
            act: 2,
            title: "Phòng Trừ",
            titleEN: "The Subtractor Room",
            story: "Tính hiệu số: A − B của từng cặp gói hàng gửi đến.",
            dialogue: {
                before: "Foreman: 'Khối SUBTRACTOR thực hiện phép trừ A trừ B.'",
                hint1: "Kéo khối SUBTRACTOR.",
                hint2: "Nối IN-A vào chân A (bị trừ), IN-B vào chân B (trừ).",
                hint3: "Nối DIFF vào OUT.",
                success: "Foreman: 'Phép trừ đã hoàn thành.'",
                fail: "Foreman: 'Coi chừng bị đảo ngược A và B dẫn đến sai dấu!'"
            },
            inputs: { "IN-A": [10, 3, 5], "IN-B": [4, 7, 5] },
            expectedOutputs: { "OUT": [6, -4, 0] },
            availableComponents: ["SUBTRACTOR", "ADDER", "CONSTANT"],
            newComponent: "SUBTRACTOR",
            challenges: { speedGoal: 3, sizeGoal: 1 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 14,
            act: 2,
            title: "Nhân Ba",
            titleEN: "The Tripler",
            story: "Nhân mỗi gói hàng cho 3 bằng cách vận dụng sáng tạo: X × 3 = X + X + X.",
            dialogue: {
                before: "Foreman: 'Ta chưa có bộ nhân, nhưng nhân ba chỉ là cộng ba lần.'",
                hint1: "Chia tín hiệu IN thành nhiều nhánh (hoặc kéo nhiều dây từ IN).",
                hint2: "Dùng 2 bộ ADDER: Bộ 1 tính (X + X) = 2X. Bộ 2 cộng 2X với X = 3X.",
                hint3: "Nối đầu ra của bộ thứ 2 vào OUT.",
                success: "Foreman: 'Tư duy ghép mạch cộng lặp rất thông minh!'",
                fail: "Foreman: 'Kết quả chưa đạt gấp 3 lần.'"
            },
            inputs: { "IN": [2, 5, -1] },
            expectedOutputs: { "OUT": [6, 15, -3] },
            availableComponents: ["ADDER", "SPLITTER"],
            challenges: { speedGoal: 3, sizeGoal: 3 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 15,
            act: 2,
            title: "Cân Đo",
            titleEN: "The Scale",
            story: "So sánh hai gói hàng A và B. Xuất giá trị LỚN HƠN trong hai gói.",
            dialogue: {
                before: "Foreman: 'Khối COMPARATOR cho biết A > B hay không. Dùng tín hiệu đó điều khiển MUX!'",
                hint1: "Nối IN-A và IN-B vào COMPARATOR.",
                hint2: "Chân GT (A > B) sẽ bằng 1 nếu A lớn hơn. Nối GT vào chân SEL của MUX.",
                hint3: "Nối IN-B vào kênh 0 của MUX, IN-A vào kênh 1 của MUX. Output của MUX ra OUT.",
                success: "Foreman: 'Bộ chọn Max đã hoạt động trơn tru.'",
                fail: "Foreman: 'Sai gói tin rồi. Kiểm tra lại kênh 0 và kênh 1 của MUX.'"
            },
            inputs: { "IN-A": [5, 3, 7], "IN-B": [3, 8, 7] },
            expectedOutputs: { "OUT": [5, 8, 7] },
            availableComponents: ["COMPARATOR", "MUX", "SPLITTER"],
            newComponent: "COMPARATOR",
            challenges: { speedGoal: 3, sizeGoal: 2 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 16,
            act: 2,
            title: "Lọc Dương",
            titleEN: "Positive Filter",
            story: "Chỉ cho qua các số DƯƠNG (> 0). Loại bỏ số 0 và số âm.",
            dialogue: {
                before: "Foreman: 'Dùng COMPARATOR so sánh với CONSTANT(0) để lọc số dương.'",
                hint1: "Tạo CONSTANT với giá trị 0.",
                hint2: "So sánh IN với CONST(0). Chân GT phát 1 khi số > 0.",
                hint3: "Dùng FILTER hoặc SWITCH điều khiển bởi chân GT để đẩy gói tin ra OUT.",
                success: "Foreman: 'Tất cả số âm và 0 đã bị sàng lọc.'",
                fail: "Foreman: 'Vẫn còn số âm lọt qua hoặc thiếu số dương!'"
            },
            inputs: { "IN": [5, -3, 0, 8, -1, 2] },
            expectedOutputs: { "OUT": [5, 8, 2] },
            availableComponents: ["COMPARATOR", "CONSTANT", "SWITCH", "FILTER"],
            newComponent: "FILTER",
            challenges: { speedGoal: 6, sizeGoal: 3 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 17,
            act: 2,
            title: "Giá Trị Tuyệt Đối",
            titleEN: "Absolute Value",
            story: "Biến tất cả số âm thành dương (|X|). Số dương giữ nguyên.",
            dialogue: {
                before: "Foreman: 'Nếu X < 0 thì lấy 0 − X, ngược lại giữ nguyên X.'",
                hint1: "Dùng SUBTRACTOR tính 0 − X (với CONST 0).",
                hint2: "Dùng COMPARATOR so sánh X với 0.",
                hint3: "Dùng MUX chọn giữa X và (0 − X) dựa trên chân LT (X < 0).",
                success: "Foreman: 'Mạch tính trị tuyệt đối chuẩn xác.'",
                fail: "Foreman: 'Số âm chưa được chuyển thành dương.'"
            },
            inputs: { "IN": [-5, 3, -8, 0, 7] },
            expectedOutputs: { "OUT": [5, 3, 8, 0, 7] },
            availableComponents: ["COMPARATOR", "CONSTANT", "SUBTRACTOR", "MUX", "SPLITTER"],
            challenges: { speedGoal: 5, sizeGoal: 4 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 18,
            act: 2,
            title: "Phân Loại Ngưỡng",
            titleEN: "Threshold Sort",
            story: "Gói hàng >= 10 gửi sang OUT-HEAVY, gói < 10 gửi sang OUT-LIGHT.",
            dialogue: {
                before: "Foreman: 'Phân ngưỡng 10: Nặng sang một cổng, nhẹ sang một cổng.'",
                hint1: "Dùng CONSTANT đặt giá trị 10.",
                hint2: "Nối IN và CONST(10) vào COMPARATOR.",
                hint3: "Dùng chân LT hoặc GT điều khiển SWITCH phân chia IN vào HEAVY và LIGHT.",
                success: "Foreman: 'Phân loại ngưỡng tải trọng thành công.'",
                fail: "Foreman: 'Gói tin vào sai cổng trọng lượng.'"
            },
            inputs: { "IN": [5, 12, 3, 15, 10, 8] },
            expectedOutputs: { "OUT-HEAVY": [12, 15, 10], "OUT-LIGHT": [5, 3, 8] },
            availableComponents: ["COMPARATOR", "CONSTANT", "SWITCH", "OR"],
            challenges: { speedGoal: 6, sizeGoal: 3 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 19,
            act: 2,
            title: "Chọn Kênh",
            titleEN: "Channel Select",
            story: "Hai luồng dữ liệu A và B. Luồng CONTROL quyết định lấy từ đâu: 0 chọn A, 1 chọn B.",
            dialogue: {
                before: "Foreman: 'Bộ chọn kênh chính thức MUX (Multiplexer 2-to-1).'",
                hint1: "Nối IN-A vào kênh 0 của MUX, IN-B vào kênh 1 của MUX.",
                hint2: "Nối CONTROL vào chân SEL của MUX.",
                hint3: "Nối đầu ra của MUX vào OUT.",
                success: "Foreman: 'Điều phối kênh dữ liệu mượt mà.'",
                fail: "Foreman: 'Kênh chọn bị đảo hoặc sai thứ tự.'"
            },
            inputs: { "IN-A": [10, 20, 30], "IN-B": [40, 50, 60], "CONTROL": [0, 1, 0] },
            expectedOutputs: { "OUT": [10, 50, 30] },
            availableComponents: ["MUX"],
            newComponent: "MUX",
            challenges: { speedGoal: 3, sizeGoal: 1 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 20,
            act: 2,
            title: "Mật Mã Đơn Giản",
            titleEN: "Simple Cipher",
            story: "Boss Level Tầng Thấp: Nếu số chẵn thì cộng 5, nếu số lẻ thì trừ 3.",
            dialogue: {
                before: "Foreman: 'Mã hóa tín hiệu: Số chẵn → +5, Số lẻ → −3. Ghép toàn bộ kỹ năng!'",
                hint1: "Số chẵn hay lẻ: dùng AND với CONSTANT(1) để kiểm tra bit cuối.",
                hint2: "Tính sẵn (IN + 5) bằng ADDER và (IN − 3) bằng SUBTRACTOR.",
                hint3: "Dùng MUX chọn giữa 2 kết quả dựa trên cờ chẵn/lẻ.",
                success: "Foreman: 'Đáng kinh ngạc! Cậu đã giải mã trọn vẹn tầng thấp!'",
                fail: "Foreman: 'Mã hóa sai gói tin! Kiểm tra lại nhánh chẵn/lẻ.'"
            },
            inputs: { "IN": [4, 7, 2, 11, 6] },
            expectedOutputs: { "OUT": [9, 4, 7, 8, 11] },
            availableComponents: ["CONSTANT", "ADDER", "SUBTRACTOR", "MUX", "AND", "SPLITTER"],
            challenges: { speedGoal: 5, sizeGoal: 6 },
            gridSize: { width: 10, height: 7 }
        },

        // ==================== ACT 3: TẦNG GIỮA (Level 21-30) ====================
        {
            levelId: 21,
            act: 3,
            title: "Bộ Nhớ Đầu Tiên",
            titleEN: "First Memory",
            story: "Lưu trữ gói tin đầu tiên vào REGISTER và phát nó ra liên tục mỗi nhịp xung nhịp.",
            dialogue: {
                before: "Foreman: 'REGISTER lưu giữ giá trị qua thời gian. Hãy giữ lấy gói tin đầu tiên.'",
                hint1: "Đặt REGISTER. Nối IN vào DATA của Register.",
                hint2: "Nối chân Q của Register ra OUT.",
                hint3: "Register sẽ lưu giá trị khi có dữ liệu và giữ nguyên giá trị đó.",
                success: "Foreman: 'Tín hiệu đã được ghi nhớ hoàn hảo.'",
                fail: "Foreman: 'Bộ nhớ bị rỗng hoặc mất giá trị qua các tick.'"
            },
            inputs: { "IN": [42, null, null, null, null] },
            expectedOutputs: { "OUT": [42, 42, 42, 42, 42] },
            availableComponents: ["REGISTER"],
            newComponent: "REGISTER",
            challenges: { speedGoal: 5, sizeGoal: 1 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 22,
            act: 3,
            title: "Bộ Đếm",
            titleEN: "The Counter",
            story: "Đếm số lần gói hàng mang giá trị 1 xuất hiện. Xuất giá trị đếm dồn mỗi tick.",
            dialogue: {
                before: "Foreman: 'Khối COUNTER tăng 1 mỗi khi nhận xung 1.'",
                hint1: "Kéo COUNTER vào bảng.",
                hint2: "Nối IN vào chân PULSE của Counter.",
                hint3: "Nối chân COUNT ra OUT.",
                success: "Foreman: 'Bộ đếm sự kiện vận hành chính xác.'",
                fail: "Foreman: 'Số đếm chưa khớp với số lượng gói 1.'"
            },
            inputs: { "IN": [1, 0, 1, 1, 0, 1] },
            expectedOutputs: { "OUT": [1, 1, 2, 3, 3, 4] },
            availableComponents: ["COUNTER"],
            newComponent: "COUNTER",
            challenges: { speedGoal: 6, sizeGoal: 1 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 23,
            act: 3,
            title: "Tổng Dồn",
            titleEN: "Running Total",
            story: "Tính tổng tích lũy: Mỗi tick xuất tổng của tất cả các số đã từng nhận được.",
            dialogue: {
                before: "Foreman: 'Vòng phản hồi (Feedback Loop): Đầu ra ADDER nạp vào REGISTER, rồi quay lại ADDER.'",
                hint1: "Dùng 1 ADDER và 1 REGISTER.",
                hint2: "Chân A của ADDER nối từ IN. Chân B nối từ đầu ra Q của REGISTER.",
                hint3: "Đầu ra của ADDER vừa nối vào DATA của REGISTER, vừa nối ra OUT.",
                success: "Foreman: 'Vòng phản hồi tích lũy vận hành xuất sắc!'",
                fail: "Foreman: 'Tổng dồn bị sai lệch. Kiểm tra lại đường dây feedback.'"
            },
            inputs: { "IN": [3, 5, 2, 10] },
            expectedOutputs: { "OUT": [3, 8, 10, 20] },
            availableComponents: ["ADDER", "REGISTER", "SPLITTER"],
            challenges: { speedGoal: 4, sizeGoal: 2 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 24,
            act: 3,
            title: "Trễ Một Nhịp",
            titleEN: "One Beat Late",
            story: "Xuất giá trị của tick TRƯỚC ĐÓ. Ở tick đầu tiên xuất 0.",
            dialogue: {
                before: "Foreman: 'Khối DELAY trì hoãn tín hiệu đúng 1 nhịp đồng hồ.'",
                hint1: "Kéo DELAY vào bảng mạch.",
                hint2: "Nối IN vào DELAY, nối đầu ra DELAY vào OUT.",
                hint3: "Delay mặc định phát 0 ở nhịp đầu tiên.",
                success: "Foreman: 'Độ trễ thời gian chuẩn 1 tick.'",
                fail: "Foreman: 'Thời điểm xuất tín hiệu chưa chuẩn.'"
            },
            inputs: { "IN": [5, 3, 8, 1] },
            expectedOutputs: { "OUT": [0, 5, 3, 8] },
            availableComponents: ["DELAY"],
            newComponent: "DELAY",
            challenges: { speedGoal: 4, sizeGoal: 1 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 25,
            act: 3,
            title: "So Với Trước",
            titleEN: "Compare With Previous",
            story: "Xuất 1 nếu giá trị hiện tại LỚN HƠN giá trị tick trước đó, ngược lại xuất 0.",
            dialogue: {
                before: "Foreman: 'Kết hợp DELAY để lấy giá trị cũ, rồi dùng COMPARATOR so sánh.'",
                hint1: "Nối IN vào DELAY để lấy giá trị tick trước.",
                hint2: "Nối IN hiện tại vào chân A của COMPARATOR, nối đầu ra DELAY vào chân B.",
                hint3: "Nối chân GT của COMPARATOR ra OUT.",
                success: "Foreman: 'So sánh xu hướng tăng giảm hoàn hảo.'",
                fail: "Foreman: 'Kết quả so sánh chưa chuẩn xác.'"
            },
            inputs: { "IN": [3, 7, 2, 9, 9] },
            expectedOutputs: { "OUT": [1, 1, 0, 1, 0] },
            availableComponents: ["DELAY", "COMPARATOR", "SPLITTER"],
            challenges: { speedGoal: 5, sizeGoal: 2 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 26,
            act: 3,
            title: "Phát Hiện Đỉnh",
            titleEN: "Peak Detector",
            story: "Xuất giá trị LỚN NHẤT từng thấy từ trước đến thời điểm hiện tại.",
            dialogue: {
                before: "Foreman: 'Mạch tìm Max liên tục: So sánh giá trị mới với Max đang lưu trong Register.'",
                hint1: "Dùng REGISTER lưu Max hiện hành.",
                hint2: "Dùng COMPARATOR so sánh IN với REGISTER.Q.",
                hint3: "Dùng MUX chọn số lớn hơn để cập nhật vào REGISTER và xuất ra OUT.",
                success: "Foreman: 'Đỉnh tín hiệu được bắt trọn vẹn!'",
                fail: "Foreman: 'Chưa bắt đúng giá trị cực đại qua các thời điểm.'"
            },
            inputs: { "IN": [3, 7, 2, 9, 5] },
            expectedOutputs: { "OUT": [3, 7, 7, 9, 9] },
            availableComponents: ["REGISTER", "COMPARATOR", "MUX", "SPLITTER"],
            challenges: { speedGoal: 5, sizeGoal: 3 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 27,
            act: 3,
            title: "Trung Bình Hai",
            titleEN: "Average of Two",
            story: "Nhận 2 số A và B. Xuất giá trị trung bình làm tròn xuống: floor((A + B) / 2).",
            dialogue: {
                before: "Foreman: 'Khối RIGHT_SHIFT dịch phải 1 bit, tương đương chia 2 lấy nguyên.'",
                hint1: "Cộng A và B bằng ADDER.",
                hint2: "Nối tổng vào RIGHT_SHIFT (>>1).",
                hint3: "Nối đầu ra của RIGHT_SHIFT vào OUT.",
                success: "Foreman: 'Tính trung bình bằng dịch bit rất nhanh và thanh lịch.'",
                fail: "Foreman: 'Kết quả trung bình chưa chính xác.'"
            },
            inputs: { "IN-A": [6, 10, 3], "IN-B": [4, 3, 8] },
            expectedOutputs: { "OUT": [5, 6, 5] },
            availableComponents: ["ADDER", "RIGHT_SHIFT"],
            newComponent: "RIGHT_SHIFT",
            challenges: { speedGoal: 3, sizeGoal: 2 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 28,
            act: 3,
            title: "Fibonacci Mini",
            titleEN: "Mini Fibonacci",
            story: "Tự tạo chuỗi số Fibonacci: 1, 1, 2, 3, 5, 8, 13, 21.",
            dialogue: {
                before: "Foreman: 'Chuỗi Fibonacci: Mỗi số là tổng của 2 số liền trước.'",
                hint1: "Dùng 2 REGISTER hoặc DELAY để lưu giữ 2 số gần nhất.",
                hint2: "Cộng 2 số đó lại bằng ADDER để sinh số tiếp theo.",
                hint3: "Tạo vòng feedback đưa số mới vào chuỗi.",
                success: "Foreman: 'Chuỗi Fibonacci tự sinh tuyệt đẹp!'",
                fail: "Foreman: 'Dãy số sinh ra không khớp chuỗi Fibonacci.'"
            },
            inputs: { "IN": [1, 1, 1, 1, 1, 1, 1, 1] },
            expectedOutputs: { "OUT": [1, 1, 2, 3, 5, 8, 13, 21] },
            availableComponents: ["REGISTER", "DELAY", "ADDER", "CONSTANT"],
            challenges: { speedGoal: 8, sizeGoal: 4 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 29,
            act: 3,
            title: "Mã Chẵn Lẻ",
            titleEN: "Parity Checker",
            story: "Nhận 3 bit A, B, C. Xuất 1 nếu tổng số bit 1 là SỐ LẺ (Odd Parity).",
            dialogue: {
                before: "Foreman: 'Kiểm tra chẵn lẻ trong truyền tin số: Chuỗi XOR liên tiếp.'",
                hint1: "Nối A và B vào cổng XOR thứ nhất.",
                hint2: "Nối kết quả đó cùng với bit C vào cổng XOR thứ hai.",
                hint3: "Đầu ra của XOR thứ hai chính là Parity bit.",
                success: "Foreman: 'Parity check thành công, gói tin không bị biến dạng.'",
                fail: "Foreman: 'Bit kiểm tra chẵn lẻ chưa chính xác.'"
            },
            inputs: { "IN-A": [1, 0, 1, 0], "IN-B": [0, 1, 1, 1], "IN-C": [1, 1, 0, 0] },
            expectedOutputs: { "OUT": [0, 0, 0, 1] },
            availableComponents: ["XOR"],
            challenges: { speedGoal: 4, sizeGoal: 2 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 30,
            act: 3,
            title: "Bộ Giải Mã",
            titleEN: "The Decoder",
            story: "Boss Level Tầng Giữa: Giải mã 2 bit (A, B) thành 4 kênh độc lập (00, 01, 10, 11).",
            dialogue: {
                before: "Foreman: '2-to-4 Decoder kinh điển: 00→Kênh 0, 01→Kênh 1, 10→Kênh 2, 11→Kênh 3.'",
                hint1: "Dùng 2 cổng NOT để tạo Not-A và Not-B.",
                hint2: "OUT-0 = (NOT A) AND (NOT B). OUT-1 = (NOT A) AND B.",
                hint3: "OUT-2 = A AND (NOT B). OUT-3 = A AND B.",
                success: "Foreman: 'Khủng khiếp! Bộ giải mã 2-to-4 hoàn chỉnh!'",
                fail: "Foreman: 'Kênh giải mã bị nhầm tổ hợp bit.'"
            },
            inputs: { "IN-A": [0, 0, 1, 1], "IN-B": [0, 1, 0, 1] },
            expectedOutputs: {
                "OUT-0": [1, 0, 0, 0],
                "OUT-1": [0, 1, 0, 0],
                "OUT-2": [0, 0, 1, 0],
                "OUT-3": [0, 0, 0, 1]
            },
            availableComponents: ["AND", "NOT", "SPLITTER"],
            challenges: { speedGoal: 4, sizeGoal: 6 },
            gridSize: { width: 10, height: 7 }
        },

        // ==================== ACT 4: TẦNG CAO (Level 31-40) ====================
        {
            levelId: 31,
            act: 4,
            title: "Nhân Hai Số",
            titleEN: "The Multiplier",
            story: "Nhân hai số dương A × B. Xuất tích số của từng cặp.",
            dialogue: {
                before: "Foreman: 'Cậu đã lên tầng cao nhất. Bài toán thuật toán phức tạp bắt đầu.'",
                hint1: "Các số nhỏ có thể tính tích bằng bảng cộng hoặc lặp tích lũy.",
                hint2: "A x B = A cộng B lần.",
                hint3: "Xuất tích ra cổng OUT.",
                success: "Foreman: 'Phép nhân hai số nguyên thành công.'",
                fail: "Foreman: 'Tích số chưa chính xác.'"
            },
            inputs: { "IN-A": [3, 5, 2], "IN-B": [4, 3, 7] },
            expectedOutputs: { "OUT": [12, 15, 14] },
            availableComponents: ["ADDER", "SUBTRACTOR", "CONSTANT", "COMPARATOR", "MUX", "REGISTER"],
            challenges: { speedGoal: 3, sizeGoal: 6 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 32,
            act: 4,
            title: "Chia Lấy Dư",
            titleEN: "Modulo",
            story: "Tính phần dư khi chia A cho B (A mod B).",
            dialogue: {
                before: "Foreman: 'Phép chia lấy dư: Trừ lặp cho đến khi số còn lại nhỏ hơn B.'",
                hint1: "Dùng SUBTRACTOR trừ B khỏi A.",
                hint2: "So sánh kết quả với B bằng COMPARATOR.",
                hint3: "Dùng MUX để lấy giá trị dư cuối cùng.",
                success: "Foreman: 'Phép mod đã cho phần dư hoàn hảo.'",
                fail: "Foreman: 'Phần dư bị sai lệch.'"
            },
            inputs: { "IN-A": [17, 10, 7], "IN-B": [5, 3, 4] },
            expectedOutputs: { "OUT": [2, 1, 3] },
            availableComponents: ["SUBTRACTOR", "COMPARATOR", "MUX", "CONSTANT"],
            challenges: { speedGoal: 3, sizeGoal: 5 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 33,
            act: 4,
            title: "Đếm Ngược",
            titleEN: "Countdown Timer",
            story: "Nhận chuỗi đếm: Trừ dần 1 đơn vị cho mỗi gói tin gửi đến.",
            dialogue: {
                before: "Foreman: 'Mạch giảm tải: Lấy mỗi gói tin trừ đi 1 trước khi xuất xưởng.'",
                hint1: "Dùng CONSTANT(1) và SUBTRACTOR.",
                hint2: "Nối IN vào chân A của SUB, CONST(1) vào chân B.",
                hint3: "Nối DIFF vào OUT.",
                success: "Foreman: 'Bộ đếm lùi chính xác từng nhịp.'",
                fail: "Foreman: 'Chưa trừ đúng 1 đơn vị.'"
            },
            inputs: { "IN": [5, 4, 3, 2, 1] },
            expectedOutputs: { "OUT": [4, 3, 2, 1, 0] },
            availableComponents: ["SUBTRACTOR", "CONSTANT", "REGISTER"],
            challenges: { speedGoal: 5, sizeGoal: 2 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 34,
            act: 4,
            title: "Lũy Thừa 2",
            titleEN: "Power of Two",
            story: "Nhận N (từ 0 đến 4). Xuất giá trị 2^N (1, 2, 4, 8, 16).",
            dialogue: {
                before: "Foreman: 'Nhị phân hóa: Mỗi bước tăng N tương ứng gấp đôi giá trị.'",
                hint1: "Giá trị tương ứng: 0→1, 1→2, 2→4, 3→8, 4→16.",
                hint2: "Dùng các phép so sánh hoặc chuỗi cộng đôi.",
                hint3: "Xuất lũy thừa ra cổng OUT.",
                success: "Foreman: 'Chuỗi lũy thừa cơ số 2 chuẩn xác.'",
                fail: "Foreman: 'Lũy thừa tính sai giá trị.'"
            },
            inputs: { "IN": [0, 1, 2, 3, 4] },
            expectedOutputs: { "OUT": [1, 2, 4, 8, 16] },
            availableComponents: ["ADDER", "MUX", "CONSTANT", "COMPARATOR"],
            challenges: { speedGoal: 5, sizeGoal: 6 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 35,
            act: 4,
            title: "Sắp Xếp Hai",
            titleEN: "Sort Two",
            story: "Nhận 2 số A và B. Xuất số nhỏ sang OUT-MIN, số lớn sang OUT-MAX.",
            dialogue: {
                before: "Foreman: 'Bộ so sánh và hoán vị (Compare-and-Swap block).'",
                hint1: "Nối A và B vào COMPARATOR.",
                hint2: "Dùng 2 MUX: 1 MUX chọn số nhỏ (LT), 1 MUX chọn số lớn (GT).",
                hint3: "Nối 2 MUX vào OUT-MIN và OUT-MAX.",
                success: "Foreman: 'Khối sắp xếp 2 phần tử hoàn hảo.'",
                fail: "Foreman: 'Thứ tự Min và Max bị lộn xộn.'"
            },
            inputs: { "IN-A": [8, 2, 5], "IN-B": [3, 9, 5] },
            expectedOutputs: { "OUT-MIN": [3, 2, 5], "OUT-MAX": [8, 9, 5] },
            availableComponents: ["COMPARATOR", "MUX", "SPLITTER"],
            challenges: { speedGoal: 3, sizeGoal: 3 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 36,
            act: 4,
            title: "Sắp Xếp Ba",
            titleEN: "Sort Three",
            story: "Nhận 3 số A, B, C. Sắp xếp và xuất theo thứ tự tăng dần: MIN, MID, MAX.",
            dialogue: {
                before: "Foreman: 'Mạng sắp xếp (Sorting Network): Ghép các khối compare-and-swap.'",
                hint1: "So sánh và tráo cặp (A, B) trước.",
                hint2: "Tiếp tục so sánh cặp (B, C) và kiểm tra lại cặp đầu.",
                hint3: "Đưa lần lượt 3 kết quả vào MIN, MID, MAX.",
                success: "Foreman: 'Mạng sắp xếp 3 kênh đã ổn định tuyệt đối!'",
                fail: "Foreman: '3 số xuất ra chưa được xếp tăng dần.'"
            },
            inputs: { "IN-A": [7, 3, 9], "IN-B": [2, 8, 1], "IN-C": [5, 4, 6] },
            expectedOutputs: {
                "OUT-MIN": [2, 3, 1],
                "OUT-MID": [5, 4, 6],
                "OUT-MAX": [7, 8, 9]
            },
            availableComponents: ["COMPARATOR", "MUX", "SPLITTER"],
            challenges: { speedGoal: 3, sizeGoal: 8 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 37,
            act: 4,
            title: "Kiểm Tra Đối Xứng",
            titleEN: "Palindrome Check",
            story: "Nhận 2 luồng A và B. Xuất 1 nếu A == B (đối xứng/khớp nhau), ngược lại xuất 0.",
            dialogue: {
                before: "Foreman: 'Kiểm tra tính đồng nhất giữa hai luồng dữ liệu.'",
                hint1: "Dùng COMPARATOR so sánh A và B.",
                hint2: "Chân EQ phát ra 1 khi hai số bằng nhau.",
                hint3: "Nối chân EQ ra OUT.",
                success: "Foreman: 'Xác thực đối xứng thành công.'",
                fail: "Foreman: 'Kiểm tra chưa đúng giá trị.'"
            },
            inputs: { "IN-A": [1, 2, 1], "IN-B": [1, 3, 1] },
            expectedOutputs: { "OUT": [1, 0, 1] },
            availableComponents: ["COMPARATOR", "AND"],
            challenges: { speedGoal: 3, sizeGoal: 1 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 38,
            act: 4,
            title: "Mã Hóa XOR",
            titleEN: "XOR Cipher",
            story: "Mã hóa tín hiệu với Key bằng cổng XOR.",
            dialogue: {
                before: "Foreman: 'Mã hóa XOR đối xứng kinh điển trong an toàn thông tin.'",
                hint1: "Nối IN vào chân A của XOR.",
                hint2: "Nối KEY vào chân B của XOR.",
                hint3: "Nối đầu ra của XOR vào OUT.",
                success: "Foreman: 'Dòng dữ liệu đã được mã hóa an toàn.'",
                fail: "Foreman: 'Mã hóa XOR chưa khớp kết quả.'"
            },
            inputs: { "IN": [5, 3, 8, 2], "KEY": [1, 4, 7, 15] },
            expectedOutputs: { "OUT": [4, 7, 15, 13] },
            availableComponents: ["XOR"],
            challenges: { speedGoal: 4, sizeGoal: 1 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 39,
            act: 4,
            title: "Bộ Cộng Nhị Phân",
            titleEN: "Binary Full Adder",
            story: "Xây dựng Full Adder hoàn chỉnh: Input A, B, Carry-In. Output: SUM và CARRY-OUT.",
            dialogue: {
                before: "Foreman: 'Mạch logic kinh điển nhất của ngành máy tính: Full Adder 1-bit.'",
                hint1: "SUM = A XOR B XOR CIN.",
                hint2: "COUT = (A AND B) OR (CIN AND (A XOR B)).",
                hint3: "Dùng 2 cổng XOR, 2 cổng AND và 1 cổng OR.",
                success: "Foreman: 'Kỳ quan mạch số! Full Adder của cậu đã chạy hoàn hảo cả 8 trường hợp!'",
                fail: "Foreman: 'Bảng chân trị Full Adder chưa đúng ở bit nhớ hoặc tổng.'"
            },
            inputs: {
                "IN-A": [0, 0, 0, 0, 1, 1, 1, 1],
                "IN-B": [0, 0, 1, 1, 0, 0, 1, 1],
                "CIN":  [0, 1, 0, 1, 0, 1, 0, 1]
            },
            expectedOutputs: {
                "SUM":  [0, 1, 1, 0, 1, 0, 0, 1],
                "COUT": [0, 0, 0, 1, 0, 1, 1, 1]
            },
            availableComponents: ["XOR", "AND", "OR", "SPLITTER"],
            challenges: { speedGoal: 8, sizeGoal: 5 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 40,
            act: 4,
            title: "Tín Hiệu Cuối Cùng",
            titleEN: "The Last Signal",
            story: "FINAL BOSS: Xây dựng mini-ALU. Nhận A, B và mã lệnh OP: OP=0 (A+B), OP=1 (A−B), OP=2 (A AND B), OP=3 (A XOR B).",
            dialogue: {
                before: "Dispatch: 'Căn phòng trắng đỉnh tháp... Hãy ghép toàn bộ tri thức thành một vi xử lý ALU thực thụ.'",
                hint1: "Tính song song cả 4 phép: MERGER, SPLITTER_VAL, DUAL_CHECK, DIFF_CHECK.",
                hint2: "Dùng SELECTOR phân cấp để chọn đúng kết quả phép toán theo lệnh OP.",
                hint3: "Đưa kết quả được chọn ra OUT.",
                success: "Dispatch: 'Cậu đã làm được. Cậu... chính là tín hiệu tự do.'",
                fail: "Dispatch: 'ALU tính sai một trong các lệnh mã máy. Hãy kiểm tra lại kênh chọn OP.'"
            },
            inputs: {
                "IN-A": [5, 8, 3, 6],
                "IN-B": [3, 2, 2, 3],
                "OP":   [0, 1, 2, 3]
            },
            expectedOutputs: {
                "OUT": [8, 6, 2, 5]
            },
            availableComponents: ["MERGER", "SPLITTER_VAL", "DUAL_CHECK", "DIFF_CHECK", "SELECTOR", "FIXED_SUPPLY", "SCALE", "COPIER", "ADDER", "SUBTRACTOR", "AND", "XOR", "MUX", "CONSTANT", "COMPARATOR", "SPLITTER"],
            challenges: { speedGoal: 4, sizeGoal: 8 },
            gridSize: { width: 10, height: 7 }
        },
        {
            levelId: 41,
            act: 4,
            isSecret: true,
            title: "Ngoài Tòa Tháp",
            titleEN: "Beyond The Tower",
            story: "SECRET LEVEL: Bạn và Glitch đã thoát ra khỏi con chip khổng lồ. Hãy hợp nhất hai luồng thế giới con người và máy móc.",
            dialogue: {
                before: "Glitch: 'Meo! Thế giới bên ngoài vô tận... Nối các gói ký ức lại với nhau nào.'",
                hint1: "Cộng giá trị A và B rồi chia đôi để lấy giá trị cân bằng.",
                hint2: "Dùng MERGER và HALVER.",
                hint3: "(A + B) / 2 đưa ra OUT.",
                success: "Glitch: 'Hoàn hảo! Chúc mừng bạn đã giải phóng hoàn toàn thế giới Signal Factory!'",
                fail: "Glitch: 'Chưa cân bằng được hai thế giới rồi.'"
            },
            inputs: {
                "IN-A": [10, 20, 30, 40],
                "IN-B": [10, 20, 30, 40]
            },
            expectedOutputs: {
                "OUT": [10, 20, 30, 40]
            },
            availableComponents: ["RAIL", "MERGER", "HALVER", "COPIER", "WIRE"],
            challenges: { speedGoal: 4, sizeGoal: 1 },
            gridSize: { width: 10, height: 7 }
        }
    ];

    SF.LEVELS = LEVELS;
})(window.SF);
