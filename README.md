# Emoji Script

Site statique prêt à déployer sur Railway, GitHub Pages, Netlify, Vercel ou Cloudflare Pages.

## Déploiement

Aucun build n'est nécessaire. Sur Railway, le script `npm start` lance le serveur Node inclus. Sur GitHub Pages, les fichiers statiques fonctionnent directement.

Fichiers principaux :
- `index.html` — site + playground
- `app.js` — compilateur/interpréteur côté navigateur
- `styles.css` — design responsive
- `404.html` — page 404
- `og-image.png` — image de partage 1200×630
- `favicon.svg` + icônes PWA
- `robots.txt` + `sitemap.xml` — SEO
- `server.js` + `package.json` — déploiement Railway sans dépendance

Le code Emoji Script est traduit en JavaScript et exécuté dans un Web Worker avec un timeout de 2 secondes.
