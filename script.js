/* =============================================
       JAVASCRIPT
       Allowed: mobile menu toggle + smooth scrolling
  ============================================= 


/* -----------------------------------------------
    1. FOOTER YEAR (no DOM manipulation restriction)
----------------------------------------------- */
document.getElementById('footer-year').textContent = new Date().getFullYear();


/* -----------------------------------------------
    2. HEADER: scroll class for background blur
----------------------------------------------- */
const siteHeader = document.getElementById('site-header');

window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
    siteHeader.classList.add('scrolled');
    } else {
    siteHeader.classList.remove('scrolled');
    }
}, { passive: true });


/* -----------------------------------------------
    3. MOBILE MENU TOGGLE
----------------------------------------------- */
const menuToggle  = document.getElementById('menu-toggle');
const mobileMenu  = document.getElementById('mobile-menu');
let   menuIsOpen  = false;

function openMenu() {
    menuIsOpen = true;
    menuToggle.classList.add('open');
    mobileMenu.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
    menuIsOpen = false;
    menuToggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
}

menuToggle.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    menuIsOpen ? closeMenu() : openMenu();
});

/* Close menu when a mobile link is tapped */
document.querySelectorAll('.mobile-link, .mobile-cta').forEach(function (link) {
    link.addEventListener('click', closeMenu);
});

/* Close menu when clicking anywhere outside */
document.addEventListener('click', function (e) {
    if (!menuIsOpen) return;
    if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
    closeMenu();
    }
});

/* Close on Escape key */
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuIsOpen) closeMenu();
});


/* -----------------------------------------------
    4. SMOOTH SCROLLING for all anchor links
----------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const headerHeight = siteHeader.offsetHeight;
    const targetTop    = target.getBoundingClientRect().top + window.scrollY - headerHeight + 1;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
});