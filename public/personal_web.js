document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your public key
    emailjs.init('J8PYga9msHdegeKll');
    
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initContactForm();
    initSmoothScrolling();
    initTabs(); // Add this
    initSkillBarsAnimation(); // Add this
});
// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveLink);
    
    // Set initial active link
    updateActiveLink();
}

// Update active navigation link based on scroll position
function updateActiveLink() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    const heroButtons = document.querySelectorAll('.hero-buttons a');
    
    // Combine both nav links and hero buttons
    const allLinks = [...navLinks, ...heroButtons];
    
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Check if it's an internal link
            if (href.startsWith('#')) {
                e.preventDefault();
                
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate skill items with delay
                const skillItems = entry.target.querySelectorAll('.skill-item');
                skillItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 200);
                });

                // Animate project cards with delay
                const projectCards = entry.target.querySelectorAll('.project-card');
                projectCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 200);
                });

                // Animate contact methods with delay
                const contactMethods = entry.target.querySelectorAll('.contact-method');
                contactMethods.forEach((method, index) => {
                    setTimeout(() => {
                        method.style.opacity = '1';
                        method.style.transform = 'translateX(0)';
                    }, index * 150);
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Initialize skill items for animation
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease';
    });

    // Initialize project cards for animation
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
    });

    // Initialize contact methods for animation
    const contactMethods = document.querySelectorAll('.contact-method');
    contactMethods.forEach(method => {
        method.style.opacity = '0';
        method.style.transform = 'translateX(-30px)';
        method.style.transition = 'all 0.6s ease';
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Add input validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateInput);
            input.addEventListener('input', clearValidationError);
        });
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Get form values
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const message = formData.get('message').trim();
    
    // Validate form
    if (!validateForm(name, email, message)) {
        return;
    }
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // 🔥 REPLACE THESE WITH YOUR ACTUAL IDs
    const serviceID = 'service_4zw4aaf';      // From Step 3
    const templateID = 'template_hezp4ka';    // From Step 4  
    const publicKey = 'J8PYga9msHdegeKll';
    
    const templateParams = {
        from_name: name,
        from_email: email,
        message: message,
        to_name: 'Jorenz Pablo',
    };
    
    emailjs.send(serviceID, templateID, templateParams, publicKey)
        .then(() => {
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
        })
        .catch((error) => {
            console.error('EmailJS error:', error);
            showNotification('Failed to send message. Please try again later.', 'error');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
}
// Validate individual input
function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    
    clearValidationError(e);
    
    if (!value) {
        showInputError(input, 'This field is required');
        return false;
    }
    
    if (input.type === 'email' && !isValidEmail(value)) {
        showInputError(input, 'Please enter a valid email address');
        return false;
    }
    
    return true;
}

// Clear validation error
function clearValidationError(e) {
    const input = e.target;
    const errorElement = input.parentNode.querySelector('.error-message');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    input.style.borderColor = 'rgba(255, 255, 255, 0.2)';
}

// Show input error
function showInputError(input, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #ff6b6b;
        font-size: 0.875rem;
        margin-top: 0.5rem;
        animation: fadeIn 0.3s ease;
    `;
    
    input.style.borderColor = '#ff6b6b';
    input.parentNode.appendChild(errorElement);
}

// Validate entire form
function validateForm(name, email, message) {
    let isValid = true;
    
    const nameInput = document.querySelector('#name');
    const emailInput = document.querySelector('#email');
    const messageInput = document.querySelector('#message');
    
    if (!name) {
        showInputError(nameInput, 'Name is required');
        isValid = false;
    }
    
    if (!email) {
        showInputError(emailInput, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showInputError(emailInput, 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!message) {
        showInputError(messageInput, 'Message is required');
        isValid = false;
    } else if (message.length < 10) {
        showInputError(messageInput, 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    return isValid;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Add CSS animations dynamically
function addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize animations
addAnimations();

window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = '#000000'; // Force black instead of white
        navbar.style.boxShadow = '0 2px 20px rgba(255, 255, 255, 0.1)'; // White shadow for black bg
    } else {
        navbar.style.background = '#000000'; // Force black instead of white
        navbar.style.boxShadow = 'none';
    }
});

// Typing effect for hero title (optional enhancement)
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title .name-highlight');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            heroTitle.textContent += text.charAt(i);
            i++;
            
            if (i >= text.length) {
                clearInterval(typeInterval);
            }
        }, 100);
    }
}

// Uncomment the line below if you want the typing effect
 setTimeout(initTypingEffect, 1000);

 function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Animate skill bars when skills tab is opened
            if (targetTab === 'skills') {
                animateSkillBars();
            }
        });
    });
}

// Animate skill bars
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    
    skillBars.forEach((bar, index) => {
        const width = bar.getAttribute('data-width');
        
        // Reset width
        bar.style.width = '0';
        
        // Animate with delay for each bar
        setTimeout(() => {
            bar.style.setProperty('--skill-width', width);
            bar.classList.add('animate');
            bar.style.width = width;
        }, index * 150);
    });
}

// Initialize skill bars animation on scroll
function initSkillBarsAnimation() {
    const skillsTab = document.getElementById('skills');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.classList.contains('active')) {
                animateSkillBars();
            }
        });
    }, {
        threshold: 0.3
    });
    
    if (skillsTab) {
        observer.observe(skillsTab);
    }
}
function initTabKeyboardNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach((button, index) => {
        button.addEventListener('keydown', (e) => {
            let newIndex;
            
            if (e.key === 'ArrowRight') {
                newIndex = index + 1 >= tabButtons.length ? 0 : index + 1;
                e.preventDefault();
            } else if (e.key === 'ArrowLeft') {
                newIndex = index - 1 < 0 ? tabButtons.length - 1 : index - 1;
                e.preventDefault();
            }
            
            if (newIndex !== undefined) {
                tabButtons[newIndex].click();
                tabButtons[newIndex].focus();
            }
        });
    });
}

// Call this in DOMContentLoaded if you want keyboard navigation
initTabKeyboardNavigation();
