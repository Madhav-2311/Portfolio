/* ==============================================
   MADHAVAN S — PORTFOLIO JAVASCRIPT
   ============================================== */

(function () {
  'use strict';

  // ============================================
  // 1. IMMERSIVE SPACE PARALLAX BACKGROUND
  // ============================================
  const canvas = document.getElementById('spaceCanvas');
  const ctx = canvas.getContext('2d');
  let canvasW, canvasH;
  let mouseXNorm = 0.5, mouseYNorm = 0.5; // Normalized 0-1

  function resizeCanvas() {
    canvasW = canvas.width = window.innerWidth;
    canvasH = canvas.height = window.innerHeight;
  }

  // Generate stars
  const STAR_COUNT = 280;
  const stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.8 + 0.3,
      depth: Math.random(), // 0 = far, 1 = near
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
    });
  }

  // Generate planets
  const planets = [
    { x: 0.15, y: 0.25, r: 45, color: '#4a3f8a', ring: true, depth: 0.6 },
    { x: 0.82, y: 0.65, r: 28, color: '#2d6a4f', ring: false, depth: 0.45 },
    { x: 0.55, y: 0.12, r: 18, color: '#8b5e3c', ring: false, depth: 0.3 },
    { x: 0.9, y: 0.2, r: 12, color: '#6c5ce7', ring: false, depth: 0.2 },
    { x: 0.35, y: 0.8, r: 22, color: '#2c3e6b', ring: true, depth: 0.5 },
  ];

  // Nebula clouds
  const nebulae = [
    { x: 0.3, y: 0.4, r: 250, color: 'rgba(108, 92, 231, 0.03)', depth: 0.15 },
    { x: 0.7, y: 0.2, r: 300, color: 'rgba(116, 185, 255, 0.025)', depth: 0.1 },
    { x: 0.5, y: 0.75, r: 200, color: 'rgba(162, 155, 254, 0.02)', depth: 0.12 },
  ];

  let time = 0;

  function drawSpace() {
    ctx.clearRect(0, 0, canvasW, canvasH);

    const parallaxX = (mouseXNorm - 0.5) * 2;
    const parallaxY = (mouseYNorm - 0.5) * 2;

    // Draw nebulae
    for (const n of nebulae) {
      const offsetX = parallaxX * n.depth * 60;
      const offsetY = parallaxY * n.depth * 60;
      const nx = n.x * canvasW + offsetX;
      const ny = n.y * canvasH + offsetY;

      const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.r);
      grad.addColorStop(0, n.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(nx, ny, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw stars with parallax + twinkle
    for (const s of stars) {
      const offsetX = parallaxX * s.depth * 40;
      const offsetY = parallaxY * s.depth * 40;
      const sx = s.x * canvasW + offsetX;
      const sy = s.y * canvasH + offsetY;

      const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(time * s.twinkleSpeed + s.twinkleOffset));
      const alpha = twinkle * (0.3 + s.depth * 0.7);

      ctx.beginPath();
      ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 220, 255, ${alpha})`;
      ctx.fill();

      // Add glow to bright stars
      if (s.r > 1.2) {
        ctx.beginPath();
        ctx.arc(sx, sy, s.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(162, 155, 254, ${alpha * 0.1})`;
        ctx.fill();
      }
    }

    // Draw planets
    for (const p of planets) {
      const offsetX = parallaxX * p.depth * 80;
      const offsetY = parallaxY * p.depth * 80;
      const px = p.x * canvasW + offsetX;
      const py = p.y * canvasH + offsetY;

      // Atmosphere glow
      const glowGrad = ctx.createRadialGradient(px, py, p.r * 0.8, px, py, p.r * 2.5);
      glowGrad.addColorStop(0, p.color + '30');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(px, py, p.r * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Planet body
      const bodyGrad = ctx.createRadialGradient(px - p.r * 0.3, py - p.r * 0.3, 0, px, py, p.r);
      bodyGrad.addColorStop(0, p.color);
      bodyGrad.addColorStop(1, '#0a0a18');
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fill();

      // Ring
      if (p.ring) {
        ctx.save();
        ctx.translate(px, py);
        ctx.scale(1, 0.35);
        ctx.strokeStyle = p.color + '60';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, p.r * 1.7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, p.r * 2.0, 0, Math.PI * 2);
        ctx.strokeStyle = p.color + '30';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }
    }

    // Occasional shooting star
    if (Math.random() < 0.002) {
      drawShootingStar();
    }

    time++;
    requestAnimationFrame(drawSpace);
  }

  function drawShootingStar() {
    const sx = Math.random() * canvasW;
    const sy = Math.random() * canvasH * 0.5;
    const len = 80 + Math.random() * 60;
    const angle = Math.PI / 4 + Math.random() * 0.3;

    const grad = ctx.createLinearGradient(sx, sy, sx + Math.cos(angle) * len, sy + Math.sin(angle) * len);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    grad.addColorStop(1, 'transparent');

    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + Math.cos(angle) * len, sy + Math.sin(angle) * len);
    ctx.stroke();
  }

  resizeCanvas();
  drawSpace();

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 200);
  });

  // Track mouse for parallax
  document.addEventListener('mousemove', (e) => {
    mouseXNorm = e.clientX / window.innerWidth;
    mouseYNorm = e.clientY / window.innerHeight;
  });

  // Cursor logic removed

  // ============================================
  // 3. NAVIGATION
  // ============================================
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  allNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Active section highlight
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 200;
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        allNavLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ============================================
  // 4. PROJECT CARD GLOW ON MOUSE MOVE
  // ============================================
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // ============================================
  // 5. SCROLL REVEAL ANIMATIONS
  // ============================================
  document.querySelectorAll('.achievement-item').forEach((item, index) => {
    item.style.transitionDelay = `${index * 120}ms`;
    requestAnimationFrame(() => item.classList.add('visible'));
  });

