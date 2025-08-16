// Content Loader for Mecra Website
class ContentLoader {
    constructor() {
        this.sections = [
            { id: 'home', active: true },
            { id: 'about', active: false },
            { id: 'news', active: false },
            { id: 'music', active: false }
        ];
        
        this.loadedSections = new Set();
        this.sectionCache = {};
        
        // Wait for text manager to be ready before initializing
        this.waitForTextManager();
    }

    async waitForTextManager() {
        console.log('Waiting for TextManager and ContentManager...');
        // Wait for textManager and contentManager to be available and loaded
        let attempts = 0;
        const maxAttempts = 100; // Increased timeout
        
        while ((!window.textManager || !window.textManager.isLoaded || !window.contentManager) && attempts < maxAttempts) {
            if (attempts % 10 === 0) { // Log every 10th attempt
                console.log(`ContentLoader attempt ${attempts + 1}/${maxAttempts}:`);
                console.log('- TextManager available:', !!window.textManager);
                console.log('- TextManager loaded:', !!window.textManager?.isLoaded);
                console.log('- ContentManager available:', !!window.contentManager);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        // Additional wait for ContentManager to be fully initialized
        if (window.contentManager && !window.contentManager.isInitialized) {
            console.log('Waiting for ContentManager to be initialized...');
            let cmAttempts = 0;
            while (!window.contentManager.isInitialized && cmAttempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                cmAttempts++;
            }
        }
        
        if (!window.textManager || !window.textManager.isLoaded) {
            console.error('❌ ContentLoader: TextManager not ready after maximum attempts');
            return;
        }
        
        if (!window.contentManager || !window.contentManager.isInitialized) {
            console.error('❌ ContentLoader: ContentManager not ready after maximum attempts');
            return;
        }
        
        console.log('✅ ContentLoader: All dependencies ready!');
        
        // Additional safety delay before initialization
        await new Promise(resolve => setTimeout(resolve, 200));
        
        this.init();
    }

    async init() {
        console.log('🚀 ContentLoader init() called');
        
        // Load all sections at once for single-page layout
        await this.loadAllSections();
        
        // Set up smooth scroll navigation
        this.setupSmoothScrollNavigation();
        
        // Set up scroll-based active section highlighting
        this.setupScrollHighlighting();
        
        // Set up hash change listener
        this.setupHashNavigation();
        
        console.log('🎉 ContentLoader init() completed');
    }

    // Reload all content for language switching
    async reloadAllContent() {
        console.log('Reloading all content for language change...');
        
        // Clear loaded sections cache
        this.loadedSections.clear();
        this.sectionCache = {};
        
        // Clear main content
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            const loadingIndicator = document.getElementById('loading-indicator');
            mainContent.innerHTML = '';
            if (loadingIndicator) {
                mainContent.appendChild(loadingIndicator);
            }
        }
        
        // Reload all sections
        await this.loadAllSections();
        
        // Reinitialize interactive elements
        this.initializeInteractiveElements();
        
        console.log('Content reloaded successfully');
    }

    async loadAllSections() {
        console.log('Loading all sections for single-page layout...');
        
        // Show loading indicator
        this.showLoading();
        
        const mainContent = document.getElementById('main-content');
        if (!mainContent) {
            console.error('Main content element not found!');
            return;
        }
        
        console.log('Main content found:', mainContent);
        
        // Store loading indicator separately and clear main content
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove(); // Remove from DOM, we'll add it back later
        }
        
        // Clear main content completely
        mainContent.innerHTML = '';
        
        // Add loading indicator back at the top
        if (loadingIndicator) {
            mainContent.appendChild(loadingIndicator);
        }
        
        // Create sections directly in JavaScript
        for (const sectionConfig of this.sections) {
            try {
                console.log(`Creating section: ${sectionConfig.id}`);
                
                // Create section container
                const sectionDiv = document.createElement('div');
                sectionDiv.id = sectionConfig.id;
                sectionDiv.className = 'content-section';
                
                // Create section HTML based on section type
                const sectionHTML = this.createSectionHTML(sectionConfig.id);
                sectionDiv.innerHTML = sectionHTML;
                
                // Hide sections initially for animations (except home)
                if (sectionConfig.id !== 'home') {
                    const sectionElement = sectionDiv.querySelector('.section');
                    if (sectionElement) {
                        sectionElement.style.opacity = '0';
                        sectionElement.style.transform = 'translateY(50px)';
                        sectionElement.style.transition = 'none';
                    }
                }
                
                console.log(`Created section div for ${sectionConfig.id}:`, sectionDiv);
                
                // Add to main content
                mainContent.appendChild(sectionDiv);
                console.log(`Appended section ${sectionConfig.id} to main content`);
                
                // Mark as loaded
                this.loadedSections.add(sectionConfig.id);
                
                console.log(`✓ Successfully created section: ${sectionConfig.id}`);
                
            } catch (error) {
                console.error(`❌ Error creating section ${sectionConfig.id}:`, error);
            }
        }
        
        console.log('All sections loaded, main content children:', mainContent.children);
        console.log('Main content children count:', mainContent.children.length);
        console.log('Main content children details:');
        for (let i = 0; i < mainContent.children.length; i++) {
            console.log(`  ${i}: ${mainContent.children[i].tagName} id="${mainContent.children[i].id}" class="${mainContent.children[i].className}"`);
        }
        
        // Wait for DOM to be fully updated
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Now load dynamic content for all sections
        for (const sectionConfig of this.sections) {
            if (this.loadedSections.has(sectionConfig.id)) {
                console.log(`Loading dynamic content for: ${sectionConfig.id}`);
                try {
                    await this.loadDynamicContent(sectionConfig.id);
                } catch (error) {
                    console.error(`❌ Error loading dynamic content for ${sectionConfig.id}:`, error);
                }
            }
        }
        
        // Hide loading indicator
        this.hideLoading();
        
        // Initialize AOS animations
        if (window.AOS) {
            window.AOS.refresh();
        }
        
        // Initialize scroll animations
        if (window.scrollAnimationManager) {
            setTimeout(() => {
                window.scrollAnimationManager.refresh();
            }, 1000);
        }
        
        // Dispatch content loaded event
        document.dispatchEvent(new CustomEvent('contentLoaded'));
        
        console.log('All sections loaded successfully');
        
        // DEBUG: Check if content is actually loaded
        setTimeout(() => {
            console.log('=== DEBUG: Checking loaded content ===');
            console.log('Main content HTML:', mainContent.innerHTML.substring(0, 500) + '...');
            console.log('Services content:', document.getElementById('services-content')?.innerHTML?.length || 0, 'characters');
            console.log('Projects content:', document.getElementById('projects-content')?.innerHTML?.length || 0, 'characters');
            console.log('Team content:', document.getElementById('team-content')?.innerHTML?.length || 0, 'characters');
            console.log('Patents content:', document.getElementById('patents-content')?.innerHTML?.length || 0, 'characters');
            console.log('Why Mecra content:', document.getElementById('why-mecra-content')?.innerHTML?.length || 0, 'characters');
            
            // DEBUG: Check visibility styles
            console.log('=== DEBUG: Checking visibility styles ===');
            const sections = ['services', 'projects', 'team', 'patents', 'why-mecra'];
            sections.forEach(sectionId => {
                const section = document.getElementById(sectionId);
                const content = document.getElementById(sectionId + '-content');
                console.log(`Section ${sectionId}:`, {
                    sectionExists: !!section,
                    contentExists: !!content,
                    sectionDisplay: section ? getComputedStyle(section).display : 'N/A',
                    sectionVisibility: section ? getComputedStyle(section).visibility : 'N/A',
                    sectionOpacity: section ? getComputedStyle(section).opacity : 'N/A',
                    sectionHeight: section ? getComputedStyle(section).height : 'N/A',
                    contentDisplay: content ? getComputedStyle(content).display : 'N/A',
                    contentVisibility: content ? getComputedStyle(content).visibility : 'N/A',
                    contentOpacity: content ? getComputedStyle(content).opacity : 'N/A',
                    contentHeight: content ? getComputedStyle(content).height : 'N/A'
                });
            });
        }, 1000);
    }
    
