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

## Icônes et assets

Une seule marque partout : l'emoji 🤯 sur la tuile jaune de la charte, en vectoriel (aucune dépendance à la police emoji du système, le rendu est identique sur tous les navigateurs).

Dans `/assets/` :

- `favicon-16.png`, `favicon-32.png` : secours PNG du favicon pour les vieux navigateurs
- `apple-touch-icon.png` (180×180)
- `icon-192.png`, `icon-512.png` et `icon-512-maskable.png` : icônes PWA
- `og-extension-fr.png`, `og-extension-en.png` (1200×630) : images de partage des pages extension, aussi utilisées comme visuel dans leur hero

À la racine : `favicon.svg` (même marque, en vectoriel).

Dans `/extension-icons/` : `icon-16/32/48/128.png`, à mettre dans le package de l'extension Chrome et sur la fiche du Chrome Web Store pour aligner l'icône de l'extension sur celle du site. Ce dossier ne sert pas au site lui-même.

Encore à placer à la racine du dépôt : `og-image-fr.png` et `og-image-en.png` (1200×630), images de partage des deux pages d'accueil.

Le dessin de l'emoji provient de Noto Color Emoji (Google), sous licence Open Font License.

## SEO

- Titles et meta descriptions inchangés
- canonical + `hreflang` FR / EN / x-default sur les 4 pages
- Open Graph et Twitter Cards par langue
- Schema.org : `WebSite`, `SoftwareApplication`, `BreadcrumbList`, `FAQPage`
- `sitemap.xml` bilingue avec alternates

Aucun build n'est nécessaire sur GitHub Pages. Publie la branche `main` depuis `/ (root)`.
