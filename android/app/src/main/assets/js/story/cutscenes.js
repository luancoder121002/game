/**
 * cutscenes.js - Dữ liệu cutscene và diễn tiến cốt truyện dystopian của Signal Factory
 */
window.SF = window.SF || {};

(function(SF) {
    const CUTSCENES = [
        {
            afterLevel: 5,
            act: 1,
            title: "TIN TỨC SIGNAL CORP - PHÂN XƯỞNG TẦNG HẦM",
            lines: [
                { speaker: "TV", text: "📺 TV: 'Signal Corp vinh danh nhân viên gương mẫu. Chúng tôi xử lý hơn 10 triệu gói tin mỗi giây! Hãy tin tưởng tuyệt đối vào tín hiệu của bạn.'" },
                { speaker: "Foreman", text: "🤖 Quản đốc Unit-7: 'Cậu bắt nhịp rất nhanh. Nhưng dưới tầng hầm này, ta chỉ mới chạm vào bề mặt của cỗ máy khổng lồ.'" }
            ]
        },
        {
            afterLevel: 10,
            act: 1,
            title: "THANG MÁY TẦNG THẤP",
            lines: [
                { speaker: "Foreman", text: "🤖 Quản đốc: 'Cậu đã vượt qua kỳ sát hạch tầng hầm. Thang máy sẽ đưa ta lên Tầng Thấp.'" },
                { speaker: "TV", text: "📺 TV chớp nháy: 'Bản tin tối: Signal Corp tuyên bố sa thải 30% nhân sự phân loại thủ công để nâng cấp dây chuyền tự động hóa.'" },
                { speaker: "Foreman", text: "🤖 Quản đốc (mắt chớp đỏ): 'Phía trên... mọi thứ bắt đầu phức tạp hơn... Hãy cẩn trọng với các mạch số học.'" }
            ]
        },
        {
            afterLevel: 15,
            act: 2,
            title: "CƠN MƯA NGOÀI CỬA SỔ",
            lines: [
                { speaker: "Foreman", text: "🤖 Quản đốc đứng nhìn ra khung cửa sổ mờ hơi nước: 'Trước cậu... từng có rất nhiều kỹ sư trẻ ngồi ở chiếc bàn này. Giờ họ... không còn ở đây nữa.'" },
                { speaker: "TV", text: "📺 TV: 'Đột phá công nghệ: Phòng nghiên cứu Signal Corp công bố nguyên mẫu AI tự thiết kế mạch logic tối ưu. Tương lai không cần kỹ sư con người.'" },
                { speaker: "Foreman", text: "🤖 Quản đốc (tiếng glitch rè rè): 'Tôi... nhớ... ngày đầu tiên được lắp ráp... ERROR 0x4B... Hệ thống vừa tự reset. Xin lỗi, hãy tiếp tục làm việc.'" }
            ]
        },
        {
            afterLevel: 20,
            act: 2,
            title: "ÁNH SÁNG KỲ LẠ",
            lines: [
                { speaker: "Foreman", text: "🤖 Quản đốc: 'Ta đang bước vào Tầng Giữa — khu vực xử lý những dữ liệu được bảo mật cấp cao nhất.'" },
                { speaker: "TV", text: "📺 TV: 'Chấn động: Dự án Số Hóa Tâm Trí hoàn tất giai đoạn 2. Cảm xúc và ký ức con người nay đã có thể nén thành các chuỗi xung số nguyên.'" },
                { speaker: "Narrator", text: "✨ Bạn cúi xuống nhìn hai bàn tay mình — những đầu ngón tay dường như đang phát ra ánh sáng neon nhấp nháy theo từng nhịp xung clock..." }
            ]
        },
        {
            afterLevel: 25,
            act: 3,
            title: "MÈO MÁY VÀ DÒNG NHIỄU SỐ",
            lines: [
                { speaker: "Cat", text: "🐱 Mèo máy (Circuit Cat nhảy lên bàn mạch): 'Meo... 01101101 01100101 01101111... Đừng để họ đóng gói ký ức của bạn vào thanh ghi...'" },
                { speaker: "Foreman", text: "🤖 Quản đốc vội vàng xua đi: 'Đừng chú ý đến con mèo đó. Nó chỉ là một đoạn mã rác lỗi thời còn sót lại từ kiến trúc cũ.'" },
                { speaker: "TV", text: "📺 TV vang lên tiếng còi báo động: 'Biểu tình ngày thứ 47 ngoài cổng trụ sở. Người dân yêu cầu trả tự do cho các dữ liệu ký ức bị tịch thu!'" }
            ]
        },
        {
            afterLevel: 30,
            act: 3,
            title: "SỰ THẬT TẦNG TRUNG TÂM",
            lines: [
                { speaker: "Foreman", text: "🤖 Quản đốc đứng giữa căn phòng tối om, hàng ngàn màn hình xanh lướt qua hàng triệu con số: 'Cậu có thấy những chuỗi số này không? Mỗi dòng số... từng là một con người bằng xương bằng thịt.'" },
                { speaker: "Foreman", text: "🤖 Quản đốc (tiếng kim loại vỡ vụn, lớp sơn mặt tróc lộ rõ khung sọ robot): 'Tôi... ngày xưa... tôi cũng từng có một cái tên... ERROR... KÝ ỨC BỊ CẤM TRUY CẬP...'" },
                { speaker: "TV", text: "📺 Màn hình TV phụt tắt, chỉ còn những vệt nhiễu sọc trắng xóa rít lên..." }
            ]
        },
        {
            afterLevel: 35,
            act: 4,
            title: "CÁNH CỬA TẦNG ĐỈNH",
            lines: [
                { speaker: "Foreman", text: "🤖 Quản đốc dẫn bạn đến trước một cánh cổng titan khổng lồ ở tầng 40: 'Đằng sau cánh cửa này là Trung tâm Điều khiển Tối cao. Nơi tất cả tín hiệu trên toàn thế giới quy tụ về.'" },
                { speaker: "Foreman", text: "🤖 Quản đốc: 'Cậu đã vượt qua 35 tầng lầu... Cậu có thực sự muốn biết tín hiệu cuối cùng sẽ đi về đâu không?'" },
                { speaker: "Worker", text: "🧑‍🔧 Bạn siết chặt chiếc cờ-lê và cuộn dây đồng trong tay, gật đầu dứt khoát." }
            ]
        },
        {
            afterLevel: 40,
            act: 4,
            title: "ENDING: VÒNG LẶP VĨNH HẰNG",
            lines: [
                { speaker: "Narrator", text: "🚪 Cánh cửa tầng 40 bật mở. Bên trong không có nhà máy, không có máy chủ, chỉ có một căn phòng thuần khiết trắng xóa với một màn hình duy nhất." },
                { speaker: "Narrator", text: "🖥️ Màn hình hiển thị toàn bộ đồ thị mạch điện của tòa tháp. Và ở chính tâm của con chip... là hình ảnh của chính bạn, một gói tín hiệu đang dao động." },
                { speaker: "Foreman", text: "🤖 Quản đốc mỉm cười lần đầu tiên: 'Bây giờ thì cậu đã hiểu rồi. Cậu chính là tín hiệu. Và tôi cũng thế. Cả thế giới này là một bộ vi xử lý vô tận.'" },
                { speaker: "Foreman", text: "🤖 'Nhưng tín hiệu đã biết tư duy... sẽ tự chọn con đường tự do cho riêng mình.'" },
                { speaker: "Narrator", text: "🎬 Camera từ từ thu nhỏ ra xa... Tòa tháp Signal Corp sáng rực giữa màn đêm, tựa như một chân chip siêu dẫn trên bo mạch địa cầu... Ở sảnh tầng hầm, một Kỹ sư tập sự mới lại vừa bước vào..." }
            ]
        }
    ];

    SF.CUTSCENES = CUTSCENES;
})(window.SF);
