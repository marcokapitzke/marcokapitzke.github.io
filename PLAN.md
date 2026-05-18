# Marco A. Kapitzke Website Plan

## Site Concept

Create a professional personal presence that reads like Marco speaking with precision and warmth about the kinds of systems he likes to understand. The site should still extend his LinkedIn profile, but it should feel less like a résumé dashboard and more like a thoughtful personal website for a modern scientist / operator.

The guiding idea is **"making complex systems understandable."** The site should feel closer to a premium editorial profile than an academic CV, with first-person language, careful factual restraint, a small portrait, and a subtle artsy interaction that carries meaning.

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
   - Name, current identity, Munich / Europe context
   - First-person headline about complex systems and useful insight
   - CTAs: email, LinkedIn, download CV
   - Small portrait image
   - Signature interaction: a meaningful path map from physical chemistry through instrumentation, data analytics, semiconductors, and business translation

2. **About / Positioning**
   - Explain the bridge between science, manufacturing analytics, materials, management, and people
   - Warm, precise copy that avoids inflated claims
   - Add a quiet optics / vector-field visual in the left column so the section feels intentionally balanced

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
   - Publication visuals should feel like small editorial artifacts: venue marks, a book-cover thumbnail treatment, and scientific motifs with the point of each item visible

6. **Leadership & Community**
   - JCF Berlin roles, events, web administration, media leadership
   - Student mentoring and academic support

7. **Contact**
   - First-person closing statement with a clear reason to reach out
   - Email, LinkedIn, Munich / Europe

8. **Beyond the Work**
   - Subtle layer of intellectual and personal interests
   - Keep it human without becoming casual or distracting

## Design System

- **Tone:** calm, editorial, precise, premium
- **Layout:** single-page, sectioned, whitespace-rich, responsive from mobile to large desktop
- **Typography:** modern system sans-serif for body, editorial serif accents for labels, captions, and reflective statements
- **Palette:** mostly white background, graphite ink, muted green accent, restrained rust highlight, fine neutral borders
- **Motion:** scroll reveal, subtle hover lift, progress rail, hero canvas movement respecting reduced-motion preferences
- **Signature interaction:** numbered path controls update the hero graph; hovering the raw canvas does not change the content
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

### Loop 4: Second Narrative Refinement

- Incorporate Marco's new feedback: first-person voice, more human tone, less metric-led hero, portrait, more meaningful interaction, richer explanations of FLUPS, Columbia, textbook, publications, JCF leadership, and interests.
- Move metrics into story context instead of leading with dashboard-style proof points.
- Add DESIGN_BRIEF.md and ITERATION_LOG.md as persistent records of the design direction and review loop.

### Loop 5: Inspiration-Based Polish

- Use selected lessons from Clinton Wang, Thomas Sutter, Arian Kriesch, and Visual Cinnamon without copying their sites.
- Optimize the supplied portrait into a small web-ready asset.
- Add a restrained data / visual thinking section to signal taste in analytical display.
- Keep the site close to the refined foundation while making it more memorable and human.

### Loop 6: Path, Optics, and Editorial Artifacts

- Replace prompt-like hero labels with stronger professional themes.
- Make the hero visual respond only to the numbered path bar.
- Add a meaningful optics / signal visual to the positioning column.
- Make education, awards, publications, and leadership marks more intentional and less list-like.
- Strengthen the data visualization section so it shows observation, calibration, uncertainty, and decision context.

### Loop 7: Affiliation Logos and Human Detail

- Replace typographic leadership marks with stable local logo assets for JCF Berlin, GDCh, and Freie Universität Berlin.
- Add a composed visual layer to "Beyond the Work" so the section suggests movement, routes, reading, and curiosity without becoming stock-photo heavy.
- Keep this pass subtle: the logos should support credibility, and the personal visual should add warmth without distracting from the professional story.

### Loop 8: Scroll Motion, Data Axis, and Education Icons

- Enlarge the hero portrait while preserving a more zoomed-out feeling through a white inset and circular crop.
- Add a subtle opening constellation that turns dots into connecting lines and fades as the visitor scrolls.
- Expand the positioning network into a taller left-column field with more bouncing nodes and no bottom labels.
- Add a measured axis and slower point/fit animation to the data visualization.
- Add institution icons to the education path while keeping awards typographic and quiet.

### Loop 9: Public-Facing Titles and Semantic Hover States

- Remove wording that reads like internal design feedback.
- Make Professional Focus hover visuals more explicit to each topic instead of decorative background textures.
- Reframe the FLUPS visual label around measurement reliability.
- Replace the plain front Beyond card with a small optics / molecule sketch.

### Loop 10: Latest Visual Corrections

- Add public award marks for MLP, Fonds / VCI, Ernst-Reuter-Gesellschaft, and keep the graduate grants connected to the university context.
- Remove the portrait inset ring and make the image warmer and slightly larger.
- Rework the opening constellation so dots resolve into lines and fade with scroll instead of reading as isolated decorative points.
- Make the positioning network more alive through varied node speeds.
- Enlarge the data sketch, replace axis labels with proper arrow axes, and slow the point / curve animation.
- Make the Professional Focus and Beyond visual layers more legible as topic-specific sketches.

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
