// Main JavaScript functionality for the portfolio website

// Project data - this will be managed through the admin panel
let projects = [
    {
        id: 1,
        title: "Quadratic Formula Solver",
        description: "A web-based calculator that solves quadratic equations and displays the solutions with step-by-step explanations.",
        image: "images/QuadraticFormulaScreenshot.png",
        link: "https://rippey-fam.github.io/Website-Builds/Projects/QuadraticFormula/",
        date: new Date().toISOString()
    },
    {
        id: 2,
        title: "Cryptogram Game",
        description: "An interactive puzzle game where players decode encrypted messages using letter substitution ciphers.",
        image: "images/CryptogramScreenshot.png",
        link: "https://rippey-fam.github.io/Website-Builds/Projects/Cryptogram/",
        date: new Date().toISOString()
    }
];

// Load projects from localStorage if available
function loadProjects() {
    const savedProjects = localStorage.getItem('matthewPortfolioProjects');
    if (savedProjects) {
        try {
            projects = JSON.parse(savedProjects);
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }
}

// Save projects to localStorage
function saveProjects() {
    try {
        localStorage.setItem('matthewPortfolioProjects', JSON.stringify(projects));
    } catch (error) {
        console.error('Error saving projects:', error);
    }
}

// Render projects on the page
function renderProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;

    // Sort projects by date (newest first)
    const sortedProjects = [...projects].sort((a, b) => new Date(b.date) - new Date(a.date));

    projectsGrid.innerHTML = sortedProjects.map(project => `
        <div class="project-card" data-project-id="${project.id}">
            <img 
                src="${project.image}" 
                alt="${project.title} screenshot" 
                class="project-image"
                onerror="this.src='https://placehold.co/600x400'"
            >
            <div class="project-content">
                <h3 class="project-title">${escapeHtml(project.title)}</h3>
                <p class="project-description">${escapeHtml(project.description)}</p>
                <a href="${project.link}" target="_blank" rel="noopener" class="project-link">
                    <span>View Project</span>
                    <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        </div>
    `).join('');

    // Add animation to project cards
    animateProjectCards();
}

// Animate project cards on scroll
function animateProjectCards() {
    const cards = document.querySelectorAll('.project-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Add scroll effect to navbar
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
            if (currentScrollY > lastScrollY) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Add typing effect to hero title
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < originalText.length) {
            heroTitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 500);
}

// Initialize contact form interactions
function initContactInteractions() {
    const contactLinks = document.querySelectorAll('.contact-link');
    
    contactLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Add particle effect to hero section
function initParticleEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${3 + Math.random() * 4}s infinite ease-in-out;
            animation-delay: ${Math.random() * 2}s;
        `;
        hero.appendChild(particle);
    }
}

// Add skill tag hover effects
function initSkillTagEffects() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.background = 'var(--accent-color)';
            tag.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', () => {
            tag.style.background = 'var(--primary-color)';
            tag.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Main initialization function
function init() {
    // Load and render projects
    loadProjects();
    renderProjects();
    
    // Initialize interactive features
    initSmoothScrolling();
    initNavbarScroll();
    initTypingEffect();
    initContactInteractions();
    initParticleEffect();
    initSkillTagEffects();
    
    // Add loading animation
    document.body.style.opacity = '0';
    window.addEventListener('load', () => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    });
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export functions for admin panel use
window.portfolioAPI = {
    projects,
    saveProjects,
    loadProjects,
    renderProjects
};