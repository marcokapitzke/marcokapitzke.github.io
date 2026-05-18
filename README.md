# Marco A. Kapitzke Personal Website

Professional static website for Marco A. Kapitzke, built as a polished personal presence for companies, business partners, collaborators, investors, recruiters, and professional contacts.

## Stack

- Dependency-free static site
- Structured content in `src/profile.mjs`
- Static generation with Node in `src/render.mjs`
- Progressive enhancement in `src/main.js`
- CSS in `src/styles.css`
- No backend, database, paid service, or package install required

## Run Locally

From the project root:

```bash
node src/render.mjs
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

If you have npm available, the equivalent commands are:

```bash
npm run build
npm run dev
```

## Check

```bash
node scripts/validate-site.mjs
```

The checker verifies required files, important metadata, key contact links, local asset references, and obvious placeholder text.

## Deploy For Free

### Vercel

1. Import this repository into Vercel.
2. Use the included `vercel.json`.
3. Build command: `node src/render.mjs`
4. Output directory: `.`

### Netlify

1. Import this repository into Netlify.
2. Use the included `netlify.toml`.
3. Build command: `node src/render.mjs`
4. Publish directory: `.`

### Cloudflare Pages

1. Create a Pages project from the repository.
2. Build command: `node src/render.mjs`
3. Build output directory: `.`

### GitHub Pages

1. Run `node src/render.mjs`.
2. Push the repository.
3. In repository settings, publish from the root of the selected branch.

## Content Updates

Edit `src/profile.mjs`, then run:

```bash
node src/render.mjs
```

Update `public/CV_MK-13.pdf` whenever the CV changes.

Selected-work hover images are credited in `IMAGE_CREDITS.md` and on `image-credits.html`.

## Public References Used

- Collège des Ingénieurs Fellows page
- Humboldt-Universität electron dynamiX profile
- SpringerNature `Mathe in der (Bio-)Chemie I`
- ChemPhotoChem VIP paper
- Freie Universität publication listing
- JCF Berlin contact page
