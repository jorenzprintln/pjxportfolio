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

// ==================== PROJECT MODAL FUNCTIONALITY ====================

// Project data
const projects = {
    blowlock: {
        title: "BlowLock - File Encryption App",
        hasGallery: false,
        description: `
            <p><strong>BlowLock</strong> is a mobile application designed to provide secure file encryption and decryption capabilities. The app empowers users to protect their sensitive files with a password-based encryption system.</p>
            
            <h3>Key Features:</h3>
            <ul>
                <li><strong>File Encryption:</strong> Encrypt any file type using a user-defined code/password</li>
                <li><strong>Secure Decryption:</strong> Decrypt files using the same code used during encryption</li>
                <li><strong>Blowfish Algorithm:</strong> Utilizes the robust Blowfish encryption algorithm for strong security</li>
                <li><strong>User-Friendly Interface:</strong> Simple and intuitive mobile interface for easy file protection</li>
            </ul>
            
            <h3>How It Works:</h3>
            <p>Users select a file they want to encrypt, enter a secure code, and BlowLock processes the file using the Blowfish algorithm. To decrypt, users simply provide the same code, and the app restores the original file. This ensures that only authorized users with the correct code can access the protected content.</p>
            
            <h3>Technology:</h3>
            <p>Built as a mobile application implementing the Blowfish symmetric-key block cipher, known for its speed and effectiveness in encryption tasks.</p>
        `
    },
    mathpop: {
    title: "MathPop - Educational Arithmetic Math Game",
    hasGallery: true,
    images: [
        'public/images/mathpop/1000016960.jpg',
        'public/images/mathpop/1000016961.jpg',
        'public/images/mathpop/1000016965.jpg',
        'public/images/mathpop/1000016966.jpg',
        'public/images/mathpop/1000016968.jpg',
        'public/images/mathpop/1000016964.jpg',
        'public/images/mathpop/1000016962.jpg',
    ],
    description: `
        <p><strong>MathPop</strong> is an engaging educational mobile game designed to make learning arithmetic fun and interactive. Players sharpen their math skills by popping balloons with correct answers while racing against time or surviving challenging rounds.</p>
        
        <h3>Game Modes:</h3>
        <ul>
            <li><strong>Practice Mode:</strong> Time-based gameplay with a 60-second timer where players solve as many math problems as possible. Collect falling time power-ups to extend your playing session and maximize your score.</li>
            <li><strong>Survival Mode:</strong> Challenge yourself with a life-based system. Start with 3 hearts and keep playing as long as you can. Each incorrect answer costs 1 heart, but you can collect falling heart power-ups to restore your lives.</li>
        </ul>
        
        <h3>Key Features:</h3>
        <ul>
            <li><strong>Interactive Gameplay:</strong> Math problems appear at the top of the screen while numbered balloons fall from above</li>
            <li><strong>Pop to Answer:</strong> Tap the balloon containing the correct answer to the displayed math problem</li>
            <li><strong>Power-Ups:</strong> Collect falling time icons in Practice Mode to extend gameplay, or heart icons in Survival Mode to restore lives</li>
            <li><strong>Life System:</strong> Survival Mode features a 3-heart system where incorrect answers reduce your lives</li>
            <li><strong>Score Tracking:</strong> Dedicated score history screen displays your performance across all game sessions</li>
            <li><strong>Educational Focus:</strong> Designed to improve arithmetic skills through engaging, repetitive practice</li>
        </ul>
        
        <h3>How to Play:</h3>
        <p>Choose your preferred game mode and start solving! A math problem displays at the top while balloons with different numbers fall down the screen. Quickly identify and pop the balloon with the correct answer. In Practice Mode, race against the clock and grab time power-ups to keep playing. In Survival Mode, protect your 3 hearts and collect heart power-ups to stay alive. Track your progress and beat your high scores in the score history screen.</p>
        
        <h3>Technology:</h3>
        <p>Built as an interactive mobile application combining educational content with entertaining gameplay mechanics to create an effective learning experience for students of all ages.</p>
    `
    },
    angklung: {
        title: "BATINGAW: Smart Angklung App Using CNN w/ MFCCs for Enhanced Music Learning",
        hasGallery: true,
        images: [
            'public/images/angklung/1st.jpg',
            'public/images/angklung/reg.jpg',
            'public/images/angklung/log.jpg',
            'public/images/angklung/home.jpg',
            'public/images/angklung/modal.jpg',
            'public/images/angklung/play.jpg',
            'public/images/angklung/record.jpg',
            'public/images/angklung/recordings.jpg',
            'public/images/angklung/about.jpg',
            'public/images/angklung/logs.jpg',
            'public/images/angklung/prof.jpg',
            'public/images/angklung/user.jpg',
            'public/images/angklung/changepass.jpg',
            'public/images/angklung/trainers.jpg',
            'public/images/angklung/trainer.jpg',
            'public/images/angklung/results.jpg',
            'public/images/angklung/prac.jpg',
            'public/images/angklung/try.jpg',
        ],
        description: `
            <p><strong>BATINGAW</strong> is an innovative mobile application that brings the traditional Indonesian angklung instrument into the digital age. Using advanced Convolutional Neural Networks (CNN) with Mel-frequency cepstral coefficients (MFCCs), this capstone project revolutionizes angklung music learning through interactive gameplay and AI-powered training.</p>
            
            <h3>Core Features:</h3>
            <ul>
                <li><strong>Realistic Angklung Simulation:</strong> Experience authentic angklung playing by shaking your phone, just like the traditional instrument. Choose from 20 different angklung notes and shake to play.</li>
                <li><strong>Flexible Playing Modes:</strong> Play angklung by shaking your phone or tapping notes on screen. Hold notes for sustained sounds, just like playing the real instrument.</li>
                <li><strong>Recording & Playback:</strong> Record your musical performances, save them for later playback, and share your recordings with others.</li>
                <li><strong>Recording Logs:</strong> Generate comprehensive logs of all your recorded sessions to track your musical journey and progress.</li>
            </ul>
            
            <h3>AI-Powered Angklung Trainer:</h3>
            <ul>
                <li><strong>Philippine Folk Songs Library:</strong> Choose from a collection of traditional Filipino folk songs to learn and master.</li>
                <li><strong>Interactive Music Sheet:</strong> Play along with visual music sheet interface that guides you through each song.</li>
                <li><strong>Real-Time Feedback:</strong> AI-powered recognition provides instant visual feedback when you play the correct note, helping you learn faster.</li>
                <li><strong>Performance Analysis:</strong> After completing a song, receive detailed performance results showing your accuracy and areas for improvement.</li>
                <li><strong>Practice Mode:</strong> Focused training mode where you play individual notes and receive AI feedback. The system only advances to the next note when you play the current note correctly, ensuring thorough learning.</li>
            </ul>
            
            <h3>How to Play:</h3>
            <p>Select your desired note from the 20 available angklung options. Hold the angklung image on screen and shake your phone to produce sound. Release the image or stop shaking to end the note. Alternatively, tap notes directly for quick playing or hold them for sustained sounds. In Trainer mode, follow the music sheet, play along with Philippine folk songs, and receive instant AI feedback to improve your skills.</p>
            
            <h3>Technology:</h3>
            <p>Built using cutting-edge machine learning technology combining Convolutional Neural Networks (CNN) and Mel-frequency cepstral coefficients (MFCCs) for accurate audio recognition and real-time performance feedback. Developed as a capstone project to enhance traditional music education through modern mobile technology.</p>
            
            <h3>Target Audience:</h3>
            <p>Designed for Bachelor of Music in Music Education (BMME) students at Leyte Normal University and anyone interested in learning traditional Filipino angklung music in an engaging, interactive way.</p>
        `
    },
};

