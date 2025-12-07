/**
 * PolyMotivator - AI Course Path Generator
 * Interactive chatbot and personalized course path generation
 */

// ===================================
// State Management
// ===================================
const AppState = {
    userPlan: '',
    coursePath: [],
    currentStep: 0,
    chatMessages: [],
    isGenerating: false
};

// ===================================
// Course Path Templates
// ===================================
const coursePathTemplates = {
    technology: [
        {
            title: "Foundation: Strengthen Your Technical Skills",
            description: "Focus on building a strong foundation in Mathematics and Science. These subjects are crucial for technology-related diplomas.",
            tags: ["Mathematics", "Science", "Computer Skills"]
        },
        {
            title: "Explore Programming Basics",
            description: "Start learning basic programming concepts through online platforms like Code.org or Scratch. This will give you a head start in IT courses.",
            tags: ["Programming", "Logic", "Problem Solving"]
        },
        {
            title: "Research Your Diploma Options",
            description: "Investigate Information Technology, Infocomm Security Management, or Cybersecurity & Digital Forensics diplomas based on your specific interests.",
            tags: ["Research", "Career Planning"]
        },
        {
            title: "Build a Portfolio",
            description: "Create small projects or participate in hackathons to demonstrate your passion and skills. This strengthens your application.",
            tags: ["Projects", "Portfolio", "Experience"]
        },
        {
            title: "Connect with Current Students",
            description: "Reach out to current polytechnic students through open houses or social media to learn about their experiences.",
            tags: ["Networking", "Mentorship"]
        },
        {
            title: "Prepare for Interviews",
            description: "Some courses may require interviews. Practice articulating your interest in technology and showcase your projects.",
            tags: ["Interview Skills", "Communication"]
        }
    ],
    business: [
        {
            title: "Foundation: Excel in Key Subjects",
            description: "Focus on subjects like Mathematics, English, and Principles of Accounts if available. These are important for business diplomas.",
            tags: ["Mathematics", "English", "Accounts"]
        },
        {
            title: "Develop Business Awareness",
            description: "Read business news, follow successful entrepreneurs, and understand current market trends to build your business acumen.",
            tags: ["Business Knowledge", "Current Affairs"]
        },
        {
            title: "Research Diploma Specializations",
            description: "Explore options like Business Administration, Marketing, Banking & Finance, or Accountancy based on your strengths.",
            tags: ["Research", "Specializations"]
        },
        {
            title: "Gain Practical Experience",
            description: "Participate in school entrepreneurship programs or start a small business project to demonstrate initiative.",
            tags: ["Entrepreneurship", "Experience"]
        },
        {
            title: "Build Communication Skills",
            description: "Join debate clubs or public speaking groups to enhance your presentation and interpersonal skills.",
            tags: ["Communication", "Leadership"]
        },
        {
            title: "Prepare Application Materials",
            description: "Craft a compelling personal statement highlighting your business interests and relevant experiences.",
            tags: ["Application", "Personal Statement"]
        }
    ],
    design: [
        {
            title: "Foundation: Strengthen Creative Subjects",
            description: "Excel in Art, Design & Technology subjects. Build a strong foundation in visual communication and design principles.",
            tags: ["Art", "Design", "Creativity"]
        },
        {
            title: "Build Your Portfolio",
            description: "Create a diverse portfolio showcasing your best work across different mediums - digital art, sketches, designs, and projects.",
            tags: ["Portfolio", "Artwork", "Projects"]
        },
        {
            title: "Learn Design Software",
            description: "Familiarize yourself with industry-standard tools like Adobe Creative Suite (Photoshop, Illustrator) through free tutorials.",
            tags: ["Software", "Digital Skills"]
        },
        {
            title: "Research Design Diplomas",
            description: "Explore Visual Communication, Interior Design, Product Design, or Digital Media Design based on your interests.",
            tags: ["Research", "Specializations"]
        },
        {
            title: "Follow Design Trends",
            description: "Stay updated with current design trends, attend exhibitions, and follow influential designers for inspiration.",
            tags: ["Inspiration", "Industry Knowledge"]
        },
        {
            title: "Prepare for Portfolio Review",
            description: "Many design courses require portfolio submissions. Curate your best work and be ready to explain your creative process.",
            tags: ["Portfolio Review", "Presentation"]
        }
    ],
    healthcare: [
        {
            title: "Foundation: Excel in Sciences",
            description: "Focus heavily on Biology, Chemistry, and Mathematics. These subjects are essential for healthcare-related diplomas.",
            tags: ["Biology", "Chemistry", "Sciences"]
        },
        {
            title: "Understand Healthcare Careers",
            description: "Research different healthcare roles - nursing, biomedical science, pharmaceutical science - to find your fit.",
            tags: ["Career Research", "Healthcare"]
        },
        {
            title: "Volunteer in Healthcare Settings",
            description: "Gain exposure through volunteering at hospitals, nursing homes, or community health programs.",
            tags: ["Volunteering", "Experience"]
        },
        {
            title: "Develop Empathy and Communication",
            description: "Healthcare requires strong interpersonal skills. Practice active listening and compassionate communication.",
            tags: ["Soft Skills", "Empathy"]
        },
        {
            title: "Prepare for Aptitude Tests",
            description: "Some healthcare courses may require additional assessments. Practice aptitude tests and interview scenarios.",
            tags: ["Tests", "Preparation"]
        },
        {
            title: "Understand Course Requirements",
            description: "Review specific entry requirements, including minimum grades and preferred subject combinations for your target diploma.",
            tags: ["Requirements", "Planning"]
        }
    ],
    engineering: [
        {
            title: "Foundation: Master STEM Subjects",
            description: "Excel in Mathematics, Physics, and Chemistry. Strong analytical and problem-solving skills are crucial.",
            tags: ["Mathematics", "Physics", "STEM"]
        },
        {
            title: "Hands-On Project Experience",
            description: "Participate in robotics clubs, engineering competitions, or DIY projects to demonstrate practical skills.",
            tags: ["Projects", "Hands-on", "Competitions"]
        },
        {
            title: "Research Engineering Branches",
            description: "Explore Mechanical, Electrical, Aerospace, or Biomedical Engineering based on your specific interests.",
            tags: ["Research", "Specializations"]
        },
        {
            title: "Develop Technical Drawing Skills",
            description: "Learn basic CAD software or technical drawing. This will be valuable for engineering courses.",
            tags: ["CAD", "Technical Skills"]
        },
        {
            title: "Understand Industry Applications",
            description: "Visit industry talks, attend engineering exhibitions, and understand real-world applications of engineering.",
            tags: ["Industry", "Applications"]
        },
        {
            title: "Prepare Your Application",
            description: "Highlight your STEM achievements, project work, and genuine passion for engineering in your application.",
            tags: ["Application", "Achievements"]
        }
    ]
};

