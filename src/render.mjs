import { writeFile } from "node:fs/promises";
import { profile } from "./profile.mjs";

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const linkAttributes = (href) =>
  href?.startsWith("http") ? ' target="_blank" rel="noreferrer"' : "";

const renderProof = (items) =>
  items
    .map(
      (item) => `
        <div class="proof-item">
          <strong>${escapeHtml(item.value)}</strong>
          <span>${escapeHtml(item.label)}</span>
        </div>`
    )
    .join("");

const renderTags = (tags) =>
  tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");

const renderFocus = (items) =>
  items
    .map(
      (item, index) => `
        <article class="focus-card reveal" style="--delay: ${index * 70}ms">
          <span class="card-index">0${index + 1}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
        </article>`
    )
    .join("");

const renderSelectedWork = (items) =>
  items
    .map(
      (item, index) => `
        <article class="work-card reveal" style="--delay: ${index * 60}ms">
          <div class="work-card__meta">
            <span>${escapeHtml(item.kicker)}</span>
            <time>${escapeHtml(item.period)}</time>
          </div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
          <div class="tag-row" aria-label="Relevant themes">${renderTags(item.tags)}</div>
        </article>`
    )
    .join("");

const renderPublications = (items) =>
  items
    .map((item) => {
      const title = item.href
        ? `<a href="${escapeHtml(item.href)}"${linkAttributes(item.href)}>${escapeHtml(item.title)}</a>`
        : escapeHtml(item.title);

      return `
        <article class="publication reveal">
          <div>
            <span>${escapeHtml(item.type)}</span>
            <h3>${title}</h3>
          </div>
          <p class="publication__venue">${escapeHtml(item.venue)}</p>
          <p>${escapeHtml(item.note)}</p>
        </article>`;
    })
    .join("");

const renderLeadership = (items) =>
  items
    .map(
      (item) => `
        <article class="leadership-item reveal">
          <span>${escapeHtml(item.org)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
        </article>`
    )
    .join("");

const renderSimpleList = (items) =>
  items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

const renderSources = (items) =>
  items
    .map(
      (item) =>
        `<a href="${escapeHtml(item.href)}"${linkAttributes(item.href)}>${escapeHtml(item.label)}</a>`
    )
    .join("");

const page = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(profile.title)}</title>
    <meta name="description" content="${escapeHtml(profile.description)}">
    <meta name="theme-color" content="#f7f7f2">
    <meta property="og:type" content="profile">
    <meta property="og:title" content="${escapeHtml(profile.title)}">
    <meta property="og:description" content="${escapeHtml(profile.description)}">
    <meta property="og:image" content="public/og-card.svg">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="icon" href="public/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="src/styles.css">
    <script type="application/ld+json">
${JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    email: `mailto:${profile.email}`,
    url: profile.linkedIn,
    sameAs: [profile.linkedIn],
    jobTitle: profile.role,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Munich",
      addressRegion: "Bavaria",
      addressCountry: "Germany"
    },
    alumniOf: [
      "Collège des Ingénieurs",
      "Humboldt-Universität zu Berlin",
      "Freie Universität Berlin"
    ],
    knowsAbout: [
      "Physical chemistry",
      "Manufacturing analytics",
      "Semiconductor front-end operations",
      "Ultrafast spectroscopy",
      "2D quantum materials",
      "Data analysis"
    ]
  },
  null,
  2
)}
    </script>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="page-progress" aria-hidden="true"><span></span></div>

    <header class="site-header" data-header>
      <nav class="nav" aria-label="Primary navigation">
        <a class="brand" href="#top" aria-label="Marco A. Kapitzke home">
          <span>MAK</span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links">
          <span></span>
          <span></span>
          <span class="sr-only">Menu</span>
        </button>
        <div class="nav-links" id="nav-links">
          <a href="#about">About</a>
          <a href="#focus">Focus</a>
          <a href="#work">Work</a>
          <a href="#writing">Writing</a>
          <a href="#leadership">Leadership</a>
          <a class="nav-contact" href="#contact">Contact</a>
        </div>
      </nav>
    </header>

    <main id="main">
      <section class="hero section-shell" id="top" aria-labelledby="hero-title">
        <div class="hero__content reveal">
          <p class="eyebrow">${escapeHtml(profile.hero.eyebrow)}</p>
          <h1 id="hero-title">${escapeHtml(profile.hero.headline)}</h1>
          <p class="hero__lead">${escapeHtml(profile.hero.lead)}</p>
          <div class="hero__actions" aria-label="Primary actions">
            <a class="button button-primary" href="mailto:${escapeHtml(profile.email)}">Start a conversation</a>
            <a class="button button-secondary" href="${escapeHtml(profile.linkedIn)}" target="_blank" rel="noreferrer">LinkedIn</a>
            <a class="button button-secondary" href="${escapeHtml(profile.cvPath)}">Download CV</a>
          </div>
          <div class="proof-grid" aria-label="Selected evidence">
            ${renderProof(profile.hero.proof)}
          </div>
        </div>

        <div class="hero__visual reveal" style="--delay: 140ms">
          <div class="signal-panel" data-signature>
            <div class="signal-panel__top">
              <span>Lab signal to fab insight</span>
              <span>Live model</span>
            </div>
            <canvas data-signal-canvas width="760" height="560" aria-hidden="true"></canvas>
            <div class="signal-labels" aria-hidden="true">
              ${profile.hero.signalLabels.map((label) => `<span>${escapeHtml(label)}</span>`).join("")}
            </div>
          </div>
        </div>
      </section>

      <section class="section-shell split-section" id="about" aria-labelledby="about-title">
        <div class="section-kicker reveal">
          <span>Positioning</span>
          <p>Science, analytics, manufacturing, materials, and leadership.</p>
        </div>
        <div class="section-copy reveal">
          <h2 id="about-title">${escapeHtml(profile.about.headline)}</h2>
          ${profile.about.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
          <ul class="principle-list" aria-label="Working principles">
            ${renderSimpleList(profile.about.principles)}
          </ul>
        </div>
      </section>

      <section class="section-shell" id="focus" aria-labelledby="focus-title">
        <div class="section-heading reveal">
          <span>Professional Focus</span>
          <h2 id="focus-title">Where technical depth becomes operating leverage.</h2>
        </div>
        <div class="focus-grid">
          ${renderFocus(profile.focus)}
        </div>
      </section>

      <section class="section-shell" id="work" aria-labelledby="work-title">
        <div class="section-heading reveal">
          <span>Selected Work</span>
          <h2 id="work-title">Evidence across industry, research, writing, and community.</h2>
        </div>
        <div class="work-grid">
          ${renderSelectedWork(profile.selectedWork)}
        </div>
      </section>

      <section class="section-shell writing-section" id="writing" aria-labelledby="writing-title">
        <div class="section-heading reveal">
          <span>Publications & Writing</span>
          <h2 id="writing-title">Research and teaching with the through-line kept visible.</h2>
        </div>
        <div class="publication-list">
          ${renderPublications(profile.publications)}
        </div>
      </section>

      <section class="section-shell leadership-section" id="leadership" aria-labelledby="leadership-title">
        <div class="section-heading reveal">
          <span>Leadership & Community</span>
          <h2 id="leadership-title">Building useful structures around science.</h2>
        </div>
        <div class="leadership-grid">
          ${renderLeadership(profile.leadership)}
        </div>
        <div class="credentials-strip reveal">
          <div>
            <span>Education</span>
            <ul>${renderSimpleList(profile.education)}</ul>
          </div>
          <div>
            <span>Awards</span>
            <ul>${renderSimpleList(profile.awards)}</ul>
          </div>
        </div>
      </section>

      <section class="contact-section" id="contact" aria-labelledby="contact-title">
        <div class="section-shell contact-inner reveal">
          <p class="eyebrow">${escapeHtml(profile.location)}</p>
          <h2 id="contact-title">For analytical work, technical strategy, or thoughtful collaboration.</h2>
          <p>
            Marco is open to conversations with companies, collaborators, investors, and professional contacts working near science, analytics, manufacturing, and business execution.
          </p>
          <div class="hero__actions">
            <a class="button button-primary" href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a>
            <a class="button button-secondary" href="${escapeHtml(profile.linkedIn)}" target="_blank" rel="noreferrer">LinkedIn profile</a>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="section-shell footer-inner">
        <div>
          <a class="brand footer-brand" href="#top"><span>MAK</span></a>
          <p>${escapeHtml(profile.name)} · ${escapeHtml(profile.role)}</p>
        </div>
        <div class="source-links" aria-label="Selected public references">
          ${renderSources(profile.sources)}
        </div>
      </div>
    </footer>

    <script type="module" src="src/main.js"></script>
  </body>
</html>
`;

await writeFile("index.html", page);
console.log("Generated index.html");
