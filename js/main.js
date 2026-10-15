/* =========================================================
   Casanova Car Care LLC — interacciones y animaciones
   ========================================================= */

// Datos de contacto: cambiar aquí y se actualizan en todo el sitio
const CONFIG = {
  phone: "+19139672528",          // formato internacional, solo dígitos con "+"
  phoneDisplay: "+1 (913) 967-2528",
  whatsapp: "19139672528",        // solo dígitos, con código de país
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- Carga inicial ---------- */
document.body.classList.add("is-loading");
let readyDone = false;
function onReady() {
  if (readyDone) return;
  readyDone = true;
  document.getElementById("loader").classList.add("is-hidden");
  document.body.classList.remove("is-loading");
  document.body.classList.add("is-ready");
}
// Se oculta el loader al cargar, o a más tardar en 2.5 s
window.addEventListener("load", () => setTimeout(onReady, 500));
setTimeout(onReady, 2500);

/* ---------- Enlaces de contacto ---------- */
const waLink = (text) =>
  `https://wa.me/${CONFIG.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

function openWhatsApp(a, text) {
  a.href = waLink(text);
  a.target = "_blank";
  a.rel = "noopener";
}
document.querySelectorAll(".js-whatsapp").forEach((a) =>
  openWhatsApp(a, "Hola, quiero información sobre sus servicios.")
);
document.querySelectorAll(".js-service").forEach((a) =>
  openWhatsApp(a, `Hola, quiero cotizar un servicio de: ${a.dataset.service}.`)
);
document.querySelectorAll(".js-phone").forEach((a) => (a.href = `tel:${CONFIG.phone}`));
document.querySelectorAll(".js-phone-text").forEach((el) => (el.textContent = CONFIG.phoneDisplay));
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Header, barra de progreso y botón "arriba" ---------- */
const header = document.getElementById("header");
const toTop = document.getElementById("to-top");
const progress = document.getElementById("progress");
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
let lastY = window.scrollY;
let ticking = false;

function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.setProperty("--p", max > 0 ? y / max : 0);
  header.classList.toggle("is-scrolled", y > 40);
  header.classList.toggle("is-hidden", y > lastY && y > 500 && !menu.classList.contains("is-open"));
  toTop.classList.toggle("is-visible", y > 700);
  lastY = y;
  ticking = false;
}
window.addEventListener("scroll", () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
onScroll();

/* ---------- Menú móvil ---------- */
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
const navLinks = [...menu.querySelectorAll('a[href^="#"]:not(.btn)')];
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
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
);
document.querySelectorAll(".reveal, #steps").forEach((el) => revealObserver.observe(el));

/* ---------- Marcas del tacómetro ---------- */
(function gaugeTicks() {
  const g = document.getElementById("gauge-ticks");
  const ns = "http://www.w3.org/2000/svg";
  const total = 40;
  for (let i = 0; i <= total; i++) {
    const angle = (135 + (270 * i) / total) * (Math.PI / 180);
    const major = i % 5 === 0;
    const r1 = major ? 60 : 64;
    const r2 = 70;
    const line = document.createElementNS(ns, "line");
    line.setAttribute("x1", 100 + r1 * Math.cos(angle));
    line.setAttribute("y1", 100 + r1 * Math.sin(angle));
    line.setAttribute("x2", 100 + r2 * Math.cos(angle));
    line.setAttribute("y2", 100 + r2 * Math.sin(angle));
    if (major) line.classList.add("major");
    if (i >= total * 0.8) line.classList.add("hot");
    g.appendChild(line);
  }
})();

/* ---------- Efectos con el mouse (solo escritorio) ---------- */
if (finePointer && !reduceMotion) {
  // Tarjetas: inclinación 3D y brillo que sigue al cursor
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

  // Botones magnéticos
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener("mouseleave", () => (btn.style.transform = ""));
  });

  // El logo del hero se inclina siguiendo el cursor
  const hero = document.querySelector(".hero");
  const stage = document.getElementById("logo-stage");
  hero.addEventListener("mousemove", (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    stage.style.transform = `perspective(1000px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
  });
  hero.addEventListener("mouseleave", () => (stage.style.transform = ""));
}

/* ---------- Formulario: arma el mensaje y lo abre en WhatsApp ---------- */
const form = document.getElementById("contact-form");
const note = document.getElementById("form-note");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;
  form.querySelectorAll("[required]").forEach((input) => {
    const ok = input.value.trim() !== "";
    input.closest(".field").classList.toggle("has-error", !ok);
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
