// Nav scroll state
const nav = document.getElementById('site-nav');
function updateNav() {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// Hamburger
const hamburger = document.getElementById('nav-hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Floor plan tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${tab}`).classList.add('active');
  });
});

// Lightbox — uses data-full for high-res version
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
let currentGallery = [];
let currentIndex = 0;

function openLightbox(photos, index) {
  currentGallery = photos;
  currentIndex = index;
  lightboxImg.src = currentGallery[currentIndex].dataset.full || currentGallery[currentIndex].src;
  lightbox.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    lightbox.style.opacity = '1';
  }));
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.style.opacity = '0';
  setTimeout(() => { lightbox.hidden = true; }, 240);
  document.body.style.overflow = '';
}

function showPhoto(index) {
  currentIndex = (index + currentGallery.length) % currentGallery.length;
  lightboxImg.src = currentGallery[currentIndex].dataset.full || currentGallery[currentIndex].src;
}

document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
document.getElementById('lightbox-prev').addEventListener('click', () => showPhoto(currentIndex - 1));
document.getElementById('lightbox-next').addEventListener('click', () => showPhoto(currentIndex + 1));

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPhoto(currentIndex - 1);
  if (e.key === 'ArrowRight') showPhoto(currentIndex + 1);
});

// Wire up gallery grid
const galleryGrid = document.getElementById('gallery-grid');
if (galleryGrid) {
  const photos = Array.from(galleryGrid.querySelectorAll('.grid-photo'));
  photos.forEach((photo, i) => {
    photo.addEventListener('click', () => openLightbox(photos, i));
  });
}

// Map lightbox
const mapImg = document.querySelector('.map-img[data-full]');
if (mapImg) {
  mapImg.addEventListener('click', () => openLightbox([mapImg], 0));
}

// Contact form — Formspree async submit
const contactForm = document.getElementById('contact-form');
const contactSuccess = document.getElementById('contact-success');

if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(contactForm);
    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        contactForm.hidden = true;
        contactSuccess.hidden = false;
      } else {
        alert('Something went wrong. Please email claudia.zivko@mail.com directly.');
      }
    } catch {
      alert('Something went wrong. Please email claudia.zivko@mail.com directly.');
    }
  });
}
