// Typing Animation
const words = [
  "Web Developer",
  "Backend Developer",
  "Web Designer",
  "Tech Enthusiast",
  "Software Developer"
];

const typingSpan = document.getElementById("typing");

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let delay = 120;

function type() {
  const word = words[wordIndex];
  const currentText = isDeleting
    ? word.substring(0, charIndex--)
    : word.substring(0, charIndex++);

  typingSpan.textContent = currentText;

  if (!isDeleting && charIndex === word.length + 1) {
    isDeleting = true;
    setTimeout(type, 1500); // pause before deleting
    return;
  }

  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
  }

  setTimeout(type, isDeleting ? 60 : delay);
}

document.addEventListener("DOMContentLoaded", type);

// Image Toggle Logic
let isRealImageShown = false;

function toggleImage() {
  const img = document.getElementById("profile-img");

  img.classList.add("flip");

  setTimeout(() => {
    if (isRealImageShown) {
      img.src = "images/sticker.webp";
      img.alt = "Click to reveal profile";
    } else {
      img.src = "images/profile.jpg";
      img.alt = "Yabetse Tesfaye";
    }

    isRealImageShown = !isRealImageShown;
  }, 150); // Halfway through flip

  setTimeout(() => {
    img.classList.remove("flip");
  }, 400); // End of flip
}

const toggle = document.getElementById('theme-toggle');
const icon = toggle.querySelector('i');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

const currentTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
document.body.classList.toggle('light-theme', currentTheme === 'light');
icon.classList.toggle('fa-sun', currentTheme === 'light');
icon.classList.toggle('fa-moon', currentTheme === 'dark');

toggle.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  icon.classList.toggle('fa-sun', isLight);
  icon.classList.toggle('fa-moon', !isLight);
});
