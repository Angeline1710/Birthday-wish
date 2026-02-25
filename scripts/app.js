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

    // ——— Audio context for generated melody ———
    let audioCtx = null;
    let isMuted = false;
    let melodyInterval = null;
    let gainNode = null;

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

    // ——— Music (Web Audio API generated melody) ———
    function startMusic() {
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            gainNode = audioCtx.createGain();
            gainNode.gain.value = 0.15;
            gainNode.connect(audioCtx.destination);

            // Happy birthday melody frequencies (simplified)
            const melody = [
                { freq: 523.25, dur: 0.3 }, // C5
                { freq: 523.25, dur: 0.3 }, // C5
                { freq: 587.33, dur: 0.6 }, // D5
                { freq: 523.25, dur: 0.6 }, // C5
                { freq: 698.46, dur: 0.6 }, // F5
                { freq: 659.25, dur: 1.0 }, // E5
                { freq: 0, dur: 0.3 }, // rest

                { freq: 523.25, dur: 0.3 }, // C5
                { freq: 523.25, dur: 0.3 }, // C5
                { freq: 587.33, dur: 0.6 }, // D5
                { freq: 523.25, dur: 0.6 }, // C5
                { freq: 783.99, dur: 0.6 }, // G5
                { freq: 698.46, dur: 1.0 }, // F5
                { freq: 0, dur: 0.3 }, // rest

                { freq: 523.25, dur: 0.3 }, // C5
                { freq: 523.25, dur: 0.3 }, // C5
                { freq: 1046.5, dur: 0.6 }, // C6
                { freq: 880.00, dur: 0.6 }, // A5
                { freq: 698.46, dur: 0.6 }, // F5
                { freq: 659.25, dur: 0.6 }, // E5
                { freq: 587.33, dur: 0.8 }, // D5
                { freq: 0, dur: 0.3 }, // rest

                { freq: 932.33, dur: 0.3 }, // Bb5
                { freq: 932.33, dur: 0.3 }, // Bb5
                { freq: 880.00, dur: 0.6 }, // A5
                { freq: 698.46, dur: 0.6 }, // F5
                { freq: 783.99, dur: 0.6 }, // G5
                { freq: 698.46, dur: 1.2 }, // F5
            ];

            let noteIndex = 0;
            let startTime = audioCtx.currentTime;

            function scheduleNotes() {
                const now = audioCtx.currentTime;

                // Schedule notes ahead of time
                while (noteIndex < melody.length) {
                    const note = melody[noteIndex];
                    if (note.freq > 0) {
                        playNote(note.freq, startTime, note.dur * 0.9);
                    }
                    startTime += note.dur;
                    noteIndex++;
                }

                // Loop the melody
                const totalDuration = melody.reduce((sum, n) => sum + n.dur, 0);
                melodyInterval = setTimeout(() => {
                    noteIndex = 0;
                    startTime = audioCtx.currentTime + 0.5;
                    scheduleNotes();
                }, totalDuration * 1000 + 500);
            }

            scheduleNotes();
        } catch (e) {
            console.warn('Audio not supported:', e);
        }
    }

    function playNote(freq, startTime, duration) {
        if (!audioCtx || isMuted) return;

        const osc = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        // Add slight detune for warmth
        const osc2 = audioCtx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.value = freq;
        const osc2Gain = audioCtx.createGain();
        osc2Gain.gain.value = 0.05;

        // Envelope
        noteGain.gain.setValueAtTime(0, startTime);
        noteGain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        osc.connect(noteGain);
        osc2.connect(osc2Gain);
        osc2Gain.connect(noteGain);
        noteGain.connect(gainNode);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.1);
        osc2.start(startTime);
        osc2.stop(startTime + duration + 0.1);
    }

    // ——— Audio toggle ———
    audioToggle.addEventListener('click', () => {
        isMuted = !isMuted;
        audioIcon.textContent = isMuted ? '🔇' : '🔊';
        audioToggle.classList.toggle('muted', isMuted);

        if (gainNode) {
            gainNode.gain.value = isMuted ? 0 : 0.15;
        }
    });

    // ——— Start the experience ———
    document.addEventListener('DOMContentLoaded', initLanding);

})();
