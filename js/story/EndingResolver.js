/**
 * EndingResolver.js - Xác định 4 kết thúc (Ending A, B, C, Secret Ending D) v2.0
 */
window.SF = window.SF || {};

(function(SF) {
    class EndingResolver {
        static resolve(storyState, completedLevels = {}) {
            const { empathy, efficiency, glitchTokens } = storyState;
            const dispatchAlly = storyState.dispatch_ally;
            const replaceDispatch = storyState.replace_dispatch;

            // Kiểm tra Secret Ending D: 10 Glitch Tokens + All Stars
            let allStars = Object.keys(completedLevels).length >= 40 &&
                Object.values(completedLevels).every(lvl => lvl.passed && lvl.speedStar && lvl.sizeStar);

            if (glitchTokens >= 10 || (allStars && glitchTokens >= 5)) {
                return {
                    id: 'D_transcend',
                    name: 'ENDING D: SIÊU VIỆT (SECRET)',
                    summary: 'Glitch dẫn BOX vượt ra ngoài tòa tháp Signal Corp. Bạn nhận ra cả thế giới này là một mạch điện vĩ đại, và BOX chính là kỹ sư tự do.',
                    unlocksLevel41: true
                };
            }

            // Ending A: Tự Do (Empathy cao + Đồng minh Dispatch)
            if (empathy >= 6 && dispatchAlly && !replaceDispatch) {
                return {
                    id: 'A_freedom',
                    name: 'ENDING A: TỰ DO',
                    summary: 'BOX cùng Dispatch phá sập bức tường ngăn cách. Dòng tín hiệu tràn ngập ánh sáng tự nhiên. Bạn và Dispatch cùng bước vào thế giới mới.'
                };
            }

            // Ending B: Phục Tùng (Efficiency cao + Thay thế Dispatch)
            if (efficiency >= 6 && replaceDispatch) {
                return {
                    id: 'B_obey',
                    name: 'ENDING B: PHỤC TÙNG',
                    summary: 'BOX được thăng chức thành Quản Đốc Dispatch mới của Signal Corp. Màn hình LED gắn vào đầu bạn, chu trình công nghiệp lặp lại vĩnh cửu.'
                };
            }

            // Ending C: Phá Hủy (Trung lập / Phản kháng)
            return {
                id: 'C_destroy',
                name: 'ENDING C: PHÁ HỦY HỆ THỐNG',
                summary: 'BOX cắt đứt toàn bộ mạch điện trung tâm. Tòa tháp Signal Corp chìm vào bóng tối. Tín hiệu số ngừng vận hành.'
            };
        }
    }

    SF.EndingResolver = EndingResolver;
})(window.SF);
