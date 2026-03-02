/* ─── Refs ─── */
const scrollProgress = document.getElementById("scrollProgress");
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const menuOverlay = document.getElementById("menuOverlay");
const contactForm = document.getElementById("contactForm");
const formSubmit = document.getElementById("formSubmit");
const toast = document.getElementById("toast");

/* ─── Scroll: progress bar + nav shrink + active link ─── */
function onScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  scrollProgress.style.width = progress + "%";

  if (scrollTop > 60) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  updateActiveLink();
}

function updateActiveLink() {
  const sections = document.querySelectorAll("section[id]");
  const anchors = document.querySelectorAll('.nav-links a[href^="#"]');
  let current = "";

  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 140) {
      current = section.getAttribute("id");
    }
  });

  anchors.forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === "#" + current);
  });
}

window.addEventListener("scroll", onScroll, { passive: true });

/* ─── Mobile menu ─── */
function openMenu() {
  navLinks.classList.add("open");
  menuOverlay.classList.add("active");
  hamburger.classList.add("open");
  hamburger.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  navLinks.classList.remove("open");
  menuOverlay.classList.remove("active");
  hamburger.classList.remove("open");
  hamburger.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

hamburger.addEventListener("click", () => {
  navLinks.classList.contains("open") ? closeMenu() : openMenu();
});

menuOverlay.addEventListener("click", closeMenu);

navLinks.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navLinks.classList.contains("open")) closeMenu();
});

/* ─── Scroll reveal ─── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const delay = parseFloat(entry.target.dataset.delay || 0) * 0.15;
      entry.target.style.transitionDelay = delay + "s";
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -48px 0px" },
);

document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));

/* ─── Counter animation ─── */
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const duration = 1800;
  const start = performance.now();

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(easeOutCubic(progress) * target);
    el.textContent = prefix + value + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.6 },
);

document.querySelectorAll(".stat-num[data-count]").forEach((el) => {
  counterObserver.observe(el);
});

/* ─── Form submit ─── */
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("show"), 4000);
}

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = contactForm.querySelector("#nome").value.trim();
  const email = contactForm.querySelector("#email").value.trim();

  if (!nome || !email) {
    showToast("Por favor, preencha nome e e-mail.");
    return;
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    showToast("Por favor, insira um e-mail válido.");
    return;
  }

  const original = formSubmit.textContent;
  formSubmit.textContent = "Enviando...";
  formSubmit.disabled = true;

  setTimeout(() => {
    contactForm.reset();
    formSubmit.textContent = original;
    formSubmit.disabled = false;
    showToast("Mensagem enviada! Entraremos em contato em breve.");
  }, 900);
});
