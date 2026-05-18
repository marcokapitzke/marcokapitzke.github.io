const header = document.querySelector("[data-header]");
const progress = document.querySelector(".page-progress span");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navAnchors = [...document.querySelectorAll(".nav-links a[href^='#']")];
const sections = navAnchors
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progressValue = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.width = `${Math.min(progressValue * 100, 100)}%`;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

function updateActiveNav() {
  const firstSection = document.querySelector("#about");
  if (firstSection && window.scrollY < firstSection.offsetTop - 220) {
    navAnchors.forEach((link) => link.classList.remove("is-active"));
    return;
  }

  const current = sections
    .map((section) => ({
      id: section.id,
      top: Math.abs(section.getBoundingClientRect().top - 120)
    }))
    .sort((a, b) => a.top - b.top)[0];

  if (!current) return;

  navAnchors.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${current.id}`);
  });
}

function setupNavigation() {
  navToggle?.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navLinks.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("nav-open", !isOpen);
  });

  navAnchors.forEach((link) => {
    link.addEventListener("click", () => {
      navToggle?.setAttribute("aria-expanded", "false");
      navLinks?.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    });
  });
}

function setupReveal() {
  const elements = [...document.querySelectorAll(".reveal")];

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  elements.forEach((element) => observer.observe(element));
}

function setupSignalCanvas() {
  const canvas = document.querySelector("[data-signal-canvas]");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  const panel = canvas.closest("[data-signature]");
  const pointer = { x: 0.58, y: 0.42, active: false };
  let width = 0;
  let height = 0;
  let frame = 0;
  let rafId = 0;

  const nodes = [
    { x: 0.12, y: 0.66, label: "source", color: "#a85c3a" },
    { x: 0.28, y: 0.35, label: "clean", color: "#2f6f5e" },
    { x: 0.47, y: 0.53, label: "model", color: "#5e5a7f" },
    { x: 0.67, y: 0.28, label: "signal", color: "#2f6f5e" },
    { x: 0.84, y: 0.58, label: "decision", color: "#a85c3a" }
  ];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.floor(rect.width);
    height = Math.floor(rect.height);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawGrid() {
    context.strokeStyle = "rgba(23, 23, 22, 0.055)";
    context.lineWidth = 1;

    for (let x = 0; x <= width; x += 42) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }

    for (let y = 0; y <= height; y += 42) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }
  }

  function drawCurve(time) {
    const influence = pointer.active ? 34 : 16;

    context.lineWidth = 3;
    context.strokeStyle = "rgba(47, 111, 94, 0.92)";
    context.beginPath();

    for (let i = 0; i <= 180; i += 1) {
      const t = i / 180;
      const x = t * width;
      const base =
        height * 0.56 +
        Math.sin(t * Math.PI * 3.2 + time * 0.018) * 38 +
        Math.sin(t * Math.PI * 8 - time * 0.011) * 11;
      const pull = Math.exp(-Math.pow(t - pointer.x, 2) / 0.012) * (pointer.y - 0.5) * influence;
      const y = base + pull;

      if (i === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }

    context.stroke();

    context.lineWidth = 2;
    context.strokeStyle = "rgba(168, 92, 58, 0.72)";
    context.beginPath();

    for (let i = 0; i <= 180; i += 1) {
      const t = i / 180;
      const x = t * width;
      const y =
        height * 0.38 +
        Math.cos(t * Math.PI * 4.6 + time * 0.014) * 24 +
        Math.sin(t * Math.PI * 2.3) * 18;

      if (i === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }

    context.stroke();
  }

  function drawNodes(time) {
    nodes.forEach((node, index) => {
      const x = node.x * width;
      const y = node.y * height + Math.sin(time * 0.018 + index) * 4;
      const pulse = 1 + Math.sin(time * 0.032 + index * 0.9) * 0.14;

      context.beginPath();
      context.fillStyle = "rgba(255, 255, 255, 0.86)";
      context.arc(x, y, 18 * pulse, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "rgba(23, 23, 22, 0.14)";
      context.lineWidth = 1;
      context.stroke();

      context.beginPath();
      context.fillStyle = node.color;
      context.arc(x, y, 5.8 * pulse, 0, Math.PI * 2);
      context.fill();

      if (index > 0) {
        const previous = nodes[index - 1];
        context.beginPath();
        context.strokeStyle = "rgba(23, 23, 22, 0.16)";
        context.lineWidth = 1;
        context.moveTo(previous.x * width, previous.y * height);
        context.lineTo(x, y);
        context.stroke();
      }
    });
  }

  function drawPointer() {
    if (!pointer.active) return;

    const x = pointer.x * width;
    const y = pointer.y * height;
    context.beginPath();
    context.fillStyle = "rgba(47, 111, 94, 0.08)";
    context.arc(x, y, 72, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.strokeStyle = "rgba(47, 111, 94, 0.28)";
    context.arc(x, y, 36, 0, Math.PI * 2);
    context.stroke();
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    drawGrid();
    drawPointer();
    drawCurve(frame);
    drawNodes(frame);

    frame += prefersReducedMotion ? 0 : 1;
    if (!prefersReducedMotion) rafId = requestAnimationFrame(draw);
  }

  panel?.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    pointer.y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    pointer.active = true;
  });

  panel?.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  window.addEventListener("resize", () => {
    resize();
    if (prefersReducedMotion) draw();
  });

  resize();
  draw();

  window.addEventListener("beforeunload", () => cancelAnimationFrame(rafId));
}

setupNavigation();
setupReveal();
setupSignalCanvas();
updateProgress();
updateActiveNav();

window.addEventListener("scroll", () => {
  updateProgress();
  updateActiveNav();
});
