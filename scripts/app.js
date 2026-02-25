/**
 * app.js — State machine & orchestration for the birthday experience
 * 
 * Flow:
 *   State 1 (Landing)  →  auto after 2s  →
 *   State 2 (Surprise) →  on gift click  →
 *   State 3 (Burst)    →  auto after 3.5s →
 *   State 4 (Joke)     →  auto after 2.5s →
 *   State 5 (Carousel)
 */

(function () {
    'use strict';

    // ——— State elements ———
    const stateLanding = document.getElementById('state-landing');
    const stateSurprise = document.getElementById('state-surprise');
    const stateBurst = document.getElementById('state-burst');
    const stateJoke = document.getElementById('state-joke');
    const stateCarousel = document.getElementById('state-carousel');

    const giftBox = document.getElementById('gift-box');
    const burstContainer = document.getElementById('burst-container');
    const sparkleContainer = document.getElementById('sparkle-container');
    const audioToggle = document.getElementById('audio-toggle');
    const audioIcon = document.getElementById('audio-icon');

    // ——— Audio: Dandelions by Ruth B (actual MP3) ———
    const bgAudio = document.getElementById('bg-audio');
    let isMuted = false;
    bgAudio.volume = 0.5;

    // ——— State transitions ———
    function showState(stateEl) {
        document.querySelectorAll('.state').forEach(s => s.classList.remove('active'));
        stateEl.classList.add('active');
    }

    // ——— INIT: State 1 — Landing ———
    function initLanding() {
        showState(stateLanding);
        Animations.createSparkles(sparkleContainer, 25);

        // Auto transition to surprise after title animation completes
        setTimeout(() => {
            transitionToSurprise();
        }, 2200);
    }

    // ——— State 2 — Surprise Prompt ———
    function transitionToSurprise() {
        showState(stateSurprise);

        giftBox.addEventListener('click', onGiftClick, { once: true });
    }

    // ——— Gift Click → State 3 ———
    function onGiftClick() {
        // Play opening animation on gift
        giftBox.classList.add('opening');

        // Small delay then burst
        setTimeout(() => {
            transitionToBurst();
        }, 600);
    }

    // ——— State 3 — Flower Burst ———
    function transitionToBurst() {
        showState(stateBurst);
        Animations.createFlowerBurst(burstContainer);

        // After burst completes → joke
        setTimeout(() => {
            transitionToJoke();
        }, 3500);
    }

    // ——— State 4 — Joke Message ———
    function transitionToJoke() {
        showState(stateJoke);

        // After reading time → carousel
        setTimeout(() => {
            transitionToCarousel();
        }, 2500);
    }

    // ——— State 5 — Carousel ———
    function transitionToCarousel() {
        showState(stateCarousel);
        Carousel.init();
        startMusic();
    }

    // ——— Music playback ———
    function startMusic() {
        bgAudio.play().catch(e => {
            console.warn('Audio autoplay blocked, will retry on user interaction:', e);
            // Fallback: play on next user click
            document.addEventListener('click', () => {
                bgAudio.play().catch(() => { });
            }, { once: true });
        });
    }

    // ——— Audio toggle ———
    audioToggle.addEventListener('click', () => {
        isMuted = !isMuted;
        audioIcon.textContent = isMuted ? '🔇' : '🔊';
        audioToggle.classList.toggle('muted', isMuted);
        bgAudio.muted = isMuted;
    });

    // ——— Start the experience ———
    document.addEventListener('DOMContentLoaded', initLanding);

})();
