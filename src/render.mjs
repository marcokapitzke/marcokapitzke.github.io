import { writeFile } from "node:fs/promises";
import { profile } from "./profile.mjs";

const assetVersion = "20260518-leadership-focus-v2";

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
        <article class="focus-card focus-card--${escapeHtml(item.visual)} reveal" style="--delay: ${index * 70}ms">
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
        <article class="work-card work-card--${escapeHtml(item.visual || "default")} reveal" tabindex="0" style="--delay: ${index * 60}ms">
          <div class="work-card__meta">
            <span>${escapeHtml(item.kicker)}</span>
            <time>${escapeHtml(item.period)}</time>
          </div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
          ${item.insight ? `<p class="work-card__insight">${escapeHtml(item.insight)}</p>` : ""}
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
            <strong>${escapeHtml(item.visualTitle || item.type)}</strong>
            <small>${escapeHtml(item.visualNote || item.venue)}</small>
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
        <article class="leadership-item reveal" tabindex="0">
          <span>${escapeHtml(item.org)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
        </article>`
    )
    .join("");

const renderSimpleList = (items) =>
  items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

const renderCredentialItems = (items) =>
  items
    .map((item) => {
      const iconSrc = item.icon
        ? `${escapeHtml(item.icon)}${item.icon.startsWith("http") ? "" : `?v=${assetVersion}`}`
        : "";
      const icon = iconSrc
        ? `<img src="${iconSrc}" alt="" loading="lazy" decoding="async">`
        : "";
      const label = escapeHtml(item.label);
      const text = escapeHtml(item.text);
      const content = `
          <span class="credential-mark credential-mark--${escapeHtml(slugify(item.mark))} credential-mark--${escapeHtml(slugify(item.label))}" aria-hidden="true">
            ${icon}
            <b>${escapeHtml(item.mark)}</b>
          </span>
          <span>
            <strong>${label}</strong>
            ${text}
          </span>`;
      const itemBody = item.href
        ? `<a class="credential-item" href="${escapeHtml(item.href)}"${linkAttributes(item.href)}>${content}</a>`
        : `<div class="credential-item">${content}</div>`;

      return `
        <li>
          ${itemBody}
        </li>`;
    })
    .join("");

const renderInterestList = (items) =>
  items.map((item) => `<span>${escapeHtml(item)}</span>`).join("");

const renderDataNotes = (items) =>
  items.map((item) => `<span>${escapeHtml(item)}</span>`).join("");

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const renderMarkList = (items) =>
  items
    .map((item) => {
      const logoSrc = item.logo
        ? `${escapeHtml(item.logo)}${item.logo.startsWith("http") ? "" : `?v=${assetVersion}`}`
        : "";
      const logo = logoSrc
        ? `<img src="${logoSrc}" alt="" loading="lazy" decoding="async">`
        : "";

      return `
        <div class="affiliation-mark">
          <span class="affiliation-logo affiliation-logo--${escapeHtml(slugify(item.mark))}" aria-hidden="true">
            ${logo}
            <b>${escapeHtml(item.mark)}</b>
          </span>
          <span>${escapeHtml(item.label)}</span>
        </div>`;
    })
    .join("");

const renderNetworkField = () => `
  <div class="network-field" data-network-field aria-hidden="true">
    <canvas data-network-canvas width="660" height="430"></canvas>
  </div>`;

const renderDataSketch = () => `
  <canvas class="morph-sketch" data-morph-canvas width="720" height="520" aria-hidden="true"></canvas>`;

const renderBeyondStack = () => `
  <div class="beyond-stack" aria-hidden="true">
    <div class="beyond-frame beyond-frame--trail">
      <img src="public/beyond-biking.jpg?v=${assetVersion}" alt="" loading="lazy" decoding="async">
    </div>
    <div class="beyond-frame beyond-frame--route">
      <img src="public/beyond-solar.jpg?v=${assetVersion}" alt="" loading="lazy" decoding="async">
    </div>
    <div class="beyond-frame beyond-frame--pages">
      <img src="public/beyond-chess.jpg?v=${assetVersion}" alt="" loading="lazy" decoding="async">
    </div>
  </div>`;

const renderSources = (items) =>
  items
    .map(
      (item) =>
        `<a href="${escapeHtml(item.href)}"${linkAttributes(item.href)}>${escapeHtml(item.label)}</a>`
    )
    .join("");

const renderSystemsThread = () => `
    <aside class="systems-thread" data-systems-thread aria-hidden="true">
      <div class="systems-thread__rail"><span></span></div>
      <p>Systems thread</p>
      <ol>
        <li data-thread-target="top">
          <span>01</span>
          <b>Science</b>
        </li>
        <li data-thread-target="opening-thread">
          <span>02</span>
          <b>Instruments</b>
        </li>
        <li data-thread-target="focus">
          <span>03</span>
          <b>Data</b>
        </li>
        <li data-thread-target="visual-thinking">
          <span>04</span>
          <b>Systems</b>
        </li>
        <li data-thread-target="writing">
          <span>05</span>
          <b>Markets</b>
        </li>
        <li data-thread-target="contact">
          <span>06</span>
          <b>People</b>
        </li>
      </ol>
    </aside>`;

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
    <canvas class="scroll-constellation" data-scroll-constellation aria-hidden="true"></canvas>
${renderSystemsThread()}

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
        <div class="hero__intro reveal">
          <div class="profile-lockup">
            <img src="${escapeHtml(profile.portraitPath)}?v=${assetVersion}" alt="Portrait of Marco A. Kapitzke" width="132" height="132">
            <div>
              <p class="eyebrow">${escapeHtml(profile.hero.eyebrow)}</p>
              <p>${escapeHtml(profile.hero.identity)}</p>
            </div>
          </div>
          <h1 id="hero-title">${escapeHtml(profile.hero.headline)}</h1>
          <a class="scroll-cue" href="#opening-thread" aria-label="Scroll to introduction">
            <span>Scroll</span>
          </a>
        </div>

        <div class="hero__continuation" id="opening-thread">
          <div class="hero__content reveal">
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
                <span>Optics · data · semiconductors</span>
              </div>
              <canvas data-signal-canvas width="760" height="560" aria-hidden="true"></canvas>
              <p class="journey-caption" data-journey-caption>${escapeHtml(profile.hero.journeyNodes[0].detail)}</p>
              <div class="signal-labels" aria-label="Interactive journey nodes">${renderJourneyNodes(profile.hero.journeyNodes)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section-shell split-section" id="about" aria-labelledby="about-title">
        <div class="section-copy reveal">
          <span class="section-label">Positioning</span>
          <h2 id="about-title">${escapeHtml(profile.about.headline)}</h2>
          ${profile.about.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
          <ul class="principle-list" aria-label="Working principles">
            ${renderSimpleList(profile.about.principles)}
          </ul>
        </div>
        <div class="section-kicker section-kicker--visual reveal">
          <span>Positioning</span>
          <p>Science, data analytics, business, markets, and leadership.</p>
          ${renderNetworkField()}
        </div>
      </section>

      <section class="section-shell credentials-section" aria-labelledby="credentials-title">
        <div class="section-heading reveal">
          <span>Education & Awards</span>
          <h2 id="credentials-title">A path across research, high-tech industry, business, and international work.</h2>
        </div>
        <div class="credentials-strip reveal">
          <div>
            <span>Education</span>
            <ul>${renderCredentialItems(profile.credentials.education)}</ul>
          </div>
          <div>
            <span>High-tech industry & research</span>
            <ul>${renderCredentialItems(profile.credentials.highTech)}</ul>
          </div>
          <div>
            <span>Awards</span>
            <ul>${renderCredentialItems(profile.credentials.awards)}</ul>
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

      <section class="section-shell visual-thinking-section" id="visual-thinking" aria-labelledby="visual-thinking-title">
        <div class="visual-thinking-copy reveal">
          <span>Data & Visual Thinking</span>
          <h2 id="visual-thinking-title">${escapeHtml(profile.visualThinking.headline)}</h2>
          <p>${escapeHtml(profile.visualThinking.text)}</p>
          ${profile.visualThinking.notes.length ? `
            <div class="data-note-row" aria-label="Visual thinking themes">
              ${renderDataNotes(profile.visualThinking.notes)}
            </div>` : ""}
        </div>
        <div class="data-etching reveal" style="--delay: 100ms" aria-hidden="true">
          ${renderDataSketch()}
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
          <h2 id="writing-title">Research, teaching, and technical translation.</h2>
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
        <div class="affiliation-row reveal" aria-label="Related communities and institutions">
          ${renderMarkList(profile.leadershipMarks)}
        </div>
        <div class="leadership-grid">
          ${renderLeadership(profile.leadership)}
        </div>
      </section>

      <section class="section-shell beyond-section" id="beyond" aria-labelledby="beyond-title">
        <div class="section-kicker reveal">
          <span>Beyond the Work</span>
          <p>Movement, reading, and a few systems I keep thinking about.</p>
          ${renderBeyondStack()}
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
          <a href="image-credits.html">Image credits</a>
          <a href="#top">Back to top</a>
        </div>
      </div>
    </footer>

    <script type="module" src="src/main.js?v=${assetVersion}"></script>
  </body>
</html>
`;

await writeFile("index.html", page.replace(/[ \t]+$/gm, ""));
console.log("Generated index.html");
