// ===================================
// Lei da Atração Bíblica - JavaScript
// Funcionalidades Interativas e Otimização de Conversão
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // NAVIGATION & MOBILE MENU
    // ===================================
    
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('.header');
    
    // Toggle mobile menu
    hamburger?.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Header scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const isMobile = window.innerWidth <= 768;
        
        if (!isMobile) {
            // Efeitos apenas no desktop
            if (scrollTop > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(212, 175, 55, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
        }
        
        // Hide/show header on scroll (desabilitado no mobile para manter logo visível)
        if (!isMobile && scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // ===================================
    // SMOOTH SCROLLING
    // ===================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===================================
    // FAQ ACCORDION
    // ===================================
    
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active', !isActive);
        });
    });
    
    // ===================================
    // SCROLL ANIMATIONS
    // ===================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(`
        .problem-item,
        .benefit-item, 
        .module-item,
        .testimonial-item,
        .verse-item,
        .credential-item
    `);
    
    animateElements.forEach(el => observer.observe(el));
    
    // ===================================
    // CONVERSION TRACKING
    // ===================================
    
    // Track CTA button clicks
    const ctaButtons = document.querySelectorAll('a[href*="kiwify"]');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Track conversion event
            trackEvent('cta_clicked', {
                button_location: getButtonLocation(this),
                timestamp: new Date().toISOString()
            });
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    function getButtonLocation(button) {
        if (button.closest('.hero')) return 'hero';
        if (button.closest('.cta-section')) return 'main-cta';
        if (button.closest('.nav-links')) return 'navigation';
        return 'unknown';
    }
    
    // ===================================
    // SCROLL PROGRESS INDICATOR
    // ===================================
    
    const progressIndicator = document.createElement('div');
    progressIndicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #D4AF37, #B8860B);
        z-index: 10000;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressIndicator);
    
    window.addEventListener('scroll', function() {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressIndicator.style.width = Math.min(scrollPercent, 100) + '%';
    });
    
    // ===================================
    // PRICE PULSING EFFECT
    // ===================================
    
    const priceElement = document.querySelector('.price-value');
    if (priceElement) {
        setInterval(() => {
            priceElement.style.transform = 'scale(1.05)';
            setTimeout(() => {
                priceElement.style.transform = 'scale(1)';
            }, 200);
        }, 5000);
    }
    
    // ===================================
    // SOCIAL PROOF COUNTER
    // ===================================
    
    const statsNumbers = document.querySelectorAll('.stat-number');
    const credentialNumbers = document.querySelectorAll('.credential-item');
    
    function animateCounter(element, finalNumber) {
        let currentNumber = 0;
        const increment = finalNumber / 60; // 1 second animation
        
        const timer = setInterval(() => {
            currentNumber += increment;
            
            if (currentNumber >= finalNumber) {
                element.textContent = finalNumber;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentNumber);
            }
        }, 16); // ~60fps
    }
    
    // Animate stats when they come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const number = parseInt(entry.target.textContent);
                if (!isNaN(number)) {
                    animateCounter(entry.target, number);
                    statsObserver.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.5 });
    
    statsNumbers.forEach(stat => {
        if (stat.textContent.includes('+')) {
            const number = parseInt(stat.textContent.replace('+', ''));
            stat.textContent = '0';
            statsObserver.observe(stat);
        }
    });
    
    // ===================================
    // TESTIMONIALS CAROUSEL (if needed)
    // ===================================
    
    function initTestimonialsCarousel() {
        const testimonialsGrid = document.querySelector('.testimonials-grid');
        const testimonials = document.querySelectorAll('.testimonial-item');
        
        if (testimonials.length > 3 && window.innerWidth < 768) {
            // Convert to carousel on mobile if more than 3 testimonials
            testimonialsGrid.style.display = 'flex';
            testimonialsGrid.style.overflowX = 'auto';
            testimonialsGrid.style.scrollSnapType = 'x mandatory';
            
            testimonials.forEach(testimonial => {
                testimonial.style.minWidth = '280px';
                testimonial.style.scrollSnapAlign = 'start';
            });
        }
    }
    
    // ===================================
    // FORM VALIDATION (if forms are added)
    // ===================================
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validatePhone(phone) {
        const re = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        return re.test(phone);
    }
    
    // ===================================
    // LAZY LOADING FOR IMAGES
    // ===================================
    
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // ===================================
    // PERFORMANCE MONITORING
    // ===================================
    
    // Monitor page load performance
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            trackEvent('page_performance', {
                load_time: pageLoadTime,
                dom_content_loaded: perfData.domContentLoadedEventEnd - perfData.navigationStart
            });
        }, 0);
    });
    
    // ===================================
    // UTILITY FUNCTIONS
    // ===================================
    
    function trackEvent(eventName, properties = {}) {
        // Analytics tracking - replace with your preferred analytics solution
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        
        // Console log for development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Event tracked:', eventName, properties);
        }
    }
    
    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        
        return function() {
            const context = this;
            const args = arguments;
            
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }
    
    function debounce(func, wait) {
        let timeout;
        
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // ===================================
    // WHATSAPP INTEGRATION
    // ===================================
    
    function createWhatsAppButton() {
        const whatsappButton = document.createElement('a');
        whatsappButton.href = 'https://wa.me/5511999999999?text=Olá! Tenho interesse no curso Lei da Atração Bíblica';
        whatsappButton.target = '_blank';
        whatsappButton.rel = 'noopener';
        whatsappButton.innerHTML = '<i class="fab fa-whatsapp"></i>';
        whatsappButton.className = 'whatsapp-float';
        whatsappButton.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: #25d366;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            z-index: 1000;
            text-decoration: none;
            box-shadow: 0 4px 20px rgba(37, 211, 102, 0.3);
            transition: all 0.3s ease;
        `;
        
        whatsappButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        whatsappButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        // Uncomment to add WhatsApp button
        // document.body.appendChild(whatsappButton);
    }
    
    // ===================================
    // URGENCY TIMER (if needed)
    // ===================================
    
    function createUrgencyTimer(endTime) {
        const timerElement = document.createElement('div');
        timerElement.className = 'urgency-timer';
        timerElement.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            background: linear-gradient(135deg, #D4AF37, #B8860B);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            font-weight: bold;
            font-size: 14px;
            z-index: 999;
            box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
            max-width: 200px;
            text-align: center;
        `;
        
        function updateTimer() {
            const now = new Date().getTime();
            const distance = endTime - now;
            
            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                timerElement.innerHTML = `
                    <div style="margin-bottom: 5px;">⏰ Oferta Especial</div>
                    <div>${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}</div>
                `;
            } else {
                timerElement.style.display = 'none';
            }
        }
        
        // Update every second
        setInterval(updateTimer, 1000);
        updateTimer();
        
        // Uncomment to add urgency timer
        // document.body.appendChild(timerElement);
    }
    
    // ===================================
    // INITIALIZE FEATURES
    // ===================================
    
    // Initialize responsive features
    window.addEventListener('resize', debounce(() => {
        initTestimonialsCarousel();
    }, 300));
    
    initTestimonialsCarousel();
    
    // Create additional features if needed
    // createWhatsAppButton();
    
    // Set urgency timer (example: 24 hours from now)
    // const urgencyEndTime = new Date().getTime() + (24 * 60 * 60 * 1000);
    // createUrgencyTimer(urgencyEndTime);
    
    // ===================================
    // ACCESSIBILITY IMPROVEMENTS
    // ===================================
    
    // Keyboard navigation for FAQ
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        question.setAttribute('tabindex', '0');
        question.setAttribute('aria-expanded', 'false');
        question.setAttribute('aria-controls', `faq-answer-${index}`);
        
        const answer = item.querySelector('.faq-answer');
        answer.id = `faq-answer-${index}`;
        
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Focus management for mobile menu
    hamburger?.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
    
    // ===================================
    // MAGICAL SPARKLES EFFECT
    // ===================================
    
    function createSparkles() {
        const heroBackground = document.querySelector('.hero-background');
        if (!heroBackground) return;
        
        // Create 20 sparkles
        for (let i = 0; i < 20; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            
            // Random position
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.animationDelay = Math.random() * 12 + 's';
            
            // Random size variation
            const size = 3 + Math.random() * 4;
            sparkle.style.width = size + 'px';
            sparkle.style.height = size + 'px';
            
            heroBackground.appendChild(sparkle);
        }
    }
    
    // Initialize sparkles
    createSparkles();
    
    console.log('🦋 Lei da Atração Bíblica - Landing Page carregada com sucesso!');
});