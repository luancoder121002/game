/**
 * SecureStorage.js - Hệ thống lưu trữ bảo mật & mã hóa chống gian lận (Anti-Tamper) v2.0
 * Tiêu chuẩn QA/QC: Security & Data Integrity cho Google Play, App Store & Web Platforms.
 * 
 * Tính năng:
 * 1. Mã hóa luân phiên chuỗi byte (Salted XOR Obfuscation) kết hợp Base64 encoding.
 * 2. Chữ ký toàn vẹn (Integrity Checksum Hash) phát hiện gian lận sửa điểm qua DevTools F12.
 * 3. Tự động di chuyển dữ liệu cũ (Legacy Migration) từ plain text sang encrypted format.
 * 4. Bọc Exception Handling an toàn tuyệt đối, chống sập app khi chạy trong Safari Private / Incognito.
 */
window.SF = window.SF || {};

(function(SF) {
    'use strict';

    class SecureStorage {
        constructor() {
            this.salt = 'SF_CORP_CYBERPUNK_SECURE_SALT_v2026';
            this.inMemoryFallback = new Map();
            this.isStorageAvailable = this.checkStorageAvailability();
        }

        checkStorageAvailability() {
            try {
                if (typeof window === 'undefined' || !window.localStorage) return false;
                const testKey = '__sf_test_storage__';
                window.localStorage.setItem(testKey, '1');
                window.localStorage.removeItem(testKey);
                return true;
            } catch (e) {
                console.warn('[SecureStorage] LocalStorage không khả dụng (Private Mode / Quota Exceeded). Dùng bộ nhớ tạm in-memory.');
                return false;
            }
        }

        // Tạo mã băm toàn vẹn (FNV-1a 32-bit Hash kết hợp Salt)
        calculateChecksum(str) {
            let hash = 2166136261;
            const fullStr = str + this.salt;
            for (let i = 0; i < fullStr.length; i++) {
                hash ^= fullStr.charCodeAt(i);
                hash = Math.imul(hash, 16777619);
            }
            return (hash >>> 0).toString(16);
        }

        // Mã hóa XOR luân phiên với chuỗi Salt
        xorCipher(text) {
            let result = '';
            for (let i = 0; i < text.length; i++) {
                const charCode = text.charCodeAt(i) ^ this.salt.charCodeAt(i % this.salt.length);
                result += String.fromCharCode(charCode);
            }
            return result;
        }

        encrypt(plainText) {
            try {
                const utf8Bytes = encodeURIComponent(plainText);
                const ciphered = this.xorCipher(utf8Bytes);
                const b64 = btoa(ciphered);
                const checksum = this.calculateChecksum(plainText);
                return JSON.stringify({
                    d: b64,
                    h: checksum,
                    v: 2
                });
            } catch (e) {
                console.warn('[SecureStorage] Lỗi mã hóa:', e);
                return plainText;
            }
        }

        decrypt(payloadStr) {
            try {
                if (!payloadStr) return null;
                // Kiểm tra payload có phải dạng đóng gói mã hóa v2 không
                let payload;
                try {
                    payload = JSON.parse(payloadStr);
                } catch (e) {
                    // Không phải JSON -> có thể là dữ liệu plain text cũ
                    return payloadStr;
                }

                if (!payload || !payload.d || !payload.h) {
                    return payloadStr; // Legacy fallback
                }

                const ciphered = atob(payload.d);
                const utf8Bytes = this.xorCipher(ciphered);
                const plainText = decodeURIComponent(utf8Bytes);

                // Xác thực tính toàn vẹn (Integrity Check)
                const expectedHash = this.calculateChecksum(plainText);
                if (payload.h !== expectedHash) {
                    console.error('[SecureStorage] CẢNH BÁO BẢO MẬT: Phát hiện dữ liệu lưu trữ bị chỉnh sửa trái phép (Tamper Detection Triggered)!');
                    return null;
                }

                return plainText;
            } catch (e) {
                console.warn('[SecureStorage] Lỗi giải mã dữ liệu:', e);
                return null;
            }
        }

        getItem(key, defaultValue = null) {
            try {
                let rawValue = null;
                if (this.isStorageAvailable) {
                    rawValue = window.localStorage.getItem(key);
                } else {
                    rawValue = this.inMemoryFallback.get(key) || null;
                }

                if (rawValue === null || rawValue === undefined) {
                    return defaultValue;
                }

                const decrypted = this.decrypt(rawValue);
                if (decrypted === null) {
                    return defaultValue;
                }

                try {
                    return JSON.parse(decrypted);
                } catch (e) {
                    return decrypted;
                }
            } catch (err) {
                console.warn(`[SecureStorage] Lỗi đọc key [${key}]:`, err);
                return defaultValue;
            }
        }

        setItem(key, value) {
            try {
                const serialized = typeof value === 'string' ? value : JSON.stringify(value);
                const encrypted = this.encrypt(serialized);

                if (this.isStorageAvailable) {
                    window.localStorage.setItem(key, encrypted);
                } else {
                    this.inMemoryFallback.set(key, encrypted);
                }
                return true;
            } catch (err) {
                console.warn(`[SecureStorage] Lỗi ghi key [${key}]:`, err);
                return false;
            }
        }

        removeItem(key) {
            try {
                if (this.isStorageAvailable) {
                    window.localStorage.removeItem(key);
                }
                this.inMemoryFallback.delete(key);
            } catch (err) {
                console.warn(`[SecureStorage] Lỗi xóa key [${key}]:`, err);
            }
        }

        // Tự động nâng cấp các key lưu trữ dạng thô (Legacy plain-text) sang định dạng bảo mật
        migrateLegacyKeys(keys = []) {
            if (!this.isStorageAvailable) return;
            for (const key of keys) {
                try {
                    const raw = window.localStorage.getItem(key);
                    if (raw && !raw.includes('"v":2')) {
                        // Di chuyển và mã hóa lại
                        let parsedVal = raw;
                        try { parsedVal = JSON.parse(raw); } catch (e) {}
                        this.setItem(key, parsedVal);
                    }
                } catch (e) {
                    // Ignore
                }
            }
        }
    }

    SF.SecureStorage = SecureStorage;
    SF.storage = new SecureStorage();

    // Tự động bảo vệ các key trọng yếu của game ngay khi nạp
    SF.storage.migrateLegacyKeys([
        'sf_completed_levels',
        'sf_current_level_idx',
        'sf_v2_story_state',
        'sf_language'
    ]);
})(window.SF);
