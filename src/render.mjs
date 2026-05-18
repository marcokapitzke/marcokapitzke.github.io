import { writeFile } from "node:fs/promises";
import { profile } from "./profile.mjs";

const assetVersion = "20260518-polish";

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

const renderJourneyNodes = (items) =>
  items
    .map(
      (item, index) => `
        <button class="journey-node" type="button" data-journey-index="${index}" data-journey-detail="${escapeHtml(item.detail)}">
          <span>${String(index + 1).padStart(2, "0")}</span>
          ${escapeHtml(item.label)}
        </button>`
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
          <div class="publication__visual publication__visual--${escapeHtml(item.visual)}" aria-hidden="true">
            <span>${escapeHtml(item.type.split(" ")[0])}</span>
          </div>
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

const renderInterestList = (items) =>
  items.map((item) => `<span>${escapeHtml(item)}</span>`).join("");

const renderDataNotes = (items) =>
  items.map((item) => `<span>${escapeHtml(item)}</span>`).join("");

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
    <link rel="icon" href="public/favicon.svg?v=${assetVersion}" type="image/svg+xml">
    <link rel="stylesheet" href="src/styles.css?v=${assetVersion}">
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
        "Data analysis",
        "Business translation"
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
          <div class="profile-lockup">
            <img src="${escapeHtml(profile.portraitPath)}?v=${assetVersion}" alt="Portrait of Marco A. Kapitzke" width="112" height="112">
            <div>
              <p class="eyebrow">${escapeHtml(profile.hero.eyebrow)}</p>
              <p>${escapeHtml(profile.hero.identity)}</p>
            </div>
          </div>
          <h1 id="hero-title">${escapeHtml(profile.hero.headline)}</h1>
          <p class="hero__lead">${escapeHtml(profile.hero.lead)}</p>
          <p class="hero__secondary">${escapeHtml(profile.hero.secondary)}</p>
          <div class="hero__actions" aria-label="Primary actions">
            <a class="button button-primary" href="mailto:${escapeHtml(profile.email)}">Reach out</a>
            <a class="button button-secondary" href="${escapeHtml(profile.linkedIn)}" target="_blank" rel="noreferrer">LinkedIn</a>
            <a class="button button-secondary" href="${escapeHtml(profile.cvPath)}">Download CV</a>
          </div>
        </div>

        <div class="hero__visual reveal" style="--delay: 140ms">
          <div class="signal-panel" data-signature>
            <div class="signal-panel__top">
              <span>${escapeHtml(profile.hero.journeyIntro)}</span>
              <span>Hover the nodes</span>
            </div>
            <canvas data-signal-canvas width="760" height="560" aria-hidden="true"></canvas>
            <p class="journey-caption" data-journey-caption>${escapeHtml(profile.hero.journeyNodes[0].detail)}</p>
            <div class="signal-labels" aria-label="Interactive journey nodes">${renderJourneyNodes(profile.hero.journeyNodes)}
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

      <section class="section-shell credentials-section" aria-labelledby="credentials-title">
        <div class="section-heading reveal">
          <span>Current Thread</span>
          <h2 id="credentials-title">A path across research, business, and international work.</h2>
        </div>
        <div class="credentials-strip reveal">
          <div>
            <span>Education</span>
            <ul>${renderSimpleList(profile.credentials.education)}</ul>
          </div>
          <div>
            <span>Awards</span>
            <ul>${renderSimpleList(profile.credentials.awards)}</ul>
          </div>
        </div>
      </section>

      <section class="section-shell" id="focus" aria-labelledby="focus-title">
        <div class="section-heading reveal">
          <span>Professional Focus</span>
          <h2 id="focus-title">The kinds of problems I keep returning to.</h2>
        </div>
        <div class="focus-grid">
          ${renderFocus(profile.focus)}
        </div>
      </section>

      <section class="section-shell visual-thinking-section" aria-labelledby="visual-thinking-title">
        <div class="visual-thinking-copy reveal">
          <span>Data & Visual Thinking</span>
          <h2 id="visual-thinking-title">${escapeHtml(profile.visualThinking.headline)}</h2>
          <p>${escapeHtml(profile.visualThinking.text)}</p>
          <div class="data-note-row" aria-label="Visual thinking themes">
            ${renderDataNotes(profile.visualThinking.notes)}
          </div>
        </div>
        <div class="data-etching reveal" style="--delay: 100ms" aria-hidden="true">
          <div class="data-etching__axis"></div>
          <div class="data-etching__wave"></div>
          <div class="data-etching__bars">
            <span style="--h: 42%"></span>
            <span style="--h: 63%"></span>
            <span style="--h: 51%"></span>
            <span style="--h: 76%"></span>
            <span style="--h: 68%"></span>
            <span style="--h: 88%"></span>
            <span style="--h: 57%"></span>
          </div>
          <div class="data-etching__labels">
            <span>observe</span>
            <span>structure</span>
            <span>translate</span>
          </div>
        </div>
      </section>

      <section class="section-shell" id="work" aria-labelledby="work-title">
        <div class="section-heading reveal">
          <span>Selected Work</span>
          <h2 id="work-title">Where this way of working has shown up in practice.</h2>
        </div>
        <div class="work-grid">
          ${renderSelectedWork(profile.selectedWork)}
        </div>
      </section>

      <section class="section-shell writing-section" id="writing" aria-labelledby="writing-title">
        <div class="section-heading reveal">
          <span>Publications & Writing</span>
          <h2 id="writing-title">Research and teaching, with the point of each item visible.</h2>
        </div>
        <div class="publication-list">
          ${renderPublications(profile.publications)}
        </div>
      </section>

      <section class="section-shell leadership-section" id="leadership" aria-labelledby="leadership-title">
        <div class="section-heading reveal">
          <span>Leadership & Community</span>
          <h2 id="leadership-title">Contributing to the communities around the work.</h2>
        </div>
        <div class="leadership-grid">
          ${renderLeadership(profile.leadership)}
        </div>
      </section>

      <section class="section-shell beyond-section" id="beyond" aria-labelledby="beyond-title">
        <div class="section-kicker reveal">
          <span>Beyond the Work</span>
          <p>Small signals of what I keep returning to.</p>
        </div>
        <div class="section-copy reveal">
          <h2 id="beyond-title">${escapeHtml(profile.beyond.headline)}</h2>
          <p>${escapeHtml(profile.beyond.text)}</p>
          <div class="interest-cloud" aria-label="Professional and intellectual interests">
            ${renderInterestList(profile.beyond.interests)}
          </div>
        </div>
      </section>

      <section class="contact-section" id="contact" aria-labelledby="contact-title">
        <div class="section-shell contact-inner reveal">
          <p class="eyebrow">${escapeHtml(profile.location)}</p>
          <h2 id="contact-title">${escapeHtml(profile.contact.headline)}</h2>
          <p>${escapeHtml(profile.contact.text)}</p>
          <div class="hero__actions">
            <a class="button button-primary" href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a>
            <a class="button button-secondary" href="${escapeHtml(profile.linkedIn)}" target="_blank" rel="noreferrer">Connect on LinkedIn</a>
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
        <div class="footer-links" aria-label="Footer links">
          <a href="mailto:${escapeHtml(profile.email)}">Email</a>
          <a href="${escapeHtml(profile.linkedIn)}" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="#top">Back to top</a>
        </div>
      </div>
    </footer>

    <script type="module" src="src/main.js?v=${assetVersion}"></script>
  </body>
</html>
`;

await writeFile("index.html", page);
console.log("Generated index.html");
