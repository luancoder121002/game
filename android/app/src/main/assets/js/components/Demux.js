/**
 * Demux.js - Bộ phân kênh 1-to-2 (tương đồng với Switch)
 */
window.SF = window.SF || {};

(function(SF) {
    class Demux extends SF.Switch {
        constructor(id) {
            super(id, 'DEMUX', 'Demux');
            this.icon = 'D';
            this.color = '#453823';
            this.borderColor = '#c79b36';
        }
    }

    SF.Demux = Demux;
})(window.SF);
