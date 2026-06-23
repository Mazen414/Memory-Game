class GameManager {
    constructor() {
        this.currentLevel = 1;
        this.score = 0;
        this.flippedCards = [];
        this.isLocked = false;
        this.totalMatchesNeeded = 0;
        this.currentMatches = 0;
        this.board = null;
        this.currentTheme = 'animals'; 
        
        this.timeLeft = 0;
        this.timerInterval = null;
        this.timeBoostUsed = false;

        // NEW: Store player data
        this.playerName = 'Anonymous';
    }

    startGame(theme, playerName) {
        this.score = 0;
        this.currentLevel = 1;
        this.currentTheme = theme; 
        this.playerName = playerName; // Save the name typed in the menu
        this.loadLevel();
    }

    loadLevel() {
        this.flippedCards = [];
        this.isLocked = false;
        this.currentMatches = 0;
        this.timeBoostUsed = false; 
        
        this.totalMatchesNeeded = Math.min(2 + (this.currentLevel * 2), 8); 
        this.board = new CardGrid(this.totalMatchesNeeded, this.currentTheme);

        this.timeLeft = 30 + (this.currentLevel * 5);
        this.startTimer();
    }

    startTimer() {
        clearInterval(this.timerInterval); 
        this.timerInterval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
            } else {
                this.handleGameOver();
            }
        }, 1000); 
    }

    handleGameOver() {
        clearInterval(this.timerInterval);
        this.isLocked = true;
        
        // Generate a random 4-digit ID for the player
        const playerId = Math.floor(1000 + Math.random() * 9000);
        
        // Save to browser storage
        this.saveScore(this.playerName, playerId, this.score);
        
        // Show the leaderboard UI instead of the old alert()
        this.showLeaderboard();
    }

    saveScore(name, id, score) {
        // 1. Get the existing list from storage (or create an empty array)
        let leaderboard = JSON.parse(localStorage.getItem('memoryGameLeaderboard')) || [];
        
        // 2. Add the new game data
        leaderboard.push({ name, id, score });
        
        // 3. Sort the array from highest score to lowest score
        leaderboard.sort((a, b) => b.score - a.score);
        
        // 4. Slice the array so it ONLY keeps the top 10
        leaderboard = leaderboard.slice(0, 10);
        
        // 5. Save the updated top 10 back to storage
        localStorage.setItem('memoryGameLeaderboard', JSON.stringify(leaderboard));
    }

   showLeaderboard() {
        const modal = document.getElementById('leaderboard-modal');
        const tbody = document.getElementById('leaderboard-body');
        
        // 1. Grab the menu and game UI containers
        const startMenu = document.getElementById('start-menu');
        const gameUI = document.getElementById('game-ui');

        if (!modal || !tbody) return;

        // 2. Hide the game board and bring back the menu wrapper!
        if (gameUI) gameUI.classList.add('hidden');
        if (startMenu) startMenu.classList.remove('hidden');

        // Fetch the newly updated top 10
        let leaderboard = JSON.parse(localStorage.getItem('memoryGameLeaderboard')) || [];
        tbody.innerHTML = '';

        // Build the HTML table rows
        leaderboard.forEach((entry, index) => {
            // Highlight the row if it's the current player's recent game
            const highlight = (entry.name === this.playerName && entry.score === this.score) ? 'class="table-active text-warning"' : '';
            
            const row = `<tr ${highlight}>
                <td>${index + 1}</td>
                <td>${entry.name}</td>
                <td>#${entry.id}</td>
                <td>${entry.score}</td>
            </tr>`;
            tbody.innerHTML += row;
        });

        // Show the popup
        modal.classList.remove('hidden');
    }

    useTimeBoost() {
        if (this.timeBoostUsed || this.timeLeft <= 0 || this.isLocked) return;
        this.timeBoostUsed = true;
        this.timeLeft += 5;
    }

    handleCardClick(clickedCard) {
        if (this.isLocked || clickedCard.isFlipped || clickedCard.isMatched) return;

        clickedCard.flip(); 
        this.flippedCards.push(clickedCard);

        if (this.flippedCards.length === 2) {
            this.isLocked = true;
            this.checkForMatch();
        }
    }

    checkForMatch() {
        const card1 = this.flippedCards[0];
        const card2 = this.flippedCards[1];

        if (card1.symbol === card2.symbol) {
            this.score += (100 * this.currentLevel); 
            this.currentMatches++;
            card1.match();
            card2.match();
            this.resetTurn();
            this.checkWinCondition();
        } else {
            this.score = Math.max(0, this.score - 10);
            setTimeout(() => {
                card1.unflip();
                card2.unflip();
                this.resetTurn();
            }, 800);
        }
    }

    resetTurn() {
        this.flippedCards = [];
        this.isLocked = false;
    }

    checkWinCondition() {
        if (this.currentMatches === this.totalMatchesNeeded) {
            clearInterval(this.timerInterval); 
            this.score += (this.timeLeft * 10); 
            this.currentLevel++;
            setTimeout(() => {
                this.loadLevel();
            }, 1000);
        }
    }
}