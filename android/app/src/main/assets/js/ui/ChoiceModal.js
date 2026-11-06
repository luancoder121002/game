/**
 * ChoiceModal.js - Popup lựa chọn phân nhánh cốt truyện v2.0
 */
window.SF = window.SF || {};

(function(SF) {
    class ChoiceModal {
        constructor(modalContainer) {
            this.modal = modalContainer;
        }

        show(choicePoint, onChosen) {
            if (!this.modal) return;
            this.modal.style.display = 'flex';

            let optionsHtml = '';
            choicePoint.options.forEach((opt, idx) => {
                optionsHtml += `
                    <button class="btn choice-btn" data-idx="${idx}">
                        <div class="choice-title">${opt.text}</div>
                        <div class="choice-note">${opt.note || ''}</div>
                    </button>
                `;
            });

            this.modal.innerHTML = `
                <div class="modal-box choice-box">
                    <div class="choice-badge">QUYẾT ĐỊNH CỦA BẠN (STORY CHOICE)</div>
                    <h2 class="choice-heading">${choicePoint.title}</h2>
                    <p class="choice-prompt">${choicePoint.prompt}</p>
                    <div class="choice-options-list">
                        ${optionsHtml}
                    </div>
                </div>
            `;

            this.modal.querySelectorAll('.choice-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = parseInt(btn.dataset.idx, 10);
                    const opt = choicePoint.options[idx];
                    SF.soundManager.playClick();
                    SF.storyManager.recordChoice(choicePoint.id, opt);
                    this.modal.style.display = 'none';
                    if (onChosen) onChosen(opt);
                });
            });
        }
    }

    SF.ChoiceModal = ChoiceModal;
})(window.SF);
