/**
 * i18n.js - Hệ thống đa ngôn ngữ (Bilingual English / Vietnamese)
 * Tiếng Anh (English) là ngôn ngữ mặc định theo tiêu chuẩn phát hành CrazyGames
 */
window.SF = window.SF || {};

(function(SF) {
    const DICTIONARY = {
        en: {
            // Brand & Topbar
            BRAND_TITLE: "SIGNAL CORP",
            LEVEL_PREFIX: "Level",
            SELECT_LEVEL: "☰ Levels",
            SPEED_LABEL: "Speed:",
            BTN_GO: "▶ GO",
            BTN_PAUSE: "▐▐ PAUSE",
            BTN_STEP: "⏭ Step",
            BTN_RESET: "↺ Reset",
            BTN_AUDIO_ON: "🔊 Audio",
            BTN_AUDIO_OFF: "🔇 Muted",
            VIEW_3D: "🧊 3D Diorama",
            VIEW_2D: "📐 2D Board",
            LANG_TOGGLE: "🌐 English",

            // HUD & Queues
            SPEED_GOAL: "⚡ ≤{n} ticks",
            SIZE_GOAL: "🔧 ≤{n} stations",
            INPUT_STREAM: "INCOMING PACKAGES",
            EXPECTED_OUTPUT: "TARGET WAREHOUSE",
            TRAY_LABEL: "PROCESSING STATIONS:",
            PORT_IN: "PORT",
            PORT_OUT: "TARGET",
            WAITING_CARGO: "Waiting for shipments...",

            // Stations (V2 Components)
            STATION_RAIL: "Rail Track",
            STATION_RAIL_DESC: "Direct rail track",
            STATION_COPIER: "Copier",
            STATION_COPIER_DESC: "Clone 1 package into 2 identical copies",
            STATION_JUNCTION: "Junction",
            STATION_JUNCTION_DESC: "Switch path based on direction signal",
            STATION_DUAL_CHECK: "Dual Check",
            STATION_DUAL_CHECK_DESC: "AND logic: passes only when both are TRUE",
            STATION_ANY_PASS: "Any Pass",
            STATION_ANY_PASS_DESC: "OR logic: passes when at least one is TRUE",
            STATION_FLIP: "Inverter",
            STATION_FLIP_DESC: "NOT logic: flips package label (Green ↔ Red)",
            STATION_DIFF_CHECK: "Diff Check",
            STATION_DIFF_CHECK_DESC: "XOR logic: passes only when values differ",
            STATION_MERGER: "Merger",
            STATION_MERGER_DESC: "ADD: sums value A + B into single package",
            STATION_SPLITTER_VAL: "Subtractor",
            STATION_SPLITTER_VAL_DESC: "SUB: subtracts value A − B",
            STATION_FIXED_SUPPLY: "Fixed Supply",
            STATION_FIXED_SUPPLY_DESC: "Supplies constant package of value [N]",
            STATION_SCALE: "Scale",
            STATION_SCALE_DESC: "Comparator: weighs A vs B (GT, EQ, LT)",
            STATION_SELECTOR: "Selector",
            STATION_SELECTOR_DESC: "MUX: selects channel 0 or 1 by control",
            STATION_FILTER: "Filter",
            STATION_FILTER_DESC: "Inspects and passes packages on condition",
            STATION_STORAGE: "Storage",
            STATION_STORAGE_DESC: "Register: stores package across clock ticks",
            STATION_COUNTER: "Counter",
            STATION_COUNTER_DESC: "Increments count on every pulse pulse",
            STATION_REST_STOP: "Rest Stop",
            STATION_REST_STOP_DESC: "Delay: delays package delivery by 1 tick",
            STATION_HALVER: "Halver",
            STATION_HALVER_DESC: "Divides value by 2 (floored)",

            // Dialogue & Characters
            SPEAKER_DISPATCH: "DISPATCH (ROBOT FOREMAN)",
            BTN_HINT: "💡 Hint ({n})",
            HINT_TITLE: "💡 TECHNICAL ASSISTANCE (TIER {n}/3)",
            HINT_WATCH_AD: "🎬 Watch Ad for Solution Hint",
            HINT_TIER1_TITLE: "Hint 1 (Subtle):",
            HINT_TIER2_TITLE: "Hint 2 (Clear Direction):",
            HINT_TIER3_TITLE: "Hint 3 (Wiring Blueprint):",
            HINT_LOCKED: "🔒 Tap [Reveal Next Hint] to unlock.",
            BTN_NEXT_HINT: "Reveal Next Hint ▶",
            BTN_DISMISS_HINT: "Got It!",

            // Win & Fail Modals
            WIN_TITLE: "DELIVERY SHIFT COMPLETED!",
            STAR_PASS: "Cleared",
            STAR_SPEED: "Speed ({curr}/{goal} ticks)",
            STAR_SIZE: "Size ({curr}/{goal} stations)",
            STAT_TICKS: "Clock Ticks Taken:",
            STAT_STATIONS: "Stations Deployed:",
            STAT_RAILS: "Rail Tracks Built:",
            BTN_REPLAY: "↺ Replay for Stars",
            BTN_NEXT_LEVEL: "Next Shift ▶",
            BTN_VIEW_ENDING: "View Final Ending 🎬",
            FAIL_TITLE: "CARGO INSPECTION REJECTED",
            BTN_RETRY: "↺ Re-route Rails & Retry",

            // Level Select
            LEVEL_SELECT_TITLE: "FACTORY LEVEL SELECTOR (41 LEVELS)",
            SECRET_TAG: "SECRET",

            // Story Choices
            STORY_CHOICE_BADGE: "CRITICAL STORY DECISION",
            AD_PLAYING_NOTICE: "Advertisement in progress... Thanks for supporting the game!"
        },
        vi: {
            // Brand & Topbar
            BRAND_TITLE: "SIGNAL CORP",
            LEVEL_PREFIX: "Level",
            SELECT_LEVEL: "☰ Chọn Tầng",
            SPEED_LABEL: "Tốc độ:",
            BTN_GO: "▶ GO",
            BTN_PAUSE: "▐▐ TẠM DỪNG",
            BTN_STEP: "⏭ Bước",
            BTN_RESET: "↺ Đặt Lại",
            BTN_AUDIO_ON: "🔊 Bật",
            BTN_AUDIO_OFF: "🔇 Tắt",
            VIEW_3D: "🧊 Chế Độ 3D",
            VIEW_2D: "📐 Chế Độ 2D",
            LANG_TOGGLE: "🌐 Tiếng Việt",

            // HUD & Queues
            SPEED_GOAL: "⚡ ≤{n} ticks",
            SIZE_GOAL: "🔧 ≤{n} trạm",
            INPUT_STREAM: "BĂNG CHUYỀN VÀO (IN)",
            EXPECTED_OUTPUT: "KHO HÀNG ĐÍCH (OUT)",
            TRAY_LABEL: "TRẠM XỬ LÝ:",
            PORT_IN: "CỔNG VÀO",
            PORT_OUT: "KHO RA",
            WAITING_CARGO: "Đang chờ chuyến hàng...",

            // Stations
            STATION_RAIL: "Đường Ray",
            STATION_RAIL_DESC: "Đường ray dẫn hàng trực tiếp",
            STATION_COPIER: "Sao Chép",
            STATION_COPIER_DESC: "Nhân đôi 1 thùng thành 2 bản sao",
            STATION_JUNCTION: "Ngã Ba",
            STATION_JUNCTION_DESC: "Bẻ hướng thùng hàng theo tín hiệu",
            STATION_DUAL_CHECK: "Kiểm Kép",
            STATION_DUAL_CHECK_DESC: "Cổng AND: Cả hai cùng OK mới qua",
            STATION_ANY_PASS: "Cửa Rộng",
            STATION_ANY_PASS_DESC: "Cổng OR: Ít nhất 1 bên OK là qua",
            STATION_FLIP: "Đổi Nhãn",
            STATION_FLIP_DESC: "Cổng NOT: Đảo ngược nhãn Xanh ↔ Đỏ",
            STATION_DIFF_CHECK: "So Khác",
            STATION_DIFF_CHECK_DESC: "Cổng XOR: Khác nhau mới qua",
            STATION_MERGER: "Gộp Hàng",
            STATION_MERGER_DESC: "Cộng giá trị A + B",
            STATION_SPLITTER_VAL: "Tách Hàng",
            STATION_SPLITTER_VAL_DESC: "Trừ giá trị A − B",
            STATION_FIXED_SUPPLY: "Kho Cố Định",
            STATION_FIXED_SUPPLY_DESC: "Cung cấp thùng hàng mang số N cố định",
            STATION_SCALE: "Cân Hàng",
            STATION_SCALE_DESC: "So sánh GT (A>B), EQ (A=B), LT (A<B)",
            STATION_SELECTOR: "Chọn Đường",
            STATION_SELECTOR_DESC: "Chọn luồng hàng theo chân điều khiển",
            STATION_FILTER: "Kiểm Duyệt",
            STATION_FILTER_DESC: "Kiểm tra và cho qua khi đạt điều kiện",
            STATION_STORAGE: "Kho Tạm",
            STATION_STORAGE_DESC: "Lưu trữ thùng hàng qua các nhịp clock",
            STATION_COUNTER: "Máy Đếm",
            STATION_COUNTER_DESC: "Tăng 1 mỗi khi nhận thùng hàng",
            STATION_REST_STOP: "Trạm Nghỉ",
            STATION_REST_STOP_DESC: "Giữ thùng hàng trễ đúng 1 nhịp",
            STATION_HALVER: "Chia Đôi",
            STATION_HALVER_DESC: "Chia đôi giá trị làm tròn xuống",

            // Dialogue & Characters
            SPEAKER_DISPATCH: "DISPATCH (QUẢN ĐỐC ROBOT)",
            BTN_HINT: "💡 Gợi Ý ({n})",
            HINT_TITLE: "💡 TRỢ GIÚP KỸ THUẬT (CẤP ĐỘ {n}/3)",
            HINT_WATCH_AD: "🎬 Xem Quảng Cáo Để Mở Gợi Ý",
            HINT_TIER1_TITLE: "Gợi ý 1 (Nhẹ nhàng):",
            HINT_TIER2_TITLE: "Gợi ý 2 (Rõ ràng):",
            HINT_TIER3_TITLE: "Gợi ý 3 (Sơ đồ lời giải):",
            HINT_LOCKED: "🔒 Nhấn [Xem gợi ý tiếp theo] để mở khóa.",
            BTN_NEXT_HINT: "Xem Gợi Ý Tiếp Theo ▶",
            BTN_DISMISS_HINT: "Đã Hiểu!",

            // Win & Fail Modals
            WIN_TITLE: "CA GIAO HÀNG HOÀN THÀNH XUẤT SẮC!",
            STAR_PASS: "Vượt Màn",
            STAR_SPEED: "Speed ({curr}/{goal} ticks)",
            STAR_SIZE: "Size ({curr}/{goal} trạm)",
            STAT_TICKS: "Số nhịp Clock đã chạy:",
            STAT_STATIONS: "Trạm xử lý đã triển khai:",
            STAT_RAILS: "Đoạn ray đã xây dựng:",
            BTN_REPLAY: "↺ Chơi Lại Tối Ưu",
            BTN_NEXT_LEVEL: "Ca Tiếp Theo ▶",
            BTN_VIEW_ENDING: "Xem Đoạn Kết 🎬",
            FAIL_TITLE: "KIỂM TRA THÙNG HÀNG THẤT BẠI",
            BTN_RETRY: "↺ Nối Lại Ray & Thử Lại",

            // Level Select
            LEVEL_SELECT_TITLE: "DANH SÁCH TẦNG NHÀ MÁY (41 MÀN)",
            SECRET_TAG: "BÍ MẬT",

            // Story Choices
            STORY_CHOICE_BADGE: "QUYẾT ĐỊNH CỦA BẠN",
            AD_PLAYING_NOTICE: "Đang phát quảng cáo... Cảm ơn bạn đã ủng hộ trò chơi!"
        }
    };

    class I18nManager {
        constructor() {
            // Mặc định là Tiếng Anh cho CrazyGames, lưu vào SecureStorage nếu người dùng chuyển đổi
            const saved = SF.storage ? SF.storage.getItem('sf_language') : localStorage.getItem('sf_language');
            this.lang = (saved === 'vi' || saved === 'en') ? saved : 'en';
            this.listeners = [];
        }

        getLanguage() {
            return this.lang;
        }

        setLanguage(lang) {
            if (lang !== 'en' && lang !== 'vi') return;
            this.lang = lang;
            if (SF.storage) {
                SF.storage.setItem('sf_language', lang);
            } else {
                localStorage.setItem('sf_language', lang);
            }
            this.notifyListeners();
        }

        toggleLanguage() {
            this.setLanguage(this.lang === 'en' ? 'vi' : 'en');
        }

        t(key, params = {}) {
            const dict = DICTIONARY[this.lang] || DICTIONARY['en'];
            let text = dict[key] || DICTIONARY['en'][key] || key;
            for (const p of Object.keys(params)) {
                text = text.replace(new RegExp(`\\{${p}\\}`, 'g'), params[p]);
            }
            return text;
        }

        addListener(fn) {
            if (typeof fn === 'function' && !this.listeners.includes(fn)) {
                this.listeners.push(fn);
            }
        }

        notifyListeners() {
            for (const fn of this.listeners) {
                try { fn(this.lang); } catch (e) { console.warn(e); }
            }
        }
    }

    SF.i18n = new I18nManager();
    SF.t = function(key, params) { return SF.i18n.t(key, params); };
})(window.SF);
