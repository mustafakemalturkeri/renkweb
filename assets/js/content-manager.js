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
                                            <span class="countdown-label">Gün</span>
                                        </div>
                                        <div class="countdown-item">
                                            <span class="countdown-number" id="hours">00</span>
                                            <span class="countdown-label">Saat</span>
                                        </div>
                                        <div class="countdown-item">
                                            <span class="countdown-number" id="minutes">00</span>
                                            <span class="countdown-label">Dakika</span>
                                        </div>
                                        <div class="countdown-item">
                                            <span class="countdown-number" id="seconds">00</span>
                                            <span class="countdown-label">Saniye</span>
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
        
        if (!window.textManager || !window.textManager.isLoaded) {
            console.warn('TextManager not ready in generateNewsHTML');
            return '<div class="news-placeholder"><p>Loading news information...</p></div>';
        }
        
        const newsData = window.textManager.getText('news');
        console.log('News data:', newsData);
        
        if (!newsData || !newsData.items) {
            console.warn('News data not found');
            return '<div class="news-placeholder"><p>News information not available</p></div>';
        }
        
        let html = `
            <div class="text-center mb-5" data-aos="fade-up">
                <h2 class="section-title">${newsData.title}</h2>
                <p class="section-subtitle">${newsData.subtitle}</p>
            </div>
            <div class="row">
        `;
        
        newsData.items.forEach((news, index) => {
            html += `
                <div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="card news-card h-100">
                        <div class="card-body">
                            <div class="news-date mb-2">
                                <i class="fas fa-calendar"></i> ${news.date}
                            </div>
                            <h5 class="news-title">${news.title}</h5>
                            <p class="news-description">${news.description}</p>
                            <div class="news-tags mt-3">
                                ${news.tags.map(tag => `<span class="badge news-tag">${tag}</span>`).join(' ')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
        
        return html;
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
                <div class="col-lg-6 mb-4" data-aos="fade-right">
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
                <div class="col-lg-6 mb-4" data-aos="fade-left">
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
