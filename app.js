// DSCPL - Spiritual Assistant App
class DSCPLApp {
    constructor() {
        this.currentScreen = 'loading';
        this.selectedCategory = null;
        this.selectedTopic = null;
        this.selectedLength = 7;
        this.currentDay = 1;
        this.userProgress = {
            programsCompleted: 0,
            daysActive: 0,
            currentStreak: 0
        };
        this.chatMessages = [];
        this.breathingTimer = null;
        this.breathingState = 'inhale';
        this.breathingCount = 0;
        
        this.initializeApp();
    }
    
    initializeApp() {
        this.loadUserData();
        this.setupEventListeners();
        this.loadInitialScreen();
    }
    
    loadUserData() {
        const savedProgress = localStorage.getItem('dscpl_progress');
        if (savedProgress) {
            this.userProgress = JSON.parse(savedProgress);
        }
        
        const savedPreferences = localStorage.getItem('dscpl_preferences');
        if (savedPreferences) {
            const prefs = JSON.parse(savedPreferences);
            document.getElementById('morning-notifications').checked = prefs.morningNotifications;
            document.getElementById('evening-notifications').checked = prefs.eveningNotifications;
            document.getElementById('bible-translation').value = prefs.bibleTranslation;
        }
    }
    
    saveUserData() {
        localStorage.setItem('dscpl_progress', JSON.stringify(this.userProgress));
        
        const preferences = {
            morningNotifications: document.getElementById('morning-notifications').checked,
            eveningNotifications: document.getElementById('evening-notifications').checked,
            bibleTranslation: document.getElementById('bible-translation').value
        };
        localStorage.setItem('dscpl_preferences', JSON.stringify(preferences));
    }
    
