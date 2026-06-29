const siteShell = document.getElementById('siteShell');
const pageLoad = document.getElementById('pageLoad');
const portfolioGrid = document.getElementById('portfolioGrid');
let portfolioCards = [];
const filterButtons = Array.from(document.querySelectorAll('.filter-button'));
const caseStudy = document.getElementById('caseStudy');
const caseBackdrop = document.getElementById('caseBackdrop');
const caseClose = document.getElementById('caseClose');
const testimonialGrid = document.getElementById('testimonial-grid');
const testimonialMarqueeWrapper = document.getElementById('testimonialMarqueeWrapper');
const faqItems = Array.from(document.querySelectorAll('.faq-item'));
const themeToggle = document.getElementById('themeToggle');
const hero = document.querySelector('.hero-background');
const contactForm = document.getElementById('contactForm');
const newsletterForm = document.querySelector('.newsletter-form');
const toastShell = document.getElementById('toastShell');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const bentoMenu = document.getElementById('bentoMenu');
const bentoItems = Array.from(document.querySelectorAll('.bento-item'));

let testimonialIndex = 0;

// Mobile menu toggle
if (mobileMenuToggle && bentoMenu) {
  mobileMenuToggle.addEventListener('click', () => {
    const isOpen = bentoMenu.classList.toggle('active');
    mobileMenuToggle.setAttribute('aria-expanded', isOpen);
  });

  bentoItems.forEach((item) => {
    item.addEventListener('click', () => {
      bentoMenu.classList.remove('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.mobile-nav')) {
      bentoMenu.classList.remove('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  if (themeToggle) {
    themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
  localStorage.setItem('siteTheme', theme);
}

function initTheme() {
  const storedTheme = localStorage.getItem('siteTheme');
  const defaultTheme = 'dark';
  setTheme(storedTheme || defaultTheme);
}

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
});

function showToast(title, message, type = 'success') {
  if (!toastShell) return;
  const toast = document.createElement('div');
  toast.className = `toast-card toast-card--${type}`;
  toast.innerHTML = `
    <div class="toast-card__icon">✓</div>
    <div class="toast-card__content">
      <div class="toast-card__title">${title}</div>
      <div class="toast-card__message">${message}</div>
    </div>
  `;
  toastShell.appendChild(toast);
  setTimeout(() => { toast.classList.add('toast-card--hide'); }, 3000);
  setTimeout(() => { toast.remove(); }, 3650);
}

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    contactForm.reset();
    showToast('Message sent', 'Your request was submitted successfully.');
  });
}

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    newsletterForm.reset();
    showToast('Subscribed', 'You have been added to the list.');
  });
}

let hasLoaded = false;
function finishLoading() {
  if (hasLoaded) return;
  hasLoaded = true;
  if (pageLoad) pageLoad.classList.add('hidden');
  if (siteShell) siteShell.classList.add('ready');
  revealOnScroll();
  initTheme();
}

window.addEventListener('DOMContentLoaded', finishLoading);
window.addEventListener('load', finishLoading);
setTimeout(finishLoading, 5000);

let latestScrollY = 0;
let isTicking = false;
window.addEventListener('scroll', () => {
  latestScrollY = window.scrollY;
  if (!isTicking) {
    isTicking = true;
    requestAnimationFrame(() => {
      if (hero) hero.style.transform = `translateY(${latestScrollY * 0.08}px)`;
      isTicking = false;
    });
  }
});

function revealOnScroll() {
  const animated = document.querySelectorAll('[data-anim]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100); // 100ms delay between each
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  animated.forEach((item) => observer.observe(item));
}

function bindPortfolioEvents() {
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;
      portfolioCards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? 'grid' : 'none';
      });
    });
  });

  portfolioCards.forEach((card) => {
    card.addEventListener('click', () => {
      const url = card.dataset.url || `https://example.com/project-${card.dataset.case}`;
      if (url) {
        window.open(url, '_blank');
      }
    });
  });
}

function createPortfolioCard(project) {
  const card = document.createElement('article');
  card.className = 'portfolio-card';
  card.dataset.category = project.category;
  card.dataset.case = project.id;
  if (project.url) card.dataset.url = project.url;
  card.setAttribute('data-anim', '');

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'portfolio-image';
  const iframe = document.createElement('iframe');

  iframe.allow = 'clipboard-write';
  iframe.setAttribute('allowfullscreen', '');
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.loading = 'lazy';
  iframe.setAttribute('scrolling', 'no');

  if (project.embedUrl) {
    iframe.src = project.embedUrl;
  } else if (project.previewHtml) {
    iframe.srcdoc = project.previewHtml;
  } else {
    iframe.srcdoc = `
      <style>
        body{margin:0;background:#111;color:#f5f5f5;font-family:Inter,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;}
        .placeholder{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.65rem;text-transform:uppercase;letter-spacing:0.2em;font-size:0.9rem;color:rgba(255,255,255,0.75);}
        .placeholder-dot{width:10px;height:10px;background:#fff;border-radius:50%;animation:pulse 1.4s ease-in-out infinite;}
        @keyframes pulse{0%,100%{opacity:.35;transform:scale(0.9);}50%{opacity:1;transform:scale(1.2);}}
      </style>
      <div class="placeholder"><div class="placeholder-dot"></div><div>${project.title}</div></div>
    `;
  }

  iframe.title = `${project.title} preview`;
  imageWrapper.appendChild(iframe);

  card.append(imageWrapper);
  return card;
}

