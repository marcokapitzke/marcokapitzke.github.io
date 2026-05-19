const header = document.querySelector("[data-header]");
const progress = document.querySelector(".page-progress span");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navAnchors = [...document.querySelectorAll(".nav-links a[href^='#']")];
const sections = navAnchors
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const systemsThread = document.querySelector("[data-systems-thread]");
const threadSteps = systemsThread ? [...systemsThread.querySelectorAll("[data-thread-target]")] : [];

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

function updateSystemsThread() {
  if (!systemsThread || !threadSteps.length) return;

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const pageProgress = scrollable > 0 ? window.scrollY / scrollable : 0;
  const reveal = Math.min(
    Math.max((window.scrollY - window.innerHeight * 0.72) / Math.max(window.innerHeight * 0.34, 1), 0),
    1
  );
  const markerY = window.scrollY + window.innerHeight * 0.42;
  let activeIndex = 0;

  threadSteps.forEach((step, index) => {
    const target = document.getElementById(step.dataset.threadTarget);
    if (target && target.offsetTop <= markerY) activeIndex = index;
  });

  systemsThread.style.setProperty("--thread-opacity", String(reveal * 0.92));
  systemsThread.style.setProperty("--thread-progress", String(Math.min(Math.max(pageProgress, 0), 1)));
  threadSteps.forEach((step, index) => {
    step.classList.toggle("is-active", index === activeIndex);
  });
}