// ===================================
// AI Course Path Generator
// ===================================
const CoursePathGenerator = {
    generatePath(userInput) {
        // Analyze user input to determine best path template
        const input = userInput.toLowerCase();
        let selectedPath = [];
        
        // Simple keyword matching (in production, this would use actual AI/ML)
        if (input.includes('technology') || input.includes('it') || input.includes('computer') || 
            input.includes('programming') || input.includes('software') || input.includes('cyber')) {
            selectedPath = coursePathTemplates.technology;
        } else if (input.includes('business') || input.includes('marketing') || input.includes('finance') || 
                   input.includes('accounting') || input.includes('entrepreneur')) {
            selectedPath = coursePathTemplates.business;
        } else if (input.includes('design') || input.includes('art') || input.includes('creative') || 
                   input.includes('media') || input.includes('visual')) {
            selectedPath = coursePathTemplates.design;
        } else if (input.includes('health') || input.includes('nursing') || input.includes('medical') || 
                   input.includes('biomedical') || input.includes('pharmaceutical')) {
            selectedPath = coursePathTemplates.healthcare;
        } else if (input.includes('engineering') || input.includes('mechanical') || input.includes('electrical') || 
                   input.includes('aerospace') || input.includes('robotics')) {
            selectedPath = coursePathTemplates.engineering;
        } else {
            // Default to general technology path
            selectedPath = coursePathTemplates.technology;
        }
        
        // Personalize the path based on user input
        return selectedPath.map((step, index) => ({
            ...step,
            stepNumber: index + 1,
            status: index === 0 ? 'active' : 'pending'
        }));
    }
};

