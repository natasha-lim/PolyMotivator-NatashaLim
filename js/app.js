/**
 * PolyMotivator - Main Application
 * Interactive features for student motivation and study guidance
 */

// ===================================
// State Management
// ===================================
const AppState = {
    checklistItems: [],
    currentMotivation: 0,
    progressPercentage: 0,
    userPreferences: {}
};

// ===================================
// Motivation Quotes Database
// ===================================
const motivationQuotes = [
    {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill"
    },
    {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
    },
    {
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt"
    },
    {
        text: "Don't watch the clock; do what it does. Keep going.",
        author: "Sam Levenson"
    },
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        text: "Education is the most powerful weapon which you can use to change the world.",
        author: "Nelson Mandela"
    },
    {
        text: "The expert in anything was once a beginner.",
        author: "Helen Hayes"
    },
    {
        text: "You are never too old to set another goal or to dream a new dream.",
        author: "C.S. Lewis"
    },
    {
        text: "Success is the sum of small efforts repeated day in and day out.",
        author: "Robert Collier"
    },
    {
        text: "Your limitation—it's only your imagination.",
        author: "Anonymous"
    },
    {
        text: "Push yourself, because no one else is going to do it for you.",
        author: "Anonymous"
    },
    {
        text: "Great things never come from comfort zones.",
        author: "Anonymous"
    },
    {
        text: "Dream it. Wish it. Do it.",
        author: "Anonymous"
    },
    {
        text: "Study while others are sleeping; work while others are loafing; prepare while others are playing.",
        author: "William A. Ward"
    },
    {
        text: "The secret of getting ahead is getting started.",
        author: "Mark Twain"
    }
];

// ===================================
// Utility Functions
// ===================================

/**
 * Debounce function to limit rate of function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
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

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 */
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn('localStorage not available:', error);
    }
}

/**
 * Load data from localStorage
 * @param {string} key - Storage key
 * @returns {*} Stored value or null
 */
function loadFromStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.warn('localStorage not available:', error);
        return null;
    }
}

/**
 * Get random item from array
 * @param {Array} array - Source array
 * @returns {*} Random item
 */
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// ===================================
// Navigation Module
// ===================================
const Navigation = {
    init() {
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.bindEvents();
        this.handleActiveLink();
    },
    
    bindEvents() {
        // Mobile menu toggle
        this.navToggle?.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container')) {
                this.closeMenu();
            }
        });
        
        // Update active link on scroll
        window.addEventListener('scroll', debounce(() => this.handleActiveLink(), 100));
    },
    
    toggleMenu() {
        const isExpanded = this.navToggle.getAttribute('aria-expanded') === 'true';
        this.navToggle.setAttribute('aria-expanded', !isExpanded);
        this.navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    },
    
    closeMenu() {
        this.navToggle?.setAttribute('aria-expanded', 'false');
        this.navMenu?.classList.remove('active');
        document.body.style.overflow = '';
    },
    
    handleActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
};

// ===================================
// Motivation Module
// ===================================
const Motivation = {
    init() {
        this.quoteText = document.getElementById('motivation-text');
        this.quoteAuthor = document.querySelector('.quote-author');
        this.newQuoteBtn = document.getElementById('new-motivation-btn');
        
        this.loadQuote();
        this.bindEvents();
    },
    
    bindEvents() {
        this.newQuoteBtn?.addEventListener('click', () => this.changeQuote());
    },
    
    loadQuote() {
        const savedQuote = loadFromStorage('currentQuote');
        if (savedQuote) {
            this.displayQuote(savedQuote);
        } else {
            this.changeQuote();
        }
    },
    
    changeQuote() {
        const quote = getRandomItem(motivationQuotes);
        this.displayQuote(quote);
        saveToStorage('currentQuote', quote);
        
        // Add animation
        this.quoteText.style.animation = 'none';
        setTimeout(() => {
            this.quoteText.style.animation = 'fadeIn 0.6s ease-out forwards';
        }, 10);
    },
    
    displayQuote(quote) {
        if (this.quoteText && this.quoteAuthor) {
            this.quoteText.textContent = `"${quote.text}"`;
            this.quoteAuthor.textContent = `— ${quote.author}`;
        }
    }
};