function setupScrollConstellation() {
  const canvas = document.querySelector("[data-scroll-constellation]");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let frame = 0;
  let rafId = 0;

  const tones = {
    green: "170, 207, 188",
    rust: "219, 154, 118",
    violet: "176, 171, 204",
    ink: "238, 241, 235"
  };

  const points = Array.from({ length: 104 }, (_, index) => {
    const columns = 13;
    const col = index % columns;
    const row = Math.floor(index / columns);
    const rowOffset = row % 2 ? 0.035 : 0;
    const x = (col + 0.48) / columns + rowOffset;
    const y = (row + 0.44) / 8.55;
    const toneOrder = ["green", "ink", "green", "rust", "green", "violet", "ink"];

    return {
      x: Math.min(x, 0.97),
      y,
      r: 1.08 + ((index * 7) % 9) * 0.12,
      tone: toneOrder[index % toneOrder.length],
      phase: index * 0.83,
      depth: 0.7 + (index % 5) * 0.16
    };
  });

  const routeVariants = [
    [5, 18, 31, 45, 59, 73, 88, 102],
    [11, 22, 34, 47, 60, 72, 84, 96],
    [1, 15, 30, 42, 56, 69, 83, 98],
    [8, 21, 35, 49, 62, 76, 88, 100],
    [3, 14, 28, 43, 57, 73, 87, 102]
  ];
  const routeDuration = 280;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function draw() {
    const progress = Math.min(window.scrollY / Math.max(window.innerHeight * 0.82, 520), 1);
    const fade = Math.max(0, 1 - progress * 1.24);
    const lineIn = Math.min(Math.max((progress - 0.12) / 0.34, 0), 1);
    const lineOut = Math.max(0, 1 - Math.max(progress - 0.58, 0) / 0.36);
    const restingMesh = Math.max(0, 0.66 - progress * 0.46);
    const lineOpacity = Math.max(restingMesh, lineIn * lineOut * 0.9);

    document.documentElement.style.setProperty("--constellation-opacity", String(fade * 0.98));
    context.clearRect(0, 0, width, height);

    const positioned = points.map((point, index) => {
      const drift = prefersReducedMotion ? 0 : Math.sin(frame * 0.006 + point.phase) * 7 * point.depth;
      return {
        ...point,
        px: point.x * width + drift + progress * (index % 2 ? -26 : 28) * point.depth,
        py:
          point.y * height -
          progress * height * 0.12 * point.depth +
          Math.cos(frame * 0.005 + point.phase) * 4
      };
    });

    if (lineOpacity > 0.01) {
      for (let i = 0; i < positioned.length; i += 1) {
        for (let j = i + 1; j < positioned.length; j += 1) {
          const a = positioned[i];
          const b = positioned[j];
          const distance = Math.hypot(a.px - b.px, a.py - b.py);
          const threshold = Math.min(width, height) * 0.16;
          if (distance > threshold) continue;

          context.beginPath();
          context.strokeStyle = `rgba(170, 207, 188, ${fade * lineOpacity * Math.max(0.055, 0.38 - distance / threshold * 0.28)})`;
          context.lineWidth = 1;
          context.moveTo(a.px, a.py);
          context.lineTo(b.px, b.py);
          context.stroke();
        }
      }
    }

    const routeFrame = frame % routeDuration;
    const routePhase = routeFrame / routeDuration;
    const routeIndex = Math.floor(frame / routeDuration) % routeVariants.length;
    const routeOpacity =
      Math.min(routePhase / 0.1, 1, Math.max(0, (1 - routePhase) / 0.14)) * fade;
    const routeProgress = Math.min(routePhase / 0.86, 1);
    const route = routeVariants[routeIndex]
      .map((index) => positioned[index])
      .filter(Boolean);

    if (route.length > 1 && routeOpacity > 0.01) {
      context.beginPath();
      route.forEach((point, index) => {
        if (index === 0) context.moveTo(point.px, point.py);
        else context.lineTo(point.px, point.py);
      });
      context.strokeStyle = `rgba(219, 154, 118, ${routeOpacity * 0.34})`;
      context.lineWidth = 1.4;
      context.stroke();

      const segmentLengths = [];
      const totalLength = route.reduce((sum, point, index) => {
        if (index === 0) return 0;

        const previous = route[index - 1];
        const length = Math.hypot(point.px - previous.px, point.py - previous.py);
        segmentLengths.push(length);
        return sum + length;
      }, 0);

      let traveled = routeProgress * totalLength;
      for (let index = 1; index < route.length; index += 1) {
        const segmentLength = segmentLengths[index - 1];
        if (traveled > segmentLength) {
          traveled -= segmentLength;
          continue;
        }

        const previous = route[index - 1];
        const point = route[index];
        const ratio = segmentLength ? traveled / segmentLength : 0;
        const x = previous.px + (point.px - previous.px) * ratio;
        const y = previous.py + (point.py - previous.py) * ratio;

        context.beginPath();
        context.fillStyle = `rgba(251, 251, 248, ${routeOpacity * 0.88})`;
        context.arc(x, y, 3.2, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.strokeStyle = `rgba(219, 154, 118, ${routeOpacity * 0.44})`;
        context.arc(x, y, 8.5, 0, Math.PI * 2);
        context.stroke();
        break;
      }
    }

    const streak = lineIn * lineOut * 34;
    positioned.forEach((point, index) => {
      const tone = tones[point.tone] || tones.green;

      if (streak > 0.5) {
        context.beginPath();
        context.strokeStyle = `rgba(${tone}, ${lineOpacity * 0.16})`;
        context.lineWidth = 1.2;
        context.moveTo(point.px - streak * (0.55 + (index % 3) * 0.16), point.py);
        context.lineTo(point.px + streak, point.py);
        context.stroke();
      }

      context.beginPath();
      context.fillStyle = `rgb(${tone})`;
      context.globalAlpha = fade * (0.72 + lineOpacity * 0.22);
      context.arc(point.px, point.py, point.r * 1.22 * (1 - progress * 0.18), 0, Math.PI * 2);
      context.fill();
    });

    context.globalAlpha = 1;
  }

  function animate() {
    frame += 1;
    draw();
    if (!prefersReducedMotion) rafId = requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("scroll", draw, { passive: true });
  resize();
  if (!prefersReducedMotion) animate();

  window.addEventListener("beforeunload", () => cancelAnimationFrame(rafId));
}

function setupNavigation() {
  const skipLink = document.querySelector(".skip-link");
  const hideSkipLink = () => skipLink?.classList.remove("skip-link--visible");

  hideSkipLink();
  window.setTimeout(() => {
    if (document.activeElement?.classList.contains("skip-link")) document.activeElement.blur();
    hideSkipLink();
  }, 0);

  window.addEventListener("keydown", (event) => {
    if (event.key === "Tab") skipLink?.classList.add("skip-link--visible");
  });

  window.addEventListener("pointerdown", hideSkipLink);
  window.addEventListener("hashchange", hideSkipLink);
  window.addEventListener("scroll", hideSkipLink, { passive: true });

  navToggle?.addEventListener("click", () => {
    hideSkipLink();
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navLinks.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("nav-open", !isOpen);
  });

  navAnchors.forEach((link) => {
    link.addEventListener("click", () => {
      hideSkipLink();
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

  function revealVisibleElements() {
    elements.forEach((element) => {
      if (element.classList.contains("is-visible")) return;

      const rect = element.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.92 && rect.bottom > window.innerHeight * 0.04;
      if (!isVisible) return;

      element.classList.add("is-visible");
      observer.unobserve(element);
    });
  }

  requestAnimationFrame(revealVisibleElements);
  window.addEventListener("hashchange", () => requestAnimationFrame(revealVisibleElements));
  window.addEventListener("scroll", revealVisibleElements, { passive: true });
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
  canvas.addEventListener("pointerdown", setJourneyFromCanvasPointer);
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

  const palette = ["#2f6f5e", "#a85c3a", "#5e5a7f", "#2f6f5e", "#171716", "#6d8f80"];
  const points = Array.from({ length: 34 }, (_, index) => {
    const angle = index * 2.37 + (index % 5) * 0.21;
    const speed = 1.82 + (index % 9) * 0.25;

    return {
      x: 0.08 + ((index * 37) % 84) / 100,
      y: 0.08 + ((index * 53) % 84) / 100,
      vx: Math.cos(angle) * (0.34 + (index % 4) * 0.07),
      vy: Math.sin(angle) * (0.34 + ((index + 2) % 4) * 0.07),
      speed,
      color: palette[index % palette.length],
      radius: 3.4 + (index % 5) * 0.42
    };
  });

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
    const closeThreshold = Math.min(width, height) * 0.28;

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
          ? Math.max(0.085, 0.26 - distance / Math.max(width, height) * 0.12)
          : Math.max(0.034, 0.21 - distance / closeThreshold * 0.17);

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
      context.fillStyle = "rgba(255, 255, 255, 0.62)";
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
      point.x += (point.vx * point.speed) / width;
      point.y += (point.vy * point.speed) / height;

      if (point.x < -0.04) point.x = 1.04;
      if (point.x > 1.04) point.x = -0.04;
      if (point.y < -0.04) point.y = 1.04;
      if (point.y > 1.04) point.y = -0.04;
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

  field?.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "touch" && event.pointerType !== "pen") return;

    isExpanded = !isExpanded;
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

function setupMorphCanvas() {
  const canvas = document.querySelector("[data-morph-canvas]");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  const stage = canvas.closest(".data-etching");
  let width = 0;
  let height = 0;
  let frame = 0;
  let rafId = 0;
  let morph = 0;
  let targetMorph = 0;

  const gridSize = 5;
  const cubePoints = [];

  for (let xi = 0; xi < gridSize; xi += 1) {
    for (let yi = 0; yi < gridSize; yi += 1) {
      for (let zi = 0; zi < gridSize; zi += 1) {
        const isSurface =
          xi === 0 ||
          yi === 0 ||
          zi === 0 ||
          xi === gridSize - 1 ||
          yi === gridSize - 1 ||
          zi === gridSize - 1;

        if (!isSurface) continue;

        const normalize = (value) => (value / (gridSize - 1) - 0.5) * 2;
        cubePoints.push({
          x: normalize(xi),
          y: normalize(yi),
          z: normalize(zi)
        });
      }
    }
  }

  const spherePoints = cubePoints.map((_, index) => {
    const count = cubePoints.length;
    const y = 1 - (index / (count - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = index * Math.PI * (3 - Math.sqrt(5));

    return {
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius
    };
  });

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function rotatePoint(point, angleX, angleY, angleZ) {
    const cosX = Math.cos(angleX);
    const sinX = Math.sin(angleX);
    const cosY = Math.cos(angleY);
    const sinY = Math.sin(angleY);
    const cosZ = Math.cos(angleZ);
    const sinZ = Math.sin(angleZ);

    let x = point.x;
    let y = point.y * cosX - point.z * sinX;
    let z = point.y * sinX + point.z * cosX;

    const nextX = x * cosY + z * sinY;
    z = -x * sinY + z * cosY;
    x = nextX;

    return {
      x: x * cosZ - y * sinZ,
      y: x * sinZ + y * cosZ,
      z
    };
  }

  function project(point, scale, floatY) {
    const perspective = 3.6;
    const depth = perspective / (perspective - point.z);

    return {
      x: width / 2 + point.x * scale * depth,
      y: height / 2 + point.y * scale * depth + floatY,
      z: point.z,
      depth
    };
  }

  function drawGuideBox(scale, floatY, angleX, angleY, angleZ, opacity) {
    if (opacity <= 0.01) return;

    const corners = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1]
    ].map(([x, y, z]) => project(rotatePoint({ x, y, z }, angleX, angleY, angleZ), scale, floatY));

    const edges = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7]
    ];

    context.beginPath();
    edges.forEach(([start, end]) => {
      context.moveTo(corners[start].x, corners[start].y);
      context.lineTo(corners[end].x, corners[end].y);
    });
    context.strokeStyle = `rgba(47, 111, 94, ${opacity * 0.34})`;
    context.lineWidth = 1;
    context.stroke();
  }

  function drawSphereRings(scale, floatY, angleX, angleY, angleZ, opacity) {
    if (opacity <= 0.01) return;

    context.strokeStyle = `rgba(168, 92, 58, ${opacity * 0.2})`;
    context.lineWidth = 1;

    [-0.42, 0, 0.42].forEach((planeY) => {
      context.beginPath();
      for (let index = 0; index <= 96; index += 1) {
        const theta = (index / 96) * Math.PI * 2;
        const radius = Math.sqrt(1 - planeY * planeY);
        const point = rotatePoint(
          {
            x: Math.cos(theta) * radius,
            y: planeY,
            z: Math.sin(theta) * radius
          },
          angleX,
          angleY,
          angleZ
        );
        const projected = project(point, scale, floatY);
        if (index === 0) context.moveTo(projected.x, projected.y);
        else context.lineTo(projected.x, projected.y);
      }
      context.stroke();
    });
  }

  function draw() {
    context.clearRect(0, 0, width, height);

    const ease = 1 - Math.pow(1 - morph, 3);
    const targetSpeed = targetMorph > morph ? 0.045 : 0.035;
    morph += (targetMorph - morph) * targetSpeed;
    if (Math.abs(targetMorph - morph) < 0.001) morph = targetMorph;

    const scale = Math.min(width, height) * 0.245;
    const floatY = prefersReducedMotion ? 0 : Math.sin(frame * 0.018) * 8;
    const angleX = 0.56 + Math.sin(frame * 0.006) * 0.08;
    const angleY = 0.76 + frame * 0.0065;
    const angleZ = -0.16 + Math.cos(frame * 0.004) * 0.04;

    drawGuideBox(scale, floatY, angleX, angleY, angleZ, 1 - ease);
    drawSphereRings(scale, floatY, angleX, angleY, angleZ, ease);

    const points = cubePoints.map((cubePoint, index) => {
      const spherePoint = spherePoints[index];
      const mixedPoint = {
        x: cubePoint.x + (spherePoint.x - cubePoint.x) * ease,
        y: cubePoint.y + (spherePoint.y - cubePoint.y) * ease,
        z: cubePoint.z + (spherePoint.z - cubePoint.z) * ease
      };
      const rotated = rotatePoint(mixedPoint, angleX, angleY, angleZ);
      const projected = project(rotated, scale, floatY);

      return {
        ...projected,
        index
      };
    });

    points
      .sort((a, b) => a.z - b.z)
      .forEach((point) => {
        const color =
          point.index % 17 === 0
            ? "168, 92, 58"
            : point.index % 11 === 0
              ? "94, 90, 127"
              : "47, 111, 94";
        const alpha = 0.42 + point.depth * 0.22;
        const radius = (1.95 + point.depth * 1.55) * (1 + ease * 0.08);

        context.beginPath();
        context.fillStyle = `rgba(255, 255, 255, ${0.48 + point.depth * 0.16})`;
        context.arc(point.x, point.y, radius + 4.6, 0, Math.PI * 2);
        context.fill();

        context.beginPath();
        context.fillStyle = `rgba(${color}, ${alpha})`;
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fill();
      });

    frame += prefersReducedMotion ? 0 : 1;
    if (!prefersReducedMotion) rafId = requestAnimationFrame(draw);
  }

  function setMorph(value) {
    targetMorph = value;
    if (prefersReducedMotion) draw();
  }

  function toggleMorph() {
    targetMorph = targetMorph > 0.5 ? 0 : 1;
    if (prefersReducedMotion) draw();
  }

  stage?.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "touch" || event.pointerType === "pen") return;
    setMorph(1);
  });

  stage?.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "touch" || event.pointerType === "pen") return;
    setMorph(0);
  });

  stage?.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse") return;
    toggleMorph();
  });

  stage?.addEventListener("touchstart", () => {
    if ("PointerEvent" in window) return;
    toggleMorph();
  }, { passive: true });

  stage?.addEventListener("click", () => {
    if ("PointerEvent" in window) return;
    toggleMorph();
  });

  window.addEventListener("resize", () => {
    resize();
    if (prefersReducedMotion) draw();
  });

  resize();
  draw();

  window.addEventListener("beforeunload", () => cancelAnimationFrame(rafId));
}

