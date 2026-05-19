/* ================================================================
   PORTFOLIO — main.js
   Description: All JavaScript functionality
   Sections:
     1. Particles.js config
     2. Typed.js config
     3. Navbar scroll behaviour
     4. Active nav link highlight
     5. Scroll-to-top button
     6. Scroll reveal animations
     7. Contact form (mailto handler)
     8. Footer year auto-update
     9. Init — runs everything on DOMContentLoaded
================================================================ */


/* ================================================================
   1. PARTICLES.JS CONFIG
   Network graph style — represents data pipelines.
   Docs: https://github.com/VincentGarreau/particles.js
   To tweak: change number, size, speed, line_linked colour etc.
================================================================ */
function initParticles() {
  if (typeof particlesJS === 'undefined') {
    console.warn('Particles.js not loaded.');
    return;
  }

  particlesJS('particles-js', {
    particles: {
      number: {
        value: 90,                  /* Number of particles — reduce on slow devices */
        density: { enable: true, value_area: 1000 }
      },
      color: {
        value: '#00d4ff'            /* Particle colour — matches --accent */
      },
      shape: {
        type: 'circle'
      },
      opacity: {
        value: 0.4,
        random: true,
        anim: { enable: true, speed: 2.5, opacity_min: 1.1, sync: false }
      },
      size: {
        value: 2.5,
        random: true
      },
      line_linked: {
        enable: true,
        distance: 140,             /* Max distance to draw connecting lines */
        color: '#00d4ff',
        opacity: 0.12,
        width: 1
      },
      move: {
        enable: true,
        speed: 1.2,                /* Drift speed — keep low for calm feel */
        direction: 'none',
        random: true,
        out_mode: 'bounce'
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: { enable: true, mode: 'grab' },   /* Lines appear toward cursor */
        onclick: { enable: true, mode: 'push' },   /* Click adds particles */
        resize: true
      },
      modes: {
        grab:  { distance: 160, line_linked: { opacity: 0.4 } },
        push:  { particles_nb: 3 }
      }
    },
    retina_detect: true
  });
}


/* ================================================================
   2. TYPED.JS CONFIG
   Cycles through professional roles in the hero.
   To edit roles: update the strings array below.
   Docs: https://github.com/mattboldt/typed.js
================================================================ */
function initTyped() {
  if (typeof Typed === 'undefined') {
    console.warn('Typed.js not loaded.');
    return;
  }

  new Typed('#typed-role', {
    strings: [
      'GCP Data Engineer.',
      'BigQuery Specialist.',
      'Pipeline Architect.',
      'dbt & Airflow Expert.',
      'Cloud Infrastructure Builder.',
	  'Data Engineering Mentor.'
    ],
    typeSpeed:    55,    /* Typing speed in ms */
    backSpeed:    30,    /* Erasing speed in ms */
    backDelay:   1800,  /* Pause before erasing */
    startDelay:   600,
    loop:         true,
    showCursor:   true,
    cursorChar:   '|'
  });
}


/* ================================================================
   3. NAVBAR SCROLL BEHAVIOUR
   Adds .scrolled class when page scrolls past 50px,
   which triggers solid background via CSS.
================================================================ */
function initNavbarScroll() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  function handleScroll() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run once on load
}


/* ================================================================
   4. ACTIVE NAV LINK HIGHLIGHT
   Highlights the nav link corresponding to the visible section.
   Uses IntersectionObserver for performance.
================================================================ */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    {
      threshold: 0.35,
      rootMargin: '-70px 0px -35% 0px'
    }
  );

  sections.forEach((section) => observer.observe(section));
}


