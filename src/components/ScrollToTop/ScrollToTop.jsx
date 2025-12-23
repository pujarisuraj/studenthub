import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop Component
 * Automatically scrolls to top of page when route changes
 * Uses smooth scroll behavior defined in global CSS
 */
export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Smooth scroll to top on route change
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, [pathname]);

    return null;
}
