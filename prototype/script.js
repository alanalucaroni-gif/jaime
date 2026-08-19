/* =========================================================
   EMBER BURGER CO. — Interações (JavaScript puro, sem libs)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initHeaderScroll();
  initMobileNav();
  initScrollReveal();
  initStatsCounter();
  initMenuFilter();
  initBackToTop();
  document.getElementById("year").textContent = new Date().getFullYear();
});

/* ---------- Header muda de estilo ao rolar ---------- */
function initHeaderScroll() {
  const header = document.getElementById("header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Menu mobile (hambúrguer) ---------- */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-active", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // Fecha o menu ao clicar em qualquer link
  nav.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-active");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });
}

/* ---------- Animação de entrada ao rolar (IntersectionObserver) ---------- */
function initScrollReveal() {
  // Marca os elementos que devem animar ao entrar na viewport
  const targets = document.querySelectorAll(
    ".about__content, .about__media, .section-head, .menu-card, .gallery__item, .testimonial, .location__content, .location__map"
  );

  targets.forEach((el, index) => {
    el.classList.add("reveal");
    // Pequeno atraso escalonado para elementos dentro de uma mesma grade
    el.classList.add(`reveal-delay-${(index % 3) + 1}`);
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ---------- Contador animado nas estatísticas do hero ---------- */
function initStatsCounter() {
  const stats = document.querySelectorAll(".hero__stats strong");

  const animateCount = (el) => {
    const raw = el.textContent.trim();
    const match = raw.match(/[\d.]+/);
    if (!match) return; // valores não numéricos (ex: "4.9") ficam como estão

    const target = parseInt(match[0], 10);
    const suffix = raw.replace(match[0], "");
    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  stats.forEach((el) => observer.observe(el));
}

/* ---------- Filtro de categorias do cardápio ---------- */
function initMenuFilter() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".menu-card");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      const filter = btn.dataset.filter;

      cards.forEach((card) => {
        const matches = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !matches);
        if (matches) {
          // Reinicia a animação de entrada a cada filtragem
          card.classList.remove("is-entering");
          void card.offsetWidth; // força reflow para reiniciar a animação
          card.classList.add("is-entering");
        }
      });
    });
  });
}

/* ---------- Botão flutuante de voltar ao topo ---------- */
function initBackToTop() {
  const btn = document.getElementById("backToTop");

  window.addEventListener(
    "scroll",
    () => btn.classList.toggle("is-visible", window.scrollY > 480),
    { passive: true }
  );

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