function setupWorkCards() {
  const cards = [...document.querySelectorAll(".work-card")];
  if (!cards.length) return;

  function clearActive(except = null) {
    cards.forEach((card) => {
      if (card !== except) card.classList.remove("is-active");
      if (card !== except) card.setAttribute("aria-pressed", "false");
    });
  }

  cards.forEach((card) => {
    card.addEventListener("pointerenter", () => clearActive(card));

    card.addEventListener("click", () => {
      const wasActive = card.classList.contains("is-active");
      clearActive(card);
      card.classList.toggle("is-active", !wasActive);
      card.setAttribute("aria-pressed", String(!wasActive));
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        card.classList.remove("is-active");
        return;
      }

      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      const wasActive = card.classList.contains("is-active");
      clearActive(card);
      card.classList.toggle("is-active", !wasActive);
      card.setAttribute("aria-pressed", String(!wasActive));
    });
  });

  document.addEventListener("pointerdown", (event) => {
    if (!event.target.closest(".work-card")) clearActive();
  });
}

function setupFocusCards() {
  const cards = [...document.querySelectorAll(".focus-card")];
  if (!cards.length) return;

  function clearActive(except = null) {
    cards.forEach((card) => {
      if (card === except) return;
      card.classList.remove("is-active");
      card.setAttribute("aria-pressed", "false");
    });
  }

  cards.forEach((card) => {
    card.addEventListener("pointerenter", () => clearActive(card));

    card.addEventListener("click", () => {
      const wasActive = card.classList.contains("is-active");
      clearActive(card);
      card.classList.toggle("is-active", !wasActive);
      card.setAttribute("aria-pressed", String(!wasActive));
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        card.classList.remove("is-active");
        card.setAttribute("aria-pressed", "false");
        return;
      }

      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      const wasActive = card.classList.contains("is-active");
      clearActive(card);
      card.classList.toggle("is-active", !wasActive);
      card.setAttribute("aria-pressed", String(!wasActive));
    });
  });

  document.addEventListener("pointerdown", (event) => {
    if (!event.target.closest(".focus-card")) clearActive();
  });
}

