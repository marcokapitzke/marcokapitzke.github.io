# Final Report

## What Was Built

A polished, dependency-free static personal website for Marco A. Kapitzke. The refined version uses first-person copy, an optimized portrait, a meaningful journey interaction, richer work descriptions, and a clearer narrative across science, data, manufacturing, business, and people.

## Design Concept

The design uses a mostly white editorial system inspired by premium professional and research organizations. It emphasizes whitespace, strong typography, restrained color, subtle serif accents, subtle motion, and a signature hero interaction: a journey map from physical chemistry to instrumentation, data tools, manufacturing analytics, and business translation.

## Key Content Included

- MBA Fellow at Collège des Ingénieurs, selected for a fully funded multinational program in Paris, Munich, and Turin
- MBA Consultant for Manufacturing Analytics at Infineon Technologies AG
- Doctoral research in physical chemistry at Humboldt-Universität zu Berlin
- Visiting research at Columbia University in New York City
- Ultrafast fluorescence spectroscopy, 2D quantum materials, Python analysis tools, and semiconductor front-end analytics
- €65K+ research funding, 3 publications, 7 presentations, and international collaborations
- SpringerNature textbook `Mathe in der (Bio-)Chemie I`
- ChemPhotoChem VIP paper, JACS accepted co-author work, and J. Mater. Chem. C co-author work
- JCF Berlin leadership, student mentoring, awards, and community work
- A subtle "Beyond the work" section covering interests in markets, game theory, data, visual communication, manufacturing systems, movement, and reading
- A restrained data / visual thinking band that signals care for analytical display without turning the site into a portfolio

## Review Roles Applied

- **Senior product designer:** tightened the hero hierarchy, first-viewport CTA presence, mobile menu clarity, and section rhythm.
- **Senior frontend engineer:** chose a robust zero-dependency static stack, added structured content, progressive enhancement, validation, deployment configs, and responsive checks.
- **Communications lead:** refined copy toward warm confidence, removed defensive phrasing, and avoided unsupported claims.
- **Potential business partner:** emphasized clarity, operating relevance, collaboration, and semiconductor analytics rather than only academic credentials.
- **Recruiter:** made current roles, evidence points, education, awards, and contact paths easy to scan.
- **Second refinement lenses:** reviewed against expectations from D. E. Shaw Research, a startup founder, an academic collaborator, a recruiter, and Marco's own authenticity feedback.

## Checks Passed

- `node src/render.mjs`
- `node scripts/validate-site.mjs`
- `node --check src/main.js`
- `node --check src/render.mjs`
- `node --check src/profile.mjs`
- `node --check scripts/validate-site.mjs`
- Browser smoke test on `http://localhost:4173`
- Desktop and mobile screenshot review
- Browser console error/warning check
- Mobile and desktop refinement review after adding portrait and first-person copy
- Portrait optimized from the original upload into a small 512px web-ready crop

## Deployment

The site is ready for Vercel, Netlify, Cloudflare Pages, GitHub Pages, or any static host. Use:

```bash
node src/render.mjs
```

Then publish the repository root.

## Optional Future Improvements

- Add a custom domain and update Open Graph URL metadata once the domain is chosen.
- Add the final public JACS title and DOI after the publication record is available.
- Add a short downloadable one-page profile if a business-development version is useful.
