/* ============================================================
 * REVION℞ v2 — homepage interactions
 *   1. Sticky header scrolled state
 *   2. Hero image carousel (auto-rotate + dots)
 *   3. Mid-page video band sequencer
 * ============================================================ */
(function () {
  "use strict";


  /* ------------------------------------------------------------
   * Sticky header — toggle scrolled state for backdrop blur
   * ------------------------------------------------------------ */
  const header = document.querySelector("[data-header]");
  if (header) {
    const THRESHOLD = 24;
    const updateHeader = () => {
      header.classList.toggle("is-scrolled", window.scrollY > THRESHOLD);
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }


  /* ------------------------------------------------------------
   * Hero carousel — auto-rotate + dot navigation
   * ------------------------------------------------------------ */
  const heroTrack = document.querySelector('[data-carousel="hero"]');
  const heroDots = document.querySelectorAll('[data-carousel-dots="hero"] .rev-hero__dot');

  if (heroTrack && heroDots.length) {
    const slides = heroTrack.querySelectorAll(".rev-hero__slide");
    const total = slides.length;
    let current = 0;
    let autoTimer = null;
    const INTERVAL_MS = 5500;

    const goTo = (i) => {
      current = (i + total) % total;
      const slideWidth = slides[0].getBoundingClientRect().width;
      heroTrack.scrollTo({ left: slideWidth * current, behavior: "smooth" });
      heroDots.forEach((dot, idx) => {
        dot.classList.toggle("is-active", idx === current);
      });
    };

    const next = () => goTo(current + 1);
    const startAuto = () => { stopAuto(); autoTimer = setInterval(next, INTERVAL_MS); };
    const stopAuto = () => { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } };

    let scrollDebounce = null;
    heroTrack.addEventListener("scroll", () => {
      if (scrollDebounce) clearTimeout(scrollDebounce);
      scrollDebounce = setTimeout(() => {
        const slideWidth = slides[0].getBoundingClientRect().width;
        if (slideWidth === 0) return;
        const idx = Math.round(heroTrack.scrollLeft / slideWidth);
        if (idx !== current) {
          current = idx;
          heroDots.forEach((dot, i) => dot.classList.toggle("is-active", i === current));
        }
      }, 80);
    }, { passive: true });

    heroDots.forEach((dot, i) => {
      dot.addEventListener("click", () => { goTo(i); startAuto(); });
    });

    heroTrack.addEventListener("mouseenter", stopAuto);
    heroTrack.addEventListener("mouseleave", startAuto);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReduced) startAuto();
  }


  /* Video band uses native loop attribute — no JS sequencer needed */

})();
