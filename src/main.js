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
  const journeyButtons = [...document.querySelectorAll("[data-journey-index]")];
  const journeyCaption = document.querySelector("[data-journey-caption]");
  let width = 0;
  let height = 0;
  let frame = 0;
  let rafId = 0;
  let activeJourney = 0;

  const nodes = [
    { x: 0.12, y: 0.66, label: "physical chemistry", color: "#a85c3a" },
    { x: 0.28, y: 0.35, label: "instrumentation", color: "#2f6f5e" },
    { x: 0.47, y: 0.53, label: "data analytics", color: "#5e5a7f" },
    { x: 0.67, y: 0.28, label: "semiconductors", color: "#2f6f5e" },
    { x: 0.84, y: 0.58, label: "business", color: "#a85c3a" }
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
    const selectedNode = nodes[activeJourney] || nodes[0];
    const pathPull = (activeJourney - (nodes.length - 1) / 2) * 7;

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
      const pull = Math.exp(-Math.pow(t - selectedNode.x, 2) / 0.016) * pathPull;
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
      const selected = index === activeJourney;
      const pulse = selected ? 1.16 + Math.sin(time * 0.04 + index) * 0.08 : 1 + Math.sin(time * 0.032 + index * 0.9) * 0.1;

      context.beginPath();
      context.fillStyle = "rgba(255, 255, 255, 0.86)";
      context.arc(x, y, (selected ? 24 : 18) * pulse, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = selected ? "rgba(47, 111, 94, 0.46)" : "rgba(23, 23, 22, 0.14)";
      context.lineWidth = selected ? 2 : 1;
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

  function nodeIndexFromPointer(event) {
    const rect = canvas.getBoundingClientRect();
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;

    return nodes.findIndex((node, index) => {
      const x = node.x * width;
      const y = node.y * height + Math.sin(frame * 0.018 + index) * 4;
      return Math.hypot(pointerX - x, pointerY - y) < 34;
    });
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    drawGrid();
    drawCurve(frame);
    drawNodes(frame);

    frame += prefersReducedMotion ? 0 : 1;
    if (!prefersReducedMotion) rafId = requestAnimationFrame(draw);
  }

  function setJourney(index) {
    activeJourney = index;
    journeyButtons.forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === index);
    });

    if (journeyCaption && journeyButtons[index]) {
      journeyCaption.textContent = journeyButtons[index].dataset.journeyDetail;
    }

    if (prefersReducedMotion) draw();
  }

  journeyButtons.forEach((button, index) => {
    button.addEventListener("pointerenter", () => setJourney(index));
    button.addEventListener("focus", () => setJourney(index));
    button.addEventListener("click", () => setJourney(index));
  });

  function setJourneyFromCanvasPointer(event) {
    const nodeIndex = nodeIndexFromPointer(event);
    canvas.style.cursor = nodeIndex >= 0 ? "pointer" : "default";
    if (nodeIndex >= 0 && nodeIndex !== activeJourney) setJourney(nodeIndex);
  }

  canvas.addEventListener("pointermove", setJourneyFromCanvasPointer);
  canvas.addEventListener("click", setJourneyFromCanvasPointer);

  canvas.addEventListener("pointerleave", () => {
    canvas.style.cursor = "default";
  });

  window.addEventListener("resize", () => {
    resize();
    if (prefersReducedMotion) draw();
  });

  resize();
  setJourney(0);
  draw();

  window.addEventListener("beforeunload", () => cancelAnimationFrame(rafId));
}

function setupNetworkCanvas() {
  const canvas = document.querySelector("[data-network-canvas]");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  const field = canvas.closest("[data-network-field]");
  let width = 0;
  let height = 0;
  let frame = 0;
  let rafId = 0;
  let isExpanded = false;

  const points = [
    { x: 0.16, y: 0.22, vx: 0.18, vy: 0.12, color: "#2f6f5e", radius: 4.6 },
    { x: 0.36, y: 0.18, vx: -0.12, vy: 0.18, color: "#a85c3a", radius: 3.8 },
    { x: 0.68, y: 0.22, vx: 0.13, vy: -0.1, color: "#5e5a7f", radius: 4.2 },
    { x: 0.82, y: 0.42, vx: -0.18, vy: 0.11, color: "#2f6f5e", radius: 4.8 },
    { x: 0.58, y: 0.56, vx: 0.14, vy: 0.16, color: "#a85c3a", radius: 3.9 },
    { x: 0.26, y: 0.62, vx: -0.16, vy: -0.12, color: "#5e5a7f", radius: 4.4 },
    { x: 0.44, y: 0.78, vx: 0.12, vy: -0.18, color: "#2f6f5e", radius: 3.7 },
    { x: 0.76, y: 0.76, vx: -0.1, vy: -0.16, color: "#a85c3a", radius: 4.1 }
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

  function drawLinks() {
    const closeThreshold = Math.min(width, height) * 0.42;

    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const a = points[i];
        const b = points[j];
        const ax = a.x * width;
        const ay = a.y * height;
        const bx = b.x * width;
        const by = b.y * height;
        const distance = Math.hypot(ax - bx, ay - by);
        const shouldConnect = isExpanded || distance < closeThreshold;

        if (!shouldConnect) continue;

        const opacity = isExpanded
          ? Math.max(0.08, 0.2 - distance / Math.max(width, height) * 0.12)
          : Math.max(0.04, 0.28 - distance / closeThreshold * 0.24);

        context.beginPath();
        context.strokeStyle = `rgba(47, 111, 94, ${opacity})`;
        context.lineWidth = isExpanded ? 1.15 : 1;
        context.moveTo(ax, ay);
        context.lineTo(bx, by);
        context.stroke();
      }
    }
  }

  function drawPoints() {
    points.forEach((point, index) => {
      const x = point.x * width;
      const y = point.y * height;
      const pulse = 1 + Math.sin(frame * 0.032 + index) * 0.08;

      context.beginPath();
      context.fillStyle = "rgba(255, 255, 255, 0.74)";
      context.arc(x, y, point.radius * 3.2 * pulse, 0, Math.PI * 2);
      context.fill();

      context.beginPath();
      context.fillStyle = point.color;
      context.arc(x, y, point.radius * pulse, 0, Math.PI * 2);
      context.fill();
    });
  }

  function updatePoints() {
    if (prefersReducedMotion) return;

    points.forEach((point) => {
      point.x += point.vx / width;
      point.y += point.vy / height;

      if (point.x < 0.08 || point.x > 0.92) point.vx *= -1;
      if (point.y < 0.12 || point.y > 0.88) point.vy *= -1;
    });
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    drawLinks();
    drawPoints();
    updatePoints();

    frame += prefersReducedMotion ? 0 : 1;
    if (!prefersReducedMotion) rafId = requestAnimationFrame(draw);
  }

  field?.addEventListener("pointerenter", () => {
    isExpanded = true;
    if (prefersReducedMotion) draw();
  });

  field?.addEventListener("pointerleave", () => {
    isExpanded = false;
    if (prefersReducedMotion) draw();
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
setupNetworkCanvas();
updateProgress();
updateActiveNav();

window.addEventListener("scroll", () => {
  updateProgress();
  updateActiveNav();
});
