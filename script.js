/* ================================================
   YABETSE PORTFOLIO - script.js
   ================================================ */

/* ---------- TYPING ANIMATION ---------- */
const words = [
  'Full Stack Developer',
  'Backend Developer',
  'Problem Solver',
  'Web Developer',
  'Tech Enthusiast',
];

const typingEl = document.getElementById('role-typing');
let wIdx = 0, cIdx = 0, deleting = false;

function type() {
  if (!typingEl) return;
  const word = words[wIdx];
  typingEl.textContent = deleting
    ? word.substring(0, cIdx--)
    : word.substring(0, cIdx++);

  if (!deleting && cIdx === word.length + 1) {
    deleting = true;
    return setTimeout(type, 1800);
  }
  if (deleting && cIdx === 0) {
    deleting = false;
    wIdx = (wIdx + 1) % words.length;
  }
  setTimeout(type, deleting ? 55 : 115);
}

document.addEventListener('DOMContentLoaded', type);


/* ---------- PROFILE CARD FLIP ---------- */
let flipped = false;

function toggleImage() {
  const inner = document.getElementById('image-card-inner');
  if (!inner) return;
  flipped = !flipped;
  inner.style.transform = flipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
}


/* ---------- THEME TOGGLE ---------- */
const themeToggle = document.getElementById('theme-toggle');

if (themeToggle) {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');

  if (theme === 'light') {
    document.body.classList.add('light-theme');
    themeToggle.classList.add('light');
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    themeToggle.classList.toggle('light');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}


/* ---------- ACTIVE NAV HIGHLIGHT ---------- */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('nav a');

function updateNav() {
  const scrollY = window.scrollY + 180;
  sections.forEach(sec => {
    const id = sec.getAttribute('id');
    if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    }
  });
}

window.addEventListener('scroll', updateNav, { passive: true });
document.addEventListener('DOMContentLoaded', updateNav);


/* ---------- SMOOTH SCROLL ---------- */
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href.startsWith('#')) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});


/* ---------- SCROLL REVEAL ---------- */
const revealEls = document.querySelectorAll('.reveal');

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = parseInt(entry.target.dataset.delay || 0);
    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.08 });

revealEls.forEach(el => revealObs.observe(el));


/* ---------- COUNTER ANIMATION ---------- */
function formatCountValue(value, prefix = '', suffix = '') {
  return `${prefix}${Math.round(value).toLocaleString()}${suffix}`;
}

