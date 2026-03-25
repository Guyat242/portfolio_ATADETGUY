/* ============================================================
   PORTFOLIO GAÏUS v2 — main.js
   ============================================================ */

/* ── Cursor personnalisé ────────────────────────────────────── */
(function initCursor() {
  const cursor = document.querySelector('.cursor');
  const ring   = document.querySelector('.cursor-ring');
  if (!cursor || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Ring suit avec du lag
  (function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Hover effect
  document.querySelectorAll('a, button, .skill-card, .project-card, .tech-card, .contact-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); ring.classList.add('hover'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); ring.classList.remove('hover'); });
  });
})();

/* ── Canvas Particles ───────────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('canvas');
  const ctx    = canvas.getContext('2d');
  const COUNT  = 60;
  const particles = [];

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x       = Math.random() * canvas.width;
      this.y       = Math.random() * canvas.height;
      this.size    = Math.random() * 1.5 + 0.5;
      this.speedX  = Math.random() * 0.3 - 0.15;
      this.speedY  = Math.random() * 0.3 - 0.15;
      this.opacity = Math.random() * 0.25 + 0.05;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x > canvas.width)  this.x = 0;
      if (this.x < 0)             this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0)             this.y = canvas.height;
    }
    draw() {
      ctx.fillStyle = `rgba(0,255,180,${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          ctx.strokeStyle = `rgba(0,255,180,${0.08 * (1 - d / 130)})`;
          ctx.lineWidth   = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ── Hamburger ──────────────────────────────────────────────── */
(function initMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('open');
    menu.classList.toggle('open', open);
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => { btn.classList.remove('open'); menu.classList.remove('open'); });
  });
})();

/* ── Smooth Scroll ──────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

/* ── Scroll Reveal ──────────────────────────────────────────── */
(function initReveal() {
  const options = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' };
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, options);

  document.querySelectorAll('.timeline-item, .reveal').forEach(el => obs.observe(el));
})();

/* ── Slider Speed ───────────────────────────────────────────── */
(function initSliders() {
  function setSpeed() {
    document.querySelectorAll('.skills-slider').forEach(slider => {
      const count = slider.querySelectorAll('.skill-card').length / 2;
      slider.style.animationDuration = `${count * 4}s`;
    });
  }
  setSpeed();
  window.addEventListener('resize', setSpeed);
})();

/* ── Active nav link on scroll ──────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.style.color = '');
        const active = document.querySelector(`nav a[href="#${entry.target.id}"]`);
        if (active) active.style.color = 'var(--cyan)';
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
})();