// ===================================
// Checklist Module
// ===================================
const Checklist = {
    init() {
        this.checkboxes = document.querySelectorAll('.checklist-checkbox');
        this.progressRing = document.querySelector('.progress-ring-fill');
        this.progressPercentage = document.querySelector('.progress-percentage');
        this.progressMessage = document.querySelector('.progress-message');
        this.resetBtn = document.getElementById('reset-checklist-btn');
        
        this.loadProgress();
        this.bindEvents();
        this.updateProgress();
    },
    
    bindEvents() {
        this.checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.saveProgress();
                this.updateProgress();
            });
        });
        
        this.resetBtn?.addEventListener('click', () => this.resetProgress());
    },
    
    loadProgress() {
        const savedProgress = loadFromStorage('checklistProgress');
        if (savedProgress) {
            this.checkboxes.forEach((checkbox, index) => {
                checkbox.checked = savedProgress[index] || false;
            });
        }
    },
    
    saveProgress() {
        const progress = Array.from(this.checkboxes).map(cb => cb.checked);
        saveToStorage('checklistProgress', progress);
    },
    
    updateProgress() {
        const total = this.checkboxes.length;
        const completed = Array.from(this.checkboxes).filter(cb => cb.checked).length;
        const percentage = Math.round((completed / total) * 100);
        
        // Update percentage text
        if (this.progressPercentage) {
            this.progressPercentage.textContent = `${percentage}%`;
        }
        
        // Update progress ring
        if (this.progressRing) {
            const circumference = 2 * Math.PI * 52; // radius = 52
            const offset = circumference - (percentage / 100) * circumference;
            this.progressRing.style.strokeDashoffset = offset;
        }
        
        // Update progress bar aria
        const progressCircle = document.querySelector('.progress-circle');
        if (progressCircle) {
            progressCircle.setAttribute('aria-valuenow', percentage);
        }
        
        // Update motivational message
        this.updateMessage(percentage, completed, total);
    },
    
    updateMessage(percentage, completed, total) {
        if (!this.progressMessage) return;
        
        let message;
        if (percentage === 0) {
            message = "Let's get started on your journey! 🚀";
        } else if (percentage < 25) {
            message = "Great start! Keep the momentum going! 💪";
        } else if (percentage < 50) {
            message = "You're making excellent progress! 🌟";
        } else if (percentage < 75) {
            message = "More than halfway there! Keep pushing! 🎯";
        } else if (percentage < 100) {
            message = "Almost there! You've got this! 🔥";
        } else {
            message = "Congratulations! You're fully prepared! 🎉";
        }
        
        this.progressMessage.textContent = message;
    },
    
    resetProgress() {
        if (confirm('Are you sure you want to reset your progress?')) {
            this.checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            this.saveProgress();
            this.updateProgress();
        }
    }
};

// ===================================
// Scroll Animations Module
// ===================================
const ScrollAnimations = {
    init() {
        this.observeElements();
    },
    
    observeElements() {
        // Only animate if user prefers motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;
        
        const options = {
            root: null,
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        // Observe elements
        const elementsToAnimate = document.querySelectorAll(
            '.tip-card, .resource-card, .motivation-card, .checklist-item'
        );
        
        elementsToAnimate.forEach(el => {
            observer.observe(el);
        });
    }
};

// ===================================
// Hero CTA Module
// ===================================
const HeroCTA = {
    init() {
        this.getStartedBtn = document.getElementById('get-started-btn');
        this.learnMoreBtn = document.getElementById('learn-more-btn');
        
        this.bindEvents();
    },
    
    bindEvents() {
        this.getStartedBtn?.addEventListener('click', () => {
            this.scrollToSection('#checklist');
        });
        
        this.learnMoreBtn?.addEventListener('click', () => {
            this.scrollToSection('#motivation');
        });
    },
    
    scrollToSection(selector) {
        const section = document.querySelector(selector);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }
};

// ===================================
// Performance Optimization
// ===================================
const Performance = {
    init() {
        // Lazy load images if needed
        this.lazyLoadImages();
        
        // Prefetch on hover for better perceived performance
        this.prefetchOnHover();
    },
    
    lazyLoadImages() {
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        } else {
            // Fallback for browsers that don't support lazy loading
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
            document.body.appendChild(script);
        }
    },
    
    prefetchOnHover() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('mouseenter', function() {
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    // Prefetch section content
                    const section = document.querySelector(href);
                    if (section) {
                        // Trigger any lazy-loaded content in that section
                        section.classList.add('preloaded');
                    }
                }
            }, { once: true });
        });
    }
};

// ===================================
// Accessibility Enhancements
// ===================================
const Accessibility = {
    init() {
        this.handleKeyboardNav();
        this.announceChanges();
    },
    
    handleKeyboardNav() {
        // Escape key to close mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const navMenu = document.querySelector('.nav-menu.active');
                if (navMenu) {
                    Navigation.closeMenu();
                }
            }
        });
        
        // Tab trap in mobile menu when open
        const navMenu = document.querySelector('.nav-menu');
        const focusableElements = navMenu?.querySelectorAll(
            'a[href], button:not([disabled])'
        );
        
        if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            navMenu.addEventListener('keydown', (e) => {
                if (e.key === 'Tab' && navMenu.classList.contains('active')) {
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            });
        }
    },
    
    announceChanges() {
        // Create live region for screen readers
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
        
        // Announce checklist updates
        const checkboxes = document.querySelectorAll('.checklist-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const label = e.target.nextElementSibling.querySelector('.checklist-text').textContent;
                const status = e.target.checked ? 'completed' : 'uncompleted';
                liveRegion.textContent = `${label} marked as ${status}`;
            });
        });
    }
};

// ===================================
// Application Initialization
// ===================================
function initApp() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}

function init() {
    // Initialize all modules
    Navigation.init();
    Motivation.init();
    Checklist.init();
    HeroCTA.init();
    ScrollAnimations.init();
    Performance.init();
    Accessibility.init();
    
    console.log('PolyMotivator initialized successfully! 🚀');
}

// Start the application
initApp();

// ===================================
// Export for potential module usage
// ===================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Navigation,
        Motivation,
        Checklist,
        AppState
    };
}