    createSectionHTML(sectionId) {
        console.log(`Creating HTML for section: ${sectionId}`);
        
        switch (sectionId) {
            case 'home':
                // Return empty container for hero - the complete hero HTML will be generated in loadDynamicContent
                return `<div id="hero-placeholder"></div>`;
            
            case 'services':
                return `
                    <section class="section">
                        <div class="container">
                            <div class="row">
                                <div class="col-12" id="services-content">
                                    <!-- Content will be loaded dynamically via JavaScript -->
                                </div>
                            </div>
                        </div>
                    </section>
                `;
            
            case 'projects':
                return `
                    <section class="section">
                        <div class="container">
                            <div class="row">
                                <div class="col-12" id="projects-content">
                                    <!-- Content will be loaded dynamically via JavaScript -->
                                </div>
                            </div>
                        </div>
                    </section>
                `;
            
            case 'about':
                return `
                    <section class="section py-5">
                        <div class="container">
                            <div class="row">
                                <div class="col-12" id="about-content">
                                    <!-- Content will be loaded dynamically via JavaScript -->
                                </div>
                            </div>
                        </div>
                    </section>
                `;
            
            case 'news':
                return `
                    <section class="section py-5">
                        <div class="container">
                            <div class="row">
                                <div class="col-12" id="news-content">
                                    <!-- Content will be loaded dynamically via JavaScript -->
                                </div>
                            </div>
                        </div>
                    </section>
                `;
            
            case 'music':
                return `
                    <section class="section py-5">
                        <div class="container">
                            <div class="row">
                                <div class="col-12" id="music-content">
                                    <!-- Content will be loaded dynamically via JavaScript -->
                                </div>
                            </div>
                        </div>
                    </section>
                `;
            
            default:
                return `
                    <section class="section">
                        <div class="container">
                            <div class="row">
                                <div class="col-12">
                                    <h2>Section: ${sectionId}</h2>
                                    <p>Content not found for this section.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                `;
        }
    }