function animateCount(el, target, ms = 1400, options = {}) {
  if (!el) return;
  const prefix = options.prefix || '';
  const suffix = options.suffix || '';
  if (el._countFrame) cancelAnimationFrame(el._countFrame);
  if (target === 0) {
    el.textContent = formatCountValue(0, prefix, suffix);
    return;
  }
  const start = performance.now();
  const update = now => {
    const p = Math.min((now - start) / ms, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = formatCountValue(ease * target, prefix, suffix);
    if (p < 1) {
      el._countFrame = requestAnimationFrame(update);
    } else {
      el._countFrame = null;
    }
  };
  el._countFrame = requestAnimationFrame(update);
}

function resetCount(el) {
  if (!el) return;
  if (el._countFrame) cancelAnimationFrame(el._countFrame);
  el._countFrame = null;
  el.textContent = formatCountValue(0, el.dataset.prefix || '', el.dataset.suffix || '');
}

function playTypingStats() {
  document.querySelectorAll('#typing .count-up').forEach(el => {
    animateCount(el, Number(el.dataset.target || 0), 1300, {
      prefix: el.dataset.prefix || '',
      suffix: el.dataset.suffix || '',
    });
  });
}

function resetTypingStats() {
  document.querySelectorAll('#typing .count-up').forEach(resetCount);
}


/* ---------- LEETCODE CANVAS DONUT ---------- */
let leetAnimationFrame = null;
let leetBarsTimeout = null;
let leetInView = false;
let latestLeetStats = null;
let latestLeetTotals = null;

function renderLeetDonut(easy, medium, hard, progress = 1) {
  const canvas = document.getElementById('leetDonut');
  if (!canvas) return;

  const dpr  = window.devicePixelRatio || 1;
  const size = 180;
  canvas.width  = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width  = size + 'px';
  canvas.style.height = size + 'px';

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const cx    = size / 2;
  const cy    = size / 2;
  const R     = 72;
  const lw    = 15;
  const total = easy + medium + hard;

  const segments = total > 0
    ? [
        { val: easy,   color: '#00b8a9' },
        { val: medium, color: '#ffc01e' },
        { val: hard,   color: '#ef4743' },
      ]
    : [];

  ctx.clearRect(0, 0, size, size);

  // Background track
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth   = lw;
  ctx.stroke();

  if (total === 0) return;

  const gap     = 0.04;
  const filled  = segments.filter(s => s.val > 0);
  const totalAngle = 2 * Math.PI - filled.length * gap;
  let start     = -0.01;

  filled.forEach(seg => {
    const fullAngle = (seg.val / total) * totalAngle;
    const drawAngle = fullAngle * progress;

    ctx.beginPath();
    ctx.arc(cx, cy, R, start, start + drawAngle);
    ctx.strokeStyle = seg.color;
    ctx.lineWidth   = lw;
    ctx.lineCap     = 'round';
    ctx.stroke();
    start += fullAngle + gap;
  });
}

function playLeetAnimation(stats = latestLeetStats, totals = latestLeetTotals) {
  if (!stats || !totals) return;
  if (leetAnimationFrame) cancelAnimationFrame(leetAnimationFrame);

  latestLeetStats = stats;
  latestLeetTotals = totals;
  resetLeetStats(false);

  const totalSolved = stats.total || (stats.easy + stats.medium + stats.hard);
  const totalEl = document.getElementById('donut-total');
  if (totalEl) animateCount(totalEl, totalSolved, 1500);

  const rankEl = document.getElementById('leet-rank');
  if (rankEl) rankEl.textContent = stats.rank > 0 ? `#${stats.rank.toLocaleString()}` : '...';

  const accEl = document.getElementById('leet-acceptance');
  if (accEl) accEl.textContent = stats.acc > 0 ? `${stats.acc.toFixed(1)}%` : '...';

  setText('leet-easy',   `${stats.easy}/${totals.easy}`);
  setText('leet-medium', `${stats.medium}/${totals.medium}`);
  setText('leet-hard',   `${stats.hard}/${totals.hard}`);

  if (leetBarsTimeout) clearTimeout(leetBarsTimeout);
  leetBarsTimeout = setTimeout(() => {
    setWidth('leet-easy-bar',   pct(stats.easy, totals.easy));
    setWidth('leet-medium-bar', pct(stats.medium, totals.medium));
    setWidth('leet-hard-bar',   pct(stats.hard, totals.hard));
    leetBarsTimeout = null;
  }, 180);

  const duration = 1500;
  const started = performance.now();

  function frame(now) {
    const p = Math.min((now - started) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 2);
    renderLeetDonut(stats.easy, stats.medium, stats.hard, ease);
    if (p < 1) {
      leetAnimationFrame = requestAnimationFrame(frame);
    } else {
      leetAnimationFrame = null;
    }
  }

  leetAnimationFrame = requestAnimationFrame(frame);
}

function resetLeetStats(clearText = true) {
  if (leetAnimationFrame) cancelAnimationFrame(leetAnimationFrame);
  if (leetBarsTimeout) clearTimeout(leetBarsTimeout);
  leetAnimationFrame = null;
  leetBarsTimeout = null;
  renderLeetDonut(0, 0, 0);
  setWidth('leet-easy-bar', 0);
  setWidth('leet-medium-bar', 0);
  setWidth('leet-hard-bar', 0);

  if (!clearText) return;
  const totalEl = document.getElementById('donut-total');
  if (totalEl) {
    if (totalEl._countFrame) cancelAnimationFrame(totalEl._countFrame);
    totalEl._countFrame = null;
    totalEl.textContent = '...';
  }
  setText('leet-easy', '...');
  setText('leet-medium', '...');
  setText('leet-hard', '...');
  setText('leet-rank', '...');
  setText('leet-acceptance', '...');
}

/* ---------- TYPING STATS WHEN VISIBLE ---------- */
const typingSection = document.getElementById('typing');
if (typingSection) {
  resetTypingStats();
  const typingObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      playTypingStats();
    } else {
      resetTypingStats();
    }
  }, { threshold: 0.28 });
  typingObs.observe(typingSection);
}