    setupEventListeners() {
        // Category selection
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectedCategory = card.dataset.category;
                if (this.selectedCategory === 'chat') {
                    this.showScreen('chat');
                } else {
                    this.showTopicSelection();
                }
            });
        });
        
        // Program length selection
        document.querySelectorAll('.length-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.length-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedLength = parseInt(btn.dataset.length);
            });
        });
        
        // Chat input
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Settings
        document.getElementById('morning-notifications').addEventListener('change', this.saveUserData.bind(this));
        document.getElementById('evening-notifications').addEventListener('change', this.saveUserData.bind(this));
        document.getElementById('bible-translation').addEventListener('change', this.saveUserData.bind(this));
    }
    
    loadInitialScreen() {
        // Simulate loading
        setTimeout(() => {
            this.showScreen('welcome');
        }, 2000);
    }
    
    showScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        document.getElementById(`${screenName}-screen`).classList.add('active');
        this.currentScreen = screenName;
        
        // Update bottom navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        if (screenName === 'welcome') {
            document.querySelector('.nav-item[onclick="goToHome()"]').classList.add('active');
        } else if (screenName === 'chat') {
            document.querySelector('.nav-item[onclick="goToChat()"]').classList.add('active');
        } else if (screenName === 'settings') {
            document.querySelector('.nav-item[onclick="goToSettings()"]').classList.add('active');
        }
    }
    
    showTopicSelection() {
        const topicGrid = document.getElementById('topic-grid');
        const topicTitle = document.getElementById('topic-title');
        
        let topics = [];
        let title = '';
        
        switch (this.selectedCategory) {
            case 'devotion':
                topics = window.appData.devotional_topics;
                title = 'Choose Your Devotion Focus';
                break;
            case 'prayer':
                topics = window.appData.prayer_topics;
                title = 'Select Your Prayer Focus';
                break;
            case 'meditation':
                topics = window.appData.meditation_topics;
                title = 'Choose Your Meditation Focus';
                break;
            case 'accountability':
                topics = window.appData.accountability_areas;
                title = 'Select Your Accountability Area';
                break;
        }
        
        topicTitle.textContent = title;
        topicGrid.innerHTML = '';
        
        topics.forEach(topic => {
            const button = document.createElement('button');
            button.className = 'topic-btn';
            button.textContent = topic;
            button.addEventListener('click', () => {
                this.selectedTopic = topic;
                this.showOverview();
            });
            topicGrid.appendChild(button);
        });
        
        this.showScreen('topic');
    }
    
    showOverview() {
        const goalText = document.getElementById('program-goal-text');
        
        let goal = '';
        switch (this.selectedCategory) {
            case 'devotion':
                goal = `By the end of this ${this.selectedLength}-day program, you will have a deeper understanding of God's Word and feel more connected to His presence in your daily life.`;
                break;
            case 'prayer':
                goal = `Through this ${this.selectedLength}-day prayer journey, you will develop a stronger prayer life and experience God's peace and guidance more clearly.`;
                break;
            case 'meditation':
                goal = `After ${this.selectedLength} days of meditation, you will feel more centered, peaceful, and aware of God's presence in your life.`;
                break;
            case 'accountability':
                goal = `This ${this.selectedLength}-day accountability program will help you overcome challenges and walk in freedom through God's strength.`;
                break;
        }
        
        goalText.textContent = goal;
        this.showScreen('overview');
    }
    
    startProgram() {
        this.currentDay = 1;
        this.generateDailyContent();
        this.showScreen('content');
    }
    
    generateDailyContent() {
        const contentBody = document.getElementById('content-body');
        const contentTitle = document.getElementById('content-title');
        
        contentTitle.textContent = `Day ${this.currentDay} - ${this.selectedTopic}`;
        
        switch (this.selectedCategory) {
            case 'devotion':
                contentBody.innerHTML = this.generateDevotionContent();
                break;
            case 'prayer':
                contentBody.innerHTML = this.generatePrayerContent();
                break;
            case 'meditation':
                contentBody.innerHTML = this.generateMeditationContent();
                break;
            case 'accountability':
                contentBody.innerHTML = this.generateAccountabilityContent();
                break;
        }
    }
    
    generateDevotionContent() {
        const verse = this.getRandomVerse();
        const prayer = this.generatePrayer();
        const declaration = this.getRandomDeclaration();
        
        return `
            <div class="content-section fade-in">
                <h3>📖 Today's Scripture</h3>
                <div class="scripture-verse">
                    ${verse.text}
                    <span class="scripture-reference">${verse.reference}</span>
                </div>
            </div>
            
            <div class="content-section fade-in">
                <h3>🙏 Prayer</h3>
                <div class="prayer-text">${prayer}</div>
            </div>
            
            <div class="content-section fade-in">
                <h3>💪 Faith Declaration</h3>
                <div class="declaration-text">${declaration}</div>
            </div>
            
            <div class="content-section fade-in">
                <h3>🎥 Recommended Video</h3>
                <div class="video-recommendation">
                    <div class="video-thumbnail">
                        ▶️ Video: "${this.selectedTopic} - Day ${this.currentDay}"
                    </div>
                    <p>Watch this inspiring message about ${this.selectedTopic.toLowerCase()} and how God's Word applies to your life today.</p>
                </div>
            </div>
            
            <div class="content-section">
                <button class="btn btn--primary btn--full-width" onclick="app.completeDay()">
                    Complete Day ${this.currentDay}
                </button>
            </div>
        `;
    }
    
    generatePrayerContent() {
        const verse = this.getRandomVerse();
        const acts = window.appData.acts_prayer_structure;
        
        return `
            <div class="content-section fade-in">
                <h3>📖 Scripture Foundation</h3>
                <div class="scripture-verse">
                    ${verse.text}
                    <span class="scripture-reference">${verse.reference}</span>
                </div>
            </div>
            
            <div class="content-section fade-in">
                <h3>🙏 ACTS Prayer Model</h3>
                <div class="acts-section">
                    <h4>A - Adoration</h4>
                    <p>${acts.adoration}</p>
                    <p><em>Spend time praising God for His character and attributes.</em></p>
                </div>
                
                <div class="acts-section">
                    <h4>C - Confession</h4>
                    <p>${acts.confession}</p>
                    <p><em>Honestly confess any sins or shortcomings to God.</em></p>
                </div>
                
                <div class="acts-section">
                    <h4>T - Thanksgiving</h4>
                    <p>${acts.thanksgiving}</p>
                    <p><em>Thank God for His blessings and provision in your life.</em></p>
                </div>
                
                <div class="acts-section">
                    <h4>S - Supplication</h4>
                    <p>${acts.supplication}</p>
                    <p><em>Bring your requests and the needs of others to God.</em></p>
                </div>
            </div>
            
            <div class="content-section fade-in">
                <h3>🎯 Today's Prayer Focus</h3>
                <div class="prayer-text">
                    Focus your prayers today on ${this.selectedTopic.toLowerCase()}. 
                    Ask God for wisdom, strength, and guidance in this area of your life.
                </div>
            </div>
            
            <div class="content-section">
                <button class="btn btn--primary btn--full-width" onclick="app.completeDay()">
                    Complete Day ${this.currentDay}
                </button>
            </div>
        `;
    }
    
    generateMeditationContent() {
        const verse = this.getRandomVerse();
        
        return `
            <div class="content-section fade-in">
                <h3>📖 Meditation Scripture</h3>
                <div class="scripture-verse">
                    ${verse.text}
                    <span class="scripture-reference">${verse.reference}</span>
                </div>
            </div>
            
            <div class="content-section fade-in">
                <h3>🧘 Meditation Prompts</h3>
                <div class="prayer-text">
                    <p><strong>Reflect on these questions:</strong></p>
                    <ul>
                        <li>What does this scripture reveal about God's character?</li>
                        <li>How does this truth apply to my current situation?</li>
                        <li>How can I live out this truth today?</li>
                        <li>What is God speaking to my heart through this verse?</li>
                    </ul>
                </div>
            </div>
            
            <div class="content-section fade-in">
                <h3>🌬️ Breathing Guide</h3>
                <div class="breathing-guide">
                    <div class="breathing-circle"></div>
                    <div class="breathing-counter" id="breathing-counter">4</div>
                    <div class="breathing-instruction" id="breathing-instruction">Get Ready</div>
                    <div class="breathing-controls">
                        <button class="btn btn--secondary" onclick="app.startBreathing()">Start</button>
                        <button class="btn btn--outline" onclick="app.stopBreathing()">Stop</button>
                    </div>
                </div>
            </div>
            
            <div class="content-section">
                <button class="btn btn--primary btn--full-width" onclick="app.completeDay()">
                    Complete Day ${this.currentDay}
                </button>
            </div>
        `;
    }
    
    generateAccountabilityContent() {
        const verse = this.getRandomVerse();
        const declaration = this.getRandomDeclaration();
        
        return `
            <div class="content-section fade-in">
                <h3>💪 Scripture for Strength</h3>
                <div class="scripture-verse">
                    ${verse.text}
                    <span class="scripture-reference">${verse.reference}</span>
                </div>
            </div>
            
            <div class="content-section fade-in">
                <h3>✨ Truth Declaration</h3>
                <div class="declaration-text">${declaration}</div>
            </div>
            
            <div class="content-section fade-in">
                <h3>🔄 Alternative Actions</h3>
                <div class="prayer-text">
                    <p><strong>Instead of giving in to temptation, try:</strong></p>
                    <ul>
                        <li>Take 10 deep breaths and pray</li>
                        <li>Read this scripture aloud 3 times</li>
                        <li>Call a trusted friend or mentor</li>
                        <li>Go for a walk and listen to worship music</li>
                        <li>Journal about your feelings and God's truth</li>
                    </ul>
                </div>
            </div>
            
            <div class="content-section fade-in">
                <h3>🚨 Emergency Support</h3>
                <div class="prayer-text">
                    <p>If you're struggling right now, click the SOS button in the top right corner for immediate support and encouragement.</p>
                </div>
            </div>
            
            <div class="content-section">
                <button class="btn btn--primary btn--full-width" onclick="app.completeDay()">
                    Complete Day ${this.currentDay}
                </button>
            </div>
        `;
    }
    
    getRandomVerse() {
        const categories = ['anxiety', 'stress', 'strength'];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const verses = window.appData.bible_verses[randomCategory];
        return verses[Math.floor(Math.random() * verses.length)];
    }
    
    generatePrayer() {
        const prayers = [
            "Lord, help me to trust in Your perfect timing and plan for my life. Give me peace in the midst of uncertainty.",
            "Heavenly Father, I surrender my worries and anxieties to You. Fill me with Your peace that surpasses understanding.",
            "God, grant me the strength to face today's challenges with faith and confidence in Your love.",
            "Lord Jesus, help me to see myself through Your eyes and to walk in the freedom You've given me.",
            "Father, guide my steps today and help me to be a light for others who need encouragement."
        ];
        return prayers[Math.floor(Math.random() * prayers.length)];
    }
    
    getRandomDeclaration() {
        const declarations = window.appData.spiritual_declarations;
        return declarations[Math.floor(Math.random() * declarations.length)];
    }
    
    completeDay() {
        this.currentDay++;
        this.userProgress.daysActive++;
        this.userProgress.currentStreak++;
        
        if (this.currentDay > this.selectedLength) {
            this.userProgress.programsCompleted++;
            this.showCompletionMessage();
        } else {
            this.generateDailyContent();
        }
        
        this.saveUserData();
        this.updateProgressDisplay();
    }
    
    showCompletionMessage() {
        const contentBody = document.getElementById('content-body');
        const contentTitle = document.getElementById('content-title');
        
        contentTitle.textContent = 'Program Complete! 🎉';
        contentBody.innerHTML = `
            <div class="content-section fade-in">
                <h3>🎊 Congratulations!</h3>
                <div class="prayer-text">
                    <p>You have successfully completed your ${this.selectedLength}-day ${this.selectedCategory} program focused on ${this.selectedTopic}!</p>
                    <p>God has been working in your life through this journey. Take a moment to reflect on how He has grown you and the insights you've gained.</p>
                </div>
            </div>
            
            <div class="content-section fade-in">
                <h3>📊 Your Progress</h3>
                <div class="progress-stats">
                    <div class="stat-item">
                        <span class="stat-label">Programs Completed</span>
                        <span class="stat-value">${this.userProgress.programsCompleted}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Days Active</span>
                        <span class="stat-value">${this.userProgress.daysActive}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Current Streak</span>
                        <span class="stat-value">${this.userProgress.currentStreak}</span>
                    </div>
                </div>
            </div>
            
            <div class="content-section">
                <button class="btn btn--primary btn--full-width" onclick="app.goToHome()">
                    Start New Program
                </button>
            </div>
        `;
    }
    
    startBreathing() {
        this.breathingState = 'inhale';
        this.breathingCount = 4;
        this.updateBreathingDisplay();
        
        this.breathingTimer = setInterval(() => {
            this.breathingCount--;
            
            if (this.breathingCount <= 0) {
                switch (this.breathingState) {
                    case 'inhale':
                        this.breathingState = 'hold';
                        this.breathingCount = 4;
                        break;
                    case 'hold':
                        this.breathingState = 'exhale';
                        this.breathingCount = 4;
                        break;
                    case 'exhale':
                        this.breathingState = 'inhale';
                        this.breathingCount = 4;
                        break;
                }
            }
            
            this.updateBreathingDisplay();
        }, 1000);
    }
    
    stopBreathing() {
        if (this.breathingTimer) {
            clearInterval(this.breathingTimer);
            this.breathingTimer = null;
        }
        
        document.getElementById('breathing-counter').textContent = '4';
        document.getElementById('breathing-instruction').textContent = 'Get Ready';
    }
    
    updateBreathingDisplay() {
        const counter = document.getElementById('breathing-counter');
        const instruction = document.getElementById('breathing-instruction');
        
        if (counter) counter.textContent = this.breathingCount;
        if (instruction) {
            const instructions = {
                'inhale': 'Breathe In',
                'hold': 'Hold',
                'exhale': 'Breathe Out'
            };
            instruction.textContent = instructions[this.breathingState];
        }
    }
    
    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (message) {
            this.addMessage(message, 'user');
            input.value = '';
            
            // Simulate AI response
            setTimeout(() => {
                const response = this.generateAIResponse(message);
                this.addMessage(response, 'bot');
            }, 1000);
        }
    }
    
    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    generateAIResponse(userMessage) {
        const responses = [
            "I understand you're going through something challenging. Remember that God is with you in every situation. Would you like to pray together about this?",
            "That's a great question. In times like these, I find that turning to Scripture can provide comfort and guidance. Let me share a verse that might help.",
            "I can hear the concern in your message. God sees your heart and knows your needs. He promises to never leave you nor forsake you.",
            "Thank you for sharing that with me. It takes courage to be vulnerable. How can we invite God into this situation?",
            "I'm glad you're seeking spiritual guidance. This shows your heart is open to God's leading. What would you like to focus our conversation on?",
            "That's something many people struggle with. You're not alone in this. God's grace is sufficient for every challenge we face."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    showSOS() {
        const modal = document.getElementById('sos-modal');
        const scriptureText = document.getElementById('sos-scripture-text');
        const declarationText = document.getElementById('sos-declaration-text');
        
        const verse = this.getRandomVerse();
        const declaration = this.getRandomDeclaration();
        
        scriptureText.innerHTML = `${verse.text}<br><br><em>- ${verse.reference}</em>`;
        declarationText.textContent = declaration;
        
        modal.classList.add('active');
    }
    
    closeSOS() {
        document.getElementById('sos-modal').classList.remove('active');
    }
    
    updateProgressDisplay() {
        const elements = {
            'programs-completed': this.userProgress.programsCompleted,
            'days-active': this.userProgress.daysActive,
            'current-streak': this.userProgress.currentStreak
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }
    
    goToHome() {
        this.selectedCategory = null;
        this.selectedTopic = null;
        this.showScreen('welcome');
    }
    
    goToChat() {
        this.showScreen('chat');
    }
    
    goToSettings() {
        this.updateProgressDisplay();
        this.showScreen('settings');
    }
    
    goBack() {
        if (this.currentScreen === 'topic') {
            this.showScreen('welcome');
        } else if (this.currentScreen === 'overview') {
            this.showTopicSelection();
        }
    }
}

// Application data
window.appData = {
    "bible_verses": {
        "anxiety": [
            {
                "reference": "Philippians 4:6-7",
                "text": "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus."
            },
            {
                "reference": "1 Peter 5:7",
                "text": "Cast all your anxiety on him, because he cares for you."
            },
            {
                "reference": "Isaiah 41:10",
                "text": "Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you, I will uphold you with my righteous right hand."
            }
        ],
        "stress": [
            {
                "reference": "Matthew 11:28-29",
                "text": "Come to me, all who labor and are heavy laden, and I will give you rest. Take my yoke upon you, and learn from me, for I am gentle and lowly in heart, and you will find rest for your souls."
            },
            {
                "reference": "Psalm 55:22",
                "text": "Cast your burden on the Lord, and he will sustain you; he will never permit the righteous to be moved."
            }
        ],
        "strength": [
            {
                "reference": "Isaiah 40:31",
                "text": "But they who wait for the Lord shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint."
            },
            {
                "reference": "Psalm 46:1",
                "text": "God is our refuge and strength, a very present help in trouble."
            }
        ]
    },
    "devotional_topics": [
        "Dealing with Stress",
        "Overcoming Fear",
        "Conquering Depression",
        "Relationships",
        "Healing",
        "Purpose & Calling",
        "Anxiety",
        "Something else..."
    ],
    "prayer_topics": [
        "Personal Growth",
        "Healing",
        "Family/Friends",
        "Forgiveness",
        "Finances",
        "Work/Career",
        "Something else..."
    ],
    "meditation_topics": [
        "Peace",
        "God's Presence",
        "Strength",
        "Wisdom",
        "Faith",
        "Something else..."
    ],
    "accountability_areas": [
        "Pornography",
        "Alcohol",
        "Drugs",
        "Sex",
        "Addiction",
        "Laziness",
        "Something else..."
    ],
    "acts_prayer_structure": {
        "adoration": "Praise and worship God for who He is",
        "confession": "Confess sins and seek forgiveness",
        "thanksgiving": "Thank God for His blessings and provision",
        "supplication": "Make requests and petitions to God"
    },
    "spiritual_declarations": [
        "I am not a slave to temptation; I am free in Christ",
        "God is my refuge, and I will not be shaken",
        "I can do all things through Christ who strengthens me",
        "The Lord is my shepherd; I shall not want",
        "God's love for me is unconditional and everlasting",
        "I am fearfully and wonderfully made by God",
        "God's grace is sufficient for me in all circumstances"
    ]
};

// Global functions for onclick handlers
function goBack() {
    window.app.goBack();
}

function goToHome() {
    window.app.goToHome();
}

function goToChat() {
    window.app.goToChat();
}

function goToSettings() {
    window.app.goToSettings();
}

function startProgram() {
    window.app.startProgram();
}

function sendMessage() {
    window.app.sendMessage();
}

function showSOS() {
    window.app.showSOS();
}

function closeSOS() {
    window.app.closeSOS();
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.app = new DSCPLApp();
});

// Service Worker registration for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Mock API call for SocialVerse integration
async function fetchSocialVersePosts() {
    try {
        const response = await fetch('https://api.socialverseapp.com/posts/summary/get?page=1&page_size=1000', {
            headers: {
                'Flic-Token': 'flic_b1c6b09d98e2d4884f61b9b3131dbb27a6af84788e4a25db067a22008ea9cce5'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log('API call failed, using mock data');
    }
    
    // Return mock data if API fails
    return {
        posts: [
            {
                id: 1,
                title: "Finding Peace in God's Presence",
                content: "In the midst of life's storms, God remains our anchor...",
                category: "meditation"
            },
            {
                id: 2,
                title: "Overcoming Fear with Faith",
                content: "Fear whispers lies, but faith speaks truth...",
                category: "devotion"
            }
        ]
    };
}

// Notification system (mock implementation)
function scheduleNotifications() {
    if ('Notification' in window) {
        Notification.requestPermission().then(function(permission) {
            if (permission === 'granted') {
                console.log('Notification permission granted');
                // Schedule daily notifications
                scheduleDaily();
            }
        });
    }
}

function scheduleDaily() {
    // Mock implementation - in a real app, this would use proper scheduling
    console.log('Daily notifications scheduled');
}

// Initialize notifications
scheduleNotifications();