function setupLeadershipCards() {
  const cards = [...document.querySelectorAll(".leadership-item")];
  if (!cards.length) return;

  function clearActive(except = null) {
    cards.forEach((card) => {
      if (card !== except) card.classList.remove("is-active");
    });
  }

  cards.forEach((card) => {
    card.addEventListener("pointerenter", () => {
      clearActive(card);
      card.classList.add("is-active");
    });

    card.addEventListener("pointerleave", () => {
      card.classList.remove("is-active");
    });

    card.addEventListener("focus", () => {
      clearActive(card);
      card.classList.add("is-active");
    });

    card.addEventListener("blur", () => {
      card.classList.remove("is-active");
    });

    card.addEventListener("click", () => {
      clearActive(card);
      card.classList.add("is-active");
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        card.classList.remove("is-active");
        return;
      }

      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      clearActive(card);
      card.classList.add("is-active");
    });
  });

  document.addEventListener("pointerdown", (event) => {
    if (!event.target.closest(".leadership-item")) clearActive();
  });
}

function setupBeyondStack() {
  const stack = document.querySelector(".beyond-stack");
  if (!stack) return;

  stack.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "touch" && event.pointerType !== "pen") return;
    stack.classList.toggle("is-active");
  });
}

setupNavigation();
setupReveal();
setupScrollConstellation();
setupSignalCanvas();
setupNetworkCanvas();
setupMorphCanvas();
setupFocusCards();
setupWorkCards();
setupLeadershipCards();
setupBeyondStack();
updateProgress();
updateActiveNav();
updateSystemsThread();

window.addEventListener("scroll", () => {
  updateProgress();
  updateActiveNav();
  updateSystemsThread();
});

window.addEventListener("resize", updateSystemsThread);