/* ================================================================
   5. SCROLL-TO-TOP BUTTON
   Shows a floating button after 400px scroll.
================================================================ */
function initScrollToTop() {
  // Create button element
  const btn = document.createElement('button');
  btn.id = 'scrollTopBtn';
  btn.setAttribute('aria-label', 'Scroll to top');
  btn.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
  document.body.appendChild(btn);

  // Show/hide on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  // Scroll to top on click
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ================================================================
   6. SCROLL REVEAL ANIMATIONS
   Adds .visible to .reveal elements when they enter the viewport.
   Elements get the .reveal class; CSS handles the animation.
   To make any element animate: add class="reveal" in HTML.
================================================================ */
function initScrollReveal() {
  // Auto-mark glass-cards and section-headers as reveal targets
  const targets = document.querySelectorAll(
    '.glass-card, .section-header, .stat-card, .contact-item, .award-card, .cert-card'
  );
  targets.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Animate once only
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}


/* ================================================================
   7. CONTACT FORM — MAILTO HANDLER
   Validates all fields, builds a mailto: URL, and opens the
   visitor's default email client with the message pre-filled.

   To switch to a real backend:
     - Remove the mailto logic inside handleSubmit()
     - Replace with: fetch('/api/contact', { method:'POST', body: JSON.stringify({name,email,subject,message}) })
     - Show success/error based on the response
================================================================ */
function initContactForm() {
  const submitBtn = document.getElementById('contact-submit');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', handleSubmit);

  function handleSubmit() {
    // Get field values
    const name    = document.getElementById('contact-name').value.trim();
    const email   = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    // Hide previous status messages
    document.getElementById('form-success').style.display = 'none';
    document.getElementById('form-error').style.display   = 'none';

    // Clear previous validation states
    clearValidation();

    // Validate
    let isValid = true;

    if (!name) {
      showError('contact-name', 'name-error');
      isValid = false;
    }
    if (!email || !isValidEmail(email)) {
      showError('contact-email', 'email-error');
      isValid = false;
    }
    if (!subject) {
      showError('contact-subject', 'subject-error');
      isValid = false;
    }
    if (!message) {
      showError('contact-message', 'message-error');
      isValid = false;
    }

    if (!isValid) {
      document.getElementById('form-error').style.display = 'flex';
      return;
    }

    // Build mailto URL
    // ──────────────────────────────────────────────────
    // RECIPIENT EMAIL: Update this if your email changes
    const recipientEmail = 'gouravchawla334@gmail.com';
    // ──────────────────────────────────────────────────

    const mailBody = `Hi Gourav,\n\nName: ${name}\nEmail: ${email}\n\n${message}\n\n---\nSent from gouravchawla.netlify.app`;
    const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;

    // Open email client
    window.location.href = mailtoUrl;

    // Show success message
    document.getElementById('form-success').style.display = 'flex';

    // Optionally clear form after 2 seconds
    setTimeout(() => {
      document.getElementById('contact-name').value    = '';
      document.getElementById('contact-email').value   = '';
      document.getElementById('contact-subject').value = '';
      document.getElementById('contact-message').value = '';
    }, 2000);
  }

  /* --- Helpers --- */

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.add('is-invalid');
    if (error) error.style.display = 'block';
  }

  function clearValidation() {
    document.querySelectorAll('.custom-input').forEach((el) => {
      el.classList.remove('is-invalid');
    });
    document.querySelectorAll('.invalid-feedback').forEach((el) => {
      el.style.display = 'none';
    });
  }

  // Clear validation state on input
  document.querySelectorAll('.custom-input').forEach((input) => {
    input.addEventListener('input', () => {
      input.classList.remove('is-invalid');
    });
  });
}


/* ================================================================
   8. FOOTER YEAR — AUTO UPDATE
   Automatically keeps the copyright year current.
================================================================ */
function initFooterYear() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}


/* ================================================================
   9. MOBILE NAV AUTO-CLOSE
   Closes the mobile menu when a nav link is clicked.
================================================================ */
function initMobileNavClose() {
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navCollapse = document.getElementById('navbarNav');

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navCollapse && navCollapse.classList.contains('show')) {
        // Use Bootstrap's collapse API to close the menu
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });
}


