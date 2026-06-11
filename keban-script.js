// ===========================
// CUSTOM CURSOR
// ===========================
const cursorRing = document.getElementById('cursor-ring');
const cursorDot = document.getElementById('cursor-dot');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .service-card, .why-item, .gallery-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorRing.style.width = '52px';
    cursorRing.style.height = '52px';
    cursorRing.style.borderColor = '#f5a623';
  });
  el.addEventListener('mouseleave', () => {
    cursorRing.style.width = '36px';
    cursorRing.style.height = '36px';
    cursorRing.style.borderColor = '#f5a623';
  });
});

// ===========================
// PARTICLES CANVAS
// ===========================
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 2 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = (Math.random() - 0.5) * 0.25;
    this.alpha = Math.random() * 0.35 + 0.05;
    this.color = Math.random() > 0.5 ? '26,46,90' : '245,166,35';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function drawLines() {
  const maxD = 100;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < maxD) {
        const a = (1 - d / maxD) * 0.05;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(26,46,90,${a})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animParticles);
}
animParticles();

// ===========================
// NAVBAR SCROLL
// ===========================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveLinks();
});

function updateActiveLinks() {
  const sections = ['hero', 'services', 'about', 'contact'];
  const sy = window.scrollY + 120;
  sections.forEach(id => {
    const sec = document.getElementById(id);
    const link = document.getElementById(`nl-${id}`);
    if (!sec || !link) return;
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    link.classList.toggle('active', sy >= top && sy < bottom);
  });
}

// ===========================
// HAMBURGER MENU
// ===========================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mob-link, .mob-phone').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ===========================
// SCROLL REVEAL
// ===========================
const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => revealObserver.observe(el));

// ===========================
// COUNTERS ANIMATION
// ===========================
function animCount(el, target, dur = 1800) {
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const prog = Math.min((ts - start) / dur, 1);
    const eased = 1 - Math.pow(1 - prog, 3);
    el.textContent = Math.round(eased * target).toLocaleString();
    if (prog < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

let countsDone = false;
const statsEl = document.querySelector('.hero-stats');

const cntObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countsDone) {
    countsDone = true;
    document.querySelectorAll('.hstat-num').forEach(el => {
      animCount(el, parseInt(el.dataset.target));
    });
  }
}, { threshold: 0.5 });

if (statsEl) cntObserver.observe(statsEl);

// ===========================
// FORM SUBMISSION
// ===========================
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('form-submit-btn');
  const btnText = document.getElementById('btn-text');
  const success = document.getElementById('form-success');

  btn.style.opacity = '0.7';
  btn.style.pointerEvents = 'none';
  btnText.textContent = 'GÖNDERİLİYOR...';

  setTimeout(() => {
    btn.style.opacity = '1';
    btn.style.pointerEvents = 'all';
    btnText.textContent = 'MESAJ GÖNDER';
    success.classList.add('show');
    document.getElementById('contact-form').reset();
    setTimeout(() => success.classList.remove('show'), 5000);
  }, 1200);
}

// ===========================
// GALLERY HOVER 3D TILT
// ===========================
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    item.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.03)`;
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
  });
});

// ===========================
// SERVICE CARDS 3D TILT
// ===========================
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===========================
// WHY ITEM stagger reveal
// ===========================
const whyItems = document.querySelectorAll('.why-item');
const whyObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
      }, i * 120);
      whyObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

whyItems.forEach(item => {
  item.style.opacity = '0';
  item.style.transform = 'translateX(-30px)';
  item.style.transition = 'all 0.6s ease';
  whyObserver.observe(item);
});

// ===========================
// PAGE LOAD ANIMATION
// ===========================
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    setTimeout(() => { document.body.style.opacity = '1'; }, 50);
  });

  // Hero reveals
  setTimeout(() => {
    document.querySelectorAll('#hero .reveal-left').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 130);
    });
    document.querySelectorAll('#hero .reveal-right').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 130 + 200);
    });
  }, 300);
});

// ===========================
// SMOOTH SCROLL on nav links
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===========================
// NAVBAR HIDE/SHOW ON SCROLL
// ===========================
let lastScrollY = 0;
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (current > lastScrollY && current > 300) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }
  lastScrollY = current;
  navbar.style.transition = 'transform 0.4s ease, box-shadow 0.3s ease, height 0.3s ease';
});
