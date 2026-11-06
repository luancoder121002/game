/**
 * ModalDialog.js - Hệ thống Hộp thoại In-Game Cyberpunk phi đồng bộ (Non-blocking Dialogs) v2.0
 * Thay thế hoàn toàn alert(), confirm(), prompt() của trình duyệt!
 * 
 * Đảm bảo:
 * 1. Không làm nghẽn UI Thread, không làm đứt quãng Web Audio oscillator.
 * 2. Đạt chuẩn Store Submission (Google Play, iOS App Store, Poki, CrazyGames).
 * 3. Hỗ trợ cảm ứng màn hình (Touch), tự động focus input, và phím tắt (Enter/Esc).
 */
window.SF = window.SF || {};

(function(SF) {
    'use strict';

    class ModalDialog {
        constructor() {
            this.container = null;
            this.activeResolve = null;
            this.initDOM();
        }

        initDOM() {
            let container = document.getElementById('dialogModal');
            if (!container) {
                container = document.createElement('div');
                container.id = 'dialogModal';
                container.className = 'modal-overlay dialog-modal-overlay';
                container.style.display = 'none';
                document.body.appendChild(container);
            }
            this.container = container;

            // Xử lý phím Enter / Escape
            window.addEventListener('keydown', (e) => {
                if (this.container.style.display !== 'flex') return;
                if (e.key === 'Escape') {
                    e.preventDefault();
                    this.close(null);
                } else if (e.key === 'Enter') {
                    const inputEl = this.container.querySelector('.dialog-input');
                    if (inputEl && document.activeElement === inputEl) {
                        e.preventDefault();
                        this.close(inputEl.value);
                    }
                }
            });
        }

        close(result) {
            if (this.container) {
                this.container.style.display = 'none';
                this.container.innerHTML = '';
            }
            if (this.activeResolve) {
                const resolve = this.activeResolve;
                this.activeResolve = null;
                resolve(result);
            }
        }

        /**
         * Thay thế alert() - Hiển thị thông báo với nút [Đồng ý / OK]
         */
        alert(message, title = 'THÔNG BÁO TỔNG ĐÀI') {
            return new Promise((resolve) => {
                this.activeResolve = resolve;
                const t = (k) => (SF.t ? SF.t(k) : k);
                const safeTitle = String(title).replace(/</g, '&lt;').replace(/>/g, '&gt;');
                const formattedMsg = String(message).replace(/\n/g, '<br/>');

                this.container.innerHTML = `
                    <div class="modal-box dialog-box" role="dialog" aria-modal="true">
                        <div class="modal-header">
                            <h3 class="dialog-title">${safeTitle}</h3>
                        </div>
                        <div class="dialog-body">
                            <p class="dialog-text">${formattedMsg}</p>
                        </div>
                        <div class="modal-footer dialog-footer">
                            <button class="btn btn-primary dialog-btn-ok" id="dialogBtnOk">${t('BTN_CONFIRM') || 'OK'}</button>
                        </div>
                    </div>
                `;

                this.container.style.display = 'flex';
                const okBtn = document.getElementById('dialogBtnOk');
                if (okBtn) {
                    okBtn.focus();
                    okBtn.onclick = () => {
                        if (SF.soundManager) SF.soundManager.playClick();
                        this.close(true);
                    };
                }
            });
        }

        /**
         * Thay thế confirm() - Trả về true nếu chọn Đồng ý, false nếu Huỷ
         */
        confirm(message, title = 'XÁC NHẬN THAO TÁC') {
            return new Promise((resolve) => {
                this.activeResolve = resolve;
                const t = (k) => (SF.t ? SF.t(k) : k);
                const safeTitle = String(title).replace(/</g, '&lt;').replace(/>/g, '&gt;');
                const formattedMsg = String(message).replace(/\n/g, '<br/>');

                this.container.innerHTML = `
                    <div class="modal-box dialog-box" role="dialog" aria-modal="true">
                        <div class="modal-header">
                            <h3 class="dialog-title">${safeTitle}</h3>
                        </div>
                        <div class="dialog-body">
                            <p class="dialog-text">${formattedMsg}</p>
                        </div>
                        <div class="modal-footer dialog-footer">
                            <button class="btn btn-secondary dialog-btn-cancel" id="dialogBtnCancel">${t('BTN_CANCEL') || 'Hủy'}</button>
                            <button class="btn btn-primary dialog-btn-ok" id="dialogBtnConfirm">${t('BTN_CONFIRM') || 'Xác nhận'}</button>
                        </div>
                    </div>
                `;

                this.container.style.display = 'flex';
                const confirmBtn = document.getElementById('dialogBtnConfirm');
                const cancelBtn = document.getElementById('dialogBtnCancel');

                if (confirmBtn) {
                    confirmBtn.focus();
                    confirmBtn.onclick = () => {
                        if (SF.soundManager) SF.soundManager.playClick();
                        this.close(true);
                    };
                }
                if (cancelBtn) {
                    cancelBtn.onclick = () => {
                        if (SF.soundManager) SF.soundManager.playClick();
                        this.close(false);
                    };
                }
            });
        }

        /**
         * Thay thế prompt() - Nhập dữ liệu (ví dụ giá trị Hằng số N)
         */
        prompt(message, defaultValue = '', title = 'CẤU HÌNH THÔNG SỐ') {
            return new Promise((resolve) => {
                this.activeResolve = resolve;
                const t = (k) => (SF.t ? SF.t(k) : k);
                const safeTitle = String(title).replace(/</g, '&lt;').replace(/>/g, '&gt;');
                const formattedMsg = String(message).replace(/\n/g, '<br/>');
                const safeDefault = String(defaultValue !== null && defaultValue !== undefined ? defaultValue : '')
                    .replace(/"/g, '&quot;');

                this.container.innerHTML = `
                    <div class="modal-box dialog-box" role="dialog" aria-modal="true">
                        <div class="modal-header">
                            <h3 class="dialog-title">${safeTitle}</h3>
                        </div>
                        <div class="dialog-body">
                            <p class="dialog-text">${formattedMsg}</p>
                            <input type="text" class="dialog-input" id="dialogInputField" value="${safeDefault}" autocomplete="off" />
                        </div>
                        <div class="modal-footer dialog-footer">
                            <button class="btn btn-secondary dialog-btn-cancel" id="dialogBtnCancel">${t('BTN_CANCEL') || 'Hủy'}</button>
                            <button class="btn btn-primary dialog-btn-ok" id="dialogBtnSubmit">${t('BTN_CONFIRM') || 'Đồng ý'}</button>
                        </div>
                    </div>
                `;

                this.container.style.display = 'flex';
                const inputField = document.getElementById('dialogInputField');
                const submitBtn = document.getElementById('dialogBtnSubmit');
                const cancelBtn = document.getElementById('dialogBtnCancel');

                if (inputField) {
                    inputField.focus();
                    inputField.select();
                }

                if (submitBtn) {
                    submitBtn.onclick = () => {
                        if (SF.soundManager) SF.soundManager.playClick();
                        const val = inputField ? inputField.value : '';
                        this.close(val);
                    };
                }
                if (cancelBtn) {
                    cancelBtn.onclick = () => {
                        if (SF.soundManager) SF.soundManager.playClick();
                        this.close(null);
                    };
                }
            });
        }
    }

    SF.ModalDialog = ModalDialog;
    SF.dialog = new ModalDialog();
})(window.SF);