/* ---------- LEETCODE DATA FETCH ---------- */
let leetLoaded = false;

async function loadLeetCode() {
  if (leetLoaded) {
    if (leetInView) playLeetAnimation();
    return;
  }
  leetLoaded = true;

  const username = 'yabtesfu';

  try {
    // Primary API
    const res = await fetch(
      `https://leetcode-stats-api.herokuapp.com/${username}`,
      { signal: AbortSignal.timeout(6000) }
    );
    if (!res.ok) throw new Error('primary failed');
    const d = await res.json();
    if (!d || d.status === 'error') throw new Error('bad data');
    applyLeetStats(d);
  } catch {
    try {
      // Backup API
      const res2 = await fetch(
        `https://alfa-leetcode-api.onrender.com/${username}/solved`,
        { signal: AbortSignal.timeout(7000) }
      );
      if (!res2.ok) throw new Error('backup failed');
      const d2 = await res2.json();
      applyLeetStatsBackup(d2);
    } catch {
      showLeetFallback();
    }
  }
}

function applyLeetStats(d) {
  const total  = d.totalSolved  || 0;
  const easy   = d.easySolved   || 0;  const tEasy   = d.totalEasy   || 881;
  const medium = d.mediumSolved || 0;  const tMed    = d.totalMedium || 1844;
  const hard   = d.hardSolved   || 0;  const tHard   = d.totalHard   || 810;
  const rank   = d.ranking      || 0;
  const acc    = d.acceptanceRate || 0;

  latestLeetStats = { easy, medium, hard, rank, acc, total };
  latestLeetTotals = { easy: tEasy, medium: tMed, hard: tHard };
  if (leetInView) playLeetAnimation();
}

function applyLeetStatsBackup(d) {
  const easy   = d.easySolved   || 0;
  const medium = d.mediumSolved || 0;
  const hard   = d.hardSolved   || 0;
  const total  = (d.solvedProblem || d.totalSolved) || (easy + medium + hard);

  latestLeetStats = { easy, medium, hard, rank: 0, acc: 0, total };
  latestLeetTotals = { easy: 881, medium: 1844, hard: 810 };
  if (leetInView) playLeetAnimation();
}

function showLeetFallback() {
  // Show loading-style placeholders and draw an empty-ish donut.
  resetLeetStats();
}

// Helpers
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setWidth(id, w) {
  const el = document.getElementById(id);
  if (el) el.style.width = w + '%';
}

function pct(n, total) {
  return total > 0 ? Math.round((n / total) * 100) : 0;
}


/* ---------- TRIGGER LEETCODE WHEN VISIBLE ---------- */
const leetSection = document.getElementById('leetcode');
if (leetSection) {
  resetLeetStats();
  const lObs = new IntersectionObserver(entries => {
    leetInView = entries[0].isIntersecting;
    if (leetInView) {
      loadLeetCode();
    } else {
      resetLeetStats();
    }
  }, { threshold: 0.28 });
  lObs.observe(leetSection);
}


/* ---------- HEADER SCROLL SHADOW ---------- */
const headerEl = document.getElementById('site-header');
if (headerEl) {
  window.addEventListener('scroll', () => {
    headerEl.style.boxShadow = window.scrollY > 20
      ? '0 1px 30px rgba(0,0,0,0.3)'
      : 'none';
  }, { passive: true });
}
