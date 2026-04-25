const siteShell = document.getElementById('siteShell');
const pageLoad = document.getElementById('pageLoad');
const portfolioCards = Array.from(document.querySelectorAll('.portfolio-card'));
const filterButtons = Array.from(document.querySelectorAll('.filter-button'));
const caseStudy = document.getElementById('caseStudy');
const caseBackdrop = document.getElementById('caseBackdrop');
const caseClose = document.getElementById('caseClose');
const testimonialCards = Array.from(document.querySelectorAll('.testimonial-card'));
const testimonialList = document.getElementById('testimonialList');
const testimonialPrev = document.getElementById('testimonialPrev');
const testimonialNext = document.getElementById('testimonialNext');
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
  const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  setTheme(storedTheme || preferredTheme);
}

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
});

window.addEventListener('load', () => {
  pageLoad.classList.add('hidden');
  siteShell.classList.add('ready');
  revealOnScroll();
  initTheme();
});

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  hero.style.transform = `translateY(${scrollY * 0.08}px)`;
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

testimonialPrev?.addEventListener('click', () => {
  updateTestimonialPosition(testimonialIndex - 1);
});

testimonialPrev?.addEventListener('mouseenter', () => {
  updateTestimonialPosition(testimonialIndex - 1);
});

testimonialNext?.addEventListener('click', () => {
  updateTestimonialPosition(testimonialIndex + 1);
});

testimonialNext?.addEventListener('mouseenter', () => {
  updateTestimonialPosition(testimonialIndex + 1);
});

faqItems.forEach((item) => {
  item.addEventListener('click', () => {
    faqItems.forEach((faq) => {
      if (faq !== item) faq.classList.remove('active');
    });
    item.classList.toggle('active');
  });
});

const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  contactForm.reset();
  alert('Message sent — thank you. We will reply shortly.');
});

const newsletterForm = document.querySelector('.newsletter-form');
newsletterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  newsletterForm.reset();
  alert('Subscribed. Expect concise updates from CenturionPhi.');
});
