"use strict";

// 🗓 CAMBIA ESTA FECHA por el día que comenzaron
const ANNIVERSARY_DATE = new Date("2024-06-09T00:00:00");

let playlist = [
  { name: "San Lucas – Kevin Kaarl", id: "7-Ikexq03O0" },
  { name: "Vámonos a Marte – Kevin Kaarl", id: "mxCW-5nUidw" },
  { name: "Contenta – Ed Maverick", id: "0nk7cKBDpRw" },
  { name: "Ropa De Bazar – Ed Maverick", id: "pquJZEwPBjM" },
  { name: "Del Río – Ed Maverick", id: "DLh9mnfZvc0" },
  { name: "Acurrucar – Ed Maverick", id: "M0YKOq_lWSQ" },
  { name: "Me Vuelves Loco – Officialalex425", id: "uLMt57gOpCc" },
];

const RANDOM_PHRASES = [
  "Cada día contigo es mi favorito. 🌙",
  "Eres la razón de mis mejores momentos. ✨",
  "Con tus ojos, el mundo brilla diferente. 💫",
  "Mi felicidad tiene tu nombre. ❤️",
  "Contigo, hasta el silencio se siente bonito. 🌸",
  "Eres mi lugar favorito en el mundo. 🌟",
];

const REASONS = [
  "Porque tu sonrisa hace que todo valga la pena.",
  "Porque siempre sabes cómo hacerme sentir mejor.",
  "Porque tu forma de ver la vida me inspira.",
  "Porque contigo el tiempo siempre vuela.",
  "Porque eres única, auténtica e irreemplazable.",
  "Porque me haces reír como nadie más puede hacerlo.",
  "Porque tu presencia convierte lo ordinario en mágico.",
  "Porque tu corazón es el lugar más bonito que conozco.",
];

const SECRETS = [
  { icon: "💌", text: "Cada mañana, mi primer pensamiento eres tú." },
  { icon: "🌙", text: "Antes de dormir me pregunto qué estarás soñando." },
  { icon: "🌸", text: "Me enamoro de ti de nuevo cada vez que te ríes." },
  { icon: "⭐", text: "Guardo cada momento tuyo como un tesoro." },
  { icon: "🦋", text: "Tu nombre me produce mariposas todavía." },
  { icon: "🕯️", text: "Eres mi persona favorita en todo el universo." },
];

let currentSongIndex = 0;
let ytPlayer = null;
let ytReady = false;
let isPlaying = false;
let reasonIndex = 0;
let heartRainInterval = null;
let particleInterval = null;

const $ = (id) => document.getElementById(id);

// ── STARS ──────────────────────────────────────────────
function initStars() {
  const canvas = $("starsCanvas");
  const ctx = canvas.getContext("2d");
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.3,
      a: Math.random(),
      speed: Math.random() * 0.01 + 0.003,
      dir: Math.random() > 0.5 ? 1 : -1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((s) => {
      s.a += s.speed * s.dir;
      if (s.a > 1 || s.a < 0.05) s.dir *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(248,240,255,${s.a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
}

// ── HEARTS ─────────────────────────────────────────────
function burstHearts(count = 40) {
  const container = $("heartRain");
  const emojis = ["❤️", "💖", "💕", "💗", "💓", "🌸", "✨"];
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.className = "heart-drop";
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = Math.random() * 98 + "vw";
      el.style.fontSize = Math.random() * 1.2 + 0.8 + "rem";
      const dur = (Math.random() * 3 + 3).toFixed(1) + "s";
      el.style.animationDuration = dur;
      container.appendChild(el);
      setTimeout(() => el.remove(), parseFloat(dur) * 1000 + 200);
    }, i * 80);
  }
}

function startHeartLoop() {
  if (heartRainInterval) return;
  heartRainInterval = setInterval(() => burstHearts(6), 4000);
}

// ── PARTICLES ──────────────────────────────────────────
function spawnParticle() {
  const el = document.createElement("div");
  el.className = "particle";
  const size = Math.random() * 8 + 3;
  el.style.width = size + "px";
  el.style.height = size + "px";
  el.style.left = Math.random() * 100 + "vw";
  el.style.animationDuration = Math.random() * 8 + 6 + "s";
  el.style.animationDelay = "-" + Math.random() * 4 + "s";
  $("particles").appendChild(el);
  setTimeout(() => el.remove(), 15000);
}

function startParticles() {
  if (particleInterval) return;
  for (let i = 0; i < 10; i++) spawnParticle();
  particleInterval = setInterval(spawnParticle, 900);
}

// ── CONFETTI ───────────────────────────────────────────
function launchConfetti() {
  const colors = [
    "#ff6b9d",
    "#ffd700",
    "#c44dff",
    "#ff8fb8",
    "#7effb2",
    "#5ae0ff",
  ];
  const container = $("confettiContainer");
  for (let i = 0; i < 150; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.className = "confetti-piece";
      el.style.left = Math.random() * 100 + "vw";
      el.style.top = "-10px";
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      el.style.width = Math.random() * 8 + 5 + "px";
      el.style.height = Math.random() * 8 + 5 + "px";
      const dur = (Math.random() * 3 + 3).toFixed(1);
      el.style.animationDuration = dur + "s";
      el.style.animationDelay = (Math.random() * 2).toFixed(1) + "s";
      container.appendChild(el);
      setTimeout(() => el.remove(), (parseFloat(dur) + 2.5) * 1000);
    }, i * 30);
  }
}

