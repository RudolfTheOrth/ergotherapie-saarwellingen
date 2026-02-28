/* ============================================================
   Aktives Leben – Main JavaScript
   Smooth scroll, mobile nav, scroll animations, sticky header
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const header = document.getElementById('header');

    const handleScroll = () => {
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // --- Mobile Navigation ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');

    const closeNav = () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    const openNav = () => {
        navToggle.classList.add('active');
        navLinks.classList.add('active');
        navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    navToggle.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            closeNav();
        } else {
            openNav();
        }
    });

    navOverlay.addEventListener('click', closeNav);

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // --- Scroll-triggered Animations ---
    const reveals = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));

    // --- Active Nav Link Highlighting ---
    const sections = document.querySelectorAll('section[id]');

    const highlightNav = () => {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-links a[href="#${id}"]`);

            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    link.style.color = '';
                    link.style.fontWeight = '700';
                } else {
                    link.style.fontWeight = '';
                }
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });

});
