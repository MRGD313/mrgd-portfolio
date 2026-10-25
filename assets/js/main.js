/* ============================================================================
   محمدرضا گنج دانش — drganjedanesh.ir
   منطق رابط کاربری: منوی موبایل، لینک فعال ناوبری، Fade-in هنگام اسکرول
   و جایگزین امن برای آیکون‌های تصویریِ هنوز آپلودنشده.
   ========================================================================== */
(function () {
  "use strict";

  var doc = document;
  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- ۱) فعال‌سازی انیمیشن‌ها فقط وقتی JS در دسترس است ---------- */

  // کلاس js روی <html> می‌نشیند تا در حالت بدون JS هیچ محتوایی مخفی نماند.
  doc.documentElement.classList.add("js");

  var fadeItems = Array.prototype.slice.call(doc.querySelectorAll(".fade-item"));

  function reveal(item) {
    item.classList.add("is-visible");
  }

  if (!reduceMotion && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          reveal(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });

    fadeItems.forEach(function (item) {
      revealObserver.observe(item);
    });

    // مواردی که همان ابتدا در viewport هستند بی‌درنگ نمایش داده شوند.
    window.addEventListener("load", function () {
      fadeItems.forEach(function (item) {
        var rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) reveal(item);
      });
    });

    // شبکهٔ اطمینان: اگر به هر دلیلی observer اجرا نشد، محتوا حتماً دیده شود.
    window.setTimeout(function () {
      fadeItems.forEach(reveal);
    }, 1800);
  } else {
    fadeItems.forEach(reveal);
  }

  /* ---------- ۲) منوی موبایل ---------- */

  var navToggle = doc.getElementById("nav-toggle");
  var siteNav = doc.getElementById("site-nav");

  function closeNav() {
    if (!siteNav || !navToggle) return;
    siteNav.classList.remove("is-open");
    navToggle.classList.remove("is-active");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = siteNav.classList.toggle("is-open");
      navToggle.classList.toggle("is-active", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    siteNav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });

    doc.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });

    // بستن منو با بزرگ‌شدن پنجره به حالت دسکتاپ
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) closeNav();
    });
  }

  /* ---------- ۳) هایلایت لینک فعال ناوبری ---------- */

  var navLinks = Array.prototype.slice.call(doc.querySelectorAll(".nav-link"));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href");
      return id && id.charAt(0) === "#" ? doc.querySelector(id) : null;
    })
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* ---------- ۴) فالبک آیکون‌های تصویری (بله / پذیرش۲۴) ---------- */

  // تا زمانی که فایل‌های تصویری روی مخزن آپلود نشوند، آیکون جایگزین SVG
  // نمایش داده می‌شود تا هرگز آیکون شکسته دیده نشود.
  var iconImages = Array.prototype.slice.call(doc.querySelectorAll(".icon-img"));

  iconImages.forEach(function (img) {
    function useFallback() {
      var shell = img.closest(".contact-icon");
      if (shell) shell.classList.add("has-fallback");
    }

    img.addEventListener("error", useFallback);

    // اگر خطا پیش از اتصال listener رخ داده باشد (کش/سرعت بالا)
    if (img.complete && img.naturalWidth === 0) useFallback();
  });

  /* ---------- ۵) بستن منو با کلیک بیرون ---------- */

  doc.addEventListener("click", function (event) {
    if (!siteNav || !siteNav.classList.contains("is-open")) return;
    if (siteNav.contains(event.target) || navToggle.contains(event.target)) return;
    closeNav();
  });
})();