    showLoading() {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.classList.remove('d-none');
        }
    }

    hideLoading() {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.classList.add('d-none');
        }
    }

    async loadDynamicContent(sectionId) {
        console.log(`Loading dynamic content for section: ${sectionId}`);
        
        // Load content using ContentManager's generate functions
        if (!window.contentManager) {
            console.warn('ContentManager not available');
            return;
        }

        switch (sectionId) {
            case 'home':
                await this.loadHeroContent();
                break;
            case 'about':
                await this.loadAboutContent();
                break;
            case 'news':
                await this.loadNewsContent();
                break;
            case 'music':
                await this.loadMusicContent();
                break;
        }
        
        console.log(`Dynamic content loaded for section: ${sectionId}`);
    }

    async loadHeroContent() {
        console.log('Loading hero content...');
        const heroPlaceholder = document.getElementById('hero-placeholder');
        console.log('Hero placeholder element:', heroPlaceholder);
        if (heroPlaceholder && window.contentManager) {
            const heroHTML = window.contentManager.generateHeroHTML();
            heroPlaceholder.outerHTML = heroHTML;
            console.log('Hero content loaded successfully');
            
            // Initialize countdown timer
            setTimeout(() => {
                console.log('🕐 Initializing countdown timer...');
                if (window.restartCountdown) {
                    console.log('✅ Using restart countdown function...');
                    window.restartCountdown();
                } else if (window.CountdownTimer) {
                    console.log('✅ CountdownTimer class found, creating new instance...');
                    new CountdownTimer();
                } else if (window.countdownTimer) {
                    console.log('✅ Using existing countdown instance...');
                    window.countdownTimer.startCountdowns();
                } else {
                    console.warn('❌ No countdown functionality found');
                }
            }, 200);
            
            // Initialize video background
            setTimeout(() => {
                console.log('🎬 Initializing video background...');
                const video = document.querySelector('.hero-video-background');
                console.log('🎬 Video element found:', video);
                if (video) {
                    console.log('🎬 Video source:', video.querySelector('source')?.src);
                    console.log('🎬 Video readyState:', video.readyState);
                    console.log('🎬 Video paused:', video.paused);
                    
                    // Check if video can be played
                    video.addEventListener('loadeddata', () => {
                        console.log('🎬 Video loaded successfully');
                    });
                    
                    video.addEventListener('error', (e) => {
                        console.error('🎬 Video error:', e);
                    });
                    
                    video.play().catch(e => {
                        console.warn('Video autoplay failed:', e);
                        // Video might not autoplay, but that's okay
                    });
                } else {
                    console.error('🎬 Video element not found!');
                }
            }, 300);
            
            // Trigger hero animations after content is loaded
            setTimeout(() => {
                // Refresh AOS for newly added elements
                if (window.AOS) {
                    console.log('🎬 Refreshing AOS for hero section...');
                    window.AOS.refresh();
                }
                
                if (window.initializeHeroAnimations) {
                    window.initializeHeroAnimations();
                }
            }, 400);
        } else {
            console.warn('Hero placeholder element not found or ContentManager not available');
        }
    }

    async loadServicesContent() {
        console.log('Loading services content...');
        const servicesContent = document.getElementById('services-content');
        if (servicesContent && window.contentManager) {
            const servicesHTML = window.contentManager.generateServicesHTML();
            servicesContent.innerHTML = servicesHTML;
            console.log('Services content loaded successfully');
            
            // Initialize background images for services (hover-based)
            setTimeout(() => {
                console.log('🖼️ Triggering background images for services...');
                
                // Check if we're on mobile and apply background images immediately
                const isMobile = window.innerWidth <= 768;
                if (isMobile) {
                    console.log('📱 Mobile detected - applying service backgrounds immediately');
                    
                    // Function to apply mobile backgrounds
                    const applyMobileBackgrounds = () => {
                        console.log('🔍 Checking text data availability...');
                        console.log('- textManager exists:', !!window.textManager);
                        console.log('- textManager.isLoaded:', window.textManager?.isLoaded);
                        console.log('- textManager.currentLanguage:', window.textManager?.currentLanguage);
                        console.log('- textManager.texts exists:', !!window.textManager?.texts);
                        
                        if (window.textManager?.texts) {
                            console.log('- Available text keys:', Object.keys(window.textManager.texts));
                            console.log('- services exists:', !!window.textManager.texts.services);
                            if (window.textManager.texts.services) {
                                console.log('- services.items exists:', !!window.textManager.texts.services.items);
                                console.log('- services.items length:', window.textManager.texts.services.items?.length);
                                if (window.textManager.texts.services.items?.length > 0) {
                                    console.log('- First service item keys:', Object.keys(window.textManager.texts.services.items[0]));
                                    console.log('- First service item:', window.textManager.texts.services.items[0]);
                                }
                            }
                        }
                        
                        const serviceCards = servicesContent.querySelectorAll('.service-card[data-service-index]');
                        console.log('- Found service cards:', serviceCards.length);
                        
                        if (window.textManager && 
                            window.textManager.texts && 
                            window.textManager.texts.services && 
                            window.textManager.texts.services.items &&
                            serviceCards.length > 0) {
                            
                            console.log('✅ All conditions met, applying mobile backgrounds');
                            const servicesData = window.textManager.texts.services.items;
                            
                            serviceCards.forEach((card, index) => {
                                const serviceData = servicesData[index];
                                console.log(`Card ${index}:`, {
                                    hasServiceData: !!serviceData,
                                    serviceDataKeys: serviceData ? Object.keys(serviceData) : [],
                                    fullServiceData: serviceData,
                                    backgroundImage: serviceData?.backgroundImage,
                                    cardElement: card
                                });
                                
                                if (serviceData && serviceData.backgroundImage) {
                                    console.log(`🎨 Setting service background for mobile card ${index}: ${serviceData.backgroundImage}`);
                                    
                                    // Apply the same background styling as the hover state
                                    card.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4)), url('${serviceData.backgroundImage}')`;
                                    card.style.backgroundSize = 'cover';
                                    card.style.backgroundPosition = 'center';
                                    card.style.backgroundRepeat = 'no-repeat';
                                    card.style.transition = 'all 0.3s ease';
                                    card.style.color = 'white';
                                    
                                    // Add mobile hover class for additional styling
                                    card.classList.add('mobile-hover');
                                    
                                    console.log(`✅ Applied background to card ${index}`);
                                } else {
                                    console.warn(`⚠️ No background image for card ${index}`);
                                }
                            });
                        } else {
                            console.warn('⚠️ Conditions not met for mobile backgrounds');
                        }
                    };
                    
                    // Try immediately
                    applyMobileBackgrounds();
                    
                    // Also set up an event listener for when content is fully loaded
                    document.addEventListener('contentLoaded', (event) => {
                        if (event.detail.section === 'services') {
                            console.log('🔄 Services content loaded event received, retrying mobile backgrounds');
                            setTimeout(applyMobileBackgrounds, 100);
                        }
                    });
                }
                
                document.dispatchEvent(new CustomEvent('contentLoaded', { detail: { section: 'services' } }));
            }, 200);
        } else {
            console.warn('Services content element not found or ContentManager not available');
        }
    }

    async loadProjectsContent() {
        console.log('Loading projects content...');
        const projectsContent = document.getElementById('projects-content');
        console.log('Projects content element:', projectsContent);
        if (projectsContent && window.contentManager) {
            const projectsHTML = window.contentManager.generateProjectsHTML();
            console.log('Projects HTML generated:', projectsHTML.length, 'characters');
            projectsContent.innerHTML = projectsHTML;
            console.log('Projects content loaded successfully');
            console.log('Projects content element after loading:', projectsContent);
            
            // Trigger background image initialization for projects
            setTimeout(() => {
                console.log('🖼️ Setting background images for projects...');
                
                // Set background images for project cards
                const projectCards = projectsContent.querySelectorAll('.service-card[data-bg-image]');
                console.log(`🎯 Found ${projectCards.length} project cards`);
                
                projectCards.forEach((card, index) => {
                    const bgImage = card.getAttribute('data-bg-image');
                    if (bgImage && bgImage.trim() !== '') {
                        console.log(`🎨 Setting background for card ${index}: ${bgImage}`);
                        card.style.backgroundImage = `url('${bgImage}')`;
                        card.style.backgroundSize = 'cover';
                        card.style.backgroundPosition = 'center';
                        card.style.backgroundRepeat = 'no-repeat';
                    }
                });
                
                document.dispatchEvent(new CustomEvent('contentLoaded', { detail: { section: 'projects' } }));
            }, 200);
        } else {
            console.warn('Projects content element not found or ContentManager not available');
        }
    }

    async loadTeamContent() {
        console.log('Loading combined team content (about + team)...');
        const teamContent = document.getElementById('team-content');
        console.log('Team content element:', teamContent);
        if (teamContent && window.contentManager) {
            // Generate both about and team HTML and combine them
            const aboutHTML = window.contentManager.generateAboutHTML();
            const teamHTML = window.contentManager.generateTeamHTML();
            
            // Combine the content - about first, then team
            const combinedHTML = aboutHTML + teamHTML;
            
            console.log('About HTML generated:', aboutHTML.length, 'characters');
            console.log('Team HTML generated:', teamHTML.length, 'characters');
            console.log('Combined HTML total:', combinedHTML.length, 'characters');
            
            teamContent.innerHTML = combinedHTML;
            console.log('Combined team content loaded successfully');
            console.log('Team content element after loading:', teamContent);
        } else {
            console.warn('Team content element not found or ContentManager not available');
        }
    }

    async loadWhyMecraContent() {
        console.log('Loading why-mecra content...');
        const whyMecraContent = document.getElementById('why-mecra-content');
        console.log('Why Mecra content element:', whyMecraContent);
        if (whyMecraContent && window.contentManager) {
            const whyMecraHTML = window.contentManager.generateWhyMecraHTML();
            console.log('Why Mecra HTML generated:', whyMecraHTML.length, 'characters');
            whyMecraContent.innerHTML = whyMecraHTML;
            console.log('Why Mecra content loaded successfully');
            console.log('Why Mecra content element after loading:', whyMecraContent);
        } else {
            console.warn('Why Mecra content element not found or ContentManager not available');
        }
    }

    async loadPatentsContent() {
        console.log('Loading patents content...');
        const patentsContent = document.getElementById('patents-content');
        console.log('Patents content element:', patentsContent);
        if (patentsContent && window.contentManager) {
            const patentsHTML = window.contentManager.generatePatentsHTML();
            console.log('Patents HTML generated:', patentsHTML.length, 'characters');
            patentsContent.innerHTML = patentsHTML;
            console.log('Patents content loaded successfully');
            console.log('Patents content element after loading:', patentsContent);
        } else {
            console.warn('Patents content element not found or ContentManager not available');
        }
    }

    setupSmoothScrollNavigation() {
        // Set up smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update hash without triggering hashchange
                    history.pushState(null, null, `#${targetId}`);
                }
            });
        });
    }

    setupScrollHighlighting() {
        // Wait a bit for all sections to be loaded
        setTimeout(() => {
            // Create intersection observer for section highlighting
            const observerOptions = {
                root: null,
                rootMargin: '-50% 0px -50% 0px',
                threshold: 0
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.id;
                        this.updateActiveNavLink(sectionId);
                    }
                });
            }, observerOptions);

            // Observe all sections
            this.sections.forEach(section => {
                const element = document.getElementById(section.id);
                if (element) {
                    observer.observe(element);
                    console.log(`Observing section: ${section.id}`);
                } else {
                    console.warn(`Section element not found: ${section.id}`);
                }
            });
        }, 500);
    }

    updateActiveNavLink(activeSection) {
        // Update active navigation state
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeSection}`) {
                link.classList.add('active');
            }
        });
    }

    setupHashNavigation() {
        // Handle hash changes (back/forward navigation)
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            if (hash) {
                const targetElement = document.getElementById(hash);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
        
        // Handle initial hash on page load
        if (window.location.hash) {
            setTimeout(() => {
                const hash = window.location.hash.substring(1);
                const targetElement = document.getElementById(hash);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 1000); // Wait for all content to load
        }
    }
    
    addDebugInfo(mainContent) {
        // Create debug panel
        const debugPanel = document.createElement('div');
        debugPanel.id = 'debug-panel';
        debugPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: var(--color-primary);
            color: var(--color-white);
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            max-width: 300px;
            max-height: 400px;
            overflow-y: auto;
        `;
        
        let debugHTML = `<h5>Debug Info</h5>`;
        debugHTML += `<p><strong>Main Content Children:</strong> ${mainContent.children.length}</p>`;
        debugHTML += `<ul>`;
        
        for (let i = 0; i < mainContent.children.length; i++) {
            const child = mainContent.children[i];
            debugHTML += `<li>${i}: ${child.tagName} id="${child.id}" class="${child.className}"</li>`;
        }
        
        debugHTML += `</ul>`;
        debugHTML += `<p><strong>Loaded Sections:</strong> ${Array.from(this.loadedSections).join(', ')}</p>`;
        
        debugPanel.innerHTML = debugHTML;
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: none;
            border: none;
            color: var(--color-white);
            font-size: 16px;
            cursor: pointer;
        `;
        closeBtn.onclick = () => debugPanel.remove();
        debugPanel.appendChild(closeBtn);
        
        document.body.appendChild(debugPanel);
    }

    async loadAboutContent() {
        console.log('Loading about content...');
        const aboutContent = document.getElementById('about-content');
        if (aboutContent && window.contentManager) {
            const aboutHTML = window.contentManager.generateAboutHTML();
            aboutContent.innerHTML = aboutHTML;
            console.log('About content loaded successfully');
        } else {
            console.warn('About content element not found or ContentManager not available');
        }
    }

    async loadNewsContent() {
        console.log('Loading news content...');
        const newsContent = document.getElementById('news-content');
        if (newsContent && window.contentManager) {
            const newsHTML = window.contentManager.generateNewsHTML();
            newsContent.innerHTML = newsHTML;
            console.log('News content loaded successfully');
        } else {
            console.warn('News content element not found or ContentManager not available');
        }
    }

    async loadMusicContent() {
        console.log('Loading music content...');
        const musicContent = document.getElementById('music-content');
        if (musicContent && window.contentManager) {
            const musicHTML = window.contentManager.generateMusicHTML();
            musicContent.innerHTML = musicHTML;
            console.log('Music content loaded successfully');
        } else {
            console.warn('Music content element not found or ContentManager not available');
        }
    }
}

// Initialize content loader when DOM is ready
// Note: This will be called from index.html after TextManager is ready
// document.addEventListener('DOMContentLoaded', () => {
//     window.contentLoader = new ContentLoader();
// });