/* =========================================================================
   NOS MUSIQUES — logique du lecteur
   =========================================================================
   Tout ce dont vous avez besoin pour personnaliser le site est regroupé
   dans la section "CONFIGURATION" ci-dessous. Vous ne devriez jamais avoir
   à toucher au reste du fichier pour changer le contenu.
   ========================================================================= */

/* =========================================================================
   1. CONFIGURATION — modifiez ici
   ========================================================================= */

const CONFIG = {
  kicker: "Le Mariage",
  date: "29.08.2026",
  names: "Ambre & Marine",
  tagline: "La bande-son de notre mariage",
  coverImage: "assets/images/pochette.svg",
};

/* Tracklist : un seul tableau à modifier.
   - file  : chemin vers le fichier audio (assets/audio/...)
   - custom: true pour les 3 morceaux personnalisés du mariage           */
const tracks = [
  { number: 1,  title: "La Vie en Rose",                          artist: "Minnz Piano",                         file: "assets/audio/track-01.mp3", custom: false },
  { number: 2,  title: "Wrecking Ball",                           artist: "Midnite String Quartet",              file: "assets/audio/track-02.mp3", custom: false },
  { number: 3,  title: "Marry You",                                artist: "Bruno Mars",                          file: "assets/audio/track-03.mp3", custom: false },
  { number: 4,  title: "Sarà perché ti amo",                       artist: "Atlantic Notes",                      file: "assets/audio/track-04.mp3", custom: false },
  { number: 5,  title: "Head & Heart",                             artist: "Joel Corry, MNEK",                    file: "assets/audio/track-05.mp3", custom: false },
  { number: 6,  title: "Te rencontrer encore (version Marine Chauchis)",                     artist: "ESTL, Marine Chauchis",                              file: "assets/audio/track-06.mp3", custom: true  },
  { number: 7,  title: "Halo",                                     artist: "Caleb Chan, Brian Chan",              file: "assets/audio/track-07.mp3", custom: false },
  { number: 8,  title: "J'irai où tu iras",                        artist: "Céline Dion, Garou",                  file: "assets/audio/track-08.mp3", custom: false },
  { number: 9,  title: "Flamme",                                artist: "Juliette Armanet",                    file: "assets/audio/track-09.mp3", custom: false },
  { number: 10, title: "Gimme! Gimme! Gimme!",                     artist: "ABBA",                                file: "assets/audio/track-10.mp3", custom: false },
  { number: 11, title: "Feel This Moment",                         artist: "Pitbull, Christina Aguilera",         file: "assets/audio/track-11.mp3", custom: false },
  { number: 12, title: "Mauvais Garçon x Earned it",                      artist: "Helena, The Weeknd, Axelle Delorme, Maia Chabanel, Eva Robichon, Aimie Jollivet, Lorian Pagès",                                    file: "assets/audio/track-12.mp3", custom: true  },
  { number: 13, title: "Swing the mood",                           artist: "Jive Bunny",                          file: "assets/audio/track-13.mp3", custom: false },
  { number: 14, title: "Amour Parano",                             artist: "Djena Della",                         file: "assets/audio/track-14.mp3", custom: false },
  { number: 15, title: "L'arrivée de Jeanne",                      artist: "Puy du Fou",                          file: "assets/audio/track-15.mp3", custom: false },
  { number: 16, title: "La Costa de Galicia",                      artist: "Dan Ar Braz",                         file: "assets/audio/track-16.mp3", custom: false },
  { number: 17, title: "La Voltige",                                artist: "Puy du Fou",                          file: "assets/audio/track-17.mp3", custom: false },
  { number: 18, title: "Grand Final",                               artist: "Puy du Fou",                          file: "assets/audio/track-18.mp3", custom: false },
  { number: 19, title: "La Danse des Cabosses",                    artist: "Puy du Fou",                          file: "assets/audio/track-19.mp3", custom: false },
  { number: 20, title: "A Sky Full of Stars",                      artist: "Coldplay",                            file: "assets/audio/track-20.mp3", custom: false },
  { number: 21, title: "Ordinary x The Fate of Ophelia",           artist: "Alex Warren, Taylor Swift, Bastien Debray",                             file: "assets/audio/track-21.mp3", custom: true  },
];

/* =========================================================================
   2. INITIALISATION DU CONTENU STATIQUE
   ========================================================================= */

