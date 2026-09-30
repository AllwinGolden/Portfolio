/* ==========================================================================
   SCRIPT.JS - Main logic, custom cursor, theme switcher, modal & form validation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- Preloader Timeout & Exit --- */
    const preloader = document.getElementById('preloader');
    const statusText = document.getElementById('preloader-status');
    
    // Lifecycle steps for preloader
    const steps = [
        { text: "Loading modules...", delay: 400 },
        { text: "Constructing layout matrices...", delay: 800 },
        { text: "Resolving assets...", delay: 1200 },
        { text: "Rendering viewport...", delay: 1600 }
    ];

    steps.forEach(step => {
        setTimeout(() => {
            if (statusText) statusText.textContent = step.text;
        }, step.delay);
    });

    window.addEventListener('load', () => {
        // Complete the preloading lifecycle
        setTimeout(() => {
            if (preloader) {
                preloader.style.transition = "opacity 0.6s ease";
                preloader.style.opacity = "0";
                setTimeout(() => {
                    preloader.style.display = "none";
                }, 600);
            }
        }, 1800);
    });

    // Fallback if load event takes too long
    setTimeout(() => {
        if (preloader && preloader.style.display !== "none") {
            preloader.style.opacity = "0";
            setTimeout(() => {
                preloader.style.display = "none";
            }, 600);
        }
    }, 4000);


    /* --- Custom Cursor Flow --- */
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('custom-cursor-dot');
    let mouseX = 0, mouseY = 0; // actual cursor positions
    let cursorX = 0, cursorY = 0; // delayed follower positions
    let isMoving = false;
    let moveTimeout;

    // Track mouse coordinate offsets
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!isMoving) {
            document.body.classList.add('mouse-moving');
            isMoving = true;
        }

        // Keep dot locked to mouse precisely
        if (cursorDot) {
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        }

        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
            document.body.classList.remove('mouse-moving');
            isMoving = false;
        }, 1500); // hide cursors when inactive
    });

    // Custom follower logic (requestAnimationFrame interpolation)
    function animateCursor() {
        // calculate standard ease interpolation
        const ease = 0.12; 
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;

        if (cursor) {
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
        }

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover transformations for buttons and interactive items
    const hoverables = document.querySelectorAll('a, button, input, textarea, .project-card, .timeline-item');
    hoverables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        item.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });


    /* --- Theme Switcher --- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Add brief button rotation animation
            themeToggleBtn.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeToggleBtn.style.transform = 'none';
            }, 300);
        });
    }


    /* --- Hamburger Mobile Overlay Menu --- */
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    function toggleMobileMenu() {
        hamburgerBtn.classList.toggle('active');
        mobileNavOverlay.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleMobileMenu);
    }

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNavOverlay.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });


    /* --- Back To Top Button --- */
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    /* --- Projects Filtering & Search --- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('project-search');
    const projectCards = document.querySelectorAll('.project-card');

    function filterProjects() {
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        const searchQuery = searchInput.value.toLowerCase().trim();

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const techData = card.getAttribute('data-tech').toLowerCase();
            const title = card.querySelector('.project-title').textContent.toLowerCase();
            const desc = card.querySelector('.project-desc').textContent.toLowerCase();

            const matchesFilter = activeFilter === 'all' || category === activeFilter;
            const matchesSearch = techData.includes(searchQuery) || title.includes(searchQuery) || desc.includes(searchQuery);

            if (matchesFilter && matchesSearch) {
                card.style.display = 'flex';
                // Trigger tiny fade in animation
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
            }
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterProjects();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', filterProjects);
    }


    /* --- Project Details Modal --- */
    const modal = document.getElementById('project-detail-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const closeBackdrop = document.getElementById('modal-close-backdrop');
    
    // Detailed static data for modal popup rendering
    const projectsDetails = {
       "1": {
    title: "Service Ticket Booking System",
    category: "Java Full Stack / Angular",
    desc: "A full-stack Service Ticket Booking System developed using Angular, Spring Boot, and MySQL. The application enables users to register, log in, browse available service professionals, and book home services through a responsive interface with REST API integration.",
    features: [
        "User registration and login with secure authentication flow.",
        "Browse and book service professionals such as electricians, plumbers, carpenters, painters, and AC technicians.",
        "REST API integration between Angular frontend and Spring Boot backend using HttpClient.",
        "Booking management with MySQL database integration using Spring Data JPA and Hibernate."
    ],
    tech: [
        "Angular",
        "Spring Boot",
        "Java",
        "Spring Data JPA",
        "Hibernate",
        "MySQL",
        "REST API",
        "Maven"
    ],
    github: "https://github.com/AllwinGolden/Service-Booking-System",
    live: "https://your-live-demo-link.com",
    svg: `<rect width="100%" height="100%" fill="#1E293B" />
    <defs>
        <linearGradient id="service-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#10B981" />
            <stop offset="100%" stop-color="#3B82F6" />
        </linearGradient>
    </defs>
    <circle cx="200" cy="110" r="60" fill="url(#service-grad)" opacity="0.15" />
    <path d="M150 80 L250 80 L250 160 L150 160 Z"
          fill="none"
          stroke="url(#service-grad)"
          stroke-width="4"/>
    <circle cx="175" cy="120" r="8" fill="#10B981"/>
    <circle cx="225" cy="120" r="8" fill="#3B82F6"/>
    <path d="M175 140 H225"
          stroke="url(#service-grad)"
          stroke-width="4"
          stroke-linecap="round"/>`
},
        "2": {
            title: "ERP Management System",
            category: "Java Backend Development",
            desc: "An enterprise management backend module designed to automate operations, department coordination, and security layers. It handles records tracking and relational query executions safely.",
            features: [
                "Detailed Employee Tracking: Renders hierarchies, assignable project teams, salary listings, and role allocations.",
                "Department Modules: Organizes database schemas to reflect branch divisions, assets, and project deadlines.",
                "Spring Security Audit: Implements password encoders, filters, session limits, and role boundaries.",
                "Relational schema design: Normalization of DB tables to PostgreSQL, query indexes, and efficient entity mappings."
            ],
            tech: ["Spring Boot", "Spring Security", "JPA / Hibernate", "PostgreSQL DB", "REST Services", "Lombok", "Maven"],
            github: "https://github.com/Adithyanswaminathan/JAM-ERP",
            svg: `<rect width="100%" height="100%" fill="#1E293B" /><defs><linearGradient id="m2-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#8B5CF6" /><stop offset="100%" stop-color="#3B82F6" /></linearGradient></defs><circle cx="200" cy="110" r="60" fill="url(#m2-grad)" opacity="0.15" /><rect x="130" y="80" width="140" height="80" rx="6" fill="none" stroke="url(#m2-grad)" stroke-width="4" /><line x1="130" y1="110" x2="270" y2="110" stroke="url(#m2-grad)" stroke-width="3" /><line x1="180" y1="80" x2="180" y2="160" stroke="url(#m2-grad)" stroke-width="2" />`
        },
        "3": {
    title: "Movie Explorer Portal",
    category: "Frontend Web Application",
    desc: "A sleek media index platform querying the TMDB (The Movie Database) API to list movies, summaries, ratings, cast information, and trending trailers. Built with optimized Vanilla JavaScript.",
    features: [
        "TMDB REST API querying with asynchronous fetch requests to dynamically display movie information.",
        "Instant search with debounce implementation for optimized API requests.",
        "Genre-based filtering including Action, Drama, Comedy, and Sci-Fi.",
        "Responsive design optimized for mobile, tablet, and desktop devices."
    ],
    tech: [
        "HTML5",
        "CSS3",
        "JavaScript",
        "TMDB API",
        "Fetch API",
        "Responsive Design"
    ],
    github: "https://github.com/AllwinGolden/movibazar",
    live: "https://allwingoldenmovibazar.netlify.app/",
    svg: `<rect width="100%" height="100%" fill="#1E293B" /><defs><linearGradient id="m3-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#06B6D4" /><stop offset="100%" stop-color="#8B5CF6" /></linearGradient></defs><circle cx="200" cy="110" r="60" fill="url(#m3-grad)" opacity="0.15" /><rect x="140" y="80" width="120" height="70" rx="8" fill="none" stroke="url(#m3-grad)" stroke-width="4" /><line x1="165" y1="80" x2="165" y2="150" stroke="url(#m3-grad)" stroke-width="3" /><line x1="235" y1="80" x2="235" y2="150" stroke="url(#m3-grad)" stroke-width="3" /><polygon points="190,105 190,125 210,115" fill="url(#m3-grad)" />`
},
        "4": {
            title: "Smart Accident Detection System",
            category: "IoT / Embedded / Python",
            desc: "An intelligent Internet-of-Things (IoT) hardware prototype that tracks vehicle metrics (coordinates, speed thresholds) to automatically identify severe collisions.",
            features: [
                "Accelerometer Collision Checking: Analyzes impact G-force values dynamically via ESP32 processors.",
                "Automatic Emergency Notification: Commands GSM chips to dispatch coordinates via text (SMS) automatically.",
                "GPS Mapping Node: Fetches exact spatial location parameters using latitude/longitude records.",
                "Server dashboard connection: Connected to a Python backend dashboard utilizing system logging files."
            ],
            tech: ["ESP32 Micro", "GPS Neo-6M", "GSM Sim900A", "Embedded C++", "Python Scripts", "Hardware Design"],
            github: "https://github.com/AllwinGolden",
            svg: `<rect width="100%" height="100%" fill="#1E293B" /><defs><linearGradient id="m4-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#EF4444" /><stop offset="100%" stop-color="#F59E0B" /></linearGradient></defs><circle cx="200" cy="110" r="60" fill="url(#m4-grad)" opacity="0.15" /><circle cx="200" cy="100" r="25" fill="none" stroke="url(#m4-grad)" stroke-width="4" /><path d="M185 130 C190 145 200 160 200 160 C200 160 210 145 215 130 Z" fill="url(#m4-grad)" />`
        }
    };

    

    function openModal(projectId) {
        const data = projectsDetails[projectId];
        if (!data) return;

        // Render data inside modal structure
        document.getElementById('modal-project-title').textContent = data.title;
        document.getElementById('modal-project-category').textContent = data.category;
        document.getElementById('modal-project-desc').textContent = data.desc;
        
        // Features list compilation
        const featuresListEl = document.getElementById('modal-project-features');
        featuresListEl.innerHTML = '';
        data.features.forEach(feat => {
            const li = document.createElement('li');
            li.textContent = feat;
            featuresListEl.appendChild(li);
        });

        // Tags compilation
        const tagsEl = document.getElementById('modal-project-tags');
        tagsEl.innerHTML = '';
        data.tech.forEach(t => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = t;
            tagsEl.appendChild(span);
        });

        // Graphic update
        const graphicContainer = document.getElementById('modal-project-graphic');
        graphicContainer.innerHTML = `
            <svg viewBox="0 0 400 220" fill="none" style="width:100%; height:100%;">
                ${data.svg}
            </svg>
        `;

        // GitHub Link
        document.getElementById('modal-github-link').setAttribute('href', data.github);

        // Open modal
        modal.classList.add('open');
        document.body.classList.add('no-scroll');
        //live demo link
       document.getElementById("modal-demo-btn").href = data.live;
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.classList.remove('no-scroll');
    }

    // Bind triggers to all project view-details buttons
    const detailButtons = document.querySelectorAll('.view-details-btn');
    detailButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const pId = this.getAttribute('data-project-id');
            openModal(pId);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeBackdrop) closeBackdrop.addEventListener('click', closeModal);
    
    // Close modal on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });

    // Mock Live Demo button interaction
    const demoBtn = document.getElementById('modal-demo-btn');
    if (demoBtn) {
        demoBtn.addEventListener('click', () => {
            alert("This is a static mock. Deployment pipelines are currently being established!");
        });
    }


   /* --- Contact Form Live Validation --- */

   const contactForm = document.getElementById("contact-form");

   const nameInput = document.getElementById("form-name");
   const emailInput = document.getElementById("form-email");
   const subjectInput = document.getElementById("form-subject");
   const messageInput = document.getElementById("form-message");

   const submitBtn = document.getElementById("form-submit-btn");
   const spinner = document.querySelector(".submit-spinner");
   const statusMsg = document.getElementById("form-status-msg");

   // Email Validation
   function validateEmail(email) {
       return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
   }

   // Field Validation
   function checkField(input, errorId, validator, errorMessage) {

       const value = input.value.trim();

       const formGroup = input.closest(".form-group");

       const error = document.getElementById(errorId);

       if (validator(value)) {

           formGroup.classList.remove("has-error");

           error.textContent = "";

           return true;

       } else {

           formGroup.classList.add("has-error");

           error.textContent = errorMessage;

           return false;

       }

   }

   // Live Validation

   nameInput.addEventListener("blur", () => {

       checkField(
           nameInput,
           "name-error",
           value => value.length >= 2,
           "Please enter your name (minimum 2 characters)"
       );

   });

   emailInput.addEventListener("blur", () => {

       checkField(
           emailInput,
           "email-error",
           value => validateEmail(value),
           "Please enter a valid email address"
       );

   });

   subjectInput.addEventListener("blur", () => {

       checkField(
           subjectInput,
           "subject-error",
           value => value.length >= 3,
           "Please enter a subject"
       );

   });

   messageInput.addEventListener("blur", () => {

       checkField(
           messageInput,
           "message-error",
           value => value.length >= 10,
           "Please enter at least 10 characters"
       );

   });

   // Form Submit

   contactForm.addEventListener("submit", function (e) {

       e.preventDefault();

       const isNameValid = checkField(
           nameInput,
           "name-error",
           value => value.length >= 2,
           "Please enter your name (minimum 2 characters)"
       );

       const isEmailValid = checkField(
           emailInput,
           "email-error",
           value => validateEmail(value),
           "Please enter a valid email address"
       );

       const isSubjectValid = checkField(
           subjectInput,
           "subject-error",
           value => value.length >= 3,
           "Please enter a subject"
       );

       const isMessageValid = checkField(
           messageInput,
           "message-error",
           value => value.length >= 10,
           "Please enter at least 10 characters"
       );

       if (
           isNameValid &&
           isEmailValid &&
           isSubjectValid &&
           isMessageValid
       ) {

           submitBtn.disabled = true;

           if (spinner)
               spinner.style.display = "inline-block";

           statusMsg.textContent = "";

           statusMsg.className = "form-status";

                   emailjs.send(
                       "service_x6m630e",
                       "template_jv6cmjh",
                       {
                           from_name: nameInput.value,
                           from_email: emailInput.value,
                           subject: subjectInput.value,
                           message: messageInput.value
                       }
                   )

                   .then(() => {

                       submitBtn.disabled = false;

                       if (spinner)
                           spinner.style.display = "none";

                       statusMsg.textContent =
                           "✅ Thank you! Your message has been sent successfully. I will get back to you shortly.";

                       statusMsg.classList.remove("error");
                       statusMsg.classList.add("success");

                       contactForm.reset();

                       document
                           .querySelectorAll(".form-group")
                           .forEach(group => group.classList.remove("has-error"));

                   })

                   .catch((error) => {

                       submitBtn.disabled = false;

                       if (spinner)
                           spinner.style.display = "none";

                       statusMsg.textContent =
                           "❌ Failed to send message. Please try again.";

                       statusMsg.classList.remove("success");
                       statusMsg.classList.add("error");

                       console.error("EmailJS Error:", error);

                   });

               } else {

                   statusMsg.textContent =
                       "Please correct the highlighted fields.";

                   statusMsg.classList.remove("success");
                   statusMsg.classList.add("error");

               }

           });




    // Set Copyright Year
    const yearEl = document.getElementById('copyright-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});
function showCert(img){

    document.getElementById("popupImg").src = img;
    document.getElementById("certPopup").style.display = "flex";

}

function hideCert(){

    document.getElementById("certPopup").style.display = "none";

}
