// Theme toggle functionality
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateProfilePicture(newTheme);
}

// Update profile picture based on theme
function updateProfilePicture(theme) {
    const profileImg = document.querySelector('.profile-image-compact');
    if (profileImg) {
        if (theme === 'dark') {
            profileImg.src = 'public/images/dark_mode.png';
        } else {
            profileImg.src = 'public/images/portfolio.png';
        }
        
        // Update onerror fallback
        profileImg.onerror = function() {
            this.src = 'https://ui-avatars.com/api/?name=Paul+Jorenz+Pablo&size=140&background=2563eb&color=fff&bold=true';
        };
    }
}

// Load saved theme on page load
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateProfilePicture(savedTheme);
}

// Send Email function with device detection
function sendEmail() {
    const yourEmail = 'jorenzlnu@gmail.com';
    const subject = encodeURIComponent('Hello from your portfolio');
    const body = encodeURIComponent('Hi Paul,\n\nI visited your portfolio and would like to connect with you.\n\nBest regards,\n[Your Name]');
    
    // Check if user is likely on a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
        // For mobile devices, use a different approach
        // Gmail app URL scheme for iOS/Android
        const gmailAppUrl = `googlegmail://co?to=${yourEmail}&subject=${subject}&body=${body}`;
        
        // Try to open Gmail app first
        window.location.href = gmailAppUrl;
        
        // If Gmail app is not installed, fall back to mailto after a delay
        setTimeout(function() {
            window.location.href = `mailto:${yourEmail}?subject=${subject}&body=${body}`;
        }, 500);
    } else {
        // For desktop, use Gmail web
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${yourEmail}&su=${subject}&body=${body}`;
        window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    }
}

// Initialize theme when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    initButtons();
});

// Button functionality
function initButtons() {
    // Send Email button
    const emailBtn = document.querySelector('.btn-primary');
    if (emailBtn) {
        emailBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sendEmail();
        });
    }
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});