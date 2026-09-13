/* ==========================================================================
   MONOCHROME PORTFOLIO INTERACTIVE CONTROLLER (JS)
   Dark/Light Theme | ScrollSpy | Smooth Scroll Navigation | Modals | Toasts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Theme Switcher
  initThemeToggle();
  
  // Initialize Navigation ScrollSpy & Smooth Scroll
  initNavigation();
  
  // Initialize Timeline Tab Switcher (Education vs Experience)
  initTimeline();
  
  // Initialize Skills Progress Animation on Scroll
  initSkillBars();
  
  // Initialize Project Filters and Modals
  initProjects();
  
  // Initialize Contact Form & Toast Notifications
  initContactForm();

  // Initialize Footer Real-Time Clock
  initClock();
});

/* --------------------------------------------------------------------------
   1. THEME SWITCHER (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  
  // Check stored theme preference or browser preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme === 'dark');
  } else if (prefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon(true);
  }

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const isDark = currentTheme === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    updateThemeIcon(!isDark);
    
    showToast(`Mode switched to ${newTheme.toUpperCase()} mode`, 'info');
  });

  function updateThemeIcon(isDark) {
    themeIcon.textContent = isDark ? '☀️' : '🌙';
    themeBtn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  }
}

/* --------------------------------------------------------------------------
   2. AUTO-SCROLL TABS & SCROLL SPY
   -------------------------------------------------------------------------- */
function initNavigation() {
  const header = document.querySelector('.header');
  const navTabs = document.querySelectorAll('.nav-tab');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navTabsMenu');

  // Add shadow to header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Smooth scroll tab links click event
  navTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = tab.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // Close mobile menu if open
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
        }

        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  // IntersectionObserver for ScrollSpy active tab highlight
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navTabs.forEach(tab => {
          if (tab.getAttribute('href') === `#${id}`) {
            tab.classList.add('active');
          } else {
            tab.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* --------------------------------------------------------------------------
   3. EDUCATION & EXPERIENCE TAB SWITCHER
   -------------------------------------------------------------------------- */
function initTimeline() {
  const toggleBtns = document.querySelectorAll('.timeline-toggle .toggle-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      
      // Update active toggle button
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter items
      timelineItems.forEach(item => {
        if (type === 'all' || item.getAttribute('data-category') === type) {
          item.style.display = 'block';
          setTimeout(() => item.style.opacity = '1', 50);
        } else {
          item.style.opacity = '0';
          setTimeout(() => item.style.display = 'none', 300);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. SKILLS ANIMATION ON SCROLL
   -------------------------------------------------------------------------- */
function initSkillBars() {
  const skillSection = document.getElementById('skills');
  const skillFills = document.querySelectorAll('.skill-progress-fill');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        skillFills.forEach(fill => {
          const targetWidth = fill.getAttribute('data-percentage') || '85%';
          fill.style.width = targetWidth;
        });
        animated = true;
      }
    });
  }, { threshold: 0.2 });

  if (skillSection) {
    observer.observe(skillSection);
  }
}

/* --------------------------------------------------------------------------
   5. PROJECTS FILTERING & MODAL PREVIEW
   -------------------------------------------------------------------------- */
function initProjects() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  // Modals
  const projectModal = document.getElementById('projectModal');
  const modalCloseBtns = document.querySelectorAll('.modal-close, .modal-overlay-close');
  
  // Filter logic
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });

  // Open Project Detail Modal
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.project-title').textContent;
      const desc = card.getAttribute('data-full-desc') || card.querySelector('.project-desc').textContent;
      const category = card.querySelector('.project-category').textContent;
      const imageSrc = card.querySelector('.project-thumb img').src;
      const techStack = Array.from(card.querySelectorAll('.project-tech span')).map(s => s.textContent);

      document.getElementById('modalProjectTitle').textContent = title;
      document.getElementById('modalProjectCategory').textContent = category;
      document.getElementById('modalProjectDesc').textContent = desc;
      document.getElementById('modalProjectImage').src = imageSrc;

      const techContainer = document.getElementById('modalProjectTech');
      techContainer.innerHTML = techStack.map(t => `<span class="badge">${t}</span>`).join(' ');

      projectModal.classList.add('active');
    });
  });

  // Modal close trigger
  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    });
  });

  // Close modal when clicking outside modal content
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. CONTACT FORM & TOAST NOTIFICATION SYSTEM
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !message) {
        showToast('Silakan lengkapi semua kolom formulir!', 'warning');
        return;
      }

      // Simulate loading state
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Mengirim Pesan...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        contactForm.reset();
        showToast(`Terima kasih ${name}, pesan Anda berhasil terkirim!`, 'success');
      }, 1200);
    });
  }
}

// Toast Display Function
function showToast(message, type = 'info') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  const iconMap = {
    success: '✓',
    warning: '⚠️',
    info: 'ℹ️'
  };

  toast.innerHTML = `<span>${iconMap[type] || 'ℹ️'}</span> <span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* --------------------------------------------------------------------------
   7. REAL-TIME FOOTER CLOCK
   -------------------------------------------------------------------------- */
function initClock() {
  const clockEl = document.getElementById('footerClock');
  if (!clockEl) return;

  function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour12: false });
    clockEl.textContent = `${timeStr} WIB`;
  }

  updateTime();
  setInterval(updateTime, 1000);
}

/* Helper function for Resume Modal */
function openResumeModal() {
  const modal = document.getElementById('resumeModal');
  if (modal) modal.classList.add('active');
}
