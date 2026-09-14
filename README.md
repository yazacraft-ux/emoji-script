# Emoji Script

Site bilingue FR / EN prêt pour GitHub Pages, avec un design unique partagé par toutes les pages.

## URLs

| Français | English |
| --- | --- |
| `/` | `/en/` |
| `/syntaxe/` | `/en/syntax/` |
| `/exemples/` | `/en/examples/` |
| `/extension-chrome/` | `/en/extension-chrome/` |
| `/privacy.html` | `/en/privacy.html` |

## Fichiers

- `index.html` : accueil français
- `en/index.html` : accueil anglais
- `syntaxe/index.html` et `en/syntax/index.html` : référence complète de la syntaxe
- `exemples/index.html` et `en/examples/index.html` : dix scripts commentés
- `extension-chrome/index.html` : page extension française
- `en/extension-chrome/index.html` : page extension anglaise
- `privacy.html` et `en/privacy.html` : politique de confidentialité
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

À la racine également : `og-image-fr.png` et `og-image-en.png` (1200×630), images de partage des deux pages d'accueil.

Le dessin de l'emoji provient de Noto Color Emoji (Google), sous licence Open Font License.


## Fonctionnement du partage de scripts

Le bouton Partager du compilateur encode le script dans l'adresse, sous la forme `/#s=<script encodé>`. Ouvrir ce lien recharge le script dans l'éditeur. Les liens « Ouvrir dans le compilateur » des pages d'exemples utilisent le même mécanisme. Rien n'est envoyé à un serveur.

## Sécurité du compilateur

Le code saisi s'exécute dans un Web Worker isolé, avec un arrêt automatique après 2 secondes et un plafond de 400 lignes affichées. Les API réseau du worker sont neutralisées avant l'exécution, et chaque page déclare une Content-Security-Policy qui interdit l'évaluation de chaînes en JavaScript.

## Police

Inter est hébergée sur le site (`assets/fonts/inter-latin.woff2`, version variable, sous-ensemble latin, 47 Ko). Aucune requête vers Google Fonts.

## SEO

- Titles et meta descriptions inchangés
- canonical + `hreflang` FR / EN / x-default sur les 4 pages
- Open Graph et Twitter Cards par langue
- Schema.org : `WebSite`, `SoftwareApplication`, `BreadcrumbList`, `FAQPage`
- `sitemap.xml` bilingue avec alternates sur les 10 pages

Aucun build n'est nécessaire sur GitHub Pages. Publie la branche `main` depuis `/ (root)`.
