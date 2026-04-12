// Typing Animation
const words = [
  "Full Stack Developer",
  "Backend Developer",
  "Web Developer",
  "Tech Enthusiast",
  "Software Developer"
];

const typingSpan = document.getElementById("typing");

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let delay = 120;

function type() {
  if (!typingSpan) return;
  const word = words[wordIndex];
  const currentText = isDeleting
    ? word.substring(0, charIndex--)
    : word.substring(0, charIndex++);

  typingSpan.textContent = currentText;

  if (!isDeleting && charIndex === word.length + 1) {
    isDeleting = true;
    setTimeout(type, 1500);
    return;
  }

  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
  }

  setTimeout(type, isDeleting ? 60 : delay);
}

document.addEventListener("DOMContentLoaded", type);

// Image Card Flip
let isFlipped = false;

function toggleImage() {
  const inner = document.getElementById("image-card-inner");
  if (!inner) return;
  isFlipped = !isFlipped;
  inner.style.transform = isFlipped ? "rotateY(180deg)" : "rotateY(0deg)";
}

// Theme Toggle
const toggle = document.getElementById('theme-toggle');
if (toggle) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');

  if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
    toggle.classList.add('light');
  }

  toggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    toggle.classList.toggle('light');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateFlashlight();
  });
}

// Flashlight effect (dark mode only)
const flashlight = document.getElementById('flashlight-overlay');

function updateFlashlight() {
  if (!flashlight) return;
  const isLight = document.body.classList.contains('light-theme');
  if (isLight) {
    flashlight.classList.remove('active');
  } else {
    flashlight.classList.add('active');
  }
}

if (flashlight) {
  document.addEventListener('mousemove', (e) => {
    flashlight.style.setProperty('--mouse-x', e.clientX + 'px');
    flashlight.style.setProperty('--mouse-y', e.clientY + 'px');
  });

  updateFlashlight();
}

// Scroll-based active nav highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a');

function updateActiveNav() {
  const scrollY = window.scrollY + 150;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNav);
document.addEventListener('DOMContentLoaded', updateActiveNav);

// Smooth scroll for nav links
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});
