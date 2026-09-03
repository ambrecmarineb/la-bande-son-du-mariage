# Nos musiques — album numérique de mariage

Page web mobile-first pensée pour être ouverte depuis un QR Code (livret de CD).
HTML / CSS / JavaScript vanilla — aucune dépendance à installer, aucune base de données.

```
/index.html
/style.css
/script.js
/README.md
/assets/
    /images/
        cover-placeholder.svg
    /audio/
        track-01.mp3 ... track-21.mp3   (silence, à remplacer)
```

---

## 1. Ajouter vos 21 fichiers audio

Dans `assets/audio/`, remplacez les fichiers `track-01.mp3` à `track-21.mp3` par vos vrais morceaux, **en gardant exactement les mêmes noms**.

Si vous préférez d'autres noms de fichiers, ouvrez `script.js` et modifiez le champ `file` du morceau correspondant, par exemple :

```javascript
{ number: 1, title: "La Vie en Rose", artist: "Minnz Piano", file: "assets/audio/ma-chanson.mp3", custom: false },
```

Pour les **3 morceaux personnalisés** du mariage, déposez vos fichiers ici :

| Morceau | Fichier à remplacer |
|---|---|
| 06 — Te rencontrer encore | `assets/audio/track-06.mp3` |
| 12 — Mix Surprise Filles | `assets/audio/track-12.mp3` |
| 21 — Ordinary x The Fate of Ophelia | `assets/audio/track-21.mp3` |

Tant qu'un fichier n'est pas remplacé, la page ne plante pas : le morceau est simplement marqué comme bientôt disponible.

**Poids conseillé** : privilégiez du MP3 encodé autour de 128–192 kbps pour rester léger sur mobile (un CD entier en 320 kbps peut représenter plusieurs centaines de Mo).

---

## 2. Remplacer l'image de couverture

Remplacez `assets/images/cover-placeholder.svg` par votre visuel définitif (idéalement un carré, au moins 1000×1000 px, en `.jpg`, `.png` ou `.webp`).

Puis, dans `script.js`, mettez à jour la ligne :

```javascript
coverImage: "assets/images/cover-placeholder.svg",
```

par exemple :

```javascript
coverImage: "assets/images/pochette.jpg",
```

---

## 3. Modifier les prénoms, la date et le titre

Tout se passe en haut de `script.js`, dans le bloc `CONFIG` :

```javascript
const CONFIG = {
  kicker: "Nos musiques",
  date: "29.08.2026",
  names: "Ambre & Prénom",
  tagline: "La bande-son de notre mariage",
  coverImage: "assets/images/cover-placeholder.svg",
};
```

Remplacez `"Prénom"` par le prénom souhaité, ajustez la date et la phrase d'introduction (`tagline`) librement.

---

## 4. Modifier la tracklist

Toujours dans `script.js`, le tableau `tracks` contient un objet par morceau :

```javascript
{ number: 6, title: "Te rencontrer encore", artist: "Marine", file: "assets/audio/track-06.mp3", custom: true },
```

- `number` : position dans l'album
- `title` / `artist` : affichés dans la liste
- `file` : chemin du fichier audio
- `custom: true` fait apparaître la mention discrète « morceau personnalisé »

Vous pouvez ajouter, supprimer ou réordonner des morceaux directement dans ce tableau : la page se reconstruit automatiquement.

---

## 5. Modifier les couleurs et les typographies

Tout est centralisé en haut de `style.css`, dans le bloc `:root` :

```css
:root {
  --cream: #FFFBF7;
  --pink-pale: #FCE5E1;
  --yellow-pale: #FFE1B7;

  --orange: #E95515;
  --fuchsia: #E61661;
  --yellow: #FABC4F;

  --font-display: "Fraunces", "Iowan Old Style", "Georgia", serif;
  --font-body: "Manrope", "Segoe UI", sans-serif;
}
```

Changez simplement les valeurs hexadécimales ou les noms de police. Si vous changez de police, pensez aussi à mettre à jour le lien Google Fonts dans le `<head>` de `index.html`.

---

## 6. Mettre le site en ligne gratuitement

### Option A — Netlify (glisser-déposer, le plus simple)

1. Allez sur [app.netlify.com/drop](https://app.netlify.com/drop)
2. Glissez le dossier complet du projet (celui qui contient `index.html`) dans la zone prévue
3. Netlify vous donne une URL en quelques secondes (ex. `https://votre-album.netlify.app`)
4. Générez un QR Code pointant vers cette URL (par exemple sur [qr-code-generator.com](https://www.qr-code-generator.com)) et intégrez-le au livret du CD

Vous pouvez ensuite personnaliser le sous-domaine dans les réglages du site Netlify.

### Option B — GitHub Pages

1. Créez un dépôt GitHub et déposez-y tous les fichiers du projet
2. Dans les réglages du dépôt : **Settings → Pages**
3. Choisissez la branche `main` et le dossier racine `/`
4. GitHub vous fournit une URL du type `https://votre-nom.github.io/votre-depot/`

---

## 7. Vérifications rapides avant impression du QR Code

- Ouvrez l'URL finale sur un vrai smartphone (pas seulement en simulation)
- Testez « Tout écouter », le clic direct sur un morceau, précédent/suivant
- Vérifiez que le mini-lecteur apparaît bien en bas de l'écran pendant la lecture
- Verrouillez l'écran du téléphone pendant la lecture pour vérifier les contrôles natifs
- Testez avec le Wi-Fi coupé et la 4G pour juger du temps de chargement

Bon mariage ! 🥂
