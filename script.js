const siteShell = document.getElementById('siteShell');
const pageLoad = document.getElementById('pageLoad');
const portfolioCards = Array.from(document.querySelectorAll('.portfolio-card'));
const filterButtons = Array.from(document.querySelectorAll('.filter-button'));
const caseStudy = document.getElementById('caseStudy');
const caseBackdrop = document.getElementById('caseBackdrop');
const caseClose = document.getElementById('caseClose');
const testimonialCards = Array.from(document.querySelectorAll('.testimonial-card'));
const testimonialList = document.getElementById('testimonialList');
const testimonialModal = document.getElementById('testimonialModal');
const testimonialBackdrop = document.getElementById('testimonialBackdrop');
const testimonialClose = document.getElementById('testimonialClose');
const testimonialTitle = document.getElementById('testimonialTitle');
const testimonialQuote = document.getElementById('testimonialQuote');
const testimonialRole = document.getElementById('testimonialRole');
const testimonialDetail = document.getElementById('testimonialDetail');
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
    const icon = themeToggle.querySelector('.theme-icon');
    if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
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

const closeCaseStudy = () => {
  caseStudy.classList.remove('active');
  caseStudy.setAttribute('aria-hidden', 'true');
};

caseBackdrop.addEventListener('click', closeCaseStudy);
caseClose.addEventListener('click', closeCaseStudy);

testimonialCards.forEach((card) => {
  card.addEventListener('click', () => {
    testimonialTitle.textContent = card.dataset.title;
    testimonialQuote.textContent = card.dataset.quote;
    testimonialRole.textContent = card.dataset.title;
    testimonialDetail.textContent = card.dataset.detail;

    testimonialModal.classList.add('active');
    testimonialModal.setAttribute('aria-hidden', 'false');
  });
});

const closeTestimonial = () => {
  testimonialModal.classList.remove('active');
  testimonialModal.setAttribute('aria-hidden', 'true');
};

testimonialBackdrop.addEventListener('click', closeTestimonial);
testimonialClose.addEventListener('click', closeTestimonial);

testimonialModal.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeTestimonial();
});

function updateTestimonialPosition(index) {
  const count = testimonialCards.length;
  testimonialIndex = ((index % count) + count) % count;
  if (testimonialList) {
    testimonialList.style.transform = `translateX(calc(-${testimonialIndex} * (100% + 1.25rem)))`;
  }
}

// Touch events for swiping
let startX = 0;
let currentX = 0;
let isDragging = false;

testimonialList.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  isDragging = true;
});

testimonialList.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  currentX = e.touches[0].clientX;
});

testimonialList.addEventListener('touchend', () => {
  if (!isDragging) return;
  const diff = startX - currentX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      updateTestimonialPosition(testimonialIndex + 1);
    } else {
      updateTestimonialPosition(testimonialIndex - 1);
    }
  }
  isDragging = false;
});

// Auto slide every 5 seconds
setInterval(() => {
  updateTestimonialPosition(testimonialIndex + 1);
}, 5000);

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
