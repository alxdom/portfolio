/* ========================================
   i18n - Internationalization
   ======================================== */
const i18n = {
    currentLang: 'es',
    translations: {},

    async load(lang) {
        if (this.translations[lang]) return this.translations[lang];
        const res = await fetch(`static/i18n/${lang}.json`);
        this.translations[lang] = await res.json();
        return this.translations[lang];
    },

    async setLang(lang) {
        this.currentLang = lang;
        const t = await this.load(lang);

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = t[key];
                } else {
                    el.textContent = t[key];
                }
            }
        });

        document.querySelectorAll('[data-i18n-list]').forEach(ul => {
            const key = ul.getAttribute('data-i18n-list');
            if (t[key]) {
                const items = t[key].split('|');
                const lis = ul.querySelectorAll('li');
                lis.forEach((li, i) => {
                    if (items[i]) li.textContent = items[i];
                });
            }
        });

        document.documentElement.lang = lang;
        document.getElementById('langFlag').textContent = lang === 'es' ? 'EN' : 'ES';
    },

    toggle() {
        this.setLang(this.currentLang === 'es' ? 'en' : 'es');
    }
};

/* ========================================
   Navigation
   ======================================== */
function initNav() {
    const nav = document.getElementById('nav');
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('nav--scrolled', window.scrollY > 50);
    });

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });
}

/* ========================================
   Typing Animation
   ======================================== */
function initTyping() {
    const el = document.getElementById('typingText');
    const phrasesByLang = {
        es: [
            'Implementación de Odoo para tu negocio',
            'Menos papeleo, más tiempo para vender',
            'Del cuaderno y el Excel a un sistema real',
            'Para micro, pequeñas y grandes empresas'
        ],
        en: [
            'Odoo implementation for your business',
            'Less paperwork, more time to sell',
            'From notebooks and spreadsheets to a real system',
            'For micro, small and large businesses'
        ]
    };
    let phrases = phrasesByLang[i18n.currentLang];
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let pauseTime = 0;

    function type() {
        const current = phrases[phraseIdx];

        if (!deleting) {
            el.textContent = current.substring(0, charIdx + 1);
            charIdx++;
            if (charIdx === current.length) {
                pauseTime = 2000;
                deleting = true;
            } else {
                pauseTime = 50 + Math.random() * 40;
            }
        } else {
            el.textContent = current.substring(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) {
                deleting = false;
                phrases = phrasesByLang[i18n.currentLang] || phrasesByLang.es;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                pauseTime = 400;
            } else {
                pauseTime = 30;
            }
        }

        setTimeout(type, pauseTime);
    }

    setTimeout(type, 1200);
}

/* ========================================
   Particles
   ======================================== */
function initParticles() {
    const container = document.getElementById('particles');
    const count = window.innerWidth < 768 ? 20 : 50;

    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        container.appendChild(p);

        gsap.to(p, {
            y: -100 - Math.random() * 200,
            x: (Math.random() - 0.5) * 100,
            opacity: 0,
            duration: 3 + Math.random() * 4,
            repeat: -1,
            delay: Math.random() * 3,
            ease: 'none'
        });
    }
}

/* ========================================
   GSAP Scroll Animations
   ======================================== */
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Set initial states BEFORE creating timeline
    gsap.set('.hero__greeting', { opacity: 0, y: 20 });
    gsap.set('.hero__name', { opacity: 0, y: 30 });
    gsap.set('.hero__subtitle', { opacity: 0, y: 20 });
    gsap.set('.hero__ctas', { opacity: 0, y: 20 });
    gsap.set('.hero__code', { opacity: 0, x: 40 });

    // Hero entrance
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
        .to('.hero__greeting', { opacity: 1, y: 0, duration: 0.6 }, 0.3)
        .to('.hero__name', { opacity: 1, y: 0, duration: 0.8 }, 0.5)
        .to('.hero__subtitle', { opacity: 1, y: 0, duration: 0.6 }, 0.9)
        .to('.hero__ctas', { opacity: 1, y: 0, duration: 0.6 }, 1.1)
        .to('.hero__code', { opacity: 1, x: 0, duration: 0.8 }, 0.8);

    // Timeline items
    document.querySelectorAll('.timeline__item').forEach((item, i) => {
        gsap.to(item, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            delay: i * 0.15,
            onComplete: () => item.classList.add('active')
        });
    });

    // Service cards
    document.querySelectorAll('.service-card').forEach((card, i) => {
        gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            delay: i * 0.15
        });
    });

    // Impact stats
    document.querySelectorAll('.impact__stat').forEach((stat, i) => {
        gsap.to(stat, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.4)',
            scrollTrigger: {
                trigger: stat,
                start: 'top 85%',
                toggleActions: 'play none none none',
                onEnter: () => animateCounter(stat)
            },
            delay: i * 0.1
        });
    });

    // Stack categories
    document.querySelectorAll('.stack__category').forEach((cat, i) => {
        gsap.to(cat, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: cat,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            delay: i * 0.12
        });
    });

    // Generic reveal blocks (Odoo explainer, process steps, FAQ)
    document.querySelectorAll('.reveal').forEach(el => {
        gsap.from(el, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Section titles
    document.querySelectorAll('.section-title, .section-subtitle').forEach(el => {
        gsap.from(el, {
            opacity: 0,
            y: 30,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });
}

/* ========================================
   Counter Animation
   ======================================== */
function animateCounter(stat) {
    const numberEl = stat.querySelector('.impact__number');
    const target = parseInt(stat.dataset.target);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        numberEl.textContent = Math.round(target * eased);

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/* ========================================
   Smooth Scroll
   ======================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const pos = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: pos, behavior: 'smooth' });
            }
        });
    });
}

/* ========================================
   Contact Form
   ======================================== */
function initContactForm() {
    emailjs.init('HSB3duwxsKl9MOkMh');

    const form = document.getElementById('contactForm');
    const btn = form.querySelector('button[type="submit"]');

    const messages = {
        es: { sending: 'Enviando...', success: 'Mensaje enviado!', error: 'Error al enviar. Intenta de nuevo.' },
        en: { sending: 'Sending...', success: 'Message sent!', error: 'Failed to send. Try again.' }
    };

    form.addEventListener('submit', e => {
        e.preventDefault();
        const msg = messages[i18n.currentLang] || messages.es;
        const originalText = btn.textContent;

        btn.textContent = msg.sending;
        btn.disabled = true;

        emailjs.sendForm('service_9xm4w19', 'template_ysfzoxm', form)
            .then(() => {
                btn.textContent = msg.success;
                btn.classList.add('btn--success');
                form.reset();
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.classList.remove('btn--success');
                    btn.disabled = false;
                }, 3000);
            })
            .catch(() => {
                btn.textContent = msg.error;
                btn.classList.add('btn--error');
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.classList.remove('btn--error');
                    btn.disabled = false;
                }, 3000);
            });
    });
}

/* ========================================
   Init
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initTyping();
    initParticles();
    initAnimations();
    initSmoothScroll();
    initContactForm();

    // Language toggle
    document.getElementById('langToggle').addEventListener('click', () => i18n.toggle());

    // Preload translations
    i18n.load('es');
    i18n.load('en');
});
