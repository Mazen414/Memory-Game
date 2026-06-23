const gameManager = new GameManager();
const displayRenderer = new DisplayRenderer('gameCanvas');

// SAFETY CHECK: We wrap this in a try-catch. 
// If you deleted SignalFilter.js during the theme change, this prevents the game from crashing!
let signalFilter = null;
try {
    if (typeof SignalFilter !== 'undefined') {
        signalFilter = new SignalFilter('gameCanvas');
    }
} catch (e) {
    console.warn("SignalFilter is missing. Graphics effects will be skipped.");
}

const startMenu = document.getElementById('start-menu');
const gameUI = document.getElementById('game-ui');
const startButton = document.getElementById('btn-start');
const themeButtons = document.querySelectorAll('.theme-btn');

let selectedTheme = 'animals';

// Handle Theme Selection highlighting
if (themeButtons.length > 0) {
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            themeButtons.forEach(b => b.classList.remove('active'));
            // Add active class to the clicked one
            btn.classList.add('active');
            
            // Save the chosen theme
            selectedTheme = btn.getAttribute('data-theme');
        });
    });
}

// Handle the Help (?) Button Modal
const btnHelp = document.getElementById('btn-help');
const rulesModal = document.getElementById('rules-modal');
const closeRules = document.getElementById('close-rules');

if (btnHelp && rulesModal && closeRules) {
    btnHelp.addEventListener('click', () => {
        rulesModal.classList.remove('hidden');
    });
    closeRules.addEventListener('click', () => {
        rulesModal.classList.add('hidden');
    });
}

// Custom Animation Function for the "+5" Timer Boost
function showTimeBoostAnimation() {
    const timerSpan = document.getElementById('ui-timer');
    if (!timerSpan) return;

    // Create a temporary span element
    const plusFive = document.createElement('span');
    plusFive.innerText = '+5';
    
    // Style it to look like bold, floating green text
    plusFive.style.color = '#28a745'; 
    plusFive.style.fontWeight = '900';
    plusFive.style.position = 'absolute';
    plusFive.style.marginLeft = '8px';
    plusFive.style.fontSize = '1.2rem';
    plusFive.style.transition = 'all 0.8s ease-out';
    plusFive.style.opacity = '1';
    plusFive.style.transform = 'translateY(0)';
    plusFive.style.textShadow = '0px 2px 4px rgba(0,0,0,0.3)';

    // Attach it right next to the timer
    timerSpan.parentNode.appendChild(plusFive);
    timerSpan.parentNode.style.position = 'relative'; // Ensure absolute positioning works

    // Trigger the animation to float up and fade out
    requestAnimationFrame(() => {
        plusFive.style.transform = 'translateY(-25px)';
        plusFive.style.opacity = '0';
    });

    // Clean it up from the HTML after the animation finishes
    setTimeout(() => {
        if (plusFive.parentNode) {
            plusFive.remove();
        }
    }, 800);
}

// Handle the Time Boost Button
const btnTimeBoost = document.getElementById('btn-time-boost');
if (btnTimeBoost) {
    btnTimeBoost.addEventListener('click', () => {
        // Only trigger if it hasn't been used and the game is active
        if (!gameManager.timeBoostUsed && gameManager.timeLeft > 0 && !gameManager.isLocked) {
            gameManager.useTimeBoost();
            
            // 1. Visually disable the button (turn it gray)
            btnTimeBoost.classList.replace('btn-success', 'btn-secondary');
            btnTimeBoost.disabled = true;

            // 2. Play the floating +5 animation
            showTimeBoostAnimation();
        }
    });
}

// Handle Start Game
if (startButton) {
    startButton.addEventListener('click', () => {
        // Get the name the player typed in, or use 'Anonymous' if they left it blank
        const playerNameInput = document.getElementById('player-name');
        let pName = playerNameInput.value.trim();
        if (pName === "") pName = "Anonymous";

        // Hide the start menu
        startMenu.classList.add('hidden');
        
        // Show the game canvas and score board
        gameUI.classList.remove('hidden');
        
        // Pass BOTH the theme and the player name into the game manager
        gameManager.startGame(selectedTheme, pName);
    });
}

// Handle the "Play Again" button on the Leaderboard
const btnPlayAgain = document.getElementById('btn-play-again');
if (btnPlayAgain) {
    btnPlayAgain.addEventListener('click', () => {
        location.reload(); // Restarts the application
    });
}
// Handle Canvas Clicks
const canvas = document.getElementById('gameCanvas');
if (canvas) {
    canvas.addEventListener('click', (event) => {
        displayRenderer.handleMouseClick(event, gameManager);
    });
}

// The Main Render Loop
function gameLoop() {
    // Only draw the game if the menu is hidden
    if (!startMenu.classList.contains('hidden')) {
        requestAnimationFrame(gameLoop);
        return;
    }

    displayRenderer.render(gameManager);
    
    // Only apply the glitch/shimmer effects if the filter actually exists
    if (signalFilter) {
        signalFilter.applyEffects(gameManager);
    }

    // Update UI text safely
    const uiLevel = document.getElementById('ui-level');
    const uiScore = document.getElementById('ui-score');
    const uiTimer = document.getElementById('ui-timer');
    
    if (uiLevel) uiLevel.innerText = gameManager.currentLevel;
    if (uiScore) uiScore.innerText = gameManager.score;
    if (uiTimer) uiTimer.innerText = gameManager.timeLeft;

    // Check if moving to a new level and reset the Boost Button visually
    if (btnTimeBoost) {
        const uiBoost = document.getElementById('ui-boost');
        if (uiBoost) uiBoost.innerText = gameManager.timeBoostUsed ? "0" : "1";
        
        // If the boost is available again but the button is still disabled, reset it to green
        if (!gameManager.timeBoostUsed && btnTimeBoost.disabled) {
            btnTimeBoost.classList.replace('btn-secondary', 'btn-success');
            btnTimeBoost.disabled = false;
        }
    }

    requestAnimationFrame(gameLoop);
}

// Start the continuous rendering loop
requestAnimationFrame(gameLoop);