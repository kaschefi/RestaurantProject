window.addEventListener("scroll", function () {
  const nav = document.querySelector(".nav");
  if (window.scrollY > 100) {
    nav.style.width = "60%";
    nav.style.left = "60%";
    nav.style.transform = "translateX(-65%)";
    nav.style.top = "20px";
    nav.style.borderRadius = "50px";
  } else {
    nav.style.width = "100%";
    nav.style.left = "0";
    nav.style.transform = "none";
    nav.style.top = "0";
    nav.style.borderRadius = "0";
  }
});
