# Marco A. Kapitzke Website Plan

## Site Concept

Create a professional personal presence that reads like an extension of Marco's LinkedIn profile: concise, credible, international, and analytically sharp. The site positions Marco at the intersection of physical chemistry, semiconductor manufacturing analytics, data-driven process understanding, and business execution.

The guiding idea is **"scientific depth translated into operational clarity."** The site should feel closer to a premium professional-services profile than an academic CV, with warm confidence and careful factual restraint.

## Source Material

- Uploaded CV: `/Users/marco/Downloads/CV_MK-13.pdf`
- LinkedIn profile URL: `https://www.linkedin.com/in/marcokapitzke/`
- Collège des Ingénieurs Fellows page confirming Marco Kapitzke as a fellow from Freie Universität Berlin / Humboldt University Berlin in Chemistry
- Humboldt-Universität electron dynamiX profile describing ultrafast electron dynamics, TMDC monolayers, and FLUPS research
- SpringerNature book page for `Mathe in der (Bio-)Chemie I`
- ChemPhotoChem open-access paper and publication indexes for the 2025 VIP paper
- JCF Berlin public contact page confirming web administration role

## Content Architecture

1. **Hero**
   - Name, current positioning, Munich / Europe context
   - Clear headline: scientific depth, analytics, and business execution
   - CTAs: email, LinkedIn, download CV
   - Evidence points: €65K+ funding, 3 publications, 7 presentations, 10,000+ textbook reach
   - Signature interaction: subtle animated signal map connecting lab, data, and fab operations

2. **About / Positioning**
   - Explain the bridge between science, manufacturing analytics, materials, and management
   - Warm, precise copy that avoids inflated claims

3. **Professional Focus**
   - Manufacturing analytics
   - Semiconductor front-end operations
   - Data-driven process understanding
   - Physical chemistry and materials science
   - Business translation and execution

4. **Selected Work**
   - Infineon manufacturing analytics
   - Doctoral research and spectroscopy instrumentation
   - Columbia University 2D quantum materials
   - SpringerNature textbook
   - Publications and collaborations
   - JCF leadership and community work

5. **Publications / Writing**
   - ChemPhotoChem VIP paper, 2025
   - JACS accepted co-author work, 2026
   - J. Mater. Chem. C, 2022
   - SpringerNature textbook, 2024

6. **Leadership & Community**
   - JCF Berlin roles, events, web administration, media leadership
   - Student mentoring and academic support

7. **Contact**
   - Direct closing statement
   - Email, LinkedIn, Munich / Europe

## Design System

- **Tone:** calm, editorial, precise, premium
- **Layout:** single-page, sectioned, whitespace-rich, responsive from mobile to large desktop
- **Typography:** system sans-serif with restrained hierarchy and no viewport-based font scaling
- **Palette:** off-white paper, graphite ink, muted green accent, restrained rust highlight, fine neutral borders
- **Motion:** scroll reveal, subtle hover lift, progress rail, hero canvas movement respecting reduced-motion preferences
- **UI rules:** semantic HTML, accessible contrast, visible focus states, no heavy gradients, no template-like cards, no decorative blobs

## Technical Stack

- Dependency-free static site for maximum portability in the current environment
- Structured content in `src/profile.mjs`
- Static generation via `src/render.mjs`
- Progressive enhancement in `src/main.js`
- CSS in `src/styles.css`
- No backend, database, paid service, or third-party runtime required
- Free deployment ready for Netlify, Vercel, Cloudflare Pages, GitHub Pages, or any static host

Rationale: the workspace has Node available but no npm/yarn/pnpm. A zero-dependency static build gives the most reliable deployment path while preserving structured content, reusable rendering logic, and polished client-side interactions.

## Implementation Phases

1. Extract and structure source facts from CV and public references.
2. Define site narrative and content architecture.
3. Build static generator, page template, content model, and visual system.
4. Implement interactions and responsive behavior.
5. Add SEO metadata, Open Graph asset, favicon, robots file, downloadable CV, README, and deployment config.
6. Run local checks, browser verification, responsive review, and accessibility-oriented inspection.
7. Iterate on design, copy, spacing, mobile behavior, and interaction polish.

## Review / Improvement Loops

### Loop 1: First Product Build

- Built the generated static site, content model, CSS system, hero visual, and deployment files.
- Initial browser review found the desktop hero was too vertically heavy and pushed the primary CTAs below the first viewport.
- Improvement: reduced hero scale, tightened spacing, shortened the hero line, and made the proof points visible earlier.

### Loop 2: Mobile and Interaction Review

- Mobile review confirmed the core copy and CTAs fit without overlap.
- Initial mobile menu background allowed too much page content to show through.
- Improvement: made the mobile navigation panel opaque and fixed active-nav behavior so "About" is not highlighted while still in the hero.

### Loop 3: UX and Communications Review

- Header "Contact" initially opened `mailto:` directly, which was less useful for navigation and was blocked during browser testing.
- Improvement: changed header contact to the on-page contact section while keeping email links in the hero and contact area.
- Refined publication copy to avoid defensive source notes and keep the tone more professional.

## Validation Checklist

- [x] `node src/render.mjs` completes successfully.
- [x] `node scripts/validate-site.mjs` passes.
- [x] Local site loads through a static server.
- [x] No console errors in browser.
- [x] Desktop and mobile screenshots reviewed.
- [x] Links checked: email, LinkedIn, CV download, public references.
- [x] No placeholder copy remains in the generated site.
- [x] Copy avoids invented claims and unsupported exaggeration.
- [x] Responsive layout avoids text overlap and awkward wrapping in reviewed breakpoints.
- [x] Semantic headings and metadata are present.
- [x] Motion respects `prefers-reduced-motion`.
- [x] Deployment instructions are included.
