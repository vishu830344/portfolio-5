// Update footer year
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
  }

  // Mobile nav toggle
  const navToggle = document.querySelector(".nav__toggle");
  const navLinks = document.querySelector(".nav__links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("nav__toggle--open");
      navLinks.classList.toggle("nav__links--open");
    });

    // Close nav when clicking a link
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.classList.remove("nav__toggle--open");
        navLinks.classList.remove("nav__links--open");
      });
    });
  }

  // Smooth scroll (for older browsers without CSS smooth behavior)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Contact form handler (AJAX, validation, feedback, EmailJS)
  const contactForm = document.getElementById("contact-form");
  const contactStatus = document.getElementById("contact-status");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      // Clear any previous status
      if (contactStatus) {
        contactStatus.textContent = "";
        contactStatus.className = "contact__status";
      }
      const name = contactForm.querySelector("#name")?.value.trim();
      const email = contactForm.querySelector("#email")?.value.trim();
      const message = contactForm.querySelector("#message")?.value.trim();
      // Simple validation
      if (!name || !email || !message) {
        if (contactStatus) {
          contactStatus.textContent = "Please fill in your name, email, and message.";
          contactStatus.classList.add("error");
        }
        return;
      }
      // Email format validation
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        if (contactStatus) {
          contactStatus.textContent = "Please enter a valid email address.";
          contactStatus.classList.add("error");
        }
        return;
      }

      // Ensure EmailJS is available
      if (typeof emailjs === "undefined") {
        if (contactStatus) {
          contactStatus.textContent =
            "Email service is currently unavailable. Please try again later or reach out directly via email.";
          contactStatus.classList.add("error");
        }
        return;
      }
      // EmailJS send
      if (contactStatus) {
        contactStatus.textContent = "Sending...";
        contactStatus.classList.remove("error", "success");
      }
      try {
        const response = await emailjs.send("service_d32lhjx", "template_xzr2639", {
          from_name: name,
          from_email: email,
          message: message,
        });
        console.log("EmailJS success:", response);
        if (contactStatus) {
          contactStatus.textContent = "Message sent successfully! I'll get back to you soon.";
          contactStatus.classList.add("success");
        }
        contactForm.reset();
      } catch (err) {
        console.error("EmailJS error:", err);
        if (contactStatus) {
          contactStatus.textContent = "Sorry, there was a problem sending your message. Please try again later.";
          contactStatus.classList.add("error");
        }
      }
    });
  }

  // Simple animated spiderweb background on canvas
  const canvas = document.getElementById("web-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth * window.devicePixelRatio);
  let height = (canvas.height = window.innerHeight * window.devicePixelRatio);
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  const center = { x: window.innerWidth / 2, y: window.innerHeight / 3 };
  const strands = 14;
  const rings = 7;
  const maxRadius = Math.min(window.innerWidth, window.innerHeight) * 0.75;

  function resize() {
    width = canvas.width = window.innerWidth * window.devicePixelRatio;
    height = canvas.height = window.innerHeight * window.devicePixelRatio;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  window.addEventListener("resize", resize);

  let t = 0;

  function draw() {
    t += 0.003;

    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createRadialGradient(
      center.x,
      center.y,
      0,
      center.x,
      center.y,
      maxRadius * 1.1
    );
    gradient.addColorStop(0, "rgba(15, 23, 42, 0.95)");
    gradient.addColorStop(1, "rgba(2, 6, 23, 1)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(center.x, center.y);

    ctx.lineWidth = 0.7;
    ctx.strokeStyle = "rgba(148, 163, 184, 0.34)";

    for (let r = 1; r <= rings; r++) {
      const radius = (maxRadius * r) / rings;
      ctx.beginPath();
      const wobble = Math.sin(t * 2 + r) * radius * 0.02;
      for (let i = 0; i <= strands; i++) {
        const angle = (i / strands) * Math.PI * 2;
        const x = Math.cos(angle) * (radius + wobble);
        const y = Math.sin(angle) * (radius + wobble);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    ctx.lineWidth = 0.6;
    ctx.strokeStyle = "rgba(55, 65, 81, 0.45)";
    for (let i = 0; i < strands; i++) {
      const angle = (i / strands) * Math.PI * 2 + Math.sin(t + i) * 0.1;
      ctx.beginPath();
      ctx.moveTo(
        Math.cos(angle) * maxRadius * 0.09,
        Math.sin(angle) * maxRadius * 0.09
      );
      ctx.lineTo(
        Math.cos(angle) * maxRadius,
        Math.sin(angle) * maxRadius
      );
      ctx.stroke();
    }

    ctx.restore();

    requestAnimationFrame(draw);
  }

  // Live demo hover preview (shows a miniature preview of the external site in the Live Demo button)
  (function setupLivePreviewIframe() {
    if (!window.matchMedia || !window.matchMedia('(hover: hover)').matches) return;

    const preview = document.getElementById('live-preview');
    if (!preview) return;

    preview.innerHTML = '';
    const inner = document.createElement('div');
    inner.className = 'preview-inner';
    preview.appendChild(inner);
    const iframe = document.createElement('iframe');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('tabindex', '-1');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.background = 'transparent';
    iframe.style.pointerEvents = 'none';
    inner.appendChild(iframe);

    const liveLinks = Array.from(document.querySelectorAll('.project-card__links a')).filter(a => /live demo/i.test(a.textContent) || /live demo/i.test(a.getAttribute('aria-label') || ''));

    let showTimer = null, hideTimer = null;

    function showFor(el) {
      clearTimeout(hideTimer);
      showTimer = setTimeout(() => {
        const rect = el.getBoundingClientRect();
        const pw = 320, ph = 200;
        // Offset: 16px right, vertically centered to button
        let top = rect.top + window.scrollY + rect.height / 2 - ph / 2;
        let left = rect.right + 16 + window.scrollX;
        // If not enough space on right, show to left with 16px offset
        if (left + pw > window.innerWidth - 8) {
          left = rect.left - pw - 16 + window.scrollX;
        }
        // Clamp top to viewport
        if (top + ph > window.innerHeight - 8) top = window.innerHeight - ph - 8;
        if (top < 8) top = 8;
        preview.style.top = top + 'px';
        preview.style.left = left + 'px';
        preview.classList.add('show');
        preview.setAttribute('aria-hidden','false');
        iframe.src = el.href;
      }, 100);
    }

    function hide() {
      clearTimeout(showTimer);
      hideTimer = setTimeout(() => {
        preview.classList.remove('show');
        preview.setAttribute('aria-hidden','true');
        iframe.src = 'about:blank';
      }, 120);
    }

    liveLinks.forEach(link => {
      link.addEventListener('mouseenter', () => showFor(link));
      link.addEventListener('mouseleave', hide);
      link.addEventListener('focus', () => showFor(link));
      link.addEventListener('blur', hide);
    });

    window.addEventListener('scroll', hide, { passive: true });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.project-card__links')) hide();
    });
  })();

  // Speak hero bubble text on image hover
  (function() {
    const heroImg = document.querySelector('.hero__image');
    const bubble = document.getElementById('hero-bubble');
    if (!heroImg || !bubble) return;
    let utterance = null;
    function speakBubble() {
      if (!window.speechSynthesis) return;
      if (utterance) {
        window.speechSynthesis.cancel();
        utterance = null;
      }
      utterance = new SpeechSynthesisUtterance(bubble.textContent.replace(/\s+/g,' ').trim());
      utterance.rate = 1.05;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
    function stopBubble() {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      utterance = null;
    }
    heroImg.addEventListener('mouseenter', speakBubble);
    heroImg.addEventListener('focus', speakBubble);
    heroImg.addEventListener('mouseleave', stopBubble);
    heroImg.addEventListener('blur', stopBubble);
  })();

  // Certificate gallery lightbox
  (function setupCertificateLightbox() {
    const lightbox = document.getElementById('cert-lightbox');
    const lightboxImg = document.getElementById('cert-lightbox-img');
    const caption = document.getElementById('cert-lightbox-caption');
    if (!lightbox || !lightboxImg) return;

    const certLinks = Array.from(document.querySelectorAll('[data-cert]'));
    const closeEls = Array.from(lightbox.querySelectorAll('[data-cert-close]'));

    function openLightbox(src, captionText) {
      lightboxImg.src = src;
      lightboxImg.alt = captionText ? `Certificate preview: ${captionText}` : 'Certificate preview';
      if (caption) caption.textContent = captionText || '';
      lightbox.classList.add('show');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('show');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.src = '';
      if (caption) caption.textContent = '';
      document.body.style.overflow = '';
    }

    certLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const img = link.querySelector('img');
        const metaTitle = link.querySelector('.cert-card__meta h3')?.textContent?.trim();
        const href = link.getAttribute('href') || img?.getAttribute('src') || '';
        if (!href) return;
        openLightbox(href, metaTitle || img?.getAttribute('alt') || '');
      });
    });

    closeEls.forEach((el) => el.addEventListener('click', closeLightbox));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('show')) closeLightbox();
    });

    // Graceful fallback for missing certificate images: replace with an inline SVG placeholder
    document.querySelectorAll('.cert-card img').forEach((img) => {
      img.addEventListener('error', () => {
        const title = img.closest('.cert-card')?.querySelector('.cert-card__meta h3')?.textContent?.trim() || 'Certificate';
        const svg = encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900">
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#0ea5e9" stop-opacity="0.28"/>
                <stop offset="1" stop-color="#fb7185" stop-opacity="0.22"/>
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="#0b1220"/>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#g)"/>
            <rect x="70" y="70" width="1060" height="760" rx="28" fill="rgba(2,6,23,0.55)" stroke="rgba(148,163,184,0.35)" stroke-width="4"/>
            <text x="120" y="190" fill="#f9fafb" font-size="62" font-family="Poppins, Arial, sans-serif">${title}</text>
            <text x="120" y="270" fill="#9ca3af" font-size="34" font-family="Poppins, Arial, sans-serif">Add your image in assets/certificates/</text>
          </svg>`
        );
        img.src = `data:image/svg+xml;charset=utf-8,${svg}`;
      }, { once: true });
    });
  })();

  // Auto-scroll certificates horizontally every second (pauses on hover)
  (function setupCertificateAutoScroll() {
    const gallery = document.querySelector('.cert-gallery');
    if (!gallery) return;

    const cards = Array.from(gallery.querySelectorAll('.cert-card'));
    if (cards.length <= 1) return;

    let hovered = false;
    let index = 0;

    const getStep = () => {
      const first = cards[0];
      const rect = first.getBoundingClientRect();
      return rect.width + 16; // card width + approx gap
    };

    function step() {
      if (hovered) return;
      const stepSize = getStep();
      const maxScroll = gallery.scrollWidth - gallery.clientWidth;

      if (gallery.scrollLeft + stepSize >= maxScroll - 1) {
        gallery.scrollTo({ left: 0, behavior: 'smooth' });
        index = 0;
      } else {
        index += 1;
        gallery.scrollBy({ left: stepSize, behavior: 'smooth' });
      }
    }

    const intervalId = setInterval(step, 1000);

    gallery.addEventListener('mouseenter', () => {
      hovered = true;
    });
    gallery.addEventListener('mouseleave', () => {
      hovered = false;
    });

    // If the user navigates away or the gallery disappears, clear interval
    window.addEventListener('beforeunload', () => clearInterval(intervalId));
  })();

  // 3D scrolling effect for timeline items
  (function setupTimelineScroll3D() {
    const items = Array.from(document.querySelectorAll('.timeline-item'));
    if (!items.length) return;

    const viewportHeight = () => window.innerHeight || document.documentElement.clientHeight;

    function update() {
      const vh = viewportHeight();
      const center = vh / 2;

      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const distance = (itemCenter - center) / vh; // -1 (top) to 1 (bottom)

        // Base transform values
        const maxTilt = 14; // deg
        const maxDepth = 180; // px
        const clamped = Math.max(-1.2, Math.min(1.2, distance));

        // When near center, mark as visible and flatten; otherwise give depth/tilt
        const isNearCenter = Math.abs(distance) < 0.25;
        if (isNearCenter) {
          item.classList.add('is-visible');
          item.style.transform = 'translateY(0) translateZ(0) rotateX(0deg)';
        } else {
          item.classList.remove('is-visible');
          const depth = -maxDepth * Math.abs(clamped);
          const tilt = maxTilt * clamped;
          item.style.transform = `translateY(${clamped * 60}px) translateZ(${depth}px) rotateX(${tilt}deg)`;
        }
      });
    }

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // Initial state
    update();
  })();

  draw();
});