// ===================================
// PDF Generator
// ===================================
const PDFGenerator = {
    async downloadPDF() {
        // Create PDF content
        const pdfContent = this.createPDFContent();
        
        // In production, use a library like jsPDF or pdfmake
        // For now, create a simple text download
        const blob = new Blob([pdfContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-course-path.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Show success message in chatbot
        Chatbot.addMessage('bot', 'Your course path has been downloaded! Check your downloads folder.');
    },
    
    createPDFContent() {
        let content = '='.repeat(60) + '\n';
        content += '           POLYMOTIVATOR - YOUR PERSONALIZED COURSE PATH\n';
        content += '='.repeat(60) + '\n\n';
        content += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
        content += 'YOUR PLAN:\n';
        content += '-'.repeat(60) + '\n';
        content += AppState.userPlan + '\n\n';
        content += 'RECOMMENDED COURSE PATH:\n';
        content += '-'.repeat(60) + '\n\n';
        
        AppState.coursePath.forEach((step, index) => {
            content += `STEP ${step.stepNumber}: ${step.title}\n`;
            content += `${step.description}\n`;
            content += `Focus Areas: ${step.tags.join(', ')}\n\n`;
        });
        
        content += '='.repeat(60) + '\n';
        content += 'Good luck on your polytechnic journey!\n';
        content += 'Visit PolyMotivator for more resources and support.\n';
        content += '='.repeat(60) + '\n';
        
        return content;
    }
};

// ===================================
// Chatbot Module
// ===================================
const Chatbot = {
    init() {
        this.messagesContainer = document.getElementById('chatbot-messages');
        this.inputField = document.getElementById('chatbot-input-field');
        this.sendBtn = document.getElementById('send-message-btn');
        this.toggleBtn = document.getElementById('chatbot-toggle');
        this.container = document.getElementById('chatbot');
        
        this.bindEvents();
    },
    
    bindEvents() {
        this.sendBtn?.addEventListener('click', () => this.sendMessage());
        this.inputField?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        this.toggleBtn?.addEventListener('click', () => this.toggleChat());
    },
    
    show() {
        if (this.container) {
            this.container.style.display = 'block';
        }
    },
    
    toggleChat() {
        this.container?.classList.toggle('minimized');
    },
    
    addMessage(type, text) {
        if (!this.messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = type === 'bot' ? '🤖' : '👤';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const p = document.createElement('p');
        p.textContent = text;
        content.appendChild(p);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        
        AppState.chatMessages.push({ type, text, timestamp: Date.now() });
    },
    
    sendMessage() {
        const message = this.inputField?.value.trim();
        if (!message) return;
        
        this.addMessage('user', message);
        this.inputField.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.addMessage('bot', response);
        }, 800);
    },
    
    generateResponse(userMessage) {
        const msg = userMessage.toLowerCase();
        
        // Get current active step for context
        const activeStep = AppState.coursePath.find(s => s.status === 'active');
        const activeStepNum = activeStep ? activeStep.stepNumber : 0;
        
        if (msg.includes('hello') || msg.includes('hi')) {
            return "Hello! I'm walking this journey with you, one step at a time. Feel free to ask any questions as we progress together! 🚶";
        } else if (msg.includes('where') || msg.includes('which step') || msg.includes('current')) {
            if (activeStep) {
                return `We're currently at Step ${activeStepNum}: "${activeStep.title}". Take your time with this stage, and click it when you're ready to move forward together! 🚶`;
            } else {
                return "We've completed all the steps together! You've walked through your entire course path. Great job! 🎉";
            }
        } else if (msg.includes('next') || msg.includes('what\'s next')) {
            const nextStep = AppState.coursePath.find(s => s.status === 'pending');
            if (nextStep) {
                return `After we complete the current step, we'll walk to Step ${nextStep.stepNumber}: "${nextStep.title}". One step at a time! 🚶✨`;
            } else {
                return "You're on the final step! Complete it and we'll have walked through your entire journey together! 🎉";
            }
        } else if (msg.includes('diploma') || msg.includes('course')) {
            return "Your recommended path includes specific steps tailored to your chosen diploma. I'm walking with you through each stage to ensure you're well-prepared!";
        } else if (msg.includes('help') || msg.includes('what can')) {
            return "I'm your guide on this journey! I'll walk with you through each step of your course path, answer questions, and provide encouragement along the way. What would you like to know? 🚶";
        } else if (msg.includes('pdf') || msg.includes('download')) {
            return "You can download your personalized course path as a PDF using the 'Download PDF' button above! It's great for keeping track of our journey together. 📄";
        } else if (msg.includes('change') || msg.includes('different')) {
            return "To create a different path, click the 'Start Over' button and describe your new plan! I'll walk through the new journey with you. 🔄";
        } else if (msg.includes('thank')) {
            return "You're welcome! I'm here to walk alongside you every step of the way. Let's keep moving forward together! 💪🚶";
        } else if (msg.includes('go back') || msg.includes('previous') || msg.includes('undo')) {
            return "No problem! You can click on any completed step to revisit it. I'll walk back with you to review that stage. 🚶";
        } else {
            return `That's a great question! We're currently walking through your course path together. ${activeStep ? `Focus on Step ${activeStepNum} for now, and I'll guide you to the next stage when you're ready!` : 'Would you like more details about any particular step?'} 🚶✨`;
        }
    }
};

// ===================================
// Path Display Module
// ===================================
const PathDisplay = {
    init() {
        this.container = document.getElementById('path-display');
        this.pathContainer = document.getElementById('course-path');
        this.downloadBtn = document.getElementById('download-pdf-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.avatar = document.getElementById('avatar');
        this.progressLine = document.getElementById('progress-line');
        this.currentStepEl = document.getElementById('current-step');
        this.totalStepsEl = document.getElementById('total-steps');
        this.progressPercentageEl = document.getElementById('progress-percentage');
        
        this.bindEvents();
    },
    
    bindEvents() {
        this.downloadBtn?.addEventListener('click', () => PDFGenerator.downloadPDF());
        this.resetBtn?.addEventListener('click', () => this.reset());
    },
    
    show() {
        if (this.container) {
            this.container.style.display = 'block';
        }
    },
    
    hide() {
        if (this.container) {
            this.container.style.display = 'none';
        }
    },
    
    renderPath(steps) {
        if (!this.pathContainer) return;
        
        this.pathContainer.innerHTML = '';
        
        steps.forEach((step, index) => {
            const stepEl = document.createElement('div');
            stepEl.className = `path-step ${step.status}`;
            stepEl.dataset.stepIndex = index;
            
            const header = document.createElement('div');
            header.className = 'step-header';
            
            const badge = document.createElement('div');
            badge.className = 'step-badge';
            badge.textContent = step.stepNumber;
            
            const title = document.createElement('h3');
            title.className = 'step-title-text';
            title.textContent = step.title;
            
            header.appendChild(badge);
            header.appendChild(title);
            
            const description = document.createElement('p');
            description.className = 'step-description';
            description.textContent = step.description;
            
            const details = document.createElement('div');
            details.className = 'step-details';
            
            step.tags.forEach(tag => {
                const tagEl = document.createElement('span');
                tagEl.className = 'step-tag';
                tagEl.textContent = tag;
                details.appendChild(tagEl);
            });
            
            stepEl.appendChild(header);
            stepEl.appendChild(description);
            stepEl.appendChild(details);
            
            // Add click handler to mark as completed
            stepEl.addEventListener('click', () => this.toggleStepComplete(index));
            
            this.pathContainer.appendChild(stepEl);
        });
        
        this.updateProgress();
    },
    
    toggleStepComplete(index) {
        const step = AppState.coursePath[index];
        const previousStatus = step.status;
        
        if (step.status === 'pending') {
            // Can't mark pending steps - must complete in order
            Chatbot.addMessage('bot', `Let's complete the current step first! I'm walking with you through each stage of your journey. 🚶`);
            return;
        } else if (step.status === 'active') {
            step.status = 'completed';
            
            // Move avatar to next step
            if (index + 1 < AppState.coursePath.length) {
                AppState.coursePath[index + 1].status = 'active';
                const nextStep = AppState.coursePath[index + 1];
                Chatbot.addMessage('bot', `Excellent! We've completed "${step.title}". Now let's walk together to the next stage: "${nextStep.title}". I'm here to guide you! 🚶✨`);
            } else {
                Chatbot.addMessage('bot', `Amazing! We've walked through all the steps together! You've completed your entire course path. You're ready for your polytechnic journey! 🎉🎓`);
            }
        } else if (step.status === 'completed') {
            // Allow unchecking to go back
            step.status = 'active';
            // Mark all subsequent steps as pending
            for (let i = index + 1; i < AppState.coursePath.length; i++) {
                if (AppState.coursePath[i].status !== 'pending') {
                    AppState.coursePath[i].status = 'pending';
                }
            }
            Chatbot.addMessage('bot', `No problem! Let's revisit "${step.title}" together. I'm walking back with you to this step. 🚶`);
        }
        
        this.renderPath(AppState.coursePath);
    },
    
    updateProgress() {
        const total = AppState.coursePath.length;
        const completed = AppState.coursePath.filter(s => s.status === 'completed').length;
        const activeStepIndex = AppState.coursePath.findIndex(s => s.status === 'active');
        
        // Progress includes completed steps + current active step position
        const progressSteps = completed + (activeStepIndex >= 0 ? 0.5 : 0);
        const percentage = Math.round((completed / total) * 100);
        
        if (this.currentStepEl) this.currentStepEl.textContent = activeStepIndex >= 0 ? activeStepIndex + 1 : completed;
        if (this.totalStepsEl) this.totalStepsEl.textContent = total;
        if (this.progressPercentageEl) this.progressPercentageEl.textContent = percentage;
        
        // Update avatar position to current active step (avatar walks TO the step)
        const position = activeStepIndex >= 0 ? ((activeStepIndex) / (total - 1)) * 100 : 100;
        if (this.avatar) {
            this.avatar.style.left = `${Math.min(100, Math.max(0, position))}%`;
        }
        
        // Update progress line to show completed portion
        const lineProgress = (completed / total) * 100;
        if (this.progressLine) {
            this.progressLine.style.setProperty('--progress-width', `${lineProgress}%`);
        }
    },
    
    reset() {
        if (confirm('Are you sure you want to start over? This will clear your current course path.')) {
            this.hide();
            Chatbot.container.style.display = 'none';
            document.getElementById('student-plan').value = '';
            document.getElementById('generate-btn').disabled = true;
            AppState.coursePath = [];
            AppState.userPlan = '';
            AppState.currentStep = 0;
        }
    }
};

// Add CSS variable support for progress line
const style = document.createElement('style');
style.textContent = `
    .progress-line::after {
        width: var(--progress-width, 0%) !important;
    }
`;
document.head.appendChild(style);

// ===================================
// Input Handler Module
// ===================================
const InputHandler = {
    init() {
        this.textarea = document.getElementById('student-plan');
        this.generateBtn = document.getElementById('generate-btn');
        
        this.bindEvents();
    },
    
    bindEvents() {
        this.textarea?.addEventListener('input', () => this.handleInput());
        this.generateBtn?.addEventListener('click', () => this.generatePath());
    },
    
    handleInput() {
        const value = this.textarea?.value.trim();
        if (this.generateBtn) {
            this.generateBtn.disabled = !value || value.length < 20;
        }
    },
    
    async generatePath() {
        const userPlan = this.textarea?.value.trim();
        if (!userPlan) return;
        
        AppState.userPlan = userPlan;
        AppState.isGenerating = true;
        
        // Show loading state
        if (this.generateBtn) {
            this.generateBtn.textContent = 'Generating...';
            this.generateBtn.disabled = true;
        }
        
        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate course path
        AppState.coursePath = CoursePathGenerator.generatePath(userPlan);
        
        // Display results
        PathDisplay.show();
        PathDisplay.renderPath(AppState.coursePath);
        
        // Show chatbot
        Chatbot.show();
        Chatbot.addMessage('bot', `I've analyzed your plan and created a personalized ${AppState.coursePath.length}-step course path for you! I'll walk alongside you through each stage of your journey. Let's start with Step 1! Click on it when you're ready to begin. 🚶✨`);
        
        // Scroll to results
        document.getElementById('path-display')?.scrollIntoView({ behavior: 'smooth' });
        
        // Reset button
        if (this.generateBtn) {
            this.generateBtn.textContent = 'Generate My Path';
        }
        
        AppState.isGenerating = false;
    }
};

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
    InputHandler.init();
    PathDisplay.init();
    Chatbot.init();
    ScrollAnimations.init();
    Accessibility.init();
    
    console.log('PolyMotivator Course Path Generator initialized! 🚀');
}

// Start the application
initApp();

// ===================================
// Export for potential module usage
// ===================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Navigation,
        CoursePathGenerator,
        Chatbot,
        PathDisplay,
        AppState
    };
}
