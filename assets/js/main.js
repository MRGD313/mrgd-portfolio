/* ============================================================================
   منطق نمایش وب‌سایت — دکتر محمدرضا گنج‌دانش
   این فایل فقط «چگونه نمایش دادن» را مدیریت می‌کند؛
   «چه چیزی نمایش داده شود» در assets/js/content.js است.
   ========================================================================== */
(function () {
  "use strict";

  var C = window.SITE_CONTENT || {};
  var mount = document.getElementById("sections");
  if (!mount) return;

  /* ---------- ابزارهای کمکی ---------- */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function has(v) {
    return Array.isArray(v) ? v.length > 0 : !!v;
  }

  function faLink(href, text, className, external) {
    var a = el("a", className, text);
    a.href = href;
    if (external !== false && /^https?:/i.test(href)) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    return a;
  }

  /* ---------- ساخت سرصفحهٔ هر بخش (شماره + عنوان + خط) ---------- */

  var sectionOrder = [
    ["about", "درباره من", "about"],
    ["experience", "تجربه‌های حرفه‌ای", "experience"],
    ["education", "تحصیلات", "education"],
    ["certifications", "گواهی‌نامه‌ها و دوره‌ها", "certifications"],
    ["honors", "افتخارات و جوایز", "honors"],
    ["research", "مقالات", "research"],
    ["expertise", "تخصص‌ها و حوزه‌های فعالیت", "expertise"],
    ["projects", "پروژه‌ها و فعالیت‌های منتخب", "projects"],
    ["skills", "مهارت‌ها", "skills"],
    ["contact", "ارتباط با من", "contact"]
  ];

  var faDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  function toFa(n) {
    return String(n).split("").map(function (d) {
      return faDigits[+d] || d;
    }).join("");
  }

  function sectionHead(num, title) {
    var head = el("header", "sec-head");
    head.appendChild(el("span", "sec-num", toFa(num)));
    var h2 = el("h2", "sec-title", title);
    head.appendChild(h2);
    return head;
  }

  /* ---------- سازنده‌های هر بخش ---------- */

  var builders = {

    about: function (data) {
      var wrap = el("div", "about-body");
      data.paragraphs.forEach(function (p) {
        wrap.appendChild(el("p", "lead", p));
      });
      return wrap;
    },

    expertise: function (data) {
      var list = el("ul", "pill-list");
      data.items.forEach(function (item) {
        list.appendChild(el("li", "pill", item));
      });
      return list;
    },

    experience: function (data) {
      var wrap = el("div", "timeline");
      data.entries.forEach(function (e) {
        var item = el("article", "timeline-item");
        var headRow = el("div", "item-head");
        headRow.appendChild(el("h3", "item-title", e.role));
        if (has(e.period)) headRow.appendChild(el("span", "chip", e.period));
        if (has(e.type)) headRow.appendChild(el("span", "chip chip-soft", e.type));
        item.appendChild(headRow);
        if (has(e.org)) {
          var orgLine = el("p", "item-org");
          orgLine.appendChild(el("span", "org-name", e.org));
          if (has(e.location)) orgLine.appendChild(el("span", "org-loc", e.location));
          item.appendChild(orgLine);
        }
        if (has(e.summary)) item.appendChild(el("p", "item-summary", e.summary));
        if (has(e.points)) {
          var ul = el("ul", "points");
          e.points.forEach(function (pt) { ul.appendChild(el("li", null, pt)); });
          item.appendChild(ul);
        }
        wrap.appendChild(item);
      });
      return wrap;
    },

    education: function (data) {
      var wrap = el("div", "cards-rows");
      data.entries.forEach(function (e) {
        var card = el("article", "row-card");
        var headRow = el("div", "item-head");
        var title = e.degree + (e.field ? " — " + e.field : "");
        headRow.appendChild(el("h3", "item-title", title));
        if (has(e.period)) headRow.appendChild(el("span", "chip", e.period));
        card.appendChild(headRow);
        if (has(e.institution)) card.appendChild(el("p", "item-org", e.institution));
        if (has(e.note)) card.appendChild(el("p", "item-summary", e.note));
        wrap.appendChild(card);
      });
      return wrap;
    },

    honors: function (data) {
      var wrap = el("ul", "honor-list");
      data.entries.forEach(function (e) {
        var li = el("li", "honor-item");
        var headRow = el("div", "item-head");
        headRow.appendChild(el("h3", "item-title", e.title));
        if (has(e.year)) headRow.appendChild(el("span", "chip", e.year));
        li.appendChild(headRow);
        if (has(e.giver)) li.appendChild(el("p", "item-org", e.giver));
        if (has(e.note)) li.appendChild(el("p", "item-summary", e.note));
        wrap.appendChild(li);
      });
      return wrap;
    },

    certifications: function (data) {
      return builders.honors(data);
    },

    projects: function (data) {
      var wrap = el("div", "cards-grid");
      data.entries.forEach(function (e) {
        var card = el("article", "project-card");
        if (has(e.url)) {
          var h3 = el("h3", null);
          h3.appendChild(faLink(e.url, e.title, "project-link"));
          card.appendChild(h3);
        } else {
          card.appendChild(el("h3", null, e.title));
        }
        if (has(e.role)) card.appendChild(el("p", "item-org", e.role));
        if (has(e.description)) card.appendChild(el("p", "item-summary", e.description));
        if (has(e.tags)) {
          var tags = el("ul", "pill-list pill-list--sm");
          e.tags.forEach(function (t) { tags.appendChild(el("li", "pill pill--sm", t)); });
          card.appendChild(tags);
        }
        wrap.appendChild(card);
      });
      return wrap;
    },

    research: function (data) {
      var wrap = el("ul", "honor-list");
      data.entries.forEach(function (e) {
        var li = el("li", "honor-item");
        var headRow = el("div", "item-head");
        if (has(e.url)) {
          var h3 = el("h3", "item-title");
          h3.appendChild(faLink(e.url, e.title));
          headRow.appendChild(h3);
        } else {
          headRow.appendChild(el("h3", "item-title", e.title));
        }
        li.appendChild(headRow);
        if (has(e.detail)) li.appendChild(el("p", "item-summary", e.detail));
        wrap.appendChild(li);
      });
      return wrap;
    },

    skills: function (data) {
      var wrap = el("div", "skill-groups");
      data.groups.forEach(function (g) {
        var group = el("div", "skill-group");
        if (has(g.title)) group.appendChild(el("h3", "skill-group-title", g.title));
        var list = el("ul", "pill-list");
        (g.items || []).forEach(function (item) {
          list.appendChild(el("li", "pill", item));
        });
        group.appendChild(list);
        wrap.appendChild(group);
      });
      return wrap;
    },

    contact: function (data) {
      var wrap = el("div", "contact-body");
      if (has(data.note)) wrap.appendChild(el("p", "lead", data.note));
      if (has(data.links)) {
        var list = el("ul", "contact-links");
        data.links.forEach(function (l) {
          if (!l || !l.url) return;
          var li = el("li");
          var label = l.handle ? l.label + " — " + l.handle : l.label;
          li.appendChild(faLink(l.url, label, "btn btn-primary"));
          list.appendChild(li);
        });
        wrap.appendChild(list);
      }
      return wrap;
    }
  };

  /* ---------- رندر بخش‌ها (بخش خالی نمایش داده نمی‌شود) ---------- */

  var renderedSections = [];

  /* ---------- شماره‌گذاری پیوستهٔ بخش‌های رندرشده ---------- */

  var visibleIndex = 0;

  sectionOrder.forEach(function (def) {
    var key = def[0], title = def[1], id = def[2];
    var data = C[key];
    if (!data) return;

    var isEmpty =
      (Array.isArray(data.entries) && data.entries.length === 0) ||
      (Array.isArray(data.items) && data.items.length === 0) ||
      (Array.isArray(data.groups) && data.groups.length === 0) ||
      (Array.isArray(data.paragraphs) && data.paragraphs.length === 0) ||
      (key === "contact" && !(data.note || has(data.links)));

    if (isEmpty) return;
    visibleIndex++;

    var section = el("section", "section", null);
    section.id = id;
    section.setAttribute("aria-labelledby", id + "-title");
    var head = sectionHead(visibleIndex, title);
    head.querySelector(".sec-title").id = id + "-title";
    section.appendChild(head);
    section.appendChild(builders[key](data));
    mount.appendChild(section);
    renderedSections.push({ id: id, title: title });
  });

  /* ---------- ناوبری بر اساس بخش‌های موجود ---------- */

  var navList = document.getElementById("nav-list");
  if (navList) {
    renderedSections.forEach(function (s) {
      var li = el("li", "nav-item");
      var a = el("a", "nav-link", s.title);
      a.href = "#" + s.id;
      a.setAttribute("data-target", s.id);
      li.appendChild(a);
      navList.appendChild(li);
    });
    var heroLink = el("a", "nav-link nav-link--home", "خانه");
    heroLink.href = "#top";
    var first = el("li", "nav-item");
    first.appendChild(heroLink);
    navList.insertBefore(first, navList.firstChild);
  }

  /* ---------- منوی موبایل ---------- */

  var navToggle = document.getElementById("nav-toggle");
  var siteNav = document.getElementById("site-nav");
  function closeNav() {
    if (!siteNav) return;
    siteNav.classList.remove("is-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.classList.remove("is-active");
    }
  }
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var open = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.classList.toggle("is-active", open);
    });
    navList.addEventListener("click", function (e) {
      if (e.target && e.target.tagName === "A") closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---------- هایلایت لینک فعال در ناوبری ---------- */

  if ("IntersectionObserver" in window && renderedSections.length) {
    var links = {};
    document.querySelectorAll(".nav-link[data-target]").forEach(function (a) {
      links[a.getAttribute("data-target")] = a;
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = links[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          document.querySelectorAll(".nav-link.is-active").forEach(function (a) {
            a.classList.remove("is-active");
          });
          link.classList.add("is-active");
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    renderedSections.forEach(function (s) {
      var sec = document.getElementById(s.id);
      if (sec) observer.observe(sec);
    });
  }

  /* ---------- سال جاری و یادداشت فوتر ---------- */

  var yearNode = document.getElementById("footer-year");
  if (yearNode) {
    yearNode.textContent = toFa(new Date().getFullYear());
  }

  var footerNote = document.getElementById("footer-note");
  if (footerNote) {
    if (C.footer && C.footer.note) {
      footerNote.textContent = C.footer.note;
    } else {
      footerNote.hidden = true;
    }
  }

  /* ---------- عناصر خالیِ بخش ابتدایی مخفی شوند ---------- */

  [".hero-title", ".hero-tagline"].forEach(function (sel) {
    var node = document.querySelector(sel);
    if (node && !node.textContent.trim()) node.hidden = true;
  });
})();
