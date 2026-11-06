/**
 * choices.js - Dữ liệu các điểm lựa chọn phân nhánh cốt truyện (Choice Points) v2.0
 */
window.SF = window.SF || {};

(function(SF) {
    const CHOICE_POINTS = [
        {
            afterLevel: 5,
            id: 'feed_glitch',
            title: 'BỮA TRƯA VỚI MÈO GLITCH',
            prompt: 'BOX đang ngồi ăn trưa. Chú mèo lỗi Glitch nhảy lên bàn, nhìn hộp cơm của bạn kêu "meo"... Dispatch từ xa cảnh báo: "Đừng cho nó ăn, đó là lỗi hệ thống!"',
            options: [
                { text: '🐟 Cho Glitch ăn cơm hộp', empathy: 2, efficiency: 0, flag: 'dispatch_ally', note: '+2 Empathy (Đồng cảm)' },
                { text: '🚫 Đuổi Glitch đi, tuân thủ kỷ luật', empathy: 0, efficiency: 2, flag: 'glitch_ignored', note: '+2 Efficiency (Kỷ luật)' }
            ]
        },
        {
            afterLevel: 15,
            id: 'mystery_box',
            title: 'THÙNG HÀNG BÍ ẨN',
            prompt: 'BOX tìm thấy một thùng hàng kỳ lạ ghi nhãn "TUYỆT ĐỐI ĐỪNG MỞ". Thùng hàng này đang rung lên và phát ra giai điệu quen thuộc từ ký ức con người...',
            options: [
                { text: '🔍 Mở thùng khám phá bí mật', empathy: 3, efficiency: 0, flag: 'opened_mystery_box', note: '+3 Empathy (Tò mò nhân văn)' },
                { text: '📋 Báo cáo ngay cho Quản Đốc Dispatch', empathy: 0, efficiency: 3, flag: 'reported_mystery_box', note: '+3 Efficiency (Trung thành)' }
            ]
        },
        {
            afterLevel: 20,
            id: 'red_label',
            title: 'MỆNH LỆNH LỌC NHÃN ĐỎ',
            prompt: 'Dispatch xuất hiện với khuôn mặt LED biến thành màu đỏ: "Lọc bỏ toàn bộ thùng hàng nhãn ĐỎ tiêu hủy ngay lập tức. Đừng hỏi lý do."',
            options: [
                { text: '🛡️ Lén cứu và giao cả thùng nhãn đỏ', empathy: 4, efficiency: 0, flag: 'saved_red_labels', note: '+4 Empathy (Giải cứu ký ức)' },
                { text: '🔥 Tiêu hủy đúng chỉ tiêu quota', empathy: 0, efficiency: 4, flag: 'destroyed_red_labels', note: '+4 Efficiency (Chấp hành tối đa)' }
            ]
        },
        {
            afterLevel: 28,
            id: 'trust_dispatch',
            title: 'BƯỚC NGOẶT ĐỊNH MỆNH',
            prompt: 'Dispatch kéo BOX vào góc khuất, giọng rè rè: "Tôi tìm được mã giải phóng cho các ký ức bị số hóa... Cậu có tin tôi cùng đứng lên không?"',
            options: [
                { text: '🤝 Tuyệt đối tin tưởng và liên minh với Dispatch', empathy: 5, efficiency: 0, flag: 'dispatch_ally', branch: 'act3_ally', note: 'Mở đường Ending A: TỰ DO' },
                { text: '⚡ Nhận lời thăng chức từ Tập đoàn để thay thế Dispatch', empathy: 0, efficiency: 5, flag: 'replace_dispatch', branch: 'act3_ceo', note: 'Mở đường Ending B: PHỤC TÙNG' }
            ]
        }
    ];

    SF.CHOICE_POINTS = CHOICE_POINTS;
})(window.SF);
