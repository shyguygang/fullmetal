// Main application script for Fullmetal Alchemist Fan Site

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const carousel = document.querySelector('.carousel');
    const carouselInner = carousel.querySelector('.carousel-inner');
    const items = carousel.querySelectorAll('.carousel-item');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('full-size-image');
    const closeBtn = document.getElementsByClassName('close')[0];
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-message');
    const chatSend = document.getElementById('chat-send');

    let currentIndex = 0;
    let intervalId;

    // Theme switching functionality
    function setTheme(theme) {
        if (theme === 'light') {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
        } else {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
        }
    }

    function toggleTheme() {
        if (body.classList.contains('dark-mode')) {
            setTheme('light');
            localStorage.setItem('theme', 'light');
        } else {
            setTheme('dark');
            localStorage.setItem('theme', 'dark');
        }
    }

    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    themeToggle.addEventListener('click', toggleTheme);

    // Carousel functionality
    // Create dots
    items.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    function rotateCarousel() {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
        resetInterval();
    }

    function updateCarousel() {
        carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function resetInterval() {
        clearInterval(intervalId);
        intervalId = setInterval(rotateCarousel, 5000);
    }

    // Initial carousel setup
    intervalId = setInterval(rotateCarousel, 5000);

    // Optional: Pause on hover
    carousel.addEventListener('mouseenter', () => clearInterval(intervalId));
    carousel.addEventListener('mouseleave', resetInterval);

    // Modal functionality for carousel images
    function openModal(imgSrc) {
        modal.style.display = 'block';
        modalImg.src = imgSrc;
    }

    // Close modal when clicking the close button
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    // Close modal when clicking outside the image
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Add click event listeners to carousel images
    carousel.addEventListener('click', function(e) {
        if (e.target.classList.contains('carousel-image')) {
            const fullSizeImage = new Image();
            fullSizeImage.src = e.target.src;
            fullSizeImage.onload = function() {
                if (this.width > 200 || this.height > 200) {
                    openModal(e.target.src);
                }
            }
        }
    });

    // View counter functionality
    function getViewCount() {
        let count = localStorage.getItem('viewCount');
        if (count === null) {
            count = 0;
        } else {
            count = parseInt(count);
        }
        count++;
        localStorage.setItem('viewCount', count);
        return count;
    }

    function animateViewCounter(finalCount) {
        const digits = document.querySelectorAll('.view-counter .digit');
        const totalDigits = digits.length;
        let currentCount = 0;

        function updateCounter() {
            if (currentCount > finalCount) {
                currentCount = finalCount;
            }

            let countString = currentCount.toString().padStart(totalDigits, '0');
            for (let i = 0; i < totalDigits; i++) {
                const digit = digits[i];
                const newValue = countString[i];
                if (digit.textContent !== newValue) {
                    animateDigit(digit, newValue);
                }
            }

            if (currentCount < finalCount) {
                currentCount = Math.min(currentCount + Math.ceil((finalCount - currentCount) / 10), finalCount);
                requestAnimationFrame(updateCounter);
            }
        }

        function animateDigit(digitElement, newValue) {
            digitElement.style.transform = 'translateY(-100%)';
            digitElement.style.opacity = '0';
            
            setTimeout(() => {
                digitElement.textContent = newValue;
                digitElement.style.transform = 'translateY(0)';
                digitElement.style.opacity = '1';
            }, 250);
        }

        updateCounter();
    }

    // Initialize view counter
    const viewCount = getViewCount();
    animateViewCounter(viewCount);

    // Chat functionality
    let username = generateUsername();
    const ws = new WebSocket(`ws://${window.location.host}`);

    function generateUsername() {
        const adjectives = ['Happy', 'Clever', 'Brave', 'Silly', 'Kind', 'Wise'];
        const nouns = ['Alchemist', 'Warrior', 'Wizard', 'Knight', 'Explorer', 'Scholar'];
        return adjectives[Math.floor(Math.random() * adjectives.length)] + 
               nouns[Math.floor(Math.random() * nouns.length)];
    }

    function addMessage(user, message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';
        messageElement.innerHTML = `<span class="chat-username">${user}:</span> ${message}`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            ws.send(JSON.stringify({ user: username, message }));
            chatInput.value = '';
        }
    }

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    ws.onmessage = function(event) {
        const data = JSON.parse(event.data);
        if (data.type === 'history') {
            data.messages.forEach(msg => addMessage(msg.user, msg.message));
        } else if (data.type === 'message') {
            addMessage(data.user, data.message);
        }
    };

    // Welcome message
    addMessage('System', `Welcome, ${username}! You can now chat with other users.`);

    // Content loading functionality
    // Content loading functionality
function loadContent(route) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = ''; // Clear existing content

    if (route === 'home') {
        // Home page content
        const homeContent = `
            <h2>Welcome to the Fullmetal Alchemist Fan Site</h2>
            <p>Explore the world of alchemy and adventure with the Elric brothers!</p>
            <h3>About Fullmetal Alchemist</h3>
            <p>Fullmetal Alchemist is a Japanese manga series written and illustrated by Hiromu Arakawa. It follows the story of two alchemist brothers, Edward and Alphonse Elric, on their journey to find the Philosopher's Stone to restore their bodies after a failed alchemical experiment.</p>
            <h3>Featured Content</h3>
            <ul>
                <li>Character profiles</li>
                <li>Alchemy explained</li>
                <li>Episode guides</li>
                <li>Fan theories and discussions</li>
            </ul>
        `;
        contentDiv.innerHTML = homeContent;
    } else if (route === 'characters') {
        contentDiv.innerHTML = '<h2>Characters</h2>';
        loadCharacters(contentDiv);
    } else {
        // Default content for other routes
        contentDiv.innerHTML = `<h2>${route.charAt(0).toUpperCase() + route.slice(1)}</h2>
                                <p>Content for ${route} page is coming soon!</p>`;
    }
}

    // Navigation handling
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const route = e.target.getAttribute('href').substr(1);
            loadContent(route);
        });
    });

    // Initial content load
    loadContent('home');
});

// Character data
const characters = [
    {
        name: "Edward Elric",
        image: "./images/ed200.avif",
        description: "The Fullmetal Alchemist, a State Alchemist and the main protagonist."
    },
    {
        name: "Alphonse Elric",
        image: "./images/al200.avif",
        description: "Edward's younger brother, whose soul is bound to a suit of armor."
    },
    {
        name: "Roy Mustang",
        image: "./images/mustang200.jpg",
        description: "The Flame Alchemist, a State Alchemist and Edward's superior officer."
    },
    // Additional characters can be added here
];

// Function to load character data
function loadCharacters(contentDiv) {
    const charactersGrid = document.createElement('div');
    charactersGrid.className = 'characters-grid';

    characters.forEach(character => {
        const characterCard = createCharacterCard(character);
        charactersGrid.appendChild(characterCard);
    });

    contentDiv.appendChild(charactersGrid);
}

// Function to create individual character cards
function createCharacterCard(character) {
    const card = document.createElement('div');
    card.className = 'character-card';

    const image = document.createElement('img');
    image.src = character.image;
    image.alt = character.name;
    image.loading = 'lazy';

    const name = document.createElement('h3');
    name.textContent = character.name;

    const description = document.createElement('p');
    description.textContent = character.description;

    card.appendChild(image);
    card.appendChild(name);
    card.appendChild(description);

    return card;
}