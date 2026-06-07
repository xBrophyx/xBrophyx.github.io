(function () {
  "use strict";

  var nav = document.querySelector(".nav");
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));

  /* ---------- Mobile nav toggle ---------- */
  function closeMenu() {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    links.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Solid nav background after scroll ---------- */
  function onScroll() {
    if (window.scrollY > 12) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Active link highlight on scroll ---------- */
  var sections = ["about", "education", "work"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  var linkById = {};
  links.forEach(function (link) {
    var id = link.getAttribute("href").replace("#", "");
    linkById[id] = link;
  });

  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            links.forEach(function (l) { l.classList.remove("is-active"); });
            var active = linkById[entry.target.id];
            if (active) active.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Fade-in reveal on scroll ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Custom cursor (dot + trailing ring) ---------- */
  /* Only on fine-pointer (mouse) devices. Touch/coarse devices keep the
     normal cursor untouched. Reduced-motion: ring tracks instantly. */
  (function initCursor() {
    var finePointer = window.matchMedia("(pointer: fine)");
    if (!finePointer.matches) return;

    var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var dot = document.createElement("div");
    dot.className = "cursor-dot";
    dot.setAttribute("aria-hidden", "true");

    var ring = document.createElement("div");
    ring.className = "cursor-ring";
    ring.setAttribute("aria-hidden", "true");

    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.documentElement.classList.add("custom-cursor-enabled");

    var INTERACTIVE = "a, button, .nav__link, .nav__social-link, .card, [role=\"button\"], input, summary";

    var mouseX = 0, mouseY = 0;
    var ringX = 0, ringY = 0;
    var shown = false;
    var EASE = 0.18;

    function showCursor() {
      if (shown) return;
      shown = true;
      dot.classList.add("is-visible");
      ring.classList.add("is-visible");
    }

    window.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = "translate3d(" + mouseX + "px," + mouseY + "px,0)";
      if (prefersReduced) {
        ringX = mouseX;
        ringY = mouseY;
        ring.style.transform = "translate3d(" + ringX + "px," + ringY + "px,0)";
      }
      showCursor();
    }, { passive: true });

    /* hide when the pointer leaves the window, restore on return */
    document.addEventListener("mouseleave", function () {
      dot.classList.remove("is-visible");
      ring.classList.remove("is-visible");
      shown = false;
    });
    document.addEventListener("mouseenter", function () {
      showCursor();
    });

    /* hover state on interactive elements */
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest && e.target.closest(INTERACTIVE)) {
        ring.classList.add("is-hover");
      }
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest && e.target.closest(INTERACTIVE)) {
        var to = e.relatedTarget;
        if (!to || !to.closest || !to.closest(INTERACTIVE)) {
          ring.classList.remove("is-hover");
        }
      }
    });

    /* press feedback */
    document.addEventListener("mousedown", function () {
      dot.classList.add("is-down");
      ring.classList.add("is-down");
    });
    document.addEventListener("mouseup", function () {
      dot.classList.remove("is-down");
      ring.classList.remove("is-down");
    });

    if (!prefersReduced) {
      (function raf() {
        ringX += (mouseX - ringX) * EASE;
        ringY += (mouseY - ringY) * EASE;
        ring.style.transform = "translate3d(" + ringX + "px," + ringY + "px,0)";
        window.requestAnimationFrame(raf);
      })();
    }
  })();

  /* ---------- Background music (local mp3, looping, no UI) ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var audio = document.getElementById("bg-music");
    if (!audio) return;

    audio.volume = 0.45;
    audio.loop = true;

    var GESTURES = ["pointerdown", "keydown", "touchstart", "scroll"];

    function onFirstGesture() {
      audio.play().catch(function () {});
      GESTURES.forEach(function (evt) {
        document.removeEventListener(evt, onFirstGesture);
      });
    }

    function armGestureFallback() {
      GESTURES.forEach(function (evt) {
        document.addEventListener(evt, onFirstGesture, { once: true, passive: true });
      });
    }

    var attempt = audio.play();
    if (attempt && typeof attempt.then === "function") {
      attempt.catch(function () {
        // Autoplay blocked; resume on first user interaction.
        armGestureFallback();
      });
    }
  });
})();
