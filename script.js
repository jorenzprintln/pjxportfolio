function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateProfilePicture(newTheme);
    setTimeout(updateElectricBorderColor, 50);
}

function updateProfilePicture(theme) {
    const profileImg = document.querySelector('.profile-image-compact');
    if (profileImg) {
        if (theme === 'dark') {
            profileImg.src = 'public/images/dark_mode.png';
        } else {
            profileImg.src = 'public/images/portfolio.png';
        }
        profileImg.onerror = function() {
            this.src = 'https://ui-avatars.com/api/?name=Paul+Jorenz+Pablo&size=140&background=2563eb&color=fff&bold=true';
        };
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateProfilePicture(savedTheme);
}

function sendEmail() {
    const yourEmail = 'jorenzlnu@gmail.com';
    const subject = encodeURIComponent('Hello from your portfolio');
    const body = encodeURIComponent('Hi Paul,\n\nI visited your portfolio and would like to connect with you.\n\nBest regards,\n[Your Name]');
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
        const gmailAppUrl = `googlegmail://co?to=${yourEmail}&subject=${subject}&body=${body}`;
        window.location.href = gmailAppUrl;
        setTimeout(function() {
            window.location.href = `mailto:${yourEmail}?subject=${subject}&body=${body}`;
        }, 500);
    } else {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${yourEmail}&su=${subject}&body=${body}`;
        window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    }
}

function initButtons() {
    const emailBtn = document.querySelector('.btn-primary');
    if (emailBtn) {
        emailBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sendEmail();
        });
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ==================== ELECTRIC BORDER ====================
class ElectricBorder {
    constructor(targetImg, options = {}) {
        this.targetImg = targetImg;
        this.color = options.color || '#3b82f6';
        this.speed = options.speed || 0.8;
        this.chaos = options.chaos || 0.12;
        this.borderRadius = options.borderRadius || 16;
        this.displacement = options.displacement || 50;
        this.borderOffset = options.borderOffset || 52;
        this.time = 0;
        this.lastFrameTime = 0;
        this.animationId = null;
        this._setupWrapper();
        this._setupResizeObserver();
        this._start();
    }

    _setupWrapper() {
        // Read the img's computed styles BEFORE touching anything
        const computed = window.getComputedStyle(this.targetImg);
        const imgW = this.targetImg.offsetWidth || 160;
        const imgH = this.targetImg.offsetHeight || 160;
        const borderRadius = computed.borderRadius || '16px';
        const border = computed.border;
        const boxShadow = computed.boxShadow;

        // Create wrapper that mimics the image's footprint exactly
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'electric-border-wrapper';
        this.wrapper.style.cssText = `
            position: relative;
            display: inline-block;
            flex-shrink: 0;
            width: ${imgW}px;
            height: ${imgH}px;
            border-radius: ${borderRadius};
            overflow: visible;
        `;

        // Insert wrapper in place of img, then put img inside
        this.targetImg.parentNode.insertBefore(this.wrapper, this.targetImg);
        this.wrapper.appendChild(this.targetImg);

        // Restore the img's exact original styles — do NOT override width/height
        this.targetImg.style.width = `${imgW}px`;
        this.targetImg.style.height = `${imgH}px`;
        this.targetImg.style.borderRadius = borderRadius;
        this.targetImg.style.display = 'block';
        this.targetImg.style.position = 'relative';
        this.targetImg.style.zIndex = '1';
        this.targetImg.style.flexShrink = '0';

        // Canvas overlays the wrapper, extends outward via negative top/left
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'electric-border-canvas';
        this.canvas.style.cssText = `
            position: absolute;
            pointer-events: none;
            z-index: 10;
        `;
        this.wrapper.appendChild(this.canvas);

        this._resize();
    }

    _resize() {
        const rect = this.targetImg.getBoundingClientRect();
        // fallback to natural dimensions if getBoundingClientRect returns 0
        const imgW = rect.width || this.targetImg.offsetWidth || 160;
        const imgH = rect.height || this.targetImg.offsetHeight || 160;

        const offset = this.borderOffset;
        const w = imgW + offset * 2;
        const h = imgH + offset * 2;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        this.canvas.width = w * dpr;
        this.canvas.height = h * dpr;
        this.canvas.style.width = `${w}px`;
        this.canvas.style.height = `${h}px`;
        this.canvas.style.top = `${-offset}px`;
        this.canvas.style.left = `${-offset}px`;

        this.dpr = dpr;
        this.w = w;
        this.h = h;
    }

    _setupResizeObserver() {
        this.ro = new ResizeObserver(() => this._resize());
        this.ro.observe(this.targetImg);
    }

    _random(x) {
        return ((Math.sin(x * 12.9898) * 43758.5453) % 1 + 1) % 1;
    }

    _noise2D(x, y) {
        const i = Math.floor(x), j = Math.floor(y);
        const fx = x - i, fy = y - j;
        const a = this._random(i + j * 57);
        const b = this._random(i + 1 + j * 57);
        const c = this._random(i + (j + 1) * 57);
        const d = this._random(i + 1 + (j + 1) * 57);
        const ux = fx * fx * (3 - 2 * fx);
        const uy = fy * fy * (3 - 2 * fy);
        return a*(1-ux)*(1-uy) + b*ux*(1-uy) + c*(1-ux)*uy + d*ux*uy;
    }

    _octavedNoise(x, time, seed) {
        const octaves = 10, lacunarity = 1.6, gain = 0.7;
        let y = 0, amplitude = this.chaos, frequency = 10;
        for (let i = 0; i < octaves; i++) {
            y += amplitude * this._noise2D(frequency * x + seed * 100, time * frequency * 0.3);
            frequency *= lacunarity;
            amplitude *= gain;
        }
        return y;
    }

    _getCornerPoint(cx, cy, r, startAngle, arcLen, progress) {
        const angle = startAngle + progress * arcLen;
        return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    }

    _getRoundedRectPoint(t, left, top, width, height, radius) {
        const sw = width - 2 * radius;
        const sh = height - 2 * radius;
        const ca = (Math.PI * radius) / 2;
        const total = 2 * sw + 2 * sh + 4 * ca;
        const dist = t * total;
        let acc = 0;
        if (dist <= acc + sw) return { x: left + radius + ((dist - acc) / sw) * sw, y: top };
        acc += sw;
        if (dist <= acc + ca) return this._getCornerPoint(left+width-radius, top+radius, radius, -Math.PI/2, Math.PI/2, (dist-acc)/ca);
        acc += ca;
        if (dist <= acc + sh) return { x: left+width, y: top+radius+((dist-acc)/sh)*sh };
        acc += sh;
        if (dist <= acc + ca) return this._getCornerPoint(left+width-radius, top+height-radius, radius, 0, Math.PI/2, (dist-acc)/ca);
        acc += ca;
        if (dist <= acc + sw) return { x: left+width-radius-((dist-acc)/sw)*sw, y: top+height };
        acc += sw;
        if (dist <= acc + ca) return this._getCornerPoint(left+radius, top+height-radius, radius, Math.PI/2, Math.PI/2, (dist-acc)/ca);
        acc += ca;
        if (dist <= acc + sh) return { x: left, y: top+height-radius-((dist-acc)/sh)*sh };
        acc += sh;
        return this._getCornerPoint(left+radius, top+radius, radius, Math.PI, Math.PI/2, (dist-acc)/ca);
    }

    _draw(now) {
        const ctx = this.canvas.getContext('2d');
        const delta = Math.min((now - this.lastFrameTime) / 1000, 0.05);
        this.time += delta * this.speed;
        this.lastFrameTime = now;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.scale(this.dpr, this.dpr);

        const offset = this.borderOffset;
        const bw = this.w - 2 * offset;
        const bh = this.h - 2 * offset;
        const maxR = Math.min(bw, bh) / 2;
        const radius = Math.min(this.borderRadius, maxR);
        const perim = 2 * (bw + bh) + 2 * Math.PI * radius;
        const samples = Math.floor(perim / 2);

        // Build the displaced path points once, reuse for all layers
        const points = [];
        for (let i = 0; i <= samples; i++) {
            const t = i / samples;
            const pt = this._getRoundedRectPoint(t, offset, offset, bw, bh, radius);
            const xd = this._octavedNoise(t * 8, this.time, 0) * this.displacement;
            const yd = this._octavedNoise(t * 8, this.time, 1) * this.displacement;
            points.push({ x: pt.x + xd, y: pt.y + yd });
        }

        // 3 glow layers: crisp core + soft glow + wide bloom
        const layers = [
            { blur: 'none', alpha: 1.0,  width: 1.5 },
            { blur: 'blur(3px)',  alpha: 0.55, width: 3.5 },
            { blur: 'blur(9px)',  alpha: 0.25, width: 7.0 },
        ];

        for (const layer of layers) {
            ctx.save();
            ctx.filter = layer.blur;
            ctx.strokeStyle = this.color;
            ctx.globalAlpha = layer.alpha;
            ctx.lineWidth = layer.width;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        }

        this.animationId = requestAnimationFrame(t => this._draw(t));
    }

    _start() {
        this.animationId = requestAnimationFrame(t => {
            this.lastFrameTime = t;
            this._draw(t);
        });
    }

    destroy() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.ro.disconnect();
        // Unwrap: move img back before wrapper, remove wrapper
        if (this.wrapper && this.wrapper.parentNode) {
            this.wrapper.parentNode.insertBefore(this.targetImg, this.wrapper);
            this.wrapper.parentNode.removeChild(this.wrapper);
        }
    }

    setColor(color) {
        this.color = color;
    }
}

let profileElectricBorder = null;

function initElectricBorder() {
    const profileImg = document.querySelector('.profile-image-compact');
    if (!profileImg) return;

    const accentColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent').trim() || '#3b82f6';

    profileElectricBorder = new ElectricBorder(profileImg, {
        color: accentColor,
        speed: 0.7,
        chaos: 0.09,
        borderRadius: 16,
        displacement: 10,
        borderOffset: 12,
    });
}

function updateElectricBorderColor() {
    if (!profileElectricBorder) return;
    const accentColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent').trim() || '#3b82f6';
    profileElectricBorder.setColor(accentColor);
}

// ==================== PROJECTS ====================
const projects = {
    blowlock: {
        title: "BlowLock - File Encryption App",
        hasGallery: true,
        images: [
            'public/images/blowlock/1000007458 (1).jpg',
            'public/images/blowlock/1000007459 (1).jpg',
            'public/images/blowlock/1000007460 (1).jpg',
            'public/images/blowlock/1000007461 (1).jpg',
            'public/images/blowlock/1000007462 (1).jpg',
            'public/images/blowlock/1000007463 (1).jpg',
            'public/images/blowlock/1000007464 (1).jpg',
        ],
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
            <p>Users select a file they want to encrypt, enter a secure code, and BlowLock processes the file using the Blowfish algorithm. To decrypt, users simply provide the same code, and the app restores the original file.</p>
            <h3>Technology:</h3>
            <p>Built as a mobile application implementing the Blowfish symmetric-key block cipher.</p>
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
    babatngon: {
        title: "Babatngon Explorer - Tourism & Resort Discovery Platform",
        hasGallery: true,
        images: [
            'public/images/babatngon_explorer/homepage.png',
            'public/images/babatngon_explorer/explore.png',
            'public/images/babatngon_explorer/coms.png',
            'public/images/babatngon_explorer/register.png',
            'public/images/babatngon_explorer/login.png',
            'public/images/babatngon_explorer/dashboard.png',
            'public/images/babatngon_explorer/exploreplace.png',
            'public/images/babatngon_explorer/details1.png',
            'public/images/babatngon_explorer/details2.png',
            'public/images/babatngon_explorer/loc.png',
            'public/images/babatngon_explorer/reb.png',
            'public/images/babatngon_explorer/save.png',
            'public/images/babatngon_explorer/rev.png',
        ],
        description: `
            <p><strong>Babatngon Explorer</strong> is a comprehensive web-based tourism platform designed to showcase the beautiful resorts and tourist attractions of Babatngon, Leyte. This interactive website serves as a digital guide for tourists and locals alike, making it easier to discover, explore, and plan visits to the municipality's scenic destinations.</p>
            <h3>User Features:</h3>
            <ul>
                <li><strong>User Authentication:</strong> Secure login and registration system allowing users to create personalized accounts and access exclusive features.</li>
                <li><strong>Resort Discovery:</strong> Browse through a curated collection of resorts and tourist attractions in Babatngon, Leyte with detailed information and images.</li>
                <li><strong>Bookmark System:</strong> Save your favorite resorts and attractions to your personal collection for easy access and future trip planning.</li>
                <li><strong>Review & Ratings:</strong> Share your experiences by leaving reviews and ratings for resorts you've visited, helping other travelers make informed decisions.</li>
                <li><strong>Interactive Maps:</strong> View exact locations of resorts and tourist spots using integrated Google Maps API for accurate geographical information.</li>
                <li><strong>Turn-by-Turn Directions:</strong> Get real-time navigation from your current location to any resort using Google Directions API, making travel planning seamless.</li>
            </ul>
            <h3>Key Functionalities:</h3>
            <ul>
                <li><strong>Resort Profiles:</strong> Each resort features comprehensive details including amenities, contact information, photos, and user reviews.</li>
                <li><strong>Location Services:</strong> Automatically detect your current location and calculate the best routes to your chosen destination.</li>
                <li><strong>Community Reviews:</strong> Read authentic reviews from other visitors to help plan your perfect trip to Babatngon.</li>
                <li><strong>User Dashboard:</strong> Manage your bookmarks, reviews, and account settings all in one convenient location.</li>
            </ul>
            <h3>How It Works:</h3>
            <p>Create an account or log in to start exploring. Browse through the available resorts and tourist attractions in Babatngon, Leyte. Click on any destination to view detailed information, photos, and reviews. Bookmark places you want to visit, leave reviews for places you've been, and use the integrated map feature to view locations and get step-by-step directions from your current position to your chosen resort.</p>
            <h3>Technology Stack:</h3>
            <ul>
                <li><strong>Google Maps API:</strong> For displaying interactive maps and precise location markers</li>
                <li><strong>Google Directions API:</strong> For providing real-time navigation and route planning</li>
                <li><strong>Web Technologies:</strong> Built as a responsive web application accessible from any device</li>
                <li><strong>User Authentication System:</strong> Secure login and registration for personalized user experiences</li>
            </ul>
            <h3>Purpose:</h3>
            <p>Babatngon Explorer aims to promote local tourism in Babatngon, Leyte by making it easier for visitors to discover hidden gems, plan their trips efficiently, and contribute to the local community through authentic reviews and recommendations.</p>
        `
    }
};

let modal, modalClose;
let currentProject = null;
let currentImageIndex = 0;

function openProjectModal(projectKey) {
    const project = projects[projectKey];
    if (!project) return;
    currentProject = project;
    currentImageIndex = 0;
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalDescription').innerHTML = project.description;
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

function closeProjectModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentProject = null;
}

function updateGallery() {
    if (!currentProject || !currentProject.images) return;
    document.getElementById('galleryImage').src = currentProject.images[currentImageIndex];
    const indicators = document.getElementById('galleryIndicators');
    indicators.innerHTML = '';
    currentProject.images.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'indicator-dot' + (index === currentImageIndex ? ' active' : '');
        dot.onclick = () => { currentImageIndex = index; updateGallery(); };
        indicators.appendChild(dot);
    });
}

function initModal() {
    modal = document.getElementById('projectModal');
    modalClose = document.querySelector('.modal-close');
    if (!modal || !modalClose) return;
    modalClose.onclick = closeProjectModal;
    window.onclick = function(event) {
        if (event.target === modal) closeProjectModal();
    };
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'flex') closeProjectModal();
    });
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    if (prevBtn) {
        prevBtn.onclick = function() {
            if (currentProject && currentProject.images) {
                currentImageIndex = (currentImageIndex - 1 + currentProject.images.length) % currentProject.images.length;
                updateGallery();
            }
        };
    }
    if (nextBtn) {
        nextBtn.onclick = function() {
            if (currentProject && currentProject.images) {
                currentImageIndex = (currentImageIndex + 1) % currentProject.images.length;
                updateGallery();
            }
        };
    }
}

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
        item.style.cursor = 'pointer';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    initButtons();
    initModal();
    initProjectClickHandlers();
    // Wait for image to fully render before measuring dimensions
    const profileImg = document.querySelector('.profile-image-compact');
    if (profileImg && profileImg.complete) {
        setTimeout(initElectricBorder, 100);
    } else if (profileImg) {
        profileImg.addEventListener('load', () => setTimeout(initElectricBorder, 100));
        setTimeout(initElectricBorder, 500); // fallback
    }
});