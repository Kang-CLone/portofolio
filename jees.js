// ============================================================
// CURSOR
// ============================================================
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
let rAF;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
    if (!rAF) rAF = requestAnimationFrame(moveRing);
});

function moveRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    rAF = requestAnimationFrame(moveRing);
}

document.querySelectorAll('a, button, .project-card, .cert-card, .skill-card, .contact-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});

// ============================================================
// PARTICLES
// ============================================================
const bgWrap = document.querySelector('.bg-wrap');
for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
        left: ${Math.random() * 100}%;
        --dur: ${10 + Math.random() * 15}s;
        --delay: ${-Math.random() * 20}s;
        --dx: ${(Math.random() - 0.5) * 100}px;
        opacity: 0;
        width: ${2 + Math.random() * 3}px;
        height: ${2 + Math.random() * 3}px;
        background: ${Math.random() > 0.5 ? 'var(--cyan)' : 'var(--green)'};
    `;
    bgWrap.appendChild(p);
}

// ============================================================
// HEADER SCROLL
// ============================================================
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
});

// ============================================================
// MOBILE MENU
// ============================================================
const hamburger = document.getElementById('hamburger');
const navCenter = document.getElementById('navCenter');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navCenter.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navCenter.classList.remove('open');
    });
});

// ============================================================
// THEME TOGGLE
// ============================================================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

let isDark = localStorage.getItem('theme') !== 'light';
applyTheme();

themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    applyTheme();
});

function applyTheme() {
    html.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeIcon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
}

// ============================================================
// SMOOTH SCROLL
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = header.offsetHeight + 10;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
});

// ============================================================
// ACTIVE NAV
// ============================================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(l => l.classList.remove('active'));
            const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
            if (link) link.classList.add('active');
        }
    });
}, { threshold: 0.35 });
sections.forEach(s => io.observe(s));

// ============================================================
// REVEAL ON SCROLL
// ============================================================
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
reveals.forEach(el => revealObs.observe(el));

// ============================================================
// COUNTER ANIMATION
// ============================================================
const counters = document.querySelectorAll('[data-count]');
const cntObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'));
            let cur = 0;
            const step = target / 80;
            const tick = () => {
                cur = Math.min(cur + step, target);
                el.textContent = Math.floor(cur);
                if (cur < target) requestAnimationFrame(tick);
            };
            tick();
            cntObs.unobserve(el);
        }
    });
}, { threshold: 0.5 });
counters.forEach(el => cntObs.observe(el));

// ============================================================
// SKILL BARS
// ============================================================
const skillsSection = document.getElementById('skills');
let skillsAnimated = false;
const skillObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !skillsAnimated) {
        skillsAnimated = true;
        document.querySelectorAll('.skill-bar-fill').forEach(bar => {
            const w = bar.getAttribute('data-width');
            bar.style.width = w + '%';
        });
        document.querySelectorAll('.skill-pct').forEach(el => {
            const target = parseInt(el.getAttribute('data-pct'));
            let cur = 0;
            const step = target / 60;
            const tick = () => {
                cur = Math.min(cur + step, target);
                el.textContent = Math.floor(cur) + '%';
                if (cur < target) requestAnimationFrame(tick);
            };
            tick();
        });
    }
}, { threshold: 0.2 });
if (skillsSection) skillObs.observe(skillsSection);

// ============================================================
// CERTIFICATE CARDS STAGGER
// ============================================================
const certCards = document.querySelectorAll('.cert-card:not(.ghost)');
const certObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const idx = Array.from(certCards).indexOf(entry.target);
            setTimeout(() => entry.target.classList.add('visible'), idx * 100);
            certObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
certCards.forEach(c => certObs.observe(c));

// ============================================================
// PROJECT FILTER
// ============================================================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-cat') === filter) {
                card.style.opacity = '1';
                card.style.transform = '';
                card.style.pointerEvents = '';
            } else {
                card.style.opacity = '0.25';
                card.style.transform = 'scale(0.97)';
                card.style.pointerEvents = 'none';
            }
        });
    });
});

// ============================================================
// CONTACT FORM
// ============================================================
const form = document.getElementById('contactForm');
form && form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) return showToast('Isi semua field ya!', 'error');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showToast('Format email tidak valid!', 'error');

    const msgs = JSON.parse(localStorage.getItem('msgs') || '[]');
    msgs.unshift({ name, email, message, date: new Date().toLocaleString() });
    localStorage.setItem('msgs', JSON.stringify(msgs));
    showToast('Pesan terkirim! Thanks ' + name + ' 🎉', 'success');
    form.reset();
});

// ============================================================
// TOAST
// ============================================================
function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    const icon = document.getElementById('toastIcon');
    const text = document.getElementById('toastMsg');
    toast.className = 'toast ' + type;
    icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    text.textContent = msg;
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => toast.classList.remove('show'), 3500);
}

// ============================================================
// BACK TO TOP
// ============================================================
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 400) backTop.classList.add('show');
    else backTop.classList.remove('show');
});
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ============================================================
// VISITOR COUNTER
// ============================================================
const vcEl = document.getElementById('visitorCount');
if (vcEl) {
    const base = 1247 + Math.floor(Math.random() * 80);
    let cur = 0;
    const step = base / 60;
    const tick = () => {
        cur = Math.min(cur + step, base);
        vcEl.textContent = Math.floor(cur);
        if (cur < base) requestAnimationFrame(tick);
    };
    tick();
}

// ============================================================
// IMAGE FALLBACK
// ============================================================
const profileImg = document.getElementById('profileImg');
if (profileImg) {
    profileImg.onerror = function() {
        this.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            width:100%; aspect-ratio:1; 
            background:linear-gradient(135deg, var(--cyan-dim), var(--purple-dim));
            display:flex; align-items:center; justify-content:center;
            font-size:5rem;
        `;
        placeholder.textContent = '👨‍💻';
        this.parentNode.insertBefore(placeholder, this);
    };
}