// ── COUNTERS ───────────────────────────────────────────
function updateCounters() {
  const now = new Date();
  const diff = now - ANNIVERSARY_DATE;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  $("cDays").textContent = days;
  $("cHours").textContent = hours;
  $("cMinutes").textContent = minutes;

  const nextAnni = new Date(ANNIVERSARY_DATE);
  nextAnni.setFullYear(now.getFullYear());
  if (nextAnni <= now) nextAnni.setFullYear(now.getFullYear() + 1);
  const nd = nextAnni - now;
  $("nDays").textContent = Math.floor(nd / 86400000);
  $("nHours").textContent = Math.floor((nd % 86400000) / 3600000);
  $("nMinutes").textContent = Math.floor((nd % 3600000) / 60000);
}

// ── RANDOM PHRASE ──────────────────────────────────────
function setRandomPhrase() {
  $("randomPhrase").textContent =
    RANDOM_PHRASES[Math.floor(Math.random() * RANDOM_PHRASES.length)];
}

// ── REASONS ────────────────────────────────────────────
function initReasons() {
  showReason();
  $("nextReason").addEventListener("click", () => {
    reasonIndex = (reasonIndex + 1) % REASONS.length;
    showReason();
  });
}

function showReason() {
  const li = document.createElement("li");
  li.className = "reason-item";
  li.textContent = REASONS[reasonIndex];
  $("reasonsList").appendChild(li);
  li.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ── SECRET LETTERS ─────────────────────────────────────
function buildSecrets() {
  const grid = $("secretsGrid");
  SECRETS.forEach((s) => {
    const card = document.createElement("div");
    card.className = "secret-card";
    card.innerHTML = `<span class="secret-icon">${s.icon}</span><span class="secret-text">${s.text}</span>`;
    card.addEventListener("click", () => card.classList.toggle("opened"));
    grid.appendChild(card);
  });
}

// ── YOUTUBE PLAYER ─────────────────────────────────────
window.onYouTubeIframeAPIReady = function () {
  ytPlayer = new YT.Player("ytPlayer", {
    height: "1",
    width: "1",
    videoId: playlist[currentSongIndex].id,
    playerVars: { autoplay: 0, controls: 0, rel: 0, modestbranding: 1 },
    events: {
      onReady: () => {
        ytReady = true;
        renderSongList();
      },
      onStateChange: onPlayerStateChange,
    },
  });
};

function onPlayerStateChange(e) {
  if (e.data === YT.PlayerState.ENDED) nextSong();
  if (e.data === YT.PlayerState.PLAYING) setPlaying(true);
  if (e.data === YT.PlayerState.PAUSED) setPlaying(false);
}

function setPlaying(state) {
  isPlaying = state;
  $("playBtn").textContent = state ? "⏸" : "▶";
  document.querySelector(".visualizer").classList.toggle("playing", state);
  $("nowPlaying").textContent = state
    ? "♪ " + playlist[currentSongIndex].name
    : "— Pausado —";
  updateActiveSong();
}

function playSong(index) {
  if (!ytReady) return;
  currentSongIndex = index;
  ytPlayer.loadVideoById(playlist[index].id);
  ytPlayer.playVideo();
  $("nowPlaying").textContent = "♪ " + playlist[index].name;
  updateActiveSong();
}

function nextSong() {
  playSong((currentSongIndex + 1) % playlist.length);
}
function prevSong() {
  playSong((currentSongIndex - 1 + playlist.length) % playlist.length);
}

function renderSongList() {
  const ul = $("songList");
  ul.innerHTML = "";
  playlist.forEach((s, i) => {
    const li = document.createElement("li");
    li.className = "song-item" + (i === currentSongIndex ? " active" : "");
    li.textContent = s.name;
    li.addEventListener("click", () => playSong(i));
    ul.appendChild(li);
  });
}

function updateActiveSong() {
  document
    .querySelectorAll(".song-item")
    .forEach((el, i) => el.classList.toggle("active", i === currentSongIndex));
}

function extractYTId(url) {
  const patterns = [
    /[?&]v=([^&#]+)/,
    /youtu\.be\/([^?#]+)/,
    /embed\/([^?#]+)/,
    /shorts\/([^?#]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function initPlayerControls() {
  $("playBtn").addEventListener("click", () => {
    if (!ytReady) return;
    isPlaying ? ytPlayer.pauseVideo() : ytPlayer.playVideo();
  });
  $("nextBtn").addEventListener("click", nextSong);
  $("prevBtn").addEventListener("click", prevSong);
  $("addSongBtn").addEventListener("click", () => {
    const url = $("songUrl").value.trim();
    const name = $("songName").value.trim() || "Canción sin nombre";
    if (!url) return;
    const id = extractYTId(url);
    if (!id) {
      alert("Enlace de YouTube no válido");
      return;
    }
    playlist.push({ name, id });
    $("songUrl").value = "";
    $("songName").value = "";
    renderSongList();
  });
}

// ── ENVELOPE ───────────────────────────────────────────
function initEnvelope() {
  const env = $("envelope");
  let opened = false;

  env.addEventListener("click", () => {
    if (opened) return;
    opened = true;
    env.classList.add("open");
    burstHearts(50);

    const sections = [
      "counters",
      "letter",
      "lumiMeaning",
      "reasons",
      "secrets",
      "playlist",
      "finaleSection",
    ];
    sections.forEach((id, i) => {
      setTimeout(
        () => {
          const el = $(id);
          if (el) el.classList.remove("hidden");
        },
        400 + i * 280,
      );
    });

    setTimeout(() => {
      setRandomPhrase();
      updateCounters();
      setInterval(updateCounters, 30000);
      initReasons();
      buildSecrets();
      initPlayerControls();
      startHeartLoop();
      startParticles();
      launchConfetti();
    }, 500);

    setTimeout(
      () => {
        $("letter").scrollIntoView({ behavior: "smooth", block: "start" });
      },
      sections.length * 280 + 800,
    );
  });
}

// ── GATE ───────────────────────────────────────────────
function initGate() {
  $("startBtn").addEventListener("click", () => {
    const gate = $("autoplayGate");
    gate.style.transition = "opacity 0.8s";
    gate.style.opacity = "0";
    setTimeout(() => (gate.style.display = "none"), 850);
  });
}

// ── FINALE ─────────────────────────────────────────────
function initFinale() {
  $("triggerFinale").addEventListener("click", startFinale);
  $("closeFinale").addEventListener("click", () =>
    $("finale").classList.add("hidden"),
  );
}

function startFinale() {
  $("finale").classList.remove("hidden");
  launchConfetti();
  drawStarName($("starNameCanvas"), "Lumi");

  [$("finaleLine1"), $("finaleLine2"), $("finaleLine3")].forEach((l, i) => {
    setTimeout(
      () => {
        l.classList.remove("hidden");
        requestAnimationFrame(() =>
          requestAnimationFrame(() => l.classList.add("show")),
        );
      },
      2000 + i * 1800,
    );
  });

  setTimeout(() => $("closeFinale").classList.remove("hidden"), 8000);
}

function drawStarName(canvas, name) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");

  const off = document.createElement("canvas");
  off.width = canvas.width;
  off.height = canvas.height;
  const octx = off.getContext("2d");
  const fontSize = Math.min(canvas.width * 0.22, 180);
  octx.font = `bold ${fontSize}px 'Playfair Display', serif`;
  octx.fillStyle = "#fff";
  octx.textAlign = "center";
  octx.textBaseline = "middle";
  octx.fillText(name, canvas.width / 2, canvas.height / 2);

  const data = octx.getImageData(0, 0, canvas.width, canvas.height).data;
  const stars = [];
  const step = 5;
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      if (data[(y * canvas.width + x) * 4 + 3] > 128) {
        stars.push({
          x: x + (Math.random() * step - step / 2),
          y: y + (Math.random() * step - step / 2),
          r: Math.random() * 2 + 0.5,
          a: 0,
          speed: Math.random() * 0.015 + 0.008,
          delay: Math.random() * 2000,
          born: Date.now(),
        });
      }
    }
  }

  const bgStars = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.2 + 0.2,
    a: Math.random() * 0.5,
    speed: Math.random() * 0.008 + 0.002,
    dir: 1,
  }));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const now = Date.now();
    bgStars.forEach((s) => {
      s.a += s.speed * 0.02 * s.dir;
      if (s.a > 0.5 || s.a < 0) s.dir *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,180,255,${Math.abs(s.a)})`;
      ctx.fill();
    });
    stars.forEach((s) => {
      if (now - s.born - s.delay < 0) return;
      s.a = Math.min(s.a + s.speed, 1);
      const flicker = 0.7 + 0.3 * Math.sin(now * 0.003 + s.x);
      const ratio = s.x / canvas.width;
      const g = Math.round(215 - ratio * 108);
      const b = Math.round(ratio * 157);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,${g},${b},${s.a * flicker})`;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// ── INIT ───────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initStars();
  initGate();
  initEnvelope();
  initFinale();
});
