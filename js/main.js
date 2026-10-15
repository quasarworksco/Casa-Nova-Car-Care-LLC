/* =========================================================
   Casa Nova Car Care LLC — interacciones y animaciones
   ========================================================= */

// Datos de contacto: cambiar aquí y se actualizan en todo el sitio
const CONFIG = {
  phone: "+19139672528",          // formato internacional, solo dígitos con "+"
  phoneDisplay: "+1 (913) 967-2528",
  whatsapp: "19139672528",        // solo dígitos, con código de país
  email: "info@ejemplo.com",
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- Carga inicial ---------- */
document.body.classList.add("is-loading");
function onReady() {
  document.getElementById("loader").classList.add("is-hidden");
  document.body.classList.remove("is-loading");
  document.body.classList.add("is-ready");
  heroCounters();
}
// Se oculta el loader al cargar, o a más tardar en 2.5 s
let readyDone = false;
function readyOnce() { if (!readyDone) { readyDone = true; onReady(); } }
window.addEventListener("load", () => setTimeout(readyOnce, 400));
setTimeout(readyOnce, 2500);

/* ---------- Enlaces de contacto ---------- */
const waLink = (text) =>
  `https://wa.me/${CONFIG.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

document.querySelectorAll(".js-whatsapp").forEach((a) => {
  a.href = waLink("Hola, quiero información sobre sus servicios.");
  a.target = "_blank";
  a.rel = "noopener";
});
document.querySelectorAll(".js-phone").forEach((a) => (a.href = `tel:${CONFIG.phone}`));
document.querySelectorAll(".js-phone-text").forEach((a) => (a.textContent = CONFIG.phoneDisplay));
document.querySelectorAll(".js-email").forEach((a) => {
  a.href = `mailto:${CONFIG.email}`;
  a.textContent = CONFIG.email;
});
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Header: fondo al bajar, se oculta al hacer scroll hacia abajo ---------- */
const header = document.getElementById("header");
const toTop = document.getElementById("to-top");
let lastY = window.scrollY;

function onScroll() {
  const y = window.scrollY;
  header.classList.toggle("is-scrolled", y > 40);
  header.classList.toggle("is-hidden", y > lastY && y > 400 && !menu.classList.contains("is-open"));
  toTop.classList.toggle("is-visible", y > 700);
  lastY = y;
}
window.addEventListener("scroll", onScroll, { passive: true });

/* ---------- Menú móvil ---------- */
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");

function setMenu(open) {
  menu.classList.toggle("is-open", open);
  burger.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  document.body.style.overflow = open ? "hidden" : "";
}
burger.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

/* ---------- Enlace activo según la sección visible ---------- */
const navLinks = [...menu.querySelectorAll("a:not(.btn)")];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${entry.target.id}`));
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
document.querySelectorAll("main section[id]").forEach((s) => sectionObserver.observe(s));

/* ---------- Aparición al hacer scroll ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      entry.target.querySelectorAll("[data-count]").forEach(countUp);
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
);
document.querySelectorAll(".reveal, #steps").forEach((el) => revealObserver.observe(el));

/* ---------- Contadores ---------- */
function countUp(el) {
  if (el.dataset.done) return;
  el.dataset.done = "1";
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  if (reduceMotion) { el.textContent = target.toLocaleString("es") + suffix; return; }
  const duration = 2000;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(target * eased).toLocaleString("es") + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
function heroCounters() {
  setTimeout(() => document.querySelectorAll(".stats [data-count]").forEach(countUp), 900);
}

/* ---------- Tarjetas: inclinación 3D y brillo que sigue al cursor ---------- */
if (finePointer && !reduceMotion) {
  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", `${x * 100}%`);
      card.style.setProperty("--my", `${y * 100}%`);
      card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 8}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => (card.style.transform = ""));
  });

  /* Botones magnéticos */
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener("mouseleave", () => (btn.style.transform = ""));
  });

  /* Parallax suave de los engranes del hero */
  const gears = document.querySelectorAll(".hero .gear");
  const hero = document.querySelector(".hero");
  hero.addEventListener("mousemove", (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    gears.forEach((g, i) => {
      const depth = (i + 1) * 14;
      g.style.translate = `${x * depth}px ${y * depth}px`;
    });
  });
}

/* ---------- Carrusel de testimonios ---------- */
(function slider() {
  const root = document.getElementById("slider");
  const slides = [...root.querySelectorAll(".slide")];
  const dotsWrap = root.querySelector(".slider-dots");
  let index = 0;
  let timer;

  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", `Testimonio ${i + 1}`);
    b.addEventListener("click", () => { go(i); restart(); });
    dotsWrap.appendChild(b);
    return b;
  });

  function go(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle("is-active", n === index));
    dots.forEach((d, n) => {
      d.classList.toggle("is-active", n === index);
      d.setAttribute("aria-selected", String(n === index));
    });
  }
  function restart() {
    clearInterval(timer);
    if (!reduceMotion) timer = setInterval(() => go(index + 1), 5500);
  }

  // Deslizar con el dedo en móvil
  let startX = null;
  root.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
  root.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { go(index + (dx < 0 ? 1 : -1)); restart(); }
    startX = null;
  });
  root.addEventListener("mouseenter", () => clearInterval(timer));
  root.addEventListener("mouseleave", restart);

  go(0);
  restart();
})();

/* ---------- Formulario: arma el mensaje y lo abre en WhatsApp ---------- */
const form = document.getElementById("contact-form");
const note = document.getElementById("form-note");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;
  form.querySelectorAll("[required]").forEach((input) => {
    const field = input.closest(".field");
    const ok = input.value.trim() !== "";
    field.classList.toggle("has-error", !ok);
    if (!ok) valid = false;
  });
  if (!valid) {
    note.textContent = "Por favor completa los campos marcados.";
    note.style.color = "#ff6b6b";
    return;
  }

  const d = Object.fromEntries(new FormData(form));
  const msg = [
    "Hola, quiero agendar una cita.",
    `Nombre: ${d.nombre}`,
    `Teléfono: ${d.telefono}`,
    d.vehiculo && `Vehículo: ${d.vehiculo}`,
    `Servicio: ${d.servicio}`,
    d.mensaje && `Detalle: ${d.mensaje}`,
  ].filter(Boolean).join("\n");

  window.open(waLink(msg), "_blank", "noopener");
  note.textContent = "¡Listo! Te abrimos WhatsApp para enviar tu solicitud.";
  note.style.color = "";
  form.reset();
});

form.querySelectorAll("input, select, textarea").forEach((el) =>
  el.addEventListener("input", () => el.closest(".field").classList.remove("has-error"))
);
