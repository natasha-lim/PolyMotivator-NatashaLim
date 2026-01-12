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
    isGenerating: false,
    videosEnabled: true,
    videoQueue: []
};

// ===================================
// AI Avatar Video Player Module
// ===================================
const AvatarVideoPlayer = {
    videoModal: null,
    currentVideoPlayer: null,
    closeBtn: null,
    continueBtn: null,
    overlayEl: null,
    fallbackEl: null,
    fallbackMessage: null,
    
    // Fallback messages when videos are not available
    fallbackMessages: {
        welcome: "Welcome! I'm Natasha, your AI guide. I've generated a personalized polytechnic pathway plan just for you. Let's explore each step together and make your dreams a reality! 🎓✨",
        step1: "🎉 Excellent start! You've completed the foundation step. Building strong fundamentals is crucial for your polytechnic journey. Keep up the great work!",
        step2: "💪 Amazing progress! Two steps down! You're showing real commitment to your future. The next step will build on what you've learned.",
        step3: "🌟 You're halfway there! This is impressive dedication. Your consistent effort is paving the way to your polytechnic success. Stay motivated!",
        step4: "🚀 Outstanding! Four steps completed! You're in the home stretch now. Your preparation is really taking shape. Almost there!",
        step5: "⭐ Brilliant work! Five steps done! You've come so far. Just one more step and you'll have a complete preparation plan. You've got this!",
        step6: "🎯 Fantastic! Six steps completed! You're so close to finishing your complete pathway plan. This final push will set you up for success!",
        completion: "🎊 CONGRATULATIONS! You've completed your entire polytechnic pathway plan! You now have a comprehensive roadmap to success. Download your PDF plan and start taking action. Your polytechnic journey begins now! 🎓🌟"
    },
    
    init() {
        this.videoModal = document.getElementById('video-modal');
        this.closeBtn = document.getElementById('video-modal-close');
        this.continueBtn = document.getElementById('video-continue-btn');
        this.overlayEl = document.getElementById('video-modal-overlay');
        this.fallbackEl = document.getElementById('video-fallback');
        this.fallbackMessage = document.getElementById('fallback-message');
        
        this.bindEvents();
    },
    
    bindEvents() {
        this.closeBtn?.addEventListener('click', () => this.closeModal());
        this.continueBtn?.addEventListener('click', () => this.closeModal());
        this.overlayEl?.addEventListener('click', () => this.closeModal());
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.videoModal?.classList.contains('active')) {
                this.closeModal();
            }
        });
    },
    
    async playVideo(videoType, stepNumber = null) {
        if (!AppState.videosEnabled) return;
        
        let videoId = '';
        let fallbackText = '';
        let modalTitle = 'AI Avatar Message';
        
        // Determine which video element to show
        if (videoType === 'welcome') {
            videoId = 'video-welcome';
            fallbackText = this.fallbackMessages.welcome;
            modalTitle = '👋 Welcome from Natasha';
        } else if (videoType === 'milestone' && stepNumber) {
            videoId = `video-step${stepNumber}`;
            fallbackText = this.fallbackMessages[`step${stepNumber}`] || `Great job completing Step ${stepNumber}!`;
            modalTitle = `🎉 Step ${stepNumber} Complete!`;
        } else if (videoType === 'completion') {
            videoId = 'video-completion';
            fallbackText = this.fallbackMessages.completion;
            modalTitle = '🎊 Pathway Complete!';
        }
        
        // Update modal title
        const titleEl = document.getElementById('video-modal-title');
        if (titleEl) titleEl.textContent = modalTitle;
        
        // Get the video element
        const videoElement = document.getElementById(videoId);
        
        if (videoElement) {
            const sourceElement = videoElement.querySelector('source');
            const videoSrc = sourceElement ? sourceElement.getAttribute('src') : '';
            
            // Check if video source has been added
            if (videoSrc && videoSrc.trim() !== '') {
                // Hide all videos first
                this.hideAllVideos();
                
                // Hide fallback, show this video
                if (this.fallbackEl) this.fallbackEl.style.display = 'none';
                videoElement.style.display = 'block';
                
                // Store current player
                this.currentVideoPlayer = videoElement;
                
                // Set up event listeners for this video
                videoElement.addEventListener('ended', () => {
                    setTimeout(() => this.closeModal(), 1000);
                }, { once: true });
                
                videoElement.addEventListener('error', () => {
                    console.warn('Video loading error');
                    this.showFallback(fallbackText);
                }, { once: true });
                
                // Open modal and play
                this.openModal();
                
                // Load and play video
                videoElement.load();
                
                try {
                    await videoElement.play();
                } catch (error) {
                    console.warn('Video autoplay prevented:', error);
                    // Video will show with controls, user can click play
                }
            } else {
                // No video source - show fallback message
                this.showFallback(fallbackText);
            }
        } else {
            // Video element not found - show fallback
            this.showFallback(fallbackText);
        }
    },
    
    hideAllVideos() {
        const videoIds = [
            'video-welcome',
            'video-step1',
            'video-step2',
            'video-step3',
            'video-step4',
            'video-step5',
            'video-step6',
            'video-completion'
        ];
        
        videoIds.forEach(id => {
            const video = document.getElementById(id);
            if (video) {
                video.style.display = 'none';
                video.pause();
                video.currentTime = 0;
            }
        });
    },
    
    showFallback(message = '') {
        if (!this.fallbackEl) return;
        
        // Hide all videos, show fallback
        this.hideAllVideos();
        this.fallbackEl.style.display = 'block';
        
        if (this.fallbackMessage && message) {
            this.fallbackMessage.textContent = message;
        }
        
        this.openModal();
    },
    
    openModal() {
        if (this.videoModal) {
            this.videoModal.classList.add('active');
            this.videoModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    },
    
    closeModal() {
        if (this.videoModal) {
            this.videoModal.classList.remove('active');
            this.videoModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            
            // Pause and reset all videos
            this.hideAllVideos();
        }
    },
    
    // Play welcome video when path is generated
    playWelcomeVideo() {
        this.playVideo('welcome');
    },
    
    // Play milestone video when step is completed
    playMilestoneVideo(stepNumber) {
        this.playVideo('milestone', stepNumber);
    },
    
    // Play completion video when all steps are done
    playCompletionVideo() {
        this.playVideo('completion');
    }
};

