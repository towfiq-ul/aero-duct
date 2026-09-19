import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Returns a scroll handler that:
 * - Navigates to "/" first if not already on the home page
 * - Then smoothly scrolls to the target element
 * - Accounts for the sticky navbar height (announcement bar + nav = ~92px)
 */
export function useScrollTo() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollTo = useCallback(
    (sectionId: string, e?: React.MouseEvent) => {
      e?.preventDefault();

      const OFFSET = 92; // announcement bar (32px) + nav (60px)

      const doScroll = () => {
        const el = document.getElementById(sectionId);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - OFFSET;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      };

      if (location.pathname !== "/") {
        // Navigate home, then scroll after the page has rendered
        navigate("/");
        // Use requestAnimationFrame + small timeout to wait for render
        const tryScroll = (attempts = 0) => {
          const el = document.getElementById(sectionId);
          if (el) {
            doScroll();
          } else if (attempts < 20) {
            setTimeout(() => tryScroll(attempts + 1), 50);
          }
        };
        setTimeout(() => tryScroll(), 100);
      } else {
        doScroll();
      }
    },
    [navigate, location.pathname]
  );

  return scrollTo;
}
