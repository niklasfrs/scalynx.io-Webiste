const details = document.querySelectorAll("details");

details.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    details.forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

const topbar = document.querySelector(".topbar");
window.addEventListener("scroll", () => {
  topbar.style.background = window.scrollY > 28 ? "rgba(5, 18, 29, 0.85)" : "rgba(5, 18, 29, 0.7)";
});
