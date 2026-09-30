# Premium Developer Portfolio - Allwin Golden

A premium, modern, professional, and fully responsive personal portfolio website designed for **Allwin Golden**, Java Full Stack & Frontend Developer.

Built with **pure HTML5, CSS3 (CSS Variables, Flexbox, Grid), and Vanilla JavaScript** — strictly zero frameworks or builders (No React, Tailwind, Bootstrap, or jQuery) to ensure maximum performance and accessibility.

## 🚀 Key Features

*   **Dark Theme by Default**: Modern dark background (`#0B1120`) with soft gradients, clean typography, and a toggle switcher for light mode.
*   **Custom Particle/Orbit Background**: Dynamic, animated orbital loops and moving blur blobs in the Hero section.
*   **Custom Cursor & Follower**: Interactive cursor tracking that scales on interactive items (disabled automatically on mobile devices).
*   **Typing Role Cycle**: High-performance role writer cycling through skill titles letter-by-letter.
*   **Dynamic Progress & Stat Counter**: Scroll-linked intersection indicators to fill skill percentage meters and count achievements (0 to target) once visible in the viewport.
*   **Real-time Projects Filter & Search**: Client-side filtering categories (All, Backend, Frontend, IoT) combined with active text searches that scan names, descriptions, and tech stacks.
*   **Interactive Details Modal**: Renders rich SVG illustrations, key features, tech grids, and source links dynamically.
*   **Client-Side Contact Validation**: Real-time validation prompts with clean user warning feedback.

---

## 📁 Project Structure

```text
allwin-portfolio-vanilla/
│
├── index.html          # Core layout structure and SVGs
│
├── css/
│   ├── style.css       # Layouts, themes variables, card and modal styles
│   ├── animations.css  # Entrance reveals, hover blooms, preloader timings
│   └── responsive.css  # Media queries for all viewports (mobile, tablet, laptop)
│
├── js/
│   ├── script.js       # Preloader, cursors, theme switcher, modal rendering, form validator
│   ├── typing.js       # Typewriter character print and deletes
│   └── scroll.js       # Scroll linked bars, reveal observers, link offsets
│
├── resume/
│   └── Allwin_Golden_Resume.pdf   # [Placeholder] Downloadable resume
│
└── README.md           # Documentation
```

---

## 🛠️ Customization Guides

### 1. Update Contact Email & Phone
Open [index.html](file:///C:/Users/Allwin%20Golden.A/.gemini/antigravity/scratch/allwin-portfolio-vanilla/index.html) and search for:
*   `allwingolden@gmail.com` to change the email link.
*   `+91 XXXXX XXXXX` to update the mobile number.

### 2. Replace the Resume PDF
Overwrite the file located at:
`allwin-portfolio-vanilla/resume/Allwin_Golden_Resume.pdf` with your actual CV. Ensure the filename matches exactly to preserve the download triggers in the header and hero sections.

### 3. Connect to EmailJS or Formspree
To connect the contact form to a live email service:
Open [js/script.js](file:///C:/Users/Allwin%20Golden.A/.gemini/antigravity/scratch/allwin-portfolio-vanilla/js/script.js) and look for the form submit handler. You can call your EmailJS SDK inside the success condition:
```javascript
// Example EmailJS integration
emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', '#contact-form')
  .then(() => {
     // Success feedback logic...
  });
```

---

## 💻 Local Testing & Deployment

Since the code utilizes pure native imports, it is fully production-ready out-of-the-box.

### Local Server Testing (Recommended)
Running through a local web server allows the Intersection Observer and local caches to function correctly without cross-origin issues:
1.  Navigate into the folder:
    `cd allwin-portfolio-vanilla`
2.  Start a quick static server using Node.js:
    `npx http-server`
3.  Open the local address in your web browser (usually `http://127.0.0.1:8080`).
