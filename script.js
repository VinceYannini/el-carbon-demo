/* ============================================
   EL CARBÓN — JavaScript Interactivity
   Menu filter · Countdown · Nav scroll · Mobile menu
   ============================================ */

/** ---- Navbar: add .scrolled on scroll ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/** ---- Mobile nav toggle ---- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
});

// Close mobile nav when link is clicked
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.textContent = '☰';
    });
});

/** ---- Menu filter tabs ---- */
const tabs = document.querySelectorAll('.tab');
const cards = document.querySelectorAll('.menu-card');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const cat = tab.dataset.cat;

        cards.forEach((card, i) => {
            const match = cat === 'all' || card.dataset.cat === cat;
            if (match) {
                card.classList.remove('hidden');
                // Stagger animation
                card.style.animationDelay = `${i * 0.06}s`;
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

/** ---- Promo countdown: always counts to next Tue or Thu at midnight ---- */
function getNextPromoDate() {
    const now = new Date();
    const day = now.getDay(); // 0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,...
    let daysUntil;

    // Target: Tuesday (2) or Thursday (4)
    const closestDays = [2, 4].map(target => {
        const diff = (target - day + 7) % 7;
        return diff === 0 ? 0 : diff; // 0 means today is the promo day
    });

    daysUntil = Math.min(...closestDays);
    if (daysUntil === 0) {
        // Today IS promo day — show countdown to end of day (midnight)
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 0);
        return endOfDay;
    }

    // Next promo day at noon
    const target = new Date(now);
    target.setDate(now.getDate() + daysUntil);
    target.setHours(12, 0, 0, 0);
    return target;
}

const cdHours = document.getElementById('cd-hours');
const cdMins = document.getElementById('cd-mins');
const cdSecs = document.getElementById('cd-secs');

function updateCountdown() {
    const now = new Date();
    const end = getNextPromoDate();
    let diff = Math.max(0, Math.floor((end - now) / 1000));

    const h = Math.floor(diff / 3600); diff %= 3600;
    const m = Math.floor(diff / 60); diff %= 60;
    const s = diff;

    cdHours.textContent = String(h).padStart(2, '0');
    cdMins.textContent = String(m).padStart(2, '0');
    cdSecs.textContent = String(s).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

/** ---- Scroll-reveal animation for cards ---- */
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    },
    { threshold: 0.1 }
);

document.querySelectorAll('.why-card, .menu-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    observer.observe(el);
});

/** ---- WhatsApp float: hide on footer ---- */
const waFloat = document.getElementById('waFloat');
const footer = document.querySelector('.footer');

const footerObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        waFloat.style.opacity = e.isIntersecting ? '0' : '1';
        waFloat.style.pointerEvents = e.isIntersecting ? 'none' : 'auto';
    });
});
footerObserver.observe(footer);
