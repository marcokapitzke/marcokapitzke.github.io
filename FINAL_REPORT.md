# Final Report

## What Was Built

A polished, dependency-free static personal website for Marco A. Kapitzke. The site presents Marco as an MBA Fellow, doctoral candidate, manufacturing analytics consultant, physical chemist, textbook author, and community leader with a clear professional narrative rather than a generic CV layout.

## Design Concept

The design uses a calm editorial system inspired by the communication clarity of premium professional and research organizations. It emphasizes whitespace, strong typography, restrained color, subtle motion, and a signature hero interaction: a live signal map that connects lab instrumentation, data modeling, and semiconductor manufacturing insight.

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

## Review Roles Applied

- **Senior product designer:** tightened the hero hierarchy, first-viewport CTA presence, mobile menu clarity, and section rhythm.
- **Senior frontend engineer:** chose a robust zero-dependency static stack, added structured content, progressive enhancement, validation, deployment configs, and responsive checks.
- **Communications lead:** refined copy toward warm confidence, removed defensive phrasing, and avoided unsupported claims.
- **Potential business partner:** emphasized clarity, operating relevance, collaboration, and semiconductor analytics rather than only academic credentials.
- **Recruiter:** made current roles, evidence points, education, awards, and contact paths easy to scan.

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

## Deployment

The site is ready for Vercel, Netlify, Cloudflare Pages, GitHub Pages, or any static host. Use:

```bash
node src/render.mjs
```

Then publish the repository root.

## Optional Future Improvements

- Add a verified professional portrait if Marco wants a more personal first impression.
- Add a custom domain and update Open Graph URL metadata once the domain is chosen.
- Add the final public JACS title and DOI after the publication record is available.
- Add a short downloadable one-page profile if a business-development version is useful.
