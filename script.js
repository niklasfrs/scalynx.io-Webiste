(function () {
  if (location.hostname === "www.scalynx.io") {
    location.replace("https://scalynx.io" + location.pathname + location.search + location.hash);
  }
})();

const topbar = document.querySelector(".topbar");
window.addEventListener("scroll", () => {
  if (!topbar) return;
  topbar.style.background = window.scrollY > 24 ? "rgba(8, 15, 24, 0.9)" : "rgba(8, 15, 24, 0.76)";
});

const revealItems = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window && revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("in"));
}

const details = document.querySelectorAll("details");
details.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    details.forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});
