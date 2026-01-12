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

// Initialize theme when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    initButtons();
});

// Button functionality
function initButtons() {
    // View Resume button
    const resumeBtn = document.querySelector('.btn-secondary');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', function() {
            // Replace with your actual resume PDF path
            alert('Resume download functionality - Connect this to your actual resume PDF file');
            // Uncomment and add your resume path:
            // window.open('path/to/your/resume.pdf', '_blank');
        });
    }

    // Send Email button
    const emailBtn = document.querySelector('.btn-primary');
    if (emailBtn) {
        emailBtn.addEventListener('click', function() {
            window.location.href = 'mailto:jorenzlnu@gmail.com?subject=Hello%20from%20your%20portfolio&body=Hi%20Paul,%0D%0A%0D%0A';
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