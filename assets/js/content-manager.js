// Content Management System for Mecra Website
class ContentManager {
    constructor() {
        // Constructor is now clean - all content comes from texts.json
        this.isInitialized = false;
        this.init();
    }

    async init() {
        console.log('ContentManager: Starting initialization...');
        
        // Wait for textManager to be ready with timeout
        let attempts = 0;
        const maxAttempts = 100;
        
        while ((!window.textManager || !window.textManager.isLoaded) && attempts < maxAttempts) {
            if (attempts % 10 === 0) {
                console.log(`ContentManager: Waiting for TextManager... Attempt ${attempts + 1}/${maxAttempts}`);
                console.log('- TextManager available:', !!window.textManager);
                console.log('- TextManager loaded:', !!window.textManager?.isLoaded);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!window.textManager || !window.textManager.isLoaded) {
            console.error('❌ ContentManager: TextManager not ready after maximum attempts');
            return;
        }
        
        // Additional safety delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        this.isInitialized = true;
        console.log('✅ ContentManager: Initialized and ready');
    }

    // Get content for a specific section from texts.json
    getContent(section) {
        if (!window.textManager) return null;
        return window.textManager.getText(section);
    }

    // Get current texts (alias for compatibility)
    get currentTexts() {
        if (!window.textManager) return {};
        return window.textManager.texts;
    }

    // Generate HTML for hero section
    generateHeroHTML() {
        const heroData = window.textManager.getText('hero');
        if (!heroData) return '';
        
        return `
            <section class="hero-section">
                <video class="hero-video-background" autoplay muted loop playsinline preload="auto">
                    <source src="${heroData.videoSource || 'assets/img/renk.mp4'}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <div class="hero-video-overlay"></div>
                <div class="container-fluid">
                    <div class="row justify-content-center">
                        <div class="col-12 col-sm-11 col-md-10 col-lg-8 col-xl-7">
                            <div class="hero-content">
                                <h1 class="hero-title" data-aos="fade-up" data-aos-delay="300">${heroData.title} <span class="hero-title-highlight" data-aos="fade-up" data-aos-delay="600">${heroData.titleHighlight}</span></h1>
                                <p class="hero-subtitle" data-aos="fade-up" data-aos-delay="900">${heroData.subtitle}</p>
                                <div class="hero-accent-image" data-aos="zoom-in" data-aos-delay="300">
                                    <img src="assets/img/muko-teko.jpeg" alt="RENK" class="muko-teko-image">
                                </div>
                                ${heroData.countdown && heroData.countdown.enabled ? `
                                <div class="countdown-section" data-aos="fade-up" data-aos-delay="600">
                                    <h3 class="countdown-title" data-aos="fade-up" data-aos-delay="900">${heroData.countdown.title}</h3>
                                    <p class="countdown-description" data-aos="fade-up" data-aos-delay="1100">${heroData.countdown.description}</p>
                                    <div class="countdown-timer" data-target="${heroData.countdown.targetDate}" data-aos="fade-up" data-aos-delay="1800">
                                        <div class="countdown-item">
                                            <span class="countdown-number" id="days">00</span>
                                            <span class="countdown-label" id="days-label">${heroData.countdown.labels ? heroData.countdown.labels.days : 'Gün'}</span>
                                        </div>
                                        <div class="countdown-item">
                                            <span class="countdown-number" id="hours">00</span>
                                            <span class="countdown-label" id="hours-label">${heroData.countdown.labels ? heroData.countdown.labels.hours : 'Saat'}</span>
                                        </div>
                                        <div class="countdown-item">
                                            <span class="countdown-number" id="minutes">00</span>
                                            <span class="countdown-label" id="minutes-label">${heroData.countdown.labels ? heroData.countdown.labels.minutes : 'Dakika'}</span>
                                        </div>
                                        <div class="countdown-item">
                                            <span class="countdown-number" id="seconds">00</span>
                                            <span class="countdown-label" id="seconds-label">${heroData.countdown.labels ? heroData.countdown.labels.seconds : 'Saniye'}</span>
                                        </div>
                                    </div>
                                </div>
                                ` : ''}
                                ${heroData.socialMedia ? `
                                <div class="social-media-links" data-aos="fade-up" data-aos-delay="2000">
                                    <a href="${heroData.socialMedia.instagram.url}" target="_blank" class="social-link instagram" aria-label="${heroData.socialMedia.instagram.label}" data-aos="zoom-in" data-aos-delay="2100">
                                        <i class="fab fa-instagram"></i>
                                    </a>
                                    <a href="${heroData.socialMedia.facebook.url}" target="_blank" class="social-link facebook" aria-label="${heroData.socialMedia.facebook.label}" data-aos="zoom-in" data-aos-delay="2200">
                                        <i class="fab fa-facebook"></i>
                                    </a>
                                    <a href="${heroData.socialMedia.spotify.url}" target="_blank" class="social-link spotify" aria-label="${heroData.socialMedia.spotify.label}" data-aos="zoom-in" data-aos-delay="2300">
                                        <i class="fab fa-spotify"></i>
                                    </a>
                                    <a href="${heroData.socialMedia.youtube.url}" target="_blank" class="social-link youtube" aria-label="${heroData.socialMedia.youtube.label}" data-aos="zoom-in" data-aos-delay="2400">
                                        <i class="fab fa-youtube"></i>
                                    </a>
                                </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Scroll Down Indicator -->
                <div class="scroll-indicator">
                    <a href="#about" class="scroll-down">
                        <i class="fas fa-chevron-down"></i>
                    </a>
                </div>
            </section>
        `;
        
        // Video yüklenme event listener ekle
        setTimeout(() => {
            const video = document.querySelector('.hero-video-background');
            const heroSection = document.querySelector('.hero-section');
            
            if (video && heroSection) {
                // Başlangıçta loading class ekle
                heroSection.classList.add('video-loading');
                
                video.addEventListener('loadeddata', () => {
                    console.log('Video yüklendi, background kaldırılıyor');
                    heroSection.classList.remove('video-loading');
                    heroSection.classList.add('video-loaded');
                });
                
                video.addEventListener('error', () => {
                    console.log('Video yüklenemedi, fallback background aktif');
                    heroSection.classList.add('video-loading');
                });
            }
        }, 100);
    }

    // Generate HTML for services
    generateServicesHTML() {
        const servicesData = window.textManager.getText('services');
        if (!servicesData || !servicesData.items) {
            return '';
        }
        
        let html = `
            <h2 class="section-title">${servicesData.title}</h2>
            <p class="mb-5 scroll-animate-fade" style="text-align: justify;">${servicesData.subtitle}</p>
            <div class="row">
        `;
        
        servicesData.items.forEach((service, index) => {
            console.log(`🔧 Service ${index}:`, service.title, 'Background:', service.backgroundImage);
            html += `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card service-card service-card-clickable h-100" data-service-index="${index}" data-bg-image="${service.backgroundImage || ''}" onclick="openServiceModal(${index})">
                        <div class="card-body">
                            <div class="service-icon">
                                <i class="${service.icon}"></i>
                            </div>
                            <h4 class="service-title">${service.title}</h4>
                            <button class="service-details-btn" onclick="event.stopPropagation(); openServiceModal(${index})">
                                ${this.getDetailsButtonText()}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
        
        return html;
    }

    // Get details button text based on language
    getDetailsButtonText() {
        const commonData = window.textManager.getText('common');
        if (commonData && commonData.details) {
            return commonData.details;
        }
        // Fallback
        let currentLang = 'en'; // default
        if (window.textManager && window.textManager.getCurrentLanguage) {
            currentLang = window.textManager.getCurrentLanguage();
        }
        return currentLang === 'en' ? 'Details' : 'Detaylar';
    }

    // Generate Projects HTML
    generateProjectsHTML() {
        console.log('🔥 generateProjectsHTML called!');
        const projects = this.currentTexts.projects;
        console.log('🔥 Projects data:', projects);
        
        if (!projects) {
            console.error('❌ No projects data found!');
            return '<div class="container"><h2>Projects data not found</h2></div>';
        }
        
        // Generate flagship projects - use same structure as Services
        const flagshipHTML = projects.flagshipProjects.items.map((project, index) => {
            return `
                <div class="col-lg-6 mb-4">
                    <div class="card service-card service-card-clickable h-100" data-bg-image="${project.backgroundImage || ''}" data-project-type="flagship" data-project-index="${index}" onclick="openProjectModal('flagship', ${index})">
                        <div class="card-body">
                            <div class="service-icon">
                                <i class="${project.icon}"></i>
                            </div>
                            <h4 class="service-title">${project.title}</h4>
                            <button class="service-details-btn" onclick="event.stopPropagation(); openProjectModal('flagship', ${index})">
                                ${this.getDetailsButtonText()}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Generate key references (3 columns for 9 items) - use same structure as Services
        const referencesHTML = projects.keyReferences.items.map((project, index) => {
            return `
                <div class="col-lg-4 mb-4">
                    <div class="card service-card service-card-clickable h-100" data-bg-image="${project.backgroundImage || ''}" data-project-type="reference" data-project-index="${index}" onclick="openProjectModal('reference', ${index})">
                        <div class="card-body">
                            <div class="service-icon">
                                <i class="${project.icon}"></i>
                            </div>
                            <h4 class="service-title">${project.title}</h4>
                            <button class="service-details-btn" onclick="event.stopPropagation(); openProjectModal('reference', ${index})">
                                ${this.getDetailsButtonText()}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="container">
                <div class="text-center mb-5">
                    <h2 class="section-title">${projects.title}</h2>
                    <p class="section-subtitle">${projects.subtitle}</p>
                </div>
                
                <!-- Flagship Projects Section -->
                <div class="mb-5">
                    <div class="text-center mb-4">
                        <h3 class="subsection-title">${projects.flagshipProjects.title}</h3>
                        <p class="subsection-subtitle">${projects.flagshipProjects.subtitle}</p>
                    </div>
                    <div class="row">
                        ${flagshipHTML}
                    </div>
                </div>
                
                <!-- Key References Section -->
                <div class="mb-5">
                    <div class="text-center mb-4">
                        <h3 class="subsection-title">${projects.keyReferences.title}</h3>
                        <p class="subsection-subtitle" style="text-align: justify;">${projects.keyReferences.subtitle}</p>
                    </div>
                    <div class="row">
                        ${referencesHTML}
                    </div>
                </div>
            </div>
        `;
    }

    // Generate HTML for team members
    generateTeamHTML() {
        const teamData = window.textManager.getText('team');
        console.log('Team data:', teamData);
        if (!teamData || !teamData.members) {
            console.warn('No team data found');
            return '';
        }
        
        let html = `
            <h2 class="section-title">${teamData.title}</h2>
            <p class="mb-5 scroll-animate-fade" style="text-align: justify;">${teamData.subtitle}</p>
            <div class="row justify-content-center">
        `;
        
        teamData.members.forEach((member, index) => {
            console.log('Processing team member:', member.name, 'Icon:', member.icon);
            const hasImageExtension = member.icon && (member.icon.includes('.jpg') || member.icon.includes('.jpeg') || member.icon.includes('.png'));
            console.log('Has image extension:', hasImageExtension);
            
            html += `
                <div class="col-lg-5 col-md-6 col-sm-8 mb-4">
                    <div class="team-card" onclick="openTeamModal(${index})" data-member-index="${index}" style="cursor: pointer;">
                        <div class="team-image">
                            ${hasImageExtension ? 
                                `<img src="assets/img/${member.icon}" alt="${member.name}" class="img-fluid">` : 
                                `<div class="team-icon-placeholder">
                                    <i class="${member.icon || 'fas fa-user'} fa-4x"></i>
                                </div>`
                            }
                            <div class="team-overlay">
                                <div class="social-links">
                                    <a href="${member.linkedin || '#'}" class="social-link" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();"><i class="fab fa-linkedin"></i></a>
                                    ${member.github ? `<a href="${member.github}" class="social-link" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();"><i class="fab fa-github"></i></a>` : ''}
                                    <a href="${member.email ? 'mailto:' + member.email : '#'}" class="social-link" onclick="event.stopPropagation();"><i class="fas fa-envelope"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="team-info">
                            <h4>${member.name}</h4>
                            <p class="team-position">${member.position}</p>
                            <p class="team-description">${member.description}</p>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
        
        console.log('Generated team HTML:', html);
        return html;
    }

    // Generate HTML for about section
    generateAboutHTML() {
        const aboutData = window.textManager.getText('about');
        if (!aboutData) {
            return '';
        }
        
        let html = `
            <div class="about-content">
                <h2 class="section-title">${aboutData.title}</h2>
                <!--<div class="text-center">
                    <img src="assets/img/logo.png" alt="Logo" class="img-fluid mb-12" style="max-width: 100px; height: auto;">
                </div>
                <h3 class="about-subtitle scroll-animate-fade text-center" style="color: var(--color-primary);">${aboutData.subtitle}</h3>
                <p class="lead scroll-animate-fade text-center" style="color: var(--color-primary);">${aboutData.description}</p>-->
                <p class="scroll-animate-fade" style="text-align: justify;">${aboutData.extendedDescription}</p>

                <!--<div class="about-values">
                    <h4 class="section-title scroll-animate-fade text-center">${aboutData.visionTitle}</h4>
                    <p class="scroll-animate-fade" style="text-align: justify;">${aboutData.vision}</p>
                    <h4 class="section-title scroll-animate-fade text-center">${aboutData.missionTitle}</h4>
                    <p class="scroll-animate-fade" style="text-align: justify;">${aboutData.mission}</p>
                    <h4 class="about-subtitle scroll-animate-fade text-center">${aboutData.valuesTitle}</h4>
                    <div class="row">-->
        `;
        
        aboutData.values.forEach(value => {
            // Only render values that have icon and title (skip any navigation links)
            if (value.icon && value.title) {
                html += `
                    <div class="col-md-4 mb-3">
                        <div class="value-item text-center">
                            <i class="${value.icon} fa-2x mb-2" style="color: var(--primary-color);"></i>
                            <h5>${value.title}</h5>
                        </div>
                    </div>
                `;
            }
        });
        
        html += `
                    </div>
                </div>
            </div>
        `;
        
        return html;
    }

    // Generate HTML for Why Mecra section
    generateWhyMecraHTML() {
        const whyMecraData = window.textManager.getText('whyMecra');
        if (!whyMecraData) {
            return '';
        }
        
        let html = `
            <div class="why-mecra-content">
                <h2 class="section-title text-center">${whyMecraData.title}</h2>
                <p class="mb-5 scroll-animate-fade" style="text-align: justify;">${whyMecraData.subtitle}</p>
                <div class="row">
        `;
        
        whyMecraData.items.forEach((item, index) => {
            html += `
                <div class="col-lg-2 col-md-4 col-sm-6 mb-4">
                    <div class="why-mecra-item text-center h-100">
                        <div class="why-mecra-icon mb-3">
                            <i class="${item.icon} fa-3x" style="color: var(--primary-color);"></i>
                        </div>
                        <h5 class="why-mecra-title">${item.title}</h5>
                        <p class="why-mecra-description" style="text-align: justify;">${item.description}</p>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
        
        return html;
    }

    // Generate HTML for patents section
    generatePatentsHTML() {
        console.log('Generating patents HTML...');
        
        if (!window.textManager || !window.textManager.isLoaded) {
            console.warn('TextManager not ready in generatePatentsHTML');
            return '<div class="patents-placeholder"><p>Loading patents information...</p></div>';
        }
        
        const patentsData = window.textManager.getText('patents');
        console.log('Patents data:', patentsData);
        
        if (!patentsData) {
            console.warn('Patents data not found');
            return '<div class="patents-placeholder"><p>Patents information not available</p></div>';
        }
        
        let html = `
            <div class="text-center mb-5" data-aos="fade-up">
                <h2 class="section-title">${patentsData.title}</h2>
                <p class="section-subtitle" style="text-align: justify;">${patentsData.subtitle}</p>
            </div>
            <div class="row">
        `;
        
        // Generate patent items
        patentsData.items.forEach((item, index) => {
            html += `
                <div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="patent-item text-center h-100 p-4 border rounded">
                        <div class="patent-image mb-3">
                            <img src="${item.image}" alt="${item.title}" class="img-fluid rounded" style="max-height: 200px; object-fit: cover;">
                        </div>
                        <h5 class="patent-subtitle mb-3">${item.title}</h5>
                    </div>
                </div>
            `;
        });
        
        html += `
            </div>
        `;
        
        return html;
    }

    // Generate HTML for about section
    generateAboutHTML() {
        console.log('Generating about HTML...');
        
        if (!window.textManager || !window.textManager.isLoaded) {
            console.warn('TextManager not ready in generateAboutHTML');
            return '<div class="about-placeholder"><p>Loading about information...</p></div>';
        }
        
        const aboutData = window.textManager.getText('about');
        console.log('About data:', aboutData);
        
        if (!aboutData) {
            console.warn('About data not found');
            return '<div class="about-placeholder"><p>About information not available</p></div>';
        }
        
        return `
            <div class="text-center mb-5" data-aos="fade-up">
                <h2 class="section-title">${aboutData.title}</h2>
                <h3 class="section-subtitle mb-4">${aboutData.subtitle}</h3>
                <p class="lead" style="text-align: justify;">${aboutData.extendedDescription}</p>
            </div>
        `;
    }

    // Generate HTML for news section
    generateNewsHTML() {
        console.log('Generating news HTML...');
        
        // Instagram Feed instead of news
        return `
            <div class="text-center mb-5" data-aos="fade-up">
                <h2 class="section-title">Instagram</h2>
                <p class="section-subtitle">Bizi Instagram'da Takip Edin</p>
            </div>
            <div class="instagram-feed-container" data-aos="fade-up">
                <div class="ig-grid">
                    <div class="ig-card">
                        <blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/DNbJu46Ic7w/" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
                            <div style="padding:16px;">
                                <div style="display: flex; flex-direction: row; align-items: center;">
                                    <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div>
                                    <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;">
                                        <div style="background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div>
                                        <div style="background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div>
                                    </div>
                                </div>
                                <div style="padding: 19% 0;"></div>
                                <div style="display:block; height:50px; margin:0 auto 12px; width:50px;">
                                    <svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg">
                                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                            <g transform="translate(-511.000000, -20.000000)" fill="#000000">
                                                <g>
                                                    <path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path>
                                                </g>
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                                <div style="padding-top: 8px;">
                                    <div style="color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">Bu gönderiyi Instagram'da gör</div>
                                </div>
                                <div style="padding: 12.5% 0;"></div>
                            </div>
                        </blockquote>
                    </div>
                </div>
                <div class="instagram-follow-link">
                    <a href="https://www.instagram.com/renkofficial/" target="_blank" class="ig-follow-btn">
                        <i class="fab fa-instagram"></i> @renkofficial
                    </a>
                </div>
                <script async src="//www.instagram.com/embed.js"></script>
            </div>
        `;
    }

    // Generate HTML for music section
    generateMusicHTML() {
        console.log('Generating music HTML...');
        
        if (!window.textManager || !window.textManager.isLoaded) {
            console.warn('TextManager not ready in generateMusicHTML');
            return '<div class="music-placeholder"><p>Loading music information...</p></div>';
        }
        
        const musicData = window.textManager.getText('music');
        console.log('Music data:', musicData);
        
        if (!musicData) {
            console.warn('Music data not found');
            return '<div class="music-placeholder"><p>Music information not available</p></div>';
        }
        
        let html = `
            <div class="text-center mb-5" data-aos="fade-up">
                <h2 class="section-title">${musicData.title}</h2>
                <p class="section-subtitle">${musicData.subtitle}</p>
            </div>
            
            <!-- Spotify Section -->
            <div class="row mb-5">
                <div class="col-lg-6 mb-4" >
                    <div class="music-platform-card">
                        <div class="platform-icon">
                            <i class="fab fa-spotify"></i>
                        </div>
                        <h4>${musicData.spotify.title}</h4>
                        <p>${musicData.spotify.description}</p>
                        <div class="spotify-embed mt-3 mb-3">
                            ${musicData.spotify.embedCode}
                        </div>
                        <a href="${musicData.spotify.artistUrl}" 
                           target="_blank" class="btn btn-spotify">
                            <i class="fab fa-spotify"></i> ${musicData.spotify.buttonText || 'Spotify Sayfamız'}
                        </a>
                    </div>
                </div>
                
                <!-- YouTube Section -->
                <div class="col-lg-6 mb-4" >
                    <div class="music-platform-card">
                        <div class="platform-icon">
                            <i class="fab fa-youtube"></i>
                        </div>
                        <h4>${musicData.youtube.title}</h4>
                        <p>${musicData.youtube.description}</p>
                        <div class="youtube-embed mt-3 mb-3">
                            ${musicData.youtube.featuredVideo.embedCode}
                        </div>
                        <a href="${musicData.youtube.channelUrl}" 
                           target="_blank" class="btn btn-youtube">
                            <i class="fab fa-youtube"></i> ${musicData.youtube.buttonText || 'YouTube Kanalımız'}
                        </a>
                    </div>
                </div>
            </div>
            
            <!-- Albums Section -->
            <div class="albums-section">
                <h3 class="text-center mb-4">Albümlerimiz</h3>
                <div class="row">
        `;
        
        if (musicData.albums) {
            musicData.albums.forEach((album, index) => {
                html += `
                    <div class="col-lg-6 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="${index * 100}">
                        <div class="album-card">
                            <div class="album-cover">
                                <img src="${album.cover}" alt="${album.title}" class="img-fluid">
                            </div>
                            <div class="album-info">
                                <h5 class="album-title">${album.title}</h5>
                                <p class="album-year">${album.year}</p>
                                <p class="album-description">${album.description}</p>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        
        html += `
                </div>
            </div>
        `;
        
        return html;
    }

}

// Initialize content manager
const contentManager = new ContentManager();

// Export for use in other scripts
window.ContentManager = ContentManager;
window.contentManager = contentManager;

// Console helper for content management
console.log('Content Manager loaded. All content is managed via texts.json');
console.log('Usage: contentManager.getContent("section_name")');
