// Cinematic Entrance Animation with Drawing Effect
const heroVideo = document.getElementById('heroVideo');
const initialLogo = document.getElementById('initialLogo');
const mainHeader = document.getElementById('mainHeader');
const heroContent = document.getElementById('heroContent');
const volumeToggle = document.getElementById('volumeToggle');
const volumeIcon = document.getElementById('volumeIcon');
let hasTransitioned = false;

// Video autoplay - keep it simple, muted videos autoplay reliably
if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.volume = 0.7;
    heroVideo.play();
}

// Volume toggle functionality
if (volumeToggle && heroVideo) {
    volumeToggle.addEventListener('click', () => {
        if (heroVideo.muted) {
            heroVideo.muted = false;
            volumeIcon.className = 'fas fa-volume-up';
            volumeToggle.classList.add('unmuted');
        } else {
            heroVideo.muted = true;
            volumeIcon.className = 'fas fa-volume-mute';
            volumeToggle.classList.remove('unmuted');
        }
    });
}

// Automatically transition after drawing animation completes
// Drawing animation: 1.8s + handle fade: 0.6s delay = ~2.4s total
// Add small buffer for smooth transition
setTimeout(() => {
    if (!hasTransitioned) {
        transitionToWebsite();
        hasTransitioned = true;
    }
}, 2500); // 2.5 seconds total


function transitionToWebsite() {
    // Animate initial logo to header position
    if (initialLogo) {
        initialLogo.classList.add('transitioning');
    }
    
    // Ensure video loops after transition
    if (heroVideo) {
        heroVideo.loop = true;
        if (heroVideo.paused) {
            heroVideo.play();
        }
    }
    
    // Show volume toggle button
    if (volumeToggle) {
        volumeToggle.classList.add('visible');
    }
    
    // Show header with animation (after logo starts transitioning)
    setTimeout(() => {
        if (mainHeader) {
            mainHeader.classList.add('visible');
        }
    }, 400);
    
    // Show hero content (with logo already in position)
    setTimeout(() => {
        if (heroContent) {
            heroContent.classList.add('visible');
        }
        // Hide initial logo after transition completes
        if (initialLogo) {
            initialLogo.classList.add('hidden');
        }
    }, 1200);
    
    // Show other sections with scroll animation
    setTimeout(() => {
        observeSections();
    }, 1000);
}

// Intersection Observer for sections
function observeSections() {
    const sections = document.querySelectorAll('.section:not(#home)');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav') && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        }
    });
});

// Set active nav link on scroll
const sections = document.querySelectorAll('.section');
const navLinksList = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    let current = '';
    const scrollPosition = window.pageYOffset + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinksList.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// Stats Counter Animation
function animateStat(statElement) {
    const target = parseFloat(statElement.getAttribute('data-target'));
    const suffix = statElement.getAttribute('data-suffix') || '';
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const isK = suffix.includes('K');
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);
        
        if (isK) {
            statElement.textContent = `${current}K+`;
        } else {
            statElement.textContent = `${current}${suffix}`;
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            // Ensure final value is set
            if (isK) {
                statElement.textContent = `${target}K+`;
            } else {
                statElement.textContent = `${target}${suffix}`;
            }
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Intersection Observer for stats animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const statNumbers = entry.target.querySelectorAll('.stat-number[data-target]');
            statNumbers.forEach((stat, index) => {
                // Stagger the animations slightly
                setTimeout(() => {
                    animateStat(stat);
                }, index * 150);
            });
        }
    });
}, {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
});

// Observe the stats container
const statsContainer = document.querySelector('.stats');
if (statsContainer) {
    // Find the parent section to observe
    const aboutSection = statsContainer.closest('.section');
    if (aboutSection) {
        statsObserver.observe(aboutSection);
    }
}

// Form submission handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    // Set the redirect URL for successful form submission
    const nextUrlInput = contactForm.querySelector('#formNextUrl');
    if (nextUrlInput) {
        const currentUrl = window.location.href.split('?')[0]; // Remove any existing query params
        nextUrlInput.value = `${currentUrl}?success=true#contact`;
    }
    
    contactForm.addEventListener('submit', (e) => {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        submitBtn.style.opacity = '0.7';
        
        // Form will submit to FormSubmit.co
        // On success, FormSubmit will redirect back to this page with ?success=true
        // If there's an error, the form will stay on the page and we can handle it
        
        // Reset button after 8 seconds in case of any issues
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.style.opacity = '1';
        }, 8000);
    });
    
    // Handle successful submission (FormSubmit redirects to _next URL)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Message Sent! ✓';
            submitBtn.style.background = '#00274C';
            submitBtn.style.color = '#FFCB05';
            submitBtn.disabled = false;
            contactForm.reset();
            
            // Scroll to form
            setTimeout(() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
            
            setTimeout(() => {
                submitBtn.textContent = 'Send Message';
                submitBtn.style.background = '';
                submitBtn.style.color = '';
                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
            }, 5000);
        }
    }
}

// Video fallback if video doesn't load
if (heroVideo) {
    heroVideo.addEventListener('error', () => {
        heroVideo.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(255, 203, 5, 0.2), rgba(0, 39, 76, 0.3));
            z-index: 1;
        `;
        heroVideo.parentElement.appendChild(fallback);
        // Transition immediately if video fails
        if (!hasTransitioned) {
            setTimeout(() => transitionToWebsite(), 1000);
            hasTransitioned = true;
        }
    });
}

// Add parallax effect on scroll (only after transition)
let parallaxEnabled = false;
window.addEventListener('scroll', () => {
    if (!parallaxEnabled || !heroVideo) return;
    
    const scrollY = window.pageYOffset;
    if (scrollY < window.innerHeight) {
        const parallaxValue = scrollY * 0.3;
        heroVideo.style.transform = `translate(-50%, calc(-50% + ${parallaxValue}px))`;
    }
});

// Enable parallax after transition
setTimeout(() => {
    parallaxEnabled = true;
}, 2000);
