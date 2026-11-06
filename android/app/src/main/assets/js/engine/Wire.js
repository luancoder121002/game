/**
 * Wire.js - Tương thích ngược với Rail.js trong Signal Factory v2.0
 */
window.SF = window.SF || {};

(function(SF) {
    if (!SF.Rail) {
        // Fallback nếu Rail chưa nạp
        SF.Wire = class Wire {
            constructor(id, fromPin, toPin) {
                return new SF.Rail(id, fromPin, toPin);
            }
        };
    } else {
        SF.Wire = SF.Rail;
    }
})(window.SF);
