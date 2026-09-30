/* ==========================================================================
   SCROLL.JS - Scroll management, reveals, statistics and progress bars
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --- Scroll Progress Bar --- */
    const progressBar = document.getElementById('scroll-progress-bar');
    
    function updateScrollProgress() {
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (docHeight > 0) {
            const scrolled = (window.scrollY / docHeight) * 100;
            progressBar.style.width = scrolled + '%';
        }
    }
    
    window.addEventListener('scroll', updateScrollProgress);
    
    /* --- Header Scrolled Effect --- */
    const header = document.getElementById('main-header');
    
    function checkHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', checkHeaderScroll);
    checkHeaderScroll(); // Run once initially in case page is loaded scrolled down
    
    /* --- Intersection Observer for Scroll Reveals --- */
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px" // trigger slightly before entering viewport
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Unobserve after revealing to prevent repeating animation on scroll up/down
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    
    // Select all elements to be revealed
    const revealEls = document.querySelectorAll('.reveal-fade, .reveal-slide-up, .reveal-stagger');
    revealEls.forEach(el => revealObserver.observe(el));
    
    /* --- Skills Progress Fill Animation on Scroll --- */
    const skillsSection = document.getElementById('skills');
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillProgressBars.forEach(bar => {
                    const targetVal = bar.getAttribute('style').match(/--val:\s*(\d+)%/)[1];
                    bar.style.width = targetVal + '%';
                });
                // Unobserve section once filled
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
    
    /* --- Statistic Animated Counters on Scroll --- */
    const achievementsContainer = document.getElementById('achievements-container');
    const counterNumbers = document.querySelectorAll('.counter-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counterNumbers.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'), 10);
                    const duration = 2000; // 2 seconds total animation time
                    const stepTime = Math.abs(Math.floor(duration / target));
                    let current = 0;
                    
                    const timer = setInterval(() => {
                        current += Math.ceil(target / 50); // increment steps
                        if (current >= target) {
                            counter.textContent = target;
                            clearInterval(timer);
                        } else {
                            counter.textContent = current;
                        }
                    }, 30);
                });
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    if (achievementsContainer) {
        counterObserver.observe(achievementsContainer);
    }
    
    /* --- Active Nav Link Highlighting on Scroll --- */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    
    const navScrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                // Update desktop nav
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
                
                // Update mobile nav
                mobileLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, { threshold: 0.3, rootMargin: "-20% 0px -55% 0px" }); // focus on center viewport scroll boundaries
    
    sections.forEach(section => navScrollObserver.observe(section));
    
    /* --- Smooth Scrolling for anchor links --- */
    const allLinks = document.querySelectorAll('a[href^="#"]');
    
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                // If mobile menu is open, close it (handled locally inside script.js via triggers)
                const headerHeight = header.offsetHeight;
                const elementPosition = targetEl.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - (headerHeight - 10);
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