function renderPortfolio() {
  if (!portfolioGrid || !window.PORTFOLIO_PROJECTS) return;
  portfolioGrid.innerHTML = '';
  window.PORTFOLIO_PROJECTS.forEach((project) => portfolioGrid.appendChild(createPortfolioCard(project)));
  portfolioCards = Array.from(document.querySelectorAll('.portfolio-card'));
  bindPortfolioEvents();
  revealOnScroll();
}

renderPortfolio();

const closeCaseStudy = () => {
  caseStudy.classList.remove('active');
  caseStudy.setAttribute('aria-hidden', 'true');
};

caseBackdrop.addEventListener('click', closeCaseStudy);
caseClose.addEventListener('click', closeCaseStudy);

function toggleMarqueePause() {
  const anyExpanded = Boolean(document.querySelector('.testimonial-card.is-expanded'));
  testimonialMarqueeWrapper?.classList.toggle('is-paused', anyExpanded);
}

const testimonialsData = [
  {
    name: "Lina Hart",
    image: "https://placehold.co/44x44?text=LH&font=Inter&bg=222&fg=fff",
    snippet: "The new system feels refined, simple, and infinitely more confident.",
    fullText: "From the first conversation, the process was structured and thoughtful. The final design system scaled beautifully across our website and brand materials."
  },
  {
    name: "Noah Wells",
    image: "https://placehold.co/44x44?text=NW&font=Inter&bg=2a2a2a&fg=fff",
    snippet: "The work delivered a premium experience with purposeful structure at every step.",
    fullText: "Now every campaign and digital touchpoint feels aligned and easy to manage. The visual system is elegant and built to last."
  },
  {
    name: "Mira Clarke",
    image: "https://placehold.co/44x44?text=MC&font=Inter&bg=1f1f1f&fg=fff",
    snippet: "This team transformed our brand with clarity and calm precision.",
    fullText: "The result is an elevated presence that feels premium without being overly complicated. Every detail was considered, from motion to messaging."
  },
  {
    name: "Arlo Sands",
    image: "https://placehold.co/44x44?text=AS&font=Inter&bg=111&fg=fff",
    snippet: "The delivered system supports ambitious growth while staying elegantly restrained.",
    fullText: "It feels like a true brand platform: coherent, extensible, and beautifully executed. The team made a complex project feel effortless."
  }
];

function bindTestimonialExpansion() {
  const expandButtons = Array.from(document.querySelectorAll('.expand-btn'));

  expandButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const card = button.closest('.testimonial-card');
      if (!card) return;

      const expanded = card.classList.toggle('is-expanded');
      button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      toggleMarqueePause();
    });
  });
}

function renderTestimonials() {
  if (!testimonialGrid) return;

  testimonialGrid.innerHTML = testimonialsData
    .concat(testimonialsData)
    .map((item) => `
      <article class="testimonial-card" role="listitem">
        <p class="testimonial-copy">${item.snippet}</p>
        <p class="testimonial-full">${item.fullText}</p>
        <div class="client-info">
          <img class="client-avatar" src="${item.image}" alt="${item.name}" />
          <div class="client-meta">
            <strong>${item.name}</strong>
          </div>
        </div>
        <button class="expand-btn" type="button" aria-expanded="false" aria-label="Expand testimonial">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
      </article>
    `)
    .join('');

  bindTestimonialExpansion();
}

renderTestimonials();

// Text scrambler effect
function scrambleText(element) {
  const text = element.textContent;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let count = 0;
  
  const interval = setInterval(() => {
    let scrambled = '';
    for (let i = 0; i < text.length; i++) {
      if (i < count || Math.random() < 0.3) {
        if (text[i] === ' ') {
          scrambled += ' ';
        } else {
          scrambled += chars[Math.floor(Math.random() * chars.length)];
        }
      } else {
        scrambled += text[i];
      }
    }
    element.textContent = scrambled;
    count++;
    
    if (count > text.length) {
      clearInterval(interval);
      element.textContent = text;
    }
  }, 30);
}

// Apply scramble effect on scroll to certain elements
const observerScramble = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !entry.target.dataset.scrambled) {
      entry.target.dataset.scrambled = 'true';
      scrambleText(entry.target);
    }
  });
}, { threshold: 0.5 });

// Optionally apply to section labels
document.querySelectorAll('.section-label').forEach(label => {
  observerScramble.observe(label);
});

faqItems.forEach((item) => {
  item.addEventListener('click', () => {
    faqItems.forEach((faq) => {
      if (faq !== item) faq.classList.remove('active');
    });
    item.classList.toggle('active');
  });
});

const brandMark = document.querySelector('.brand-mark');
let clickCount = 0;

brandMark.addEventListener('click', () => {
  clickCount++;
  if (clickCount === 3) {
    // Easter egg: rainbow gradient on body
    document.body.style.background = 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)';
    document.body.style.backgroundSize = '400% 400%';
    document.body.style.animation = 'rainbow 2s ease infinite';
    setTimeout(() => {
      document.body.style.background = '';
      document.body.style.animation = '';
    }, 3000);
    clickCount = 0;
  }
});
