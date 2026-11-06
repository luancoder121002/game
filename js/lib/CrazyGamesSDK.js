/**
 * CrazyGamesSDK.js - Tích hợp CrazyGames SDK v3 chính thức
 * Hỗ trợ: gameplayStart, gameplayStop, happytime, Midroll Ads, Rewarded Ads (Xem Hint),
 * Tự động chuyển đổi mượt mà khi chạy offline / localhost / test mà không lỗi!
 */
window.SF = window.SF || {};

(function(SF) {
    class CrazyGamesManager {
        constructor() {
            this.sdk = null;
            this.initialized = false;
            this.isGameplayActive = false;
            this.isAdPlaying = false;
            this.initPromise = null;

            this.init();
        }

        async init() {
            if (this.initPromise) return this.initPromise;

            this.initPromise = new Promise(async (resolve) => {
                try {
                    if (window.CrazyGames && window.CrazyGames.SDK) {
                        this.sdk = window.CrazyGames.SDK;
                        await this.sdk.init();
                        this.initialized = true;
                        console.log('[CrazyGames SDK v3] Khởi tạo thành công!');
                    } else {
                        console.log('[CrazyGames SDK] Đang chạy ở chế độ Local/Sandbox (SDK mockup sẵn sàng).');
                    }
                } catch (err) {
                    console.warn('[CrazyGames SDK] Lỗi khởi tạo (sử dụng fallback):', err);
                }
                resolve();
            });

            return this.initPromise;
        }

        // Bắt đầu gameplay (khi người chơi bấm GO hoặc bắt đầu thao tác màn)
        gameplayStart() {
            if (this.isGameplayActive) return;
            this.isGameplayActive = true;
            try {
                if (this.sdk && this.sdk.game && typeof this.sdk.game.gameplayStart === 'function') {
                    this.sdk.game.gameplayStart();
                    console.log('[CrazyGames] gameplayStart()');
                }
            } catch (e) {
                console.warn(e);
            }
        }

        // Dừng gameplay (khi tạm dừng, hoàn thành màn, hoặc thất bại)
        gameplayStop() {
            if (!this.isGameplayActive) return;
            this.isGameplayActive = false;
            try {
                if (this.sdk && this.sdk.game && typeof this.sdk.game.gameplayStop === 'function') {
                    this.sdk.game.gameplayStop();
                    console.log('[CrazyGames] gameplayStop()');
                }
            } catch (e) {
                console.warn(e);
            }
        }

        // Kích hoạt khoảnh khắc vui (chiến thắng màn chơi, đạt sao tối đa)
        happytime() {
            try {
                if (this.sdk && this.sdk.game && typeof this.sdk.game.happytime === 'function') {
                    this.sdk.game.happytime();
                }
            } catch (e) {
                console.warn(e);
            }
        }

        // Yêu cầu Midroll Ad (quảng cáo chuyển tiếp giữa các màn chơi)
        async requestMidrollAd(onComplete) {
            await this.init();

            if (!this.sdk || !this.sdk.ad || typeof this.sdk.ad.requestAd !== 'function') {
                // Không có SDK (chạy local/offline) -> tiếp tục ngay
                if (onComplete) onComplete();
                return;
            }

            const wasMuted = SF.soundManager ? SF.soundManager.muted : false;
            this.isAdPlaying = true;

            // Tạm thời tắt âm thanh khi xem quảng cáo theo quy định
            if (SF.soundManager && !wasMuted) {
                SF.soundManager.stopBGM();
            }

            const callbacks = {
                adStarted: () => {
                    this.isAdPlaying = true;
                    if (SF.soundManager) SF.soundManager.stopBGM();
                },
                adFinished: () => {
                    this.isAdPlaying = false;
                    if (SF.soundManager && !wasMuted) {
                        SF.soundManager.startBGM(SF.soundManager.currentAct || 1);
                    }
                    if (onComplete) onComplete();
                },
                adError: (error) => {
                    console.warn('[CrazyGames] Midroll Ad error / blocked:', error);
                    this.isAdPlaying = false;
                    if (SF.soundManager && !wasMuted) {
                        SF.soundManager.startBGM(SF.soundManager.currentAct || 1);
                    }
                    if (onComplete) onComplete();
                }
            };

            try {
                this.sdk.ad.requestAd('midroll', callbacks);
            } catch (err) {
                console.warn(err);
                callbacks.adFinished();
            }
        }

        // Yêu cầu Rewarded Ad (xem quảng cáo nhận thưởng mở gợi ý Hint)
        async requestRewardedAd(onRewarded, onFailed) {
            await this.init();

            if (!this.sdk || !this.sdk.ad || typeof this.sdk.ad.requestAd !== 'function') {
                // Offline fallback: vẫn thưởng cho người chơi trải nghiệm
                if (onRewarded) onRewarded();
                return;
            }

            const wasMuted = SF.soundManager ? SF.soundManager.muted : false;
            this.isAdPlaying = true;

            if (SF.soundManager && !wasMuted) {
                SF.soundManager.stopBGM();
            }

            let rewarded = false;
            const callbacks = {
                adStarted: () => {
                    this.isAdPlaying = true;
                    if (SF.soundManager) SF.soundManager.stopBGM();
                },
                adFinished: () => {
                    this.isAdPlaying = false;
                    rewarded = true;
                    if (SF.soundManager && !wasMuted) {
                        SF.soundManager.startBGM(SF.soundManager.currentAct || 1);
                    }
                    if (onRewarded) onRewarded();
                },
                adError: (error) => {
                    console.warn('[CrazyGames] Rewarded Ad error / blocked:', error);
                    this.isAdPlaying = false;
                    if (SF.soundManager && !wasMuted) {
                        SF.soundManager.startBGM(SF.soundManager.currentAct || 1);
                    }
                    if (!rewarded && onFailed) onFailed();
                }
            };

            try {
                this.sdk.ad.requestAd('rewarded', callbacks);
            } catch (err) {
                console.warn(err);
                if (onRewarded) onRewarded();
            }
        }
    }

    SF.crazyGames = new CrazyGamesManager();
})(window.SF);
