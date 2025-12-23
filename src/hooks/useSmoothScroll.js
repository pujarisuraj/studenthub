import { useEffect } from 'react';

/**
 * Custom hook for smooth mouse wheel scrolling
 * Intercepts wheel events and applies smooth scrolling animation
 */
const useSmoothScroll = () => {
    useEffect(() => {
        let isScrolling = false;
        let targetScroll = window.scrollY;

        const smoothScrollTo = (target) => {
            const start = window.scrollY;
            const distance = target - start;
            const duration = 500; // Faster duration (was 800ms, now 500ms)
            let startTime = null;

            const easeInOutCubic = (t) => {
                return t < 0.5
                    ? 4 * t * t * t
                    : 1 - Math.pow(-2 * t + 2, 3) / 2;
            };

            const animation = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                const ease = easeInOutCubic(progress);

                window.scrollTo(0, start + distance * ease);

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                } else {
                    isScrolling = false;
                }
            };

            requestAnimationFrame(animation);
        };

        const handleWheel = (e) => {
            e.preventDefault();

            // Calculate scroll amount
            const delta = e.deltaY;
            const scrollAmount = delta * 2.5; // Faster scroll (was 1.5x, now 2.5x)

            targetScroll = Math.max(
                0,
                Math.min(
                    document.documentElement.scrollHeight - window.innerHeight,
                    targetScroll + scrollAmount
                )
            );

            if (!isScrolling) {
                isScrolling = true;
                smoothScrollTo(targetScroll);
            }
        };

        // Add passive: false to allow preventDefault
        window.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, []);
};

export default useSmoothScroll;