document.getElementById("albumKicker").textContent = CONFIG.kicker;
document.getElementById("albumDate").textContent = CONFIG.date;
document.getElementById("albumNames").textContent = CONFIG.names;
document.getElementById("albumTagline").textContent = CONFIG.tagline;
document.getElementById("trackCountLabel").textContent = `${tracks.length} titres`;
document.getElementById("coverImage").src = CONFIG.coverImage;
document.getElementById("miniCover").src = CONFIG.coverImage;
document.title = `Nos musiques — ${CONFIG.names}`;

/* =========================================================================
   3. ÉTAT DU LECTEUR
   ========================================================================= */

const audio = document.getElementById("audioEl");
const tracklistEl = document.getElementById("tracklist");

let currentIndex = -1;   // index du morceau chargé
let isPlaying = false;
let isPlayAllMode = false;
const unavailable = new Set(); // indices dont le fichier a échoué au chargement

/* =========================================================================
   4. CONSTRUCTION DE LA TRACKLIST
   ========================================================================= */

function buildTracklist() {
  tracklistEl.innerHTML = "";

  tracks.forEach((track, index) => {
    const li = document.createElement("li");
    li.className = "track";
    li.dataset.index = String(index);

    const num = String(track.number).padStart(2, "0");

    li.innerHTML = `
      <button class="track-btn" aria-label="Lire ${escapeAttr(track.title)}">
        <span class="track-number">${num}</span>
        <span class="track-marker" aria-hidden="true">
          <span class="eq"><span></span><span></span><span></span></span>
        </span>
        <span class="track-body">
          <span class="track-title">${escapeHtml(track.title)}</span>
          <span class="track-sub">
            ${track.artist ? `<span class="track-artist">${escapeHtml(track.artist)}</span>` : ""}
            ${track.custom ? `<span class="track-custom-tag">${track.artist ? "· " : ""}morceau personnalisé</span>` : ""}
          </span>
        </span>
      </button>
      <span class="track-status" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      </span>
    `;

    li.querySelector(".track-btn").addEventListener("click", () => {
      if (unavailable.has(index)) return;
      isPlayAllMode = true; // cliquer sur un morceau enchaîne la suite de l'album
      loadTrack(index, { autoplay: true });
    });

    tracklistEl.appendChild(li);
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}
function escapeAttr(str) { return escapeHtml(str); }

/* =========================================================================
   5. CHARGEMENT / LECTURE
   ========================================================================= */

function loadTrack(index, { autoplay = false } = {}) {
  if (index < 0 || index >= tracks.length) return;
  const track = tracks[index];

  currentIndex = index;
  audio.src = track.file;
  audio.currentTime = 0;

  updateActiveRow();
  updateMiniPlayer(track);
  updateMediaSession(track);
  showMiniPlayer(true);

  if (autoplay) {
    playCurrent();
  } else {
    setPlayingState(false);
  }
}

function playCurrent() {
  if (currentIndex === -1) {
    // "Tout écouter" depuis le tout début
    isPlayAllMode = true;
    loadTrack(0, { autoplay: true });
    return;
  }
  const p = audio.play();
  if (p && p.catch) {
    p.then(() => setPlayingState(true)).catch(() => setPlayingState(false));
  } else {
    setPlayingState(true);
  }
}

function pauseCurrent() {
  audio.pause();
  setPlayingState(false);
}

function togglePlay() {
  if (isPlaying) pauseCurrent();
  else playCurrent();
}

function playNext() {
  if (currentIndex + 1 < tracks.length) {
    loadTrack(currentIndex + 1, { autoplay: true });
  } else {
    // Fin de l'album : arrêt propre
    setPlayingState(false);
    isPlayAllMode = false;
  }
}

function playPrev() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  if (currentIndex - 1 >= 0) {
    loadTrack(currentIndex - 1, { autoplay: true });
  } else {
    audio.currentTime = 0;
  }
}

function setPlayingState(state) {
  isPlaying = state;

  const playAllBtn = document.getElementById("playAllBtn");
  playAllBtn.classList.toggle("is-playing", isPlaying);
  document.getElementById("playAllLabel").textContent = isPlaying ? "En écoute" : "Tout écouter";

  document.getElementById("miniPlay")
    .querySelector(".mp-icon-play").style.display = isPlaying ? "none" : "block";
  document.getElementById("miniPlay")
    .querySelector(".mp-icon-pause").style.display = isPlaying ? "block" : "none";

  document.querySelectorAll(".track.is-active").forEach((el) => {
    el.classList.toggle("is-paused-active", !isPlaying);
  });

  if ("mediaSession" in navigator) {
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }
}

/* =========================================================================
   6. AFFICHAGE — ligne active, mini-player, progression
   ========================================================================= */

function updateActiveRow() {
  document.querySelectorAll(".track").forEach((el) => {
    const idx = Number(el.dataset.index);
    el.classList.toggle("is-active", idx === currentIndex);
  });
}

function updateMiniPlayer(track) {
  document.getElementById("miniTitle").textContent = track.title;
  document.getElementById("miniArtist").textContent = track.artist || "Mix";
}

function showMiniPlayer(show) {
  document.getElementById("miniPlayer").classList.toggle("is-visible", show);
  document.getElementById("page").classList.toggle("has-mini-player", show);
}

function updateProgressUI() {
  const fill = document.getElementById("miniProgressFill");
  const track = document.getElementById("miniProgressTrack");
  if (!audio.duration || isNaN(audio.duration)) {
    fill.style.width = "0%";
    return;
  }
  const pct = (audio.currentTime / audio.duration) * 100;
  fill.style.width = `${pct}%`;
  track.setAttribute("aria-valuenow", String(Math.round(pct)));
}

/* =========================================================================
   7. MEDIA SESSION API — contrôles natifs du téléphone / verrouillage
   ========================================================================= */

function updateMediaSession(track) {
  if (!("mediaSession" in navigator)) return;

  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title,
    artist: track.artist || CONFIG.names,
    album: CONFIG.names,
    artwork: [
      { src: CONFIG.coverImage, sizes: "512x512", type: "image/svg+xml" },
    ],
  });

  navigator.mediaSession.setActionHandler("play", playCurrent);
  navigator.mediaSession.setActionHandler("pause", pauseCurrent);
  navigator.mediaSession.setActionHandler("previoustrack", playPrev);
  navigator.mediaSession.setActionHandler("nexttrack", playNext);
}

