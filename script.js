(function() {
  'use strict';

  // Monitors scrolled heights and updates variables accordingly
  const updateNavbarHeight = () => {
      const navbar = document.getElementById('navbar');
      if (navbar) {
          document.documentElement.style.setProperty('--navbar-height', `${navbar.offsetHeight}px`);
      }
  };
  window.addEventListener('resize', updateNavbarHeight, { passive: true });
  window.addEventListener('scroll', () => {
      const navbar = document.getElementById('navbar');
      if (navbar) {
          navbar.classList.toggle('scrolled', window.scrollY > 60);
      }
      updateNavbarHeight();
  }, { passive: true });

  updateNavbarHeight();

  // Mobile Hamburger Overlay transition morphing to X
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const menuOverlay = document.getElementById('menuOverlay');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (menuToggle && mobileMenu) {
      const toggleMenu = () => {
          const isOpen = menuToggle.classList.toggle('open');
          mobileMenu.classList.toggle('open', isOpen);
          document.body.classList.toggle('modal-open', isOpen);
      };
      menuToggle.addEventListener('click', toggleMenu);
      
      document.querySelectorAll('.mobile-link').forEach(link => {
          link.addEventListener('click', () => {
              menuToggle.classList.remove('open');
              mobileMenu.classList.remove('open');
              document.body.classList.remove('modal-open');
          });
      });
  }

  // Scroll active steps highlighting (30vh window up and down of center)
  const steps = document.querySelectorAll('.belief-card');
  if (steps.length > 0) {
      const handleScroll = () => {
          const viewportCenter = window.innerHeight / 2;
          const rangeOffset = window.innerHeight * 0.3; // 30vh target boundary
          const rangeMin = viewportCenter - rangeOffset;
          const rangeMax = viewportCenter + rangeOffset;

          steps.forEach(step => {
              const rect = step.getBoundingClientRect();
              const elementCenter = rect.top + rect.height / 2;
              
              // Active highlight turns on if the element sits inside the 30vh window
              const isInside = elementCenter >= rangeMin && elementCenter <= rangeMax;
              step.classList.toggle('active-scroll', isInside);
          });
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
  }

  // Smooth scroll for nav anchor links, offsetting header heights
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;
          
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
              e.preventDefault();
              
              // Read exact offset from dynamically compiled variables
              const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 78;
              const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - offset + 20;
              
              window.scrollTo({
                  top: targetPosition,
                  behavior: 'smooth'
              });
          }
      });
  });

})();