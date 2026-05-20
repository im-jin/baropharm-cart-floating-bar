/* ============================================================
 * VIVION rx — Home page interactions
 * Vanilla JS, no dependencies.
 *   1. Hero — 3-slide auto-rolling carousel + dot indicators
 * ============================================================ */

(function () {
  "use strict";

  const STORAGE = {
    NOTICE_DISMISSED: "vivion:notice-dismissed",      /* boolean — session only */
    PROMO_HIDE_UNTIL: "vivion:promo-hide-until",      /* ISO date string */
  };


  /* ------------------------------------------------------------
   * Top notice strip — close button
   * ------------------------------------------------------------ */
  const notice = document.querySelector("[data-notice]");
  const noticeClose = document.querySelector("[data-notice-close]");

  if (notice && noticeClose) {
    /* Hide on this session if previously dismissed */
    if (sessionStorage.getItem(STORAGE.NOTICE_DISMISSED) === "1") {
      notice.hidden = true;
      document.body.classList.add("notice-dismissed");
    }
    noticeClose.addEventListener("click", () => {
      notice.hidden = true;
      document.body.classList.add("notice-dismissed");
      sessionStorage.setItem(STORAGE.NOTICE_DISMISSED, "1");
    });
  }


  /* ------------------------------------------------------------
   * Promo popup — bottom-right
   *   - Close button: hide for this session only
   *   - "하루 동안 보지 않기": hide for 24h via localStorage
   * ------------------------------------------------------------ */
  const promo = document.querySelector("[data-promo]");
  const promoClose = document.querySelector("[data-promo-close]");
  const promoHideToday = document.querySelector("[data-promo-hide-today]");

  if (promo) {
    const hideUntilRaw = localStorage.getItem(STORAGE.PROMO_HIDE_UNTIL);
    const hideUntil = hideUntilRaw ? Date.parse(hideUntilRaw) : NaN;
    const isHidden = !isNaN(hideUntil) && Date.now() < hideUntil;

    if (!isHidden) {
      /* Defer one tick so the entrance animation runs */
      setTimeout(() => { promo.hidden = false; }, 600);
    }

    promoClose?.addEventListener("click", () => {
      promo.hidden = true;
    });

    promoHideToday?.addEventListener("click", () => {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      localStorage.setItem(STORAGE.PROMO_HIDE_UNTIL, tomorrow.toISOString());
      promo.hidden = true;
    });
  }


  /* ------------------------------------------------------------
   * Header — toggle transparent / solid state based on scroll
   * ------------------------------------------------------------ */
  const header = document.querySelector(".site-header");
  if (header) {
    const SCROLL_THRESHOLD = 50;
    const updateHeaderState = () => {
      header.classList.toggle("site-header--scrolled", window.scrollY > SCROLL_THRESHOLD);
    };
    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
  }


  /* ------------------------------------------------------------
   * Hero carousel — auto roll every 5s + dot navigation
   * ------------------------------------------------------------ */
  const heroTrack = document.querySelector('[data-carousel="hero"]');
  const heroDots = document.querySelectorAll('[data-carousel-indicators="hero"] .hero__dot');

  if (heroTrack && heroDots.length) {
    const slides = heroTrack.querySelectorAll(".hero__slide");
    const total = slides.length;
    let current = 0;
    let autoTimer = null;
    const INTERVAL_MS = 5000;

    const goTo = (i) => {
      current = (i + total) % total;
      const slideWidth = slides[0].getBoundingClientRect().width;
      heroTrack.scrollTo({ left: slideWidth * current, behavior: "smooth" });
      heroDots.forEach((dot, idx) => {
        dot.classList.toggle("is-active", idx === current);
      });
    };

    const next = () => goTo(current + 1);

    const startAuto = () => {
      stopAuto();
      autoTimer = setInterval(next, INTERVAL_MS);
    };

    const stopAuto = () => {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    };

    /* Sync dot state when user scroll-swipes manually */
    let scrollDebounce = null;
    heroTrack.addEventListener("scroll", () => {
      if (scrollDebounce) clearTimeout(scrollDebounce);
      scrollDebounce = setTimeout(() => {
        const slideWidth = slides[0].getBoundingClientRect().width;
        if (slideWidth === 0) return;
        const idx = Math.round(heroTrack.scrollLeft / slideWidth);
        if (idx !== current) {
          current = idx;
          heroDots.forEach((dot, i) => {
            dot.classList.toggle("is-active", i === current);
          });
        }
      }, 80);
    }, { passive: true });

    /* Dot click → jump + reset timer */
    heroDots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        goTo(i);
        startAuto();
      });
    });

    /* Pause on hover (desktop) */
    heroTrack.addEventListener("mouseenter", stopAuto);
    heroTrack.addEventListener("mouseleave", startAuto);

    /* Respect reduced motion */
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReduced) startAuto();
  }
})();