// Modal functionality
let modal, modalClose;
let currentProject = null;
let currentImageIndex = 0;

// Open modal
function openProjectModal(projectKey) {
    const project = projects[projectKey];
    if (!project) return;
    
    currentProject = project;
    currentImageIndex = 0;
    
    // Set title and description
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalDescription').innerHTML = project.description;
    
    // Handle gallery
    const gallery = document.getElementById('modalGallery');
    if (project.hasGallery && project.images) {
        gallery.style.display = 'block';
        updateGallery();
    } else {
        gallery.style.display = 'none';
    }
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeProjectModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentProject = null;
}

// Update gallery display
function updateGallery() {
    if (!currentProject || !currentProject.images) return;
    
    const galleryImage = document.getElementById('galleryImage');
    galleryImage.src = currentProject.images[currentImageIndex];
    
    // Update indicators
    const indicators = document.getElementById('galleryIndicators');
    indicators.innerHTML = '';
    currentProject.images.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'indicator-dot' + (index === currentImageIndex ? ' active' : '');
        dot.onclick = () => {
            currentImageIndex = index;
            updateGallery();
        };
        indicators.appendChild(dot);
    });
}

// Initialize modal
function initModal() {
    modal = document.getElementById('projectModal');
    modalClose = document.querySelector('.modal-close');
    
    if (!modal || !modalClose) return;
    
    // Close button click
    modalClose.onclick = closeProjectModal;
    
    // Click outside modal to close
    window.onclick = function(event) {
        if (event.target === modal) {
            closeProjectModal();
        }
    }
    
    // Escape key to close
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'flex') {
            closeProjectModal();
        }
    });
    
    // Gallery navigation
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    
    if (prevBtn) {
        prevBtn.onclick = function() {
            if (currentProject && currentProject.images) {
                currentImageIndex = (currentImageIndex - 1 + currentProject.images.length) % currentProject.images.length;
                updateGallery();
            }
        }
    }
    
    if (nextBtn) {
        nextBtn.onclick = function() {
            if (currentProject && currentProject.images) {
                currentImageIndex = (currentImageIndex + 1) % currentProject.images.length;
                updateGallery();
            }
        }
    }
}

// Initialize project click handlers
function initProjectClickHandlers() {
    const projectItems = document.querySelectorAll('.project-item');
    const projectKeys = ['angklung', 'babatngon', 'mathpop', 'blowlock'];
    
    projectItems.forEach((item, index) => {
        item.onclick = function(e) {
            e.preventDefault();
            if (projectKeys[index] && projects[projectKeys[index]]) {
                openProjectModal(projectKeys[index]);
            }
        };
        
        // Add pointer cursor
        item.style.cursor = 'pointer';
    });
}

// ==================== INITIALIZE EVERYTHING ====================

// Initialize theme and all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    initButtons();
    initModal();
    initProjectClickHandlers();
});