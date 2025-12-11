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
                                    ${heroData.countdown && heroData.countdown.link ? 
                                        `<a href="${heroData.countdown.link}" target="_blank" rel="noopener noreferrer">
                                            <img src="${heroData.countdown.image}" alt="RENK" class="muko-teko-image">
                                        </a>` :
                                        `<img src="${heroData.countdown && heroData.countdown.image}" alt="RENK" class="muko-teko-image">`
                                    }
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

    // Generate HTML for concerts section
    generateConcertsHTML() {
        console.log('🎵 Generating concerts HTML...');
        
        if (!window.textManager) {
            console.warn('❌ TextManager not ready in generateConcertsHTML');
            return '';
        }

        const concertsData = window.textManager.getText('concerts');
        console.log('🎵 Concerts data:', concertsData);
        
        if (!concertsData) {
            console.warn('❌ No concerts data found');
            return '';
        }

        let concertsHtml = `
            <section id="concerts" class="content-section py-5">
                <div class="container">
                    <div class="row text-center mb-5">
                        <div class="col-12">
                            <h2 class="section-title" data-aos="fade-up">${concertsData.title}</h2>
                            <p class="section-subtitle" data-aos="fade-up" data-aos-delay="200">${concertsData.subtitle}</p>
                        </div>
                    </div>
        `;

        if (concertsData.items && concertsData.items.length > 0) {
            console.log('🎵 Found', concertsData.items.length, 'concerts');
            
            concertsHtml += `<div class="row justify-content-center">`;
            
            concertsData.items.forEach((concert, index) => {
                const statusClass = concert.status === 'available' ? 'available' : 'coming-soon';
                
                concertsHtml += `
                    <div class="col-lg-6 col-md-8 col-sm-10 mb-4" data-aos="fade-up" data-aos-delay="${index * 200}">
                        <div class="concert-card ${statusClass}">
                            <div class="concert-image">
                                <img src="${concert.image}" alt="${concert.title}" class="img-fluid" onerror="this.src='assets/img/renk-headshots1.jpg'">
                                <div class="concert-overlay">
                                    <div class="concert-info">
                                        <h3 class="concert-title">${concert.title}</h3>
                                        <p class="concert-location"><i class="fas fa-map-marker-alt"></i> ${concert.location}</p>
                                        <p class="concert-date"><i class="fas fa-calendar-alt"></i> ${concert.date} - ${concert.time}</p>
                                        <p class="concert-venue"><i class="fas fa-building"></i> ${concert.venue}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="concert-details">
                                <h4 class="concert-card-title">${concert.title}</h4>
                                <p class="concert-description">${concert.description}</p>
                                <div class="concert-meta">
                                    <span class="concert-date-badge">
                                        <i class="fas fa-calendar-alt"></i> ${concert.date}
                                    </span>
                                    <span class="concert-location-badge">
                                        <i class="fas fa-map-marker-alt"></i> ${concert.location}
                                    </span>
                                </div>
                                <div class="concert-action">
                                    ${concert.ticketUrl && concert.ticketUrl !== '#' ? 
                                        `<a href="${concert.ticketUrl}" target="_blank" class="btn btn-concert btn-lg mt-3">
                                            <i class="fas fa-ticket-alt"></i> ${concert.ticketButtonText}
                                        </a>` : 
                                        `<button class="btn btn-concert-disabled btn-lg mt-3" disabled>
                                            <i class="fas fa-clock"></i> ${concert.ticketButtonText}
                                        </button>`
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            concertsHtml += `</div>`;
            
        } else {
            concertsHtml += `
                <div class="row">
                    <div class="col-12 text-center">
                        <div class="no-concerts">
                            <i class="fas fa-music fa-3x mb-3" style="color: var(--color-secondary);"></i>
                            <p class="lead">Yakında konser duyurularımız burada olacak!</p>
                        </div>
                    </div>
                </div>
            `;
        }

        concertsHtml += `
                </div>
            </section>
        `;

        console.log('🎵 Generated concerts HTML length:', concertsHtml.length);
        console.log('🎵 Generated concerts HTML (first 300 chars):', concertsHtml.substring(0, 300));
        return concertsHtml;
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
                <h3 class="text-center mb-4">${musicData.albumsTitle || 'Albümlerimiz'}</h3>
                <div class="row">
        `;
        
        if (musicData.albums) {
            musicData.albums.forEach((album, index) => {
                // Kıyı albümü için özel handling
                const isKiyiAlbum = album.title === 'Kıyı';
                const clickUrl = isKiyiAlbum && album.listenUrl ? album.listenUrl : album.spotifyUrl;
                const overlayContent = isKiyiAlbum && album.listenUrl ? 
                    `<div class="album-overlay album-overlay-kiyi"><i class="fas fa-play"></i><span>${album.listenButtonText || 'Dinle'}</span></div>` :
                    (album.spotifyUrl ? `<div class="album-overlay"><i class="fab fa-spotify"></i><span>${musicData.spotifyButtonText || 'Spotify\'da Dinle'}</span></div>` : '');
                
                const albumContent = `
                    <div class="col-lg-6 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="${index * 100}">
                        <div class="album-card${clickUrl ? ' clickable-album' : ''}${isKiyiAlbum ? ' kiyi-album' : ''}" ${clickUrl ? `onclick="window.open('${clickUrl}', '_blank')" style="cursor: pointer;"` : ''}>
                            <div class="album-cover">
                                <img src="${album.cover}" alt="${album.title}" class="img-fluid">
                                ${overlayContent}
                            </div>
                            <div class="album-info">
                                <h5 class="album-title">${album.title}</h5>
                                <p class="album-year">${album.year}</p>
                                <p class="album-description">${album.description}</p>
                                <div class="album-buttons">
                                    ${album.spotifyUrl ? `<a href="${album.spotifyUrl}" target="_blank" class="btn btn-spotify btn-sm mt-2" onclick="event.stopPropagation();"><i class="fab fa-spotify"></i> ${musicData.spotifyButtonText || 'Spotify\'da Dinle'}</a>` : ''}
                                    ${album.listenUrl ? `<a href="${album.listenUrl}" target="_blank" class="btn btn-primary btn-sm mt-2" onclick="event.stopPropagation();"><i class="fas fa-play"></i> ${album.listenButtonText || 'Dinle'}</a>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                html += albumContent;
            });
        }
        
        html += `
                </div>
            </div>
        `;
        
        return html;
    }

    // Generate HTML for gallery section
    generateGalleryHTML() {
        console.log('ContentManager: Generating gallery HTML...');
        
        const galleryData = this.getContent('gallery');
        if (!galleryData) {
            console.error('ContentManager: No gallery data found');
            return '<div>Gallery data not found</div>';
        }

        console.log('ContentManager: Gallery data loaded:', galleryData);

        // Load gallery images asynchronously
        setTimeout(() => {
            this.loadGalleryCarousel();
        }, 100);

        return `
            <section id="gallery" class="section">
                <div class="container">
                    <div class="text-center mb-5">
                        <h2 class="section-title">${galleryData.title}</h2>
                        <p class="section-subtitle">${galleryData.subtitle}</p>
                        <p class="gallery-photographer">${galleryData.photographer}</p>
                    </div>
                    
                    <!-- Gallery Carousel -->
                    <div id="galleryCarousel" class="carousel slide" data-bs-ride="carousel">
                        <!-- Loading placeholder -->
                        <div id="gallery-loading" class="text-center p-4">
                            <div class="spinner-border text-secondary" role="status">
                                <span class="visually-hidden">${this.getContent('common').loading}</span>
                            </div>
                            <p class="mt-2">${this.getContent('common').loading}</p>
                        </div>
                        
                        <!-- Carousel indicators (will be populated) -->
                        <div class="carousel-indicators" id="gallery-indicators" style="display: none;"></div>
                        
                        <!-- Carousel inner (will be populated) -->
                        <div class="carousel-inner" id="gallery-carousel-inner" style="display: none;"></div>
                        
                        <!-- Carousel controls (will be shown when loaded) -->
                        <button class="carousel-control-prev" type="button" data-bs-target="#galleryCarousel" data-bs-slide="prev" style="display: none;" id="gallery-prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">${this.getContent('common').previous || 'Önceki'}</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#galleryCarousel" data-bs-slide="next" style="display: none;" id="gallery-next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">${this.getContent('common').next || 'Sonraki'}</span>
                        </button>
                    </div>
                </div>
                
                <!-- Simple Image Modal -->
                <div id="imageModal" class="custom-modal" style="display: none;">
                    <div class="custom-modal-backdrop" onclick="window.contentManager.closeImageModal()"></div>
                    <div class="custom-modal-content">
                        <div class="custom-modal-header">
                            <h5 id="imageModalTitle">Galeri</h5>
                            <button type="button" class="custom-close-btn" onclick="window.contentManager.closeImageModal()">×</button>
                        </div>
                        <div class="custom-modal-body">
                            <img id="modalImage" src="" alt="" />
                            <div class="image-info">
                                <p id="imageDescription"></p>
                                <small id="imagePhotographer"></small>
                            </div>
                        </div>
                        <div class="custom-modal-footer">
                            <button type="button" class="custom-nav-btn" id="prevImageBtn">
                                ← Önceki
                            </button>
                            <span id="imageCounter">1 / 1</span>
                            <button type="button" class="custom-nav-btn" id="nextImageBtn">
                                Sonraki →
                            </button>
                        </div>
                    </div>
                </div>
        `;
    }

    // Load gallery carousel asynchronously
    async loadGalleryCarousel() {
        console.log('Loading gallery carousel...');
        
        try {
            const response = await fetch('data/gallery.json');
            const data = await response.json();
            
            console.log('Gallery data loaded:', data);
            
            if (!data.images || data.images.length === 0) {
                this.showGalleryError('Galeri resimleri bulunamadı');
                return;
            }
            
            this.renderCarouselImages(data.images);
            
        } catch (error) {
            console.error('Error loading gallery:', error);
            this.showGalleryError('Galeri yüklenirken hata oluştu');
        }
    }
    
    // Show gallery error
    showGalleryError(message) {
        const loadingEl = document.getElementById('gallery-loading');
        if (loadingEl) {
            loadingEl.innerHTML = `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle"></i> ${message}
                </div>
            `;
        }
    }
    
    // Render carousel images
    renderCarouselImages(images) {
        const galleryData = this.getContent('gallery');
        const imagesPerSlide = 3; // 3 images per slide
        const totalSlides = Math.ceil(images.length / imagesPerSlide);
        
        const indicatorsEl = document.getElementById('gallery-indicators');
        const carouselInnerEl = document.getElementById('gallery-carousel-inner');
        const loadingEl = document.getElementById('gallery-loading');
        const prevBtn = document.getElementById('gallery-prev');
        const nextBtn = document.getElementById('gallery-next');
        
        if (!indicatorsEl || !carouselInnerEl) {
            console.error('Carousel elements not found');
            return;
        }
        
        // Store images for modal functionality
        this.galleryImages = images;
        
        // Clear indicators and carousel inner
        indicatorsEl.innerHTML = '';
        carouselInnerEl.innerHTML = '';
        
        // Generate indicators
        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('button');
            indicator.type = 'button';
            indicator.setAttribute('data-bs-target', '#galleryCarousel');
            indicator.setAttribute('data-bs-slide-to', i.toString());
            if (i === 0) {
                indicator.className = 'active';
                indicator.setAttribute('aria-current', 'true');
            }
            indicator.setAttribute('aria-label', `Slide ${i + 1}`);
            indicatorsEl.appendChild(indicator);
        }
        
        // Generate carousel slides
        for (let i = 0; i < totalSlides; i++) {
            const start = i * imagesPerSlide;
            const end = Math.min(start + imagesPerSlide, images.length);
            const slideImages = images.slice(start, end);
            
            const carouselItem = document.createElement('div');
            carouselItem.className = i === 0 ? 'carousel-item active' : 'carousel-item';
            
            let slideHTML = `
                <div class="container">
                    <div class="row g-4">
            `;
            
            slideImages.forEach((image, slideIndex) => {
                const globalIndex = start + slideIndex; // Global index for modal
                slideHTML += `
                    <div class="col-lg-4 col-md-6 col-12">
                        <div class="gallery-carousel-card" data-image-index="${globalIndex}" style="cursor: pointer;">
                            <div class="position-relative overflow-hidden">
                                <img src="assets/img/gallery/${image.filename}" 
                                     class="w-100" 
                                     alt="RENK Galeri"
                                     loading="lazy"
                                     style="height: 280px; object-fit: cover;">
                                <div class="gallery-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                                    <i class="fas fa-expand text-white fs-3"></i>
                                </div>
                            </div>
                            <div class="p-3 text-center">
                                <small class="text-secondary">Foto: ${image.photographer}</small>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            slideHTML += `
                    </div>
                </div>
            `;
            
            carouselItem.innerHTML = slideHTML;
            carouselInnerEl.appendChild(carouselItem);
        }
        
        // Hide loading and show carousel elements
        if (loadingEl) loadingEl.style.display = 'none';
        indicatorsEl.style.display = 'flex';
        carouselInnerEl.style.display = 'block';
        if (prevBtn) prevBtn.style.display = 'flex';
        if (nextBtn) nextBtn.style.display = 'flex';
        
        // Add click event listeners to gallery cards
        setTimeout(() => {
            const galleryCards = document.querySelectorAll('.gallery-carousel-card');
            galleryCards.forEach(card => {
                card.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const imageIndex = parseInt(card.getAttribute('data-image-index'));
                    console.log('Gallery card clicked, image index:', imageIndex);
                    
                    if (!isNaN(imageIndex)) {
                        this.openImageModal(imageIndex);
                    } else {
                        console.error('Invalid image index:', imageIndex);
                    }
                });
            });
            console.log(`Added click listeners to ${galleryCards.length} gallery cards`);
        }, 100);
        
        console.log(`Gallery carousel loaded: ${totalSlides} slides, ${images.length} images`);
    }

    // Old render function - keep for compatibility
    renderGalleryImages(container, images, galleryData, startIndex = 0, batchSize = 12) {
        if (startIndex === 0) {
            container.innerHTML = '';
        }

        const endIndex = Math.min(startIndex + batchSize, images.length);
        const batch = images.slice(startIndex, endIndex);

        batch.forEach((image, index) => {
            const actualIndex = startIndex + index;
            const imageCard = document.createElement('div');
            imageCard.className = 'gallery-item';
            imageCard.setAttribute('data-aos', 'fade-up');
            imageCard.setAttribute('data-aos-delay', (index * 100).toString());

            imageCard.innerHTML = `
                <div class="gallery-card" onclick="window.contentManager.openImageModal(${actualIndex})">
                    <div class="gallery-image-container">
                        <img src="assets/img/gallery/${image.filename}" 
                             alt="RENK Galeri ${actualIndex + 1}" 
                             class="gallery-image"
                             loading="lazy">
                        <div class="gallery-overlay">
                            <div class="gallery-overlay-content">
                                <i class="fas fa-expand text-white"></i>
                            </div>
                        </div>
                    </div>
                    <div class="gallery-info">
                        <small class="gallery-photographer">${image.photographer}</small>
                    </div>
                </div>
            `;

            container.appendChild(imageCard);
        });

        // Handle load more button
        const loadMoreBtn = document.getElementById('load-more-gallery');
        if (endIndex >= images.length) {
            loadMoreBtn.classList.add('d-none');
        } else {
            loadMoreBtn.classList.remove('d-none');
            loadMoreBtn.onclick = () => this.renderGalleryImages(container, images, galleryData, endIndex, batchSize);
        }

        // Store images for modal navigation
        this.galleryImages = images;

        // Refresh AOS animations
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    // Open image modal
    openImageModal(imageIndex) {
        console.log('Opening image modal for index:', imageIndex);
        
        // Check if galleryImages exists
        if (!this.galleryImages || !Array.isArray(this.galleryImages)) {
            console.error('Gallery images not loaded yet');
            return;
        }
        
        const image = this.galleryImages[imageIndex];
        if (!image) {
            console.error('Image not found at index:', imageIndex);
            return;
        }
        
        console.log('Opening image:', image);

        // Get modal elements
        const modal = document.getElementById('imageModal');
        const modalTitle = document.getElementById('imageModalTitle');
        const modalImage = document.getElementById('modalImage');
        const imageDescription = document.getElementById('imageDescription');
        const imagePhotographer = document.getElementById('imagePhotographer');
        const imageCounter = document.getElementById('imageCounter');
        const prevBtn = document.getElementById('prevImageBtn');
        const nextBtn = document.getElementById('nextImageBtn');

        if (!modal) {
            console.error('Image modal element not found');
            window.open(`assets/img/gallery/${image.filename}`, '_blank');
            return;
        }

        // Set content
        if (modalTitle) modalTitle.textContent = `RENK Galeri - ${imageIndex + 1}`;
        if (modalImage) {
            modalImage.src = `assets/img/gallery/${image.filename}`;
            modalImage.alt = `RENK Galeri ${imageIndex + 1}`;
        }
        if (imageDescription) imageDescription.textContent = '';
        if (imagePhotographer) imagePhotographer.textContent = `Foto: ${image.photographer}`;
        if (imageCounter) imageCounter.textContent = `${imageIndex + 1} / ${this.galleryImages.length}`;

        // Set navigation
        if (prevBtn) {
            prevBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const prevIndex = imageIndex > 0 ? imageIndex - 1 : this.galleryImages.length - 1;
                this.openImageModal(prevIndex);
            };
        }

        if (nextBtn) {
            nextBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const nextIndex = imageIndex < this.galleryImages.length - 1 ? imageIndex + 1 : 0;
                this.openImageModal(nextIndex);
            };
        }

        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Add keyboard event listener
        document.addEventListener('keydown', this.handleKeyDown);

        // Store current index
        this.currentImageIndex = imageIndex;
        
        console.log('Custom modal opened successfully');
    }

    // Close image modal
    closeImageModal() {
        const modal = document.getElementById('imageModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            document.removeEventListener('keydown', this.handleKeyDown);
        }
    }

    // Handle keyboard events for modal
    handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            this.closeImageModal();
        } else if (e.key === 'ArrowLeft') {
            const prevIndex = this.currentImageIndex > 0 ? this.currentImageIndex - 1 : this.galleryImages.length - 1;
            this.openImageModal(prevIndex);
        } else if (e.key === 'ArrowRight') {
            const nextIndex = this.currentImageIndex < this.galleryImages.length - 1 ? this.currentImageIndex + 1 : 0;
            this.openImageModal(nextIndex);
        }
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
