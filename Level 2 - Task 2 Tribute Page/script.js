AOS.init({
    duration: 800,
    once: true,
});

const heroText = document.querySelector('.hero-text');
const heroOverlay = document.querySelector('.hero-overlay');
const fadeOutDistance = 800;

window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;

    if (scrollPosition < fadeOutDistance) {
        // Fade OUT the text (opacity goes from 1 to 0)
        const textOpacity = 1 - (scrollPosition / fadeOutDistance);
        
        // Fade IN the overlay (opacity goes from 0 to 1)
        const overlayOpacity = scrollPosition / fadeOutDistance;

        heroText.style.opacity = textOpacity;
        heroOverlay.style.opacity = overlayOpacity;

    } else {
        // If scrolled past the fade distance...
        heroText.style.opacity = 0;
        heroOverlay.style.opacity = 1;
    }
});