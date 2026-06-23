class DisplayRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // 1. Slightly smaller cards so 4 full rows fit inside the 600px canvas
        this.cardWidth = 90;
        this.cardHeight = 125;
        this.padding = 15;

        // Load the university logo
        this.cardBackImage = new Image();
        this.cardBackImage.src = 'arel_logo.jpeg'; 
    }

    render(gameManager) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (!gameManager.board || !gameManager.board.cards) return;

        const cards = gameManager.board.cards;
        
        // 2. Lock the grid to exactly 4 columns. 
        // Lvl 1 (8 cards) = 4x2. Lvl 2 (12 cards) = 4x3. Lvl 3 (16 cards) = 4x4.
        const cols = 4; 
        
        const gridWidth = (cols * this.cardWidth) + ((cols - 1) * this.padding);
        const startX = (this.canvas.width - gridWidth) / 2;
        const startY = 40; // Shifted the entire grid up slightly 

        cards.forEach((card, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);

            card.x = startX + col * (this.cardWidth + this.padding);
            card.y = startY + row * (this.cardHeight + this.padding);
            card.width = this.cardWidth;
            card.height = this.cardHeight;

            this.drawCard(card);
        });
    }

    drawCard(card) {
        const targetProgress = card.isFlipped ? 1 : 0;
        card.animProgress += (targetProgress - card.animProgress) * 0.15; 
        
        let scaleX = Math.cos(card.animProgress * Math.PI); 
        
        this.ctx.save();
        
        const centerX = card.x + this.cardWidth / 2;
        const centerY = card.y + this.cardHeight / 2;
        this.ctx.translate(centerX, centerY);
        this.ctx.scale(Math.abs(scaleX), 1); 
        this.ctx.translate(-centerX, -centerY); 
        
        if (card.animProgress > 0.5) {
            // Revealed State
            this.ctx.fillStyle = card.isMatched ? '#1e3c66' : '#3868a6'; 
            this.ctx.fillRect(card.x, card.y, this.cardWidth, this.cardHeight);
            
            this.ctx.strokeStyle = '#ffd13b';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(card.x, card.y, this.cardWidth, this.cardHeight);

            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 45px Nunito, sans-serif'; // Reduced font size to fit smaller card
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(card.symbol, card.x + this.cardWidth / 2, card.y + (this.cardHeight / 2) + 5);
        } else {
            // Hidden State (Logo side)
            this.ctx.fillStyle = '#ffffff'; 
            this.ctx.fillRect(card.x, card.y, this.cardWidth, this.cardHeight);
            
            this.ctx.strokeStyle = '#3868a6'; 
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(card.x, card.y, this.cardWidth, this.cardHeight);

            if (this.cardBackImage && this.cardBackImage.complete) {
                const imgSize = 70; // Reduced logo size to fit smaller card
                const imgX = card.x + (this.cardWidth - imgSize) / 2;
                const imgY = card.y + (this.cardHeight - imgSize) / 2;
                this.ctx.drawImage(this.cardBackImage, imgX, imgY, imgSize, imgSize);
            }
        }
        
        this.ctx.restore();
    }

    handleMouseClick(event, gameManager) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (!gameManager.board || !gameManager.board.cards) return;

        for (let card of gameManager.board.cards) {
            if (mouseX >= card.x && mouseX <= card.x + card.width &&
                mouseY >= card.y && mouseY <= card.y + card.height) {
                gameManager.handleCardClick(card);
                break; 
            }
        }
    }
}