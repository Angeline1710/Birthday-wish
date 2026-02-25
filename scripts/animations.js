/**
 * animations.js — Particle system for flower burst & dandelion drift
 * Full-screen burst version
 */

const Animations = (() => {
    const FLOWERS = ['🌸', '🌺', '🌷', '🌹', '🌻', '💐', '🌼', '🏵️', '🌾', '💮'];
    const DANDELIONS = ['🌾', '✿', '❀', '❁', '✾', '🍃', '🌿', '☘️', '🍀'];

    /**
     * Create sparkles around the title text
     */
    function createSparkles(container, count = 20) {
        for (let i = 0; i < count; i++) {
            const sparkle = document.createElement('div');
            sparkle.classList.add('sparkle');
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.animationDelay = Math.random() * 2 + 's';
            sparkle.style.animationDuration = (1 + Math.random() * 1.5) + 's';
            const colors = ['#ffd700', '#ff6b9d', '#a855f7', '#67e8f9'];
            sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
            container.appendChild(sparkle);
        }
    }

    /**
     * Create the flower bouquet burst animation — fills the ENTIRE screen
     */
    function createFlowerBurst(container) {
        container.innerHTML = '';

        // Central bouquet emoji
        const bouquet = document.createElement('div');
        bouquet.classList.add('bouquet');
        bouquet.textContent = '💐';
        container.appendChild(bouquet);

        // Get viewport dimensions for full-screen spread
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const maxDist = Math.max(vw, vh) * 0.7;

        // Burst flowers across the entire screen
        const particleCount = 45;
        for (let i = 0; i < particleCount; i++) {
            const flower = document.createElement('div');
            flower.classList.add('flower-particle');
            flower.textContent = FLOWERS[Math.floor(Math.random() * FLOWERS.length)];

            // Random burst direction covering full viewport
            const angle = (Math.PI * 2 / particleCount) * i + (Math.random() - 0.5) * 0.6;
            const distance = (maxDist * 0.3) + Math.random() * (maxDist * 0.7);
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            flower.style.left = '50%';
            flower.style.top = '50%';
            flower.style.setProperty('--tx', tx + 'px');
            flower.style.setProperty('--ty', ty + 'px');
            flower.style.animationDelay = (Math.random() * 0.6) + 's';
            flower.style.fontSize = (1.5 + Math.random() * 2.5) + 'rem';

            container.appendChild(flower);
        }

        // Second wave of flowers for density
        setTimeout(() => {
            const secondWave = 20;
            for (let i = 0; i < secondWave; i++) {
                const flower = document.createElement('div');
                flower.classList.add('flower-particle');
                flower.textContent = FLOWERS[Math.floor(Math.random() * FLOWERS.length)];

                const angle = Math.random() * Math.PI * 2;
                const distance = (maxDist * 0.2) + Math.random() * (maxDist * 0.5);
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;

                flower.style.left = '50%';
                flower.style.top = '50%';
                flower.style.setProperty('--tx', tx + 'px');
                flower.style.setProperty('--ty', ty + 'px');
                flower.style.animationDelay = (Math.random() * 0.3) + 's';
                flower.style.fontSize = (1 + Math.random() * 2) + 'rem';

                container.appendChild(flower);
            }
        }, 400);

        // After flower burst, create dandelions
        setTimeout(() => {
            createDandelions(container);
        }, 1400);
    }

    /**
     * Create floating dandelion particles (full-screen drift)
     */
    function createDandelions(container) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const count = 30;

        for (let i = 0; i < count; i++) {
            const dandelion = document.createElement('div');
            dandelion.classList.add('dandelion-particle');
            dandelion.textContent = DANDELIONS[Math.floor(Math.random() * DANDELIONS.length)];

            // Start from spread-out positions across the screen
            dandelion.style.left = (10 + Math.random() * 80) + '%';
            dandelion.style.top = (20 + Math.random() * 60) + '%';

            // Random drift direction — mostly upward, wide horizontal spread
            const dx = (Math.random() - 0.5) * vw * 0.8;
            const dy = -(100 + Math.random() * vh * 0.6);
            const rot = (Math.random() * 720) + 'deg';

            dandelion.style.setProperty('--dx', dx + 'px');
            dandelion.style.setProperty('--dy', dy + 'px');
            dandelion.style.setProperty('--rot', rot);
            dandelion.style.animationDelay = (Math.random() * 1.5) + 's';
            dandelion.style.animationDuration = (4 + Math.random() * 3) + 's';
            dandelion.style.fontSize = (1 + Math.random() * 2) + 'rem';

            container.appendChild(dandelion);
        }
    }

    return {
        createSparkles,
        createFlowerBurst,
        createDandelions
    };
})();