const contactForm = document.getElementById('contactForm'); 
const submitBtn = document.getElementById('submitBtn'); 
const toast = document.getElementById('toast'); 
const toastMessage = document.getElementById('toastMessage'); 

function showToast(message, isError = false) { 
    toastMessage.textContent = message; 
    toast.classList.add('show'); 
    
    const toastIcon = toast.querySelector('.toast-icon');
    if (toastIcon) {
        toastIcon.style.color = isError ? '#e74c3c' : '#2ecc71'; 
    }

    setTimeout(() => { 
        toast.classList.remove('show'); 
    }, 4000); 
} 

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    const formData = new FormData(contactForm);

    fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
        .then((response) => {
            if (response.ok) {
                showToast('Message sent successfully! I\'ll get back to you soon.');
                contactForm.reset();
            } else {
                showToast('Something went wrong. Please try again or email me directly.', true);
            }
        })
        .catch(() => {
            showToast('Network error. Please check your connection and try again.', true);
        })
        .finally(() => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        });
});


  // ============================================
  // 7. SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ============================================
  // 8. RESUME MODAL
  // ============================================
  const viewResumeBtn = document.getElementById('viewResumeBtn');
  const resumeModal = document.getElementById('resumeModal');
  const resumeModalClose = document.getElementById('resumeModalClose');
  const resumeIframe = document.getElementById('resumeIframe');

  // Use PDF for embedding so it can be viewed natively instead of downloading
  const RESUME_FILE = 'Madhavan_Resume.html';

  viewResumeBtn.addEventListener('click', () => {
    // For local file: open directly. For hosted: use Google Docs Viewer
    // Since this is a local portfolio, we link to the file directly
    // The Google Docs viewer works with publicly hosted URLs
    // For local use, we use object/embed fallback approach
    resumeIframe.src = RESUME_FILE;
    resumeModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  resumeModalClose.addEventListener('click', closeResumeModal);

  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) {
      closeResumeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal.classList.contains('open')) {
      closeResumeModal();
    }
  });

  function closeResumeModal() {
    resumeModal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { resumeIframe.src = ''; }, 400);
  }

  // ============================================
  // 9. BACKGROUND MUSIC
  // ============================================
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  let musicPlaying = false;

  bgMusic.volume = 0.15; // Subtle background volume

  musicToggle.addEventListener('click', () => {
    if (musicPlaying) {
      bgMusic.pause();
      musicToggle.classList.add('muted');
      musicPlaying = false;
    } else {
      bgMusic.play().then(() => {
        musicToggle.classList.remove('muted');
        musicPlaying = true;
      }).catch(() => {
        // Autoplay blocked, try on next user interaction
        showToast('Click again to enable music', false);
      });
    }
  });

  // Start muted visually
  musicToggle.classList.add('muted');

  // ============================================
  // 10. PROFILE IMAGE 3D TILT EFFECT
  // ============================================
  const profileWrapper = document.getElementById('profileImageWrapper');
  const profileImage = document.getElementById('profileImage');

  if (profileWrapper && profileImage) {
    profileWrapper.addEventListener('mousemove', (e) => {
      const rect = profileWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -20; // Max 20 degrees
      const rotateY = ((x - centerX) / centerX) * 20;

      profileImage.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    profileWrapper.addEventListener('mouseleave', () => {
      profileImage.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }

})();
