/**
 * carousel.js — Auto-advancing cat meme carousel with swipe support
 */

const Carousel = (() => {
    let currentSlide = 0;
    let totalSlides = 0;
    let autoplayTimer = null;
    let touchStartX = 0;
    let touchEndX = 0;

    const AUTOPLAY_INTERVAL = 3500; // ms

    function init() {
        const track = document.getElementById('carousel-track');
        const slides = track.querySelectorAll('.carousel-slide');
        totalSlides = slides.length;

        // Create dots
        const dotsContainer = document.getElementById('carousel-dots');
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }

        // Navigation buttons
        document.getElementById('carousel-prev').addEventListener('click', prevSlide);
        document.getElementById('carousel-next').addEventListener('click', nextSlide);

        // Touch/swipe support
        const container = document.getElementById('carousel-container');
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay();
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoplay();
        }, { passive: true });

        // Start autoplay
        startAutoplay();
    }

    function goToSlide(index) {
        currentSlide = index;
        if (currentSlide >= totalSlides) currentSlide = 0;
        if (currentSlide < 0) currentSlide = totalSlides - 1;

        const track = document.getElementById('carousel-track');
        track.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Update dots
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    return { init, nextSlide, prevSlide, startAutoplay, stopAutoplay };
})();
