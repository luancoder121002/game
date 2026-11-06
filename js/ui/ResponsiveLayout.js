/**
 * ResponsiveLayout.js - Tự động điều chỉnh bố cục giao diện đa nền tảng Mobile & Desktop v2.0
 */
window.SF = window.SF || {};

(function(SF) {
    class ResponsiveLayout {
        constructor() {
            this.platform = this.detectPlatform();
            this.orientation = this.detectOrientation();

            window.addEventListener('resize', () => {
                this.updateLayout();
            });
        }

        detectPlatform() {
            const ua = navigator.userAgent;
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
                return 'mobile';
            }
            return (window.innerWidth <= 768) ? 'mobile' : 'desktop';
        }

        detectOrientation() {
            return (window.innerHeight > window.innerWidth) ? 'portrait' : 'landscape';
        }

        updateLayout() {
            this.platform = this.detectPlatform();
            this.orientation = this.detectOrientation();

            const isMobilePortrait = (this.platform === 'mobile' && this.orientation === 'portrait') || window.innerWidth < 640;
            document.body.classList.toggle('layout-mobile-portrait', isMobilePortrait);
            document.body.classList.toggle('layout-desktop', !isMobilePortrait);
        }
    }

    SF.ResponsiveLayout = ResponsiveLayout;
    SF.responsiveLayout = new ResponsiveLayout();
})(window.SF);