/* ================================================================
   INIT — Run everything when the DOM is ready
================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initTyped();
  initNavbarScroll();
  initActiveNav();
  initScrollToTop();
  initScrollReveal();
  initContactForm();
  initFooterYear();
  initMobileNavClose();
  initThemeToggle();
  initSVGMouseEffect();
  initCustomCursor();
  initCounters(); 
  initSkillTagStagger();
  initTimelineSlide();
});

/*
Cursor Trail / Custom Cursor
*/
function initCustomCursor() {
  if (window.innerWidth < 992) return; // desktop only

  // Create cursor elements
  const cursor     = document.createElement('div');
  const cursorDot  = document.createElement('div');
  cursor.id        = 'cursor-ring';
  cursorDot.id     = 'cursor-dot';
  document.body.appendChild(cursor);
  document.body.appendChild(cursorDot);

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Dot follows instantly
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  // Ring follows with lag — creates trail feel
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursor.style.left = ringX + 'px';
    cursor.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Grow ring on hoverable elements
  document.querySelectorAll('a, button, .glass-card, .skill-tag').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
  });
}

/*
Animated Counter — Stats Count Up on Scroll
*/
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el       = entry.target;
      // Extract numeric part only e.g. "30" from "30TB"
      const rawText  = el.textContent;
      const numMatch = rawText.match(/\d+/);
      if (!numMatch) return;

      const target   = parseInt(numMatch[0]);
      const suffix   = rawText.replace(/\d+/, ''); // "TB", "+", "x" etc.
      const duration = 1800; // ms
      const step     = Math.ceil(duration / target);
      let   current  = 0;

      const timer = setInterval(() => {
        current++;
        el.textContent = current + suffix;
        if (current >= target) {
          el.textContent = target + suffix; // ensure exact final value
          clearInterval(timer);
        }
      }, step);

      observer.unobserve(el); // run once
    });
  }, { threshold: 0.6 });

  counters.forEach((el) => observer.observe(el));
}
/*
Skill Tags — Staggered Fade In
*/
function initSkillTagStagger() {
  const groups = document.querySelectorAll('.skill-tags');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const tags = entry.target.querySelectorAll('.skill-tag');
      tags.forEach((tag, i) => {
        setTimeout(() => tag.classList.add('tag-visible'), i * 60);
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  groups.forEach((g) => observer.observe(g));
}

/*
Timeline Cards — Slide In from Left
*/
function initTimelineSlide() {
  const items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => {
        entry.target.classList.add('slide-visible');
      }, i * 150);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  items.forEach((item) => observer.observe(item));
}

/* ================================================================
   THEME TOGGLE — Dark / Light
   Saves preference to localStorage so it persists on reload.
================================================================ */
function initThemeToggle() {
  const btn  = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  if (!btn || !icon) return;

  // Check saved preference — default is dark
  const saved = localStorage.getItem('theme') || 'dark';
  if (saved === 'light') applyLight();

  btn.addEventListener('click', () => {
    if (document.body.classList.contains('light-theme')) {
      applyDark();
    } else {
      applyLight();
    }
  });

  function applyLight() {
    document.body.classList.add('light-theme');
    icon.className = 'fa-solid fa-sun';   // Switch to sun icon
    localStorage.setItem('theme', 'light');
  }

  function applyDark() {
    document.body.classList.remove('light-theme');
    icon.className = 'fa-solid fa-moon';  // Switch to moon icon
    localStorage.setItem('theme', 'dark');
  }
}

/* ================================================================
   SVG HERO ILLUSTRATION — Mouse Parallax / Tilt Effect
   SVG tilts slightly toward the mouse cursor position.
   Only active on desktop (lg screens and above).
================================================================ */
function initSVGMouseEffect() {
  const illustration = document.querySelector('.hero-illustration');
  if (!illustration) return;

  // Only on desktop
  if (window.innerWidth < 992) return;

  const hero = document.getElementById('home');
  if (!hero) return;

  hero.addEventListener('mousemove', (e) => {
    const rect   = hero.getBoundingClientRect();

    // Normalise mouse position: -1 to +1
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;

    // Max tilt in degrees
    const tiltX =  y * 12;   // vertical mouse → tilt on X axis
    const tiltY = -x * 12;   // horizontal mouse → tilt on Y axis

    // Slight scale up on hover for depth feel
    illustration.style.transform = `
      perspective(600px)
      rotateX(${tiltX}deg)
      rotateY(${tiltY}deg)
      scale(1.04)
    `;
  });

  // Reset on mouse leave
  hero.addEventListener('mouseleave', () => {
    illustration.style.transform = `
      perspective(600px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `;
  });
}