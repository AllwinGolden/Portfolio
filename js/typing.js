/* ==========================================================================
   TYPING.JS - Typing Animation for Allwin Golden Portfolio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const typingTextEl = document.getElementById('typing-text');
    if (!typingTextEl) return;

    // Array of words/roles to type out
    const words = [
        "Java Full Stack Developer",
        "Spring Boot Developer",
        "React Developer",
        "Frontend Developer",
        "REST API Developer",
        "UI Enthusiast"
    ];

    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let delay = 150; // base character printing speed

    function type() {
        const currentWord = words[wordIdx];
        
        if (isDeleting) {
            // Remove character
            typingTextEl.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
            delay = 60; // speed up on deletion
        } else {
            // Add character
            typingTextEl.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
            delay = 120; // normal speed when typing
        }

        // Check if finished typing current word
        if (!isDeleting && charIdx === currentWord.length) {
            // Pause before starting deletion
            delay = 2000;
            isDeleting = true;
        } 
        // Check if finished deleting current word
        else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            // Go to next word
            wordIdx = (wordIdx + 1) % words.length;
            // Brief pause before starting next word
            delay = 500;
        }

        setTimeout(type, delay);
    }

    // Initialize typewriter animation with a small initial delay
    setTimeout(type, 1000);
});