/* =========================================================================
   8. GESTION DES FICHIERS AUDIO MANQUANTS
   ========================================================================= */

audio.addEventListener("error", () => {
  if (currentIndex === -1) return;
  unavailable.add(currentIndex);

  const row = tracklistEl.querySelector(`.track[data-index="${currentIndex}"]`);
  if (row) {
    row.classList.add("is-unavailable");
    const status = row.querySelector(".track-status");
    if (status) status.innerHTML = `<span style="font-size:10.5px;">bientôt</span>`;
  }

  setPlayingState(false);

  // En mode "tout écouter", on passe poliment au morceau suivant.
  if (isPlayAllMode) {
    setTimeout(playNext, 300);
  }
});

/* =========================================================================
   9. ÉVÉNEMENTS AUDIO
   ========================================================================= */

audio.addEventListener("timeupdate", updateProgressUI);
audio.addEventListener("ended", () => {
  if (isPlayAllMode) {
    playNext();
  } else {
    setPlayingState(false);
  }
});
audio.addEventListener("play", () => setPlayingState(true));
audio.addEventListener("pause", () => { if (!audio.ended) setPlayingState(false); });

/* =========================================================================
   10. CONTRÔLES DE L'INTERFACE
   ========================================================================= */

document.getElementById("playAllBtn").addEventListener("click", () => {
  if (isPlaying) {
    pauseCurrent();
    return;
  }
  if (currentIndex === -1) {
    isPlayAllMode = true;
    loadTrack(0, { autoplay: true });
  } else {
    playCurrent();
  }
});

document.getElementById("miniPlay").addEventListener("click", togglePlay);
document.getElementById("miniNext").addEventListener("click", playNext);
document.getElementById("miniPrev").addEventListener("click", playPrev);

const miniProgressTrack = document.getElementById("miniProgressTrack");
function seekFromEvent(clientX) {
  if (!audio.duration || isNaN(audio.duration)) return;
  const rect = miniProgressTrack.getBoundingClientRect();
  const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  audio.currentTime = ratio * audio.duration;
}
miniProgressTrack.addEventListener("click", (e) => seekFromEvent(e.clientX));
miniProgressTrack.addEventListener("keydown", (e) => {
  if (!audio.duration) return;
  if (e.key === "ArrowRight") audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
  if (e.key === "ArrowLeft") audio.currentTime = Math.max(0, audio.currentTime - 5);
});

/* =========================================================================
   11. LANCEMENT
   ========================================================================= */

buildTracklist();
