// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initThemeToggle();
    initMobileMenu();
    initSmoothScroll();
    initBackToTop();
    initCounterAnimation();
    initProgressBars();
    initFormSubmission();
    initVisitorCounter();
});

// ===== THEME TOGGLE =====
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const root = document.documentElement;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const newTheme = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
    
    function setTheme(theme) {
        root.setAttribute('data-theme', theme);
        themeIcon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('theme', theme);
    }
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== BACK TO TOP =====
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== COUNTER ANIMATION =====
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    if (counters.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// ===== PROGRESS BARS =====
function initProgressBars() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = [
                    { selector: '.js-progress', width: '90%' },
                    { selector: '.py-progress', width: '85%' },
                    { selector: '.react-progress', width: '80%' },
                    { selector: '.node-progress', width: '75%' },
                    { selector: '.design-progress', width: '70%' },
                    { selector: '.devops-progress', width: '65%' }
                ];
                
                // Update progress bars
                progressBars.forEach(bar => {
                    const element = document.querySelector(bar.selector);
                    if (element) {
                        element.style.width = bar.width;
                    }
                });
                
                // Update percentage numbers
                const percentElements = document.querySelectorAll('.skill-percent');
                percentElements.forEach(element => {
                    const target = element.getAttribute('data-percent');
                    let current = 0;
                    const increment = target / 100;
                    const duration = 1500;
                    const stepTime = duration / target;
                    
                    const timer = setInterval(() => {
                        current += increment;
                        element.textContent = Math.floor(current) + '%';
                        
                        if (current >= target) {
                            element.textContent = target + '%';
                            clearInterval(timer);
                        }
                    }, stepTime);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(skillsSection);
}

// ===== FORM SUBMISSION =====
function initFormSubmission() {
    const form = document.getElementById('messageForm');
    if (!form) return;
    
    // Load existing messages
    loadMessages();
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('#name').value.trim();
        const email = this.querySelector('#email').value.trim();
        const message = this.querySelector('#message').value.trim();
        
        if (!name || !email || !message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Save message
        saveMessage({ name, email, message, date: new Date().toLocaleString() });
        
        // Show success message
        showNotification('Message sent successfully!', 'success');
        
        // Reset form
        this.reset();
    });
    
    function saveMessage(message) {
        const messages = JSON.parse(localStorage.getItem('portfolioMessages') || '[]');
        messages.unshift(message);
        localStorage.setItem('portfolioMessages', JSON.stringify(messages));
        displayMessage(message);
    }
    
    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem('portfolioMessages') || '[]');
        messages.forEach(displayMessage);
    }
    
    function displayMessage(message) {
        // In a real application, you would display messages in the UI
        console.log('New message:', message);
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showNotification(text, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${text}</span>
        `;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '15px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: '2000',
            transform: 'translateX(100px)',
            opacity: '0',
            transition: 'all 0.3s ease'
        });
        
        // Add border color based on type
        if (type === 'success') {
            notification.style.borderLeft = '4px solid var(--accent-success)';
        } else {
            notification.style.borderLeft = '4px solid var(--accent-danger)';
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// ===== VISITOR COUNTER =====
function initVisitorCounter() {
    const visitorCountElement = document.getElementById('visitorCount');
    if (!visitorCountElement) return;
    
    // Simulate visitor count (in real app, this would come from a backend)
    const baseCount = 1247;
    const randomIncrement = Math.floor(Math.random() * 50);
    const totalCount = baseCount + randomIncrement;
    
    // Animate counter
    let current = 0;
    const increment = totalCount / 50;
    
    const counterInterval = setInterval(() => {
        current += increment;
        visitorCountElement.textContent = Math.floor(current);
        
        if (current >= totalCount) {
            visitorCountElement.textContent = totalCount;
            clearInterval(counterInterval);
        }
    }, 30);
}

// ===== WINDOW LOAD =====
window.addEventListener('load', function() {
    // Add fade-in animation to elements
    const fadeElements = document.querySelectorAll('.hero-content, .about-content, .project-card, .skill-item');
    
    fadeElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Set initial styles for fade-in effect
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
});