// ===================================
// State Management
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
    ],
    hospitality: [
        {
            title: "Foundation: Build Service Excellence",
            description: "Focus on English, communication, and interpersonal skills. Customer service excellence is key in hospitality.",
            tags: ["English", "Communication", "Service"]
        },
        {
            title: "Gain Industry Exposure",
            description: "Seek part-time work or volunteer at hotels, restaurants, or events to understand the hospitality environment.",
            tags: ["Experience", "Industry Exposure"]
        },
        {
            title: "Research Hospitality Diplomas",
            description: "Explore Hotel & Hospitality Management, Culinary Science, Tourism Management, or Event Management options.",
            tags: ["Research", "Specializations"]
        },
        {
            title: "Develop Cultural Awareness",
            description: "Learn about different cultures and customs. Global awareness is crucial in tourism and hospitality.",
            tags: ["Cultural Awareness", "Global Mindset"]
        },
        {
            title: "Build Leadership Skills",
            description: "Take on leadership roles in school events or community service to develop team management abilities.",
            tags: ["Leadership", "Teamwork"]
        },
        {
            title: "Prepare for Interviews",
            description: "Practice professional presentation, demonstrate passion for service, and showcase your people skills.",
            tags: ["Interview", "Professionalism"]
        }
    ],
    media: [
        {
            title: "Foundation: Enhance Communication Skills",
            description: "Excel in English, Literature, and subjects involving creative writing. Strong communication is essential.",
            tags: ["English", "Writing", "Communication"]
        },
        {
            title: "Build Your Media Portfolio",
            description: "Create content - videos, articles, podcasts, or social media campaigns to showcase your media capabilities.",
            tags: ["Portfolio", "Content Creation"]
        },
        {
            title: "Learn Media Production Tools",
            description: "Familiarize yourself with tools like video editing software, audio production, and content management systems.",
            tags: ["Technical Skills", "Software"]
        },
        {
            title: "Research Media Specializations",
            description: "Explore Mass Communication, Film & Media Studies, Digital Media Design, or Journalism options.",
            tags: ["Research", "Specializations"]
        },
        {
            title: "Stay Updated on Media Trends",
            description: "Follow current media trends, social media evolution, and understand how audiences consume content today.",
            tags: ["Industry Knowledge", "Trends"]
        },
        {
            title: "Showcase Your Creativity",
            description: "Prepare a strong portfolio demonstrating your creative work and ability to tell compelling stories.",
            tags: ["Creativity", "Storytelling"]
        }
    ],
    socialsciences: [
        {
            title: "Foundation: Excel in Humanities",
            description: "Focus on English, History, Geography, and Social Studies. Understanding human behavior and society is key.",
            tags: ["Humanities", "English", "Social Studies"]
        },
        {
            title: "Develop Research Skills",
            description: "Practice conducting research, analyzing data, and writing reports. These skills are crucial for social sciences.",
            tags: ["Research", "Analysis", "Critical Thinking"]
        },
        {
            title: "Explore Social Science Fields",
            description: "Research diplomas in Psychology, Social Work, Early Childhood Education, or Community Services.",
            tags: ["Research", "Career Options"]
        },
        {
            title: "Volunteer in Community Programs",
            description: "Gain experience through volunteering with social service organizations, youth programs, or community centers.",
            tags: ["Volunteering", "Community Service"]
        },
        {
            title: "Build Empathy and Listening Skills",
            description: "Develop strong interpersonal skills, active listening, and the ability to work with diverse populations.",
            tags: ["Empathy", "Soft Skills"]
        },
        {
            title: "Prepare Your Personal Statement",
            description: "Highlight your passion for helping others and understanding society in your application materials.",
            tags: ["Application", "Personal Statement"]
        }
    ],
    aviation: [
        {
            title: "Foundation: Master Core Sciences",
            description: "Excel in Mathematics, Physics, and English. Strong technical and communication skills are essential for aviation.",
            tags: ["Mathematics", "Physics", "English"]
        },
        {
            title: "Understand Aviation Regulations",
            description: "Learn about aviation safety, international regulations, and industry standards that govern the aviation sector.",
            tags: ["Regulations", "Safety", "Standards"]
        },
        {
            title: "Research Aviation Career Paths",
            description: "Explore Aeronautical Engineering, Aviation Management, Aerospace Electronics, or Air Traffic Management.",
            tags: ["Research", "Career Planning"]
        },
        {
            title: "Develop Spatial Awareness",
            description: "Practice spatial reasoning through simulators, flight games, or model aircraft to build relevant skills.",
            tags: ["Spatial Skills", "Technical Practice"]
        },
        {
            title: "Build Technical Knowledge",
            description: "Learn about aircraft systems, navigation, meteorology, and the technical aspects of flight operations.",
            tags: ["Technical Knowledge", "Aviation Systems"]
        },
        {
            title: "Prepare for Assessments",
            description: "Some aviation courses require aptitude tests and medical examinations. Ensure you meet all requirements.",
            tags: ["Assessments", "Medical Requirements"]
        }
    ],
    maritime: [
        {
            title: "Foundation: Strengthen STEM Foundation",
            description: "Focus on Mathematics, Physics, and Geography. Understanding navigation, engineering, and environmental science is important.",
            tags: ["Mathematics", "Physics", "Geography"]
        },
        {
            title: "Learn About Maritime Industry",
            description: "Research the shipping industry, port operations, marine engineering, and global maritime trade.",
            tags: ["Industry Knowledge", "Maritime"]
        },
        {
            title: "Explore Maritime Specializations",
            description: "Investigate Marine Engineering, Nautical Studies, Maritime Business, or Shipping Management diplomas.",
            tags: ["Research", "Specializations"]
        },
        {
            title: "Develop Physical Fitness",
            description: "Maritime careers often require good physical health. Maintain fitness and be prepared for medical examinations.",
            tags: ["Physical Fitness", "Health"]
        },
        {
            title: "Build Technical Skills",
            description: "Learn about navigation systems, ship operations, mechanical systems, and maritime safety procedures.",
            tags: ["Technical Skills", "Navigation"]
        },
        {
            title: "Understand Career Requirements",
            description: "Review specific entry requirements including medical fitness, color vision tests, and minimum grade criteria.",
            tags: ["Requirements", "Medical Standards"]
        }
    ]
};

