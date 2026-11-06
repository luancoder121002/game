/**
 * StoryManager.js - Quản lý cốt truyện phân nhánh, điểm Reputation (Empathy / Efficiency) và Glitch Token v2.0
 */
window.SF = window.SF || {};

(function(SF) {
    class StoryManager {
        constructor() {
            this.state = this.loadState();
        }

        loadState() {
            try {
                if (SF.storage) {
                    const saved = SF.storage.getItem('sf_v2_story_state');
                    if (saved) return saved;
                } else {
                    const saved = localStorage.getItem('sf_v2_story_state');
                    if (saved) return JSON.parse(saved);
                }
            } catch (e) {
                console.warn(e);
            }
            return {
                empathy: 0,
                efficiency: 0,
                glitchTokens: 0,
                choices: {},
                currentBranch: 'default',
                unlockedEndings: []
            };
        }

        saveState() {
            try {
                if (SF.storage) {
                    SF.storage.setItem('sf_v2_story_state', this.state);
                } else {
                    localStorage.setItem('sf_v2_story_state', JSON.stringify(this.state));
                }
            } catch (e) {
                console.warn(e);
            }
        }

        addGlitchToken() {
            this.state.glitchTokens++;
            this.saveState();
            return this.state.glitchTokens;
        }

        recordChoice(choiceId, option) {
            this.state.choices[choiceId] = option.text;
            if (option.empathy) this.state.empathy += option.empathy;
            if (option.efficiency) this.state.efficiency += option.efficiency;
            if (option.flag) this.state[option.flag] = true;
            if (option.branch) this.state.currentBranch = option.branch;

            this.saveState();
        }

        getReputation() {
            return {
                empathy: this.state.empathy,
                efficiency: this.state.efficiency,
                glitchTokens: this.state.glitchTokens
            };
        }

        getTone() {
            if (this.state.empathy > this.state.efficiency + 2) return 'highEmpathy';
            if (this.state.efficiency > this.state.empathy + 2) return 'highEfficiency';
            return 'default';
        }
    }

    SF.StoryManager = StoryManager;
    SF.storyManager = new StoryManager();
})(window.SF);
