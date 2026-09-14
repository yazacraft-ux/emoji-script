# Emoji Script

Site bilingue FR / EN prêt pour GitHub Pages, avec un design unique partagé par toutes les pages.

## URLs

- Français : `https://emoji-script.com/`
- English : `https://emoji-script.com/en/`
- Extension Chrome FR : `https://emoji-script.com/extension-chrome/`
- Extension Chrome EN : `https://emoji-script.com/en/extension-chrome/`
- Confidentialité : `https://emoji-script.com/privacy.html`

## Fichiers

- `index.html` : accueil français
- `en/index.html` : accueil anglais
- `extension-chrome/index.html` : page extension française
- `en/extension-chrome/index.html` : page extension anglaise
- `privacy.html` : politique de confidentialité
- `404.html` : page 404 bilingue
- `styles.css` : **une seule** feuille de style pour tout le site
- `app.js` : **un seul** script pour tout le site (compilateur + menu mobile)
- `sitemap.xml`, `robots.txt`, `site.webmanifest`, `favicon.svg`, `CNAME`, `.nojekyll`
- `server.js` : petit serveur statique, uniquement pour un aperçu local

## Dossier assets attendu

Le dossier `/assets/` doit contenir :

- `chrome-extension-store.jpg` (capture utilisée sur les pages extension)
- `og-extension-fr.png` et `og-extension-en.png` (1200×630)
- `apple-touch-icon.png` (180×180)
- `icon-192.png` et `icon-512.png`

Et à la racine : `og-image-fr.png` et `og-image-en.png` (1200×630).

## SEO

- Titles et meta descriptions inchangés
- canonical + `hreflang` FR / EN / x-default sur les 4 pages
- Open Graph et Twitter Cards par langue
- Schema.org : `WebSite`, `SoftwareApplication`, `BreadcrumbList`, `FAQPage`
- `sitemap.xml` bilingue avec alternates

Aucun build n'est nécessaire sur GitHub Pages. Publie la branche `main` depuis `/ (root)`.
