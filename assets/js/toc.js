(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var article = document.getElementById("post-content");
    var sidebar = document.getElementById("toc-sidebar");
    var nav = document.getElementById("toc-nav");
    if (!article || !sidebar || !nav) return;

    var headings = Array.prototype.slice
      .call(article.querySelectorAll("h1, h2, h3"))
      .filter(function (heading) {
        return !!heading.id;
      });

    if (headings.length < 2) {
      sidebar.style.display = "none";
      document.body.classList.remove("has-toc");
      return;
    }

    var list = document.createElement("ul");
    var links = [];

    headings.forEach(function (heading) {
      var item = document.createElement("li");
      item.className = "toc-item toc-" + heading.tagName.toLowerCase();

      var link = document.createElement("a");
      link.href = "#" + heading.id;
      link.textContent = heading.textContent;

      item.appendChild(link);
      list.appendChild(item);
      links.push({ link: link, heading: heading });
    });

    nav.appendChild(list);

    var ticking = false;

    function setActive() {
      var scrollPos = window.scrollY + 120;
      var current = null;

      links.forEach(function (entry) {
        if (entry.heading.offsetTop <= scrollPos) {
          current = entry;
        }
      });

      links.forEach(function (entry) {
        entry.link.classList.toggle("active", entry === current);
      });

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(setActive);
        ticking = true;
      }
    }

    document.addEventListener("scroll", onScroll, { passive: true });
    setActive();
  });
})();
