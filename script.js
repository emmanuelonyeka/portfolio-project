(function() {
    'use strict';

    // Theme toggle handling
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = document.documentElement.classList.toggle('theme-light');
            try {
                localStorage.setItem('theme', isLight ? 'light' : 'dark');
            } catch (e) { /* ignore fallback errors */ }
        });
    }

    // Dynamic navbar offset variable updates
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
    
    if (menuToggle && navLinks) {
        const toggleMenu = () => {
            const isOpen = menuToggle.classList.toggle('open');
            navLinks.classList.toggle('active');
            if (menuOverlay) menuOverlay.classList.toggle('active');
            document.body.classList.toggle('modal-open', isOpen);
        };
        menuToggle.addEventListener('click', toggleMenu);
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('open');
                navLinks.classList.remove('active');
                if (menuOverlay) menuOverlay.classList.remove('active');
                document.body.classList.remove('modal-open');
            });
        });
        if (menuOverlay) {
            menuOverlay.addEventListener('click', () => {
                menuToggle.classList.remove('open');
                navLinks.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.classList.remove('modal-open');
            });
        }
    }

    // Process section scroll active highlights
    const steps = document.querySelectorAll('.process-step');
    if (steps.length > 0) {
        const handleScroll = () => {
            const navbar = document.getElementById('navbar');
            const navHeight = navbar?.offsetHeight ?? 78
            const viewportCenter = navHeight + (window.innerHeight - navHeight) / 2;

            let closestStep = null;
            let closestDist = Infinity;

            steps.forEach(step => {
                const rect = step.getBoundingClientRect();
                const stepCenter = rect.top + rect.height / 2;
                const dist = Math.abs(stepCenter - viewportCenter);

                if (dist < closestDist) {
                    closestDist = dist;
                    closestStep = step;
                }
            });

            steps.forEach(step => {
                step.classList.toggle('active-scroll', step === closestStep);
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // Modern Form Submission Validation with Tooltips
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const validateField = (field, errEl) => {
            let isValid = true;
            if (!field.value.trim()) {
                field.classList.add('input-error');
                field.parentElement.classList.add('has-error');
                isValid = false;
            } else if (field.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value.trim())) {
                    field.classList.add('input-error');
                    field.parentElement.classList.add('has-error');
                    isValid = false;
                } else {
                    field.classList.remove('input-error');
                    field.parentElement.classList.remove('has-error');
                }
            } else {
                field.classList.remove('input-error');
                field.parentElement.classList.remove('has-error');
            }
            return isValid;
        };

        const nameField = document.getElementById('formName');
        const emailField = document.getElementById('formEmail');
        const subjectField = document.getElementById('formSubject');
        const messageField = document.getElementById('formMessage');

        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const subjectError = document.getElementById('subjectError');
        const messageError = document.getElementById('messageError');

        [nameField, emailField, subjectField, messageField].forEach(field => {
            field.addEventListener('input', () => validateField(field));
            field.addEventListener('blur', () => validateField(field));
        });

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const v1 = validateField(nameField);
            const v2 = validateField(emailField);
            const v3 = validateField(subjectField);
            const v4 = validateField(messageField);

            const successMsg = document.getElementById('formSuccess');
            const errorMsg = document.getElementById('formError');

            if (!v1 || !v2 || !v3 || !v4) {
                errorMsg.style.display = 'block';
                successMsg.style.display = 'none';
                return;
            }

            contactForm.classList.add('sending');
            const spinner = contactForm.querySelector('.luxury-spinner');
            if (spinner) spinner.style.display = 'inline-block';
            errorMsg.style.display = 'none';
            successMsg.style.display = 'none';

            try {
                const res = await fetch('https://formspree.io/f/xyzkqypk', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: nameField.value,
                        email: emailField.value,
                        subject: subjectField.value,
                        message: messageField.value
                    })
                });

                contactForm.classList.remove('sending');
                if (spinner) spinner.style.display = 'none';

                if (res.ok) {
                    successMsg.style.display = 'block';
                    contactForm.reset();
                } else {
                    errorMsg.style.display = 'block';
                }
            } catch (err) {
                contactForm.classList.remove('sending');
                if (spinner) spinner.style.display = 'none';
                errorMsg.style.display = 'block';
            }
        });
    }

    // Image Modal viewer handling
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const imageModalClose = document.getElementById('imageModalClose');

    if (imageModal && modalImage && imageModalClose) {
        document.querySelectorAll('.preview-image').forEach(img => {
            img.addEventListener('click', () => {
                modalImage.src = img.src;
                modalImage.alt = img.alt;
                imageModal.classList.add('active');
                document.body.classList.add('modal-open');
            });
        });

        const closeModal = () => {
            imageModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        };

        imageModalClose.addEventListener('click', closeModal);
        imageModal.addEventListener('click', closeModal);
        modalImage.addEventListener('click', (e) => e.stopPropagation());
    }

    // Sticky WhatsApp fade logic on scrolling to #contact section
    const waFloat = document.getElementById('waFloat');
    const contactSection = document.getElementById('contact');
    if (waFloat && contactSection) {
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    waFloat.classList.add('wa-float--footer-hidden');
                } else {
                    waFloat.classList.remove('wa-float--footer-hidden');
                }
            },
            { threshold: 0.01 }
        );
        obs.observe(contactSection);
    }

    // Entrance reveals
    window.addEventListener('load', () => {
        document.body.classList.add('is-loaded');
        const reveals = document.querySelectorAll('.reveal, .reveal-section');
        const obsReveal = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obsReveal.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        reveals.forEach(el => obsReveal.observe(el));
    });

    // Word cycling
    const cycleItems = document.querySelectorAll('.word-cycle-item');
    if (cycleItems.length > 1) {
        let activeIdx = 0;
        setInterval(() => {
            const current = cycleItems[activeIdx];
            const nextIdx = (activeIdx + 1) % cycleItems.length;
            const next = cycleItems[nextIdx];
            current.classList.remove('is-active');
            current.classList.add('is-leaving');
            next.classList.remove('is-leaving');
            next.classList.add('is-active');
            setTimeout(() => current.classList.remove('is-leaving'), 500);
            activeIdx = nextIdx;
        }, 2400);
    }

    // Custom cursor lerp logic
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    if (cursorDot && cursorRing) {
        let mX = 0, mY = 0;
        let rX = 0, rY = 0;
        let active = false;

        document.addEventListener('mousemove', (e) => {
            mX = e.clientX;
            mY = e.clientY;
            if (!active) {
                active = true;
                document.body.classList.add('has-custom-cursor');
            }
            cursorDot.style.transform = `translate(${mX}px, ${mY}px)`;
        });

        const animateCursor = () => {
            rX += (mX - rX) * 0.15;
            rY += (mY - rY) * 0.15;
            cursorRing.style.transform = `translate(${rX}px, ${rY}px)`;
            requestAnimationFrame(animateCursor);
        };
        requestAnimationFrame(animateCursor);

        document.querySelectorAll('a, button, [role="button"]').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-on-link'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-on-link'));
        });

        document.querySelectorAll('.preview-image').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-on-image'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-on-image'));
        });
    }

    // Dynamic Live Time updates
    const liveTimeEl = document.getElementById('liveTime');
    if (liveTimeEl) {
        const updateTime = () => {
            try {
                const now = new Date();
                const formatter = new Intl.DateTimeFormat('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                    timeZone: 'Africa/Lagos'
                });
                const formattedTime = formatter.format(now).toLowerCase().replace(' ', '');
                liveTimeEl.textContent = `${formattedTime} in Lagos NG`;
                liveTimeEl.closest('.status-pill')?.classList.add('has-time');
            } catch (e) { /* fallback gracefully */ }
        };
        updateTime();
        setInterval(updateTime, 60000);
    }

})();