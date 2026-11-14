/* ============================================================
   GHORA BLACK PEPPER — Portfolio JavaScript
   ============================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Mobile navigation ---------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------- Sticky navbar on scroll ---------------- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    backToTop.classList.toggle('visible', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Back to top ---------------- */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------- Active navigation indicator ---------------- */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    const y = window.scrollY + 120;
    let current = 'home';
    sections.forEach(sec => {
      if (y >= sec.offsetTop) current = sec.id;
    });
    navItems.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  /* ---------------- Scroll reveal animations ---------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show everything
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------------- Skill rings animate on view ---------------- */
  const skillRings = document.querySelectorAll('.skill-ring');

  const animateRing = (ring) => {
    const target = parseInt(ring.style.getPropertyValue('--p'), 10) || 0;
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      ring.style.setProperty('--p', Math.round(target * eased));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const ringObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateRing(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    skillRings.forEach(ring => ringObserver.observe(ring));
  }

  /* ---------------- Project filtering ---------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !show);
        if (show) {
          card.classList.remove('visible');
          // re-trigger reveal animation
          requestAnimationFrame(() =>
            requestAnimationFrame(() => card.classList.add('visible'))
          );
        }
      });
    });
  });

  /* ---------------- Contact form validation ---------------- */
  const form  = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  const fields = {
    name:    { el: document.getElementById('name'),    err: document.getElementById('nameError') },
    email:   { el: document.getElementById('email'),   err: document.getElementById('emailError') },
    subject: { el: document.getElementById('subject'), err: document.getElementById('subjectError') },
    message: { el: document.getElementById('message'), err: document.getElementById('messageError') }
  };

  const validators = {
    name:    v => v.trim().length >= 2  || 'Please enter your name (min. 2 characters).',
    email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email address.',
    subject: v => v.trim().length >= 3  || 'Please enter a subject (min. 3 characters).',
    message: v => v.trim().length >= 10 || 'Please tell me a bit more (min. 10 characters).'
  };

  const validateField = (key) => {
    const { el, err } = fields[key];
    const result = validators[key](el.value);
    if (result === true) {
      el.classList.remove('invalid');
      err.textContent = '';
      return true;
    }
    el.classList.add('invalid');
    err.textContent = result;
    return false;
  };

  Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('blur', () => validateField(key));
    fields[key].el.addEventListener('input', () => {
      if (fields[key].el.classList.contains('invalid')) validateField(key);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const allValid = Object.keys(fields).map(validateField).every(Boolean);

    if (!allValid) {
      status.textContent = 'Please fix the errors above.';
      status.style.color = '#e05c5c';
      return;
    }

    // No backend connected — be honest with the user.
    status.style.color = '';
    status.textContent =
      'Thanks! Your message is valid. This demo form has no backend yet — ' +
      'please reach out via WhatsApp, Instagram or email instead.';
    form.reset();
  });

  /* ---------------- Dynamic copyright year ---------------- */
  document.getElementById('year').textContent = new Date().getFullYear();

});