// ===================================
// AI Course Path Generator
// ===================================
const CoursePathGenerator = {
    generatePath(userInput) {
        console.log('🔄 Generating path for input:', userInput.substring(0, 50) + '...');
        
        // Use smart template-based generation with keyword detection
        return this.generateTemplatePath(userInput);
    },
    
    generateTemplatePath(userInput) {
        // Analyze user input to determine best path template
        const input = userInput.toLowerCase();
        let selectedPath = [];
        let selectedCategory = '';
        
        // Enhanced keyword matching with more comprehensive keywords
        const keywords = {
            technology: ['technology', 'it', 'computer', 'programming', 'software', 'cyber', 
                        'coding', 'developer', 'app', 'web', 'digital', 'tech', 'infocomm',
                        'database', 'cloud', 'network', 'security', 'data', 'analytics', 
                        'ai', 'artificial intelligence', 'machine learning', 'blockchain',
                        'iot', 'internet of things', 'python', 'java', 'javascript', 'c++',
                        'fullstack', 'backend', 'frontend', 'devops', 'game', 'mobile',
                        'systems', 'infrastructure', 'agile', 'scrum', 'testing', 'qa'],
            business: ['business', 'marketing', 'finance', 'accounting', 'entrepreneur', 
                      'management', 'economics', 'commerce', 'trade', 'sales',
                      'retail', 'consulting', 'hr', 'human resources', 'operations',
                      'strategy', 'banking', 'investment', 'insurance', 'logistics',
                      'supply chain', 'procurement', 'hospitality', 'tourism', 'hotel',
                      'customer service', 'administration', 'leadership', 'startup',
                      'corporate', 'ecommerce', 'advertising', 'branding', 'pr'],
            design: ['design', 'art', 'creative', 'media', 'visual', 'graphic', 
                    'multimedia', 'animation', 'illustration', 'ux', 'ui',
                    'photography', 'video', 'film', 'production', 'editing',
                    'advertising design', 'product design', 'interior', 'fashion',
                    'architect', 'landscape', '3d', 'modeling', 'rendering',
                    'photoshop', 'illustrator', 'figma', 'sketch', 'adobe',
                    'branding design', 'typography', 'layout', 'motion graphics'],
            healthcare: ['health', 'nursing', 'medical', 'biomedical', 'pharmaceutical', 
                        'healthcare', 'medicine', 'therapy', 'clinical', 'patient',
                        'doctor', 'physician', 'surgeon', 'dentistry', 'dental',
                        'pharmacy', 'pharmacist', 'physiotherapy', 'occupational therapy',
                        'radiology', 'laboratory', 'diagnostic', 'pathology', 'nutrition',
                        'dietetics', 'optometry', 'paramedic', 'emergency', 'hospital',
                        'wellness', 'mental health', 'counseling', 'psychology', 'care'],
            engineering: ['engineering', 'mechanical', 'electrical', 'aerospace', 'robotics',
                         'civil', 'chemical', 'manufacturing', 'automation',
                         'industrial', 'structural', 'construction', 'building',
                         'electronics', 'power', 'energy', 'renewable', 'solar',
                         'automotive', 'marine', 'naval', 'materials', 'mechatronics',
                         'process', 'production', 'quality', 'safety', 'maintenance',
                         'cad', 'autocad', 'solidworks', 'plc', 'hydraulic', 'pneumatic'],
            hospitality: ['hospitality', 'hotel', 'tourism', 'travel', 'culinary', 'chef',
                         'restaurant', 'food', 'beverage', 'service', 'resort',
                         'events', 'catering', 'guest', 'accommodation', 'cruise',
                         'convention', 'banquet', 'concierge', 'housekeeping',
                         'front desk', 'sommelier', 'bartender', 'pastry', 'baking'],
            media: ['media', 'journalism', 'broadcasting', 'news', 'reporter',
                   'communication', 'public relations', 'content', 'writing',
                   'editing', 'publishing', 'radio', 'television', 'podcast',
                   'social media', 'digital media', 'mass comm', 'advertising',
                   'copywriting', 'storytelling', 'documentary', 'interview',
                   'blogger', 'vlogger', 'influencer', 'streaming'],
            socialsciences: ['social', 'psychology', 'sociology', 'counseling',
                            'social work', 'community', 'early childhood', 'education',
                            'teaching', 'childcare', 'youth', 'family', 'welfare',
                            'humanities', 'anthropology', 'behavior', 'human services',
                            'rehabilitation', 'therapy', 'development', 'nonprofit',
                            'advocacy', 'disability', 'elderly', 'special needs'],
            aviation: ['aviation', 'aerospace', 'pilot', 'flight', 'aircraft',
                      'airline', 'airport', 'aeronautical', 'air traffic',
                      'aviation management', 'flying', 'cabin crew', 'ground handling',
                      'cargo', 'logistics', 'navigation', 'aviation safety',
                      'air transport', 'flight operations', 'drone', 'uav'],
            maritime: ['maritime', 'marine', 'shipping', 'nautical', 'naval',
                      'port', 'vessel', 'ship', 'seafaring', 'ocean',
                      'maritime business', 'logistics', 'shipping management',
                      'marine engineering', 'offshore', 'port operations',
                      'cargo', 'maritime law', 'navigation', 'seamanship',
                      'merchant navy', 'boat', 'yacht', 'maritime safety']
        };
        
        // Count keyword matches for each category
        const scores = {};
        for (const [category, words] of Object.entries(keywords)) {
            scores[category] = words.filter(word => input.includes(word)).length;
        }
        
        // Select category with highest score
        let maxScore = 0;
        for (const [category, score] of Object.entries(scores)) {
            if (score > maxScore) {
                maxScore = score;
                selectedCategory = category;
            }
        }
        
        // If no keywords matched, use technology as default
        if (maxScore === 0) {
            selectedCategory = 'technology';
            console.log('📋 No specific keywords found, using default: technology');
        } else {
            console.log(`📋 Detected category: ${selectedCategory} (${maxScore} keyword matches)`);
        }
        
        selectedPath = coursePathTemplates[selectedCategory];
        
        // Show message in chatbot about detected path
        if (typeof Chatbot !== 'undefined' && Chatbot.addMessage && maxScore > 0) {
            const categoryNames = {
                technology: 'Technology/IT',
                business: 'Business',
                design: 'Design/Creative',
                healthcare: 'Healthcare',
                engineering: 'Engineering',
                hospitality: 'Hospitality & Tourism',
                media: 'Media & Communications',
                socialsciences: 'Social Sciences',
                aviation: 'Aviation',
                maritime: 'Maritime'
            };
            setTimeout(() => {
                Chatbot.addMessage('bot', `🎯 Detected interest in ${categoryNames[selectedCategory]}! I've customized your pathway accordingly.`);
            }, 1500);
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
        // For now, create a professional text download
        const blob = new Blob([pdfContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Generate filename with date
        const date = new Date().toISOString().split('T')[0];
        a.download = `PolyMotivator_Pathway_Plan_${date}.txt`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Show success message in chatbot
        Chatbot.addMessage('bot', '✅ Pathway plan exported successfully! Great for your portfolio and tracking your progress. 📄');
    },
    
    createPDFContent() {
        let content = '='.repeat(70) + '\n';
        content += '              POLYMOTIVATOR - CAREER PATHWAY GUIDANCE PLAN\n';
        content += '='.repeat(70) + '\n\n';
        content += `Generated: ${new Date().toLocaleDateString('en-SG', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })}\n`;
        content += `Time: ${new Date().toLocaleTimeString('en-SG')}\n\n`;
        content += 'STUDENT PROFILE & INTERESTS:\n';
        content += '-'.repeat(70) + '\n';
        content += AppState.userPlan + '\n\n';
        content += 'PERSONALIZED POLYTECHNIC PREPARATION PATHWAY:\n';
        content += '-'.repeat(70) + '\n';
        content += 'This structured plan provides step-by-step guidance for polytechnic\n';
        content += 'preparation. Students should work through each step systematically.\n\n';
        
        AppState.coursePath.forEach((step, index) => {
            content += `STEP ${step.stepNumber}: ${step.title.toUpperCase()}\n`;
            content += `${'-'.repeat(70)}\n`;
            content += `Description:\n${step.description}\n\n`;
            content += `Key Focus Areas:\n`;
            step.tags.forEach(tag => {
                content += `  • ${tag}\n`;
            });
            content += `\nStatus: [ ] Not Started  [ ] In Progress  [ ] Completed\n`;
            content += `Notes:\n${'_'.repeat(70)}\n`;
            content += `${'_'.repeat(70)}\n\n`;
        });
        
        content += '='.repeat(70) + '\n';
        content += 'RECOMMENDATIONS FOR SUCCESS:\n';
        content += '='.repeat(70) + '\n';
        content += '1. Work through steps sequentially for best results\n';
        content += '2. Set specific deadlines for each step\n';
        content += '3. Track progress and adjust timeline as needed\n';
        content += '4. Seek help from teachers or mentors when stuck\n';
        content += '5. Review and update this plan every 2-4 weeks\n\n';
        content += 'NOTES:\n';
        content += '-'.repeat(70) + '\n';
        content += 'Progress Updates:\n';
        content += '_'.repeat(70) + '\n';
        content += '_'.repeat(70) + '\n\n';
        content += 'PARENT/GUARDIAN ACKNOWLEDGMENT:\n';
        content += '-'.repeat(70) + '\n';
        content += 'I have reviewed this pathway plan with my child.\n\n';
        content += 'Parent/Guardian Name: _______________________  Date: __________\n';
        content += 'Signature: _______________________\n\n';
        content += '='.repeat(70) + '\n';
        content += 'PolyMotivator - Educational Guidance System\n';
        content += 'For students in Singapore\n';
        content += 'Visit: [Your School Career Guidance Portal]\n';
        content += '='.repeat(70) + '\n';
        
        return content;
    }
};

// ===================================
// Google Gemini AI Image Generator
// ===================================
const ImageGenerator = {
    // ⚠️ SECURITY WARNING: API key should ideally be stored on a backend server
    // For production, move this to a secure backend environment
    // API_KEY: 'AIzaSyDFcTpf2wWHVjBYaY9qjNIjT6aWiXO7GD8',
    
    async generateVisualPath(userInput) {
        const displayContainer = document.getElementById('path-display');
        
        // 1. Create a container for the image if it doesn't exist
        let imgWrapper = document.getElementById('ai-image-wrapper');
        if (!imgWrapper) {
            imgWrapper = document.createElement('div');
            imgWrapper.id = 'ai-image-wrapper';
            imgWrapper.style = "text-align: center; margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 15px;";
            displayContainer.prepend(imgWrapper);
        }

        // 2. Show Loading State
        imgWrapper.innerHTML = `
            <div id="ai-loader">
                <p>🎨 Generating your career roadmap with Google Gemini AI...</p>
                <div class="spinner"></div> 
            </div>
        `;

        try {
            // 3. Generate image using Google Gemini API
            const prompt = `Create a detailed visual career roadmap infographic for the following student profile:

${userInput}

Generate a clear, professional career roadmap infographic with:
- Timeline visualization showing progression from current state to career goal
- Key milestones with dates/timeframes
- Educational requirements (diplomas, courses, certifications)
- Skill development stages
- Career progression steps
- Relevant icons and visual elements
- Clean, modern design with readable text
- Bright, motivational colors
- Horizontal timeline format from left to right

Make it inspirational and actionable, suitable for a polytechnic student planning their future.`;

            const imageData = await this.callGeminiAPI(prompt);
            
            if (!imageData) {
                throw new Error('No image data received from Gemini API');
            }

            // 4. Create and display the image element
            const imgElement = document.createElement('img');
            imgElement.src = `data:image/png;base64,${imageData}`;
            imgElement.alt = "AI-generated career roadmap";
            imgElement.style = "width: 100%; max-width: 800px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); transition: opacity 0.5s ease-in;";
            
            imgWrapper.innerHTML = ''; // Remove loader
            
            // Create a container for the image and download button
            const imageContainer = document.createElement('div');
            imageContainer.style = "display: flex; flex-direction: column; align-items: center; gap: 15px;";
            
            imageContainer.appendChild(imgElement);
            
            // 5. Add Download Button
            const downloadBtn = document.createElement('button');
            downloadBtn.textContent = '📥 Download Roadmap';
            downloadBtn.className = 'btn btn-secondary';
            downloadBtn.style = "padding: 12px 24px; font-size: 16px; cursor: pointer; margin-top: 10px;";
            
            downloadBtn.addEventListener('click', () => {
                try {
                    // Create a download link for base64 image
                    const downloadLink = document.createElement('a');
                    downloadLink.href = imgElement.src;
                    downloadLink.download = `Career_Roadmap_${Date.now()}.png`;
                    
                    // Trigger download
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                    
                    // Show success feedback
                    downloadBtn.textContent = '✅ Downloaded!';
                    setTimeout(() => {
                        downloadBtn.textContent = '📥 Download Roadmap';
                    }, 2000);
                } catch (error) {
                    console.error('Download error:', error);
                    downloadBtn.textContent = '❌ Download failed';
                    setTimeout(() => {
                        downloadBtn.textContent = '📥 Download Roadmap';
                    }, 2000);
                }
            });
            
            imageContainer.appendChild(downloadBtn);
            imgWrapper.appendChild(imageContainer);

        } catch (error) {
            console.error("Gemini AI Image Generation Error:", error);
            
            // Provide detailed error message
            imgWrapper.innerHTML = `
                <div style="padding: 20px; background: #fff3cd; border-radius: 10px; border-left: 4px solid #ffc107;">
                    <h4 style="margin-top: 0; color: #856404;">⚠️ Image Generation Issue</h4>
                    <p style="color: #856404; margin-bottom: 10px;">Unable to generate visual roadmap at this time.</p>
                    <p style="color: #856404; font-size: 14px;"><strong>Reason:</strong> ${error.message || 'API connection error'}</p>
                    <p style="color: #856404; font-size: 14px; margin-top: 10px;">Your detailed career path is still available below. The visual roadmap will be generated once the service is available.</p>
                </div>
            `;
        }
    },
    
    async callGeminiAPI(prompt) {
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=AIzaSyDFcTpf2wWHVjBYaY9qjNIjT6aWiXO7GD8`;

        const requestBody = {
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: 1.0,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192,
                // THIS IS THE CRITICAL FIX: Request image (or text + image) output
                responseModalities: ["IMAGE"]  // Use ["TEXT", "IMAGE"] if you want accompanying text too
            },
            // Optional: For better roadmap aspect ratio (horizontal timeline)
            // Uncomment if you want a wide image
            // imageConfig: {
            //     aspectRatio: "16:9"
            // }
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(`API error: ${err.error?.message || response.status}`);
        }

        const data = await response.json();

        // Extract base64 image from inline_data (mimeType will be image/png or similar)
        if (data.candidates?.[0]?.content?.parts) {
            for (const part of data.candidates[0].content.parts) {
                if (part.inlineData?.mimeType?.startsWith('image/') && part.inlineData.data) {
                    return part.inlineData.data;  // Base64 string
                }
            }
        }

        // Fallback error with any text response for debugging
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No output';
        throw new Error(`No image generated. Text response: ${textResponse.substring(0, 300)}...`);
    }
};

// ===================================
// Chatbot Module
// ===================================
const Chatbot = {
    flowiseApiUrl: 'https://flowise-production-e0ce.up.railway.app/api/v1/prediction/7d208ad3-eb5b-4b3c-9eec-02504f7c0c9a',
    
    init() {
        this.messagesContainer = document.getElementById('chatbot-messages');
        this.inputField = document.getElementById('chatbot-input-field');
        this.sendBtn = document.getElementById('send-message-btn');
        this.toggleBtn = document.getElementById('chatbot-toggle');
        this.maximizeBtn = document.getElementById('chatbot-maximize');
        this.fabBtn = document.getElementById('chatbot-fab');
        this.container = document.getElementById('chatbot');
        this.isMaximized = false;
        
        this.bindEvents();
    },
    
    bindEvents() {
        this.sendBtn?.addEventListener('click', () => this.sendMessage());
        this.inputField?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        this.toggleBtn?.addEventListener('click', () => this.closeChat());
        this.maximizeBtn?.addEventListener('click', () => this.toggleMaximize());
        this.fabBtn?.addEventListener('click', () => this.openChat());
    },
    
    openChat() {
        if (this.container) {
            this.container.style.display = 'block';
            this.fabBtn.style.display = 'none';
        }
    },
    
    closeChat() {
        if (this.container) {
            this.container.style.display = 'none';
            this.fabBtn.style.display = 'flex';
            // Reset to normal size when closing
            if (this.isMaximized) {
                this.toggleMaximize();
            }
        }
    },
    
    toggleMaximize() {
        this.isMaximized = !this.isMaximized;
        this.container?.classList.toggle('maximized');
        
        // Update button icon and aria-label
        if (this.maximizeBtn) {
            if (this.isMaximized) {
                this.maximizeBtn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
                    </svg>
                `;
                this.maximizeBtn.setAttribute('aria-label', 'Minimize chatbot');
                this.maximizeBtn.setAttribute('title', 'Minimize');
            } else {
                this.maximizeBtn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                    </svg>
                `;
                this.maximizeBtn.setAttribute('aria-label', 'Maximize chatbot');
                this.maximizeBtn.setAttribute('title', 'Maximize');
            }
        }
        
        // Scroll to bottom after animation completes
        setTimeout(() => {
            if (this.messagesContainer) {
                this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
            }
        }, 300);
    },
    
    show() {
        // This is called when path is generated - just make fab visible
        if (this.fabBtn) {
            this.fabBtn.style.display = 'flex';
        }
    },
    
    toggleChat() {
        this.container?.classList.toggle('minimized');
    },
    
    addMessage(type, text, isFormatted = false) {
        if (!this.messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = type === 'bot' ? '🎓' : '👤';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        if (isFormatted) {
            // Format the response text for better display
            const formattedText = this.formatResponseText(text);
            content.innerHTML = formattedText;
        } else {
            const p = document.createElement('p');
            p.textContent = text;
            content.appendChild(p);
        }
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        
        AppState.chatMessages.push({ type, text, timestamp: Date.now() });
    },
    
    formatResponseText(text) {
        if (!text) return '';
        
        // First, clean the text of any unwanted characters
        let cleaned = text.trim();
        
        // Step 1: Convert markdown bold (only **text** format) to HTML
        cleaned = cleaned.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
        
        // Step 2: Split into logical sections based on patterns
        // Add line breaks before common section markers
        cleaned = cleaned.replace(/(Requirement:|Action Step:|ProTip:|Professional Advice|Academic Foundation|Polytechnic Path|Career Path|Next Steps?:)/gi, '\n\n$1');
        
        // Split into paragraphs based on double line breaks
        let paragraphs = cleaned.split(/\n\n+/);
        
        // Step 3: Process each paragraph
        let formatted = paragraphs.map(para => {
            para = para.trim();
            if (!para) return '';
            
            // Check if it's a list (lines starting with - or *)
            const lines = para.split('\n');
            const isListBlock = lines.every(line => 
                line.trim().match(/^[\-\*•]\s+/) || line.trim() === ''
            );
            
            if (isListBlock) {
                // Convert to HTML list
                const listItems = lines
                    .filter(line => line.trim())
                    .map(line => {
                        const content = line.replace(/^[\-\*•]\s+/, '').trim();
                        return `<li>${content}</li>`;
                    })
                    .join('');
                return `<ul>${listItems}</ul>`;
            } else {
                // Check if this is a section header (Requirement:, ProTip:, etc.)
                if (para.match(/^(Requirement:|Action Step:|ProTip:|Professional Advice|Academic Foundation|Polytechnic Path|Career Path|Next Steps?:)/i)) {
                    // Add extra spacing for section headers
                    para = para.replace(/\n/g, ' ');
                    return `<p class="section-header">${para}</p>`;
                } else {
                    // Regular paragraph - replace single line breaks with spaces for better flow
                    para = para.replace(/\n/g, ' ');
                    return `<p>${para}</p>`;
                }
            }
        }).filter(p => p).join('');
        
        // Step 4: Clean up any remaining markdown artifacts
        formatted = formatted
            // Remove heading markers (with or without space)
            .replace(/#{1,6}\s*/g, '')
            // Remove standalone hash symbols
            .replace(/\s*###\s*/g, ' ')
            // Remove code block markers
            .replace(/```[\w]*\n?/g, '')
            .replace(/`/g, '')
            // Remove any standalone asterisks or underscores that weren't part of formatting
            .replace(/(?<!\w)[\*_](?!\w)/g, '');
        
        return formatted;
    },
    
    sendMessage() {
        const message = this.inputField?.value.trim();
        if (!message) return;
        
        this.addMessage('user', message);
        this.inputField.value = '';
        
        // Call Flowise API for response
        this.getFlowiseResponse(message);
    },
    
    async getFlowiseResponse(userMessage) {
        try {
            // Add typing indicator
            this.addTypingIndicator();
            
            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
            
            const response = await fetch(this.flowiseApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question: userMessage
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Remove typing indicator
            this.removeTypingIndicator();
            
            // Extract and clean response text
            let botResponse = data.text || data.answer || data.response || 'I apologize, but I received an unexpected response format. Please try asking your question again.';
            
            // Clean up the response
            botResponse = this.cleanResponse(botResponse);
            
            this.addMessage('bot', botResponse, true);
            
        } catch (error) {
            console.error('Flowise API error:', error);
            
            // Remove typing indicator
            this.removeTypingIndicator();
            
            // Check if it's a timeout error
            if (error.name === 'AbortError') {
                this.addMessage('bot', 'The AI is taking longer than expected to respond. This might be due to server load. Please try again or ask a simpler question.', false);
            } else {
                // Fallback to local response on error
                const fallbackResponse = this.generateResponse(userMessage);
                this.addMessage('bot', fallbackResponse, false);
            }
        }
    },
    
    cleanResponse(text) {
        if (!text) return '';
        
        // Remove any stray symbols or artifacts
        return text
            .trim()
            // Remove excessive spaces
            .replace(/\s{2,}/g, ' ')
            // Remove any control characters
            .replace(/[\x00-\x1F\x7F]/g, '')
            // Clean up common artifacts
            .replace(/\[object Object\]/g, '')
            .replace(/undefined/g, '')
            .replace(/null/g, '');
    },
    
    addTypingIndicator() {
        if (!this.messagesContainer) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = '🎓';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const p = document.createElement('p');
        p.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
        content.appendChild(p);
        
        typingDiv.appendChild(avatar);
        typingDiv.appendChild(content);
        
        this.messagesContainer.appendChild(typingDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    },
    
    removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    },
    
    generateResponse(userMessage) {
        const msg = userMessage.toLowerCase();
        
        // Get current active step for context
        const activeStep = AppState.coursePath.find(s => s.status === 'active');
        const activeStepNum = activeStep ? activeStep.stepNumber : 0;
        
        if (msg.includes('hello') || msg.includes('hi')) {
            return "Hello! I'm here to provide guidance throughout this pathway planning session. How can I assist you and the student today? 🎓";
        } else if (msg.includes('counsellor') || msg.includes('counselor') || msg.includes('teacher')) {
            return "This system is designed to help you explore your polytechnic options independently. You can share your generated pathway plan with teachers or mentors for additional guidance if needed.";
        } else if (msg.includes('session') || msg.includes('meeting')) {
            return "For counselling sessions: Review the generated pathway with the student, discuss each step's relevance, and export the plan as a take-home resource. This helps maintain continuity between sessions.";
        } else if (msg.includes('where') || msg.includes('which step') || msg.includes('current')) {
            if (activeStep) {
                return `The student is currently at Step ${activeStepNum}: "${activeStep.title}". This is a good discussion point for the current session. 📝`;
            } else {
                return "All pathway steps have been reviewed. Consider discussing implementation timeline and support resources with the student.";
            }
        } else if (msg.includes('next') || msg.includes('what\'s next')) {
            const nextStep = AppState.coursePath.find(s => s.status === 'pending');
            if (nextStep) {
                return `The next step is Step ${nextStep.stepNumber}: "${nextStep.title}". This can be covered in a follow-up session or assigned as student homework.`;
            } else {
                return "This completes the pathway plan. Consider scheduling a follow-up session to review progress and adjust as needed.";
            }
        } else if (msg.includes('diploma') || msg.includes('course')) {
            return "The recommended pathway is tailored to the student's indicated diploma interest. Use this as a starting point for deeper exploration of specific programmes.";
        } else if (msg.includes('help') || msg.includes('what can')) {
            return "I can help with: pathway explanation, step-by-step guidance, session planning tips, and answering student questions. What would you like to know? 🎓";
        } else if (msg.includes('pdf') || msg.includes('download') || msg.includes('export')) {
            return "Export the pathway plan using the 'Export Pathway Plan' button. This provides a professional PDF that students can take home and share with parents/guardians. 📄";
        } else if (msg.includes('print')) {
            return "After exporting, the PDF can be printed for the student's portfolio or saved digitally for reference. Great for documentation purposes!";
        } else if (msg.includes('change') || msg.includes('different') || msg.includes('redo')) {
            return "To generate a different pathway, click 'Start Over' and enter updated student information. Useful when exploring alternative diploma options during the session.";
        } else if (msg.includes('parent') || msg.includes('guardian')) {
            return "The exported pathway plan is parent-friendly and can be shared during parent-teacher conferences or sent home for family discussion.";
        } else if (msg.includes('thank')) {
            return "You're welcome! I'm here to support effective career guidance sessions. Feel free to use this system with all your students! 💪";
        } else if (msg.includes('go back') || msg.includes('previous') || msg.includes('undo')) {
            return "Click any completed step to revisit it during the session. This is helpful for reviewing or clarifying specific recommendations with the student.";
        } else if (msg.includes('time') || msg.includes('how long')) {
            return "The pathway typically covers 3-6 months of preparation. Adjust the timeline based on the student's current academic stage and available time before polytechnic application.";
        } else {
            return `Great question! ${activeStep ? `The current focus is on Step ${activeStepNum}. This step is important for building foundation toward the student's diploma goal.` : 'Consider discussing the overall pathway structure and identifying priority actions.'} Feel free to explore specific steps in detail! 🎓`;
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
            Chatbot.addMessage('bot', `Please complete steps in sequential order. This ensures comprehensive preparation. Currently working on an earlier step. 📝`);
            return;
        } else if (step.status === 'active') {
            step.status = 'completed';
            
            // Play milestone video for completed step
            AvatarVideoPlayer.playMilestoneVideo(step.stepNumber);
            
            // Move avatar to next step
            if (index + 1 < AppState.coursePath.length) {
                AppState.coursePath[index + 1].status = 'active';
                const nextStep = AppState.coursePath[index + 1];
                Chatbot.addMessage('bot', `✅ Step ${step.stepNumber} completed: "${step.title}". Moving to Step ${nextStep.stepNumber}: "${nextStep.title}". ${index < 2 ? 'Good progress in this session!' : 'Excellent systematic approach!'} 🎓`);
            } else {
                // All steps completed - play completion video
                AvatarVideoPlayer.playCompletionVideo();
                Chatbot.addMessage('bot', `🎉 Pathway Complete! All ${AppState.coursePath.length} steps reviewed. The student now has a comprehensive preparation roadmap. Recommend exporting for future reference and scheduling follow-up check-ins. 🎓✨`);
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
            Chatbot.addMessage('bot', `Returning to Step ${step.stepNumber}: "${step.title}" for review. This is useful for clarifying details or adjusting the plan during the session. 🔄`);
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
        
        // Update avatar position to match the progress line
        // Avatar should be at the end of completed steps (start of active step)
        let avatarPosition;
        if (activeStepIndex >= 0) {
            // Avatar is at the position of the active step
            avatarPosition = (activeStepIndex / (total - 1)) * 100;
        } else if (completed === total) {
            // All completed - avatar at end
            avatarPosition = 100;
        } else {
            // No active step, position at last completed
            avatarPosition = completed > 0 ? ((completed - 1) / (total - 1)) * 100 : 0;
        }
        
        if (this.avatar) {
            this.avatar.style.left = `${Math.min(100, Math.max(0, avatarPosition))}%`;
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
        
        // Clear previous path if it exists
        if (AppState.coursePath.length > 0) {
            this.clearPreviousPath();
        }
        
        AppState.userPlan = userPlan;
        AppState.isGenerating = true;
        
        // Show loading state
        if (this.generateBtn) {
            this.generateBtn.textContent = 'Generating...';
            this.generateBtn.disabled = true;
        }
        
        // Generate AI visual representation first
        // TEMPORARILY DISABLED FOR VIDEO TESTING
        await ImageGenerator.generateVisualPath(userPlan);
        
        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Generate course path using AI
        AppState.coursePath = await CoursePathGenerator.generatePath(userPlan);
        
        // Display results
        PathDisplay.show();
        PathDisplay.renderPath(AppState.coursePath);
        
        // Show chatbot
        Chatbot.show();
        Chatbot.addMessage('bot', `Pathway analysis complete! I've generated a ${AppState.coursePath.length}-step personalized plan based on your profile. Follow along step-by-step and click Step 1 to begin! 🎓✨`);
        
        // Play welcome video from AI Avatar
        setTimeout(() => {
            AvatarVideoPlayer.playWelcomeVideo();
        }, 1000);
        
        // Scroll to results
        document.getElementById('path-display')?.scrollIntoView({ behavior: 'smooth' });
        
        // Reset button
        if (this.generateBtn) {
            this.generateBtn.textContent = 'Generate My Path';
        }
        
        AppState.isGenerating = false;
    },
    
    clearPreviousPath() {
        // Clear the course path array
        AppState.coursePath = [];
        AppState.currentStep = 0;
        
        // Clear the visual display
        const pathContainer = document.getElementById('course-path');
        if (pathContainer) {
            pathContainer.innerHTML = '';
        }
        
        // Reset progress indicators
        PathDisplay.updateProgress();
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
// Scroll Animations Module
// ===================================
const ScrollAnimations = {
    init() {
        this.observeElements();
    },
    
    observeElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe elements that should animate on scroll
        document.querySelectorAll('.step-card, .info-card, .resource-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    }
};

// ===================================
// Accessibility Module
// ===================================
const Accessibility = {
    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupAriaLiveRegions();
    },
    
    setupKeyboardNavigation() {
        // Allow Escape key to close chatbot
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const chatbot = document.getElementById('chatbot');
                if (chatbot && !chatbot.classList.contains('minimized')) {
                    Chatbot.toggleChat();
                }
            }
        });
    },
    
    setupFocusManagement() {
        // Trap focus within modal dialogs if needed
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        document.querySelectorAll('.chatbot-container').forEach(container => {
            const firstFocusable = container.querySelectorAll(focusableElements)[0];
            const focusableContent = container.querySelectorAll(focusableElements);
            const lastFocusable = focusableContent[focusableContent.length - 1];
            
            container.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === firstFocusable) {
                        lastFocusable?.focus();
                        e.preventDefault();
                    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                        firstFocusable?.focus();
                        e.preventDefault();
                    }
                }
            });
        });
    },
    
    setupAriaLiveRegions() {
        // Create live region for dynamic updates
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'aria-live-region';
        document.body.appendChild(liveRegion);
    },
    
    announceToScreenReader(message) {
        const liveRegion = document.getElementById('aria-live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
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
    AvatarVideoPlayer.init();
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
