class SignalFilter {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // We track time to animate the reflection moving across the cards
        this.frameCount = 0; 
    }

   applyEffects(gameManager) {
        if (!gameManager.board || !gameManager.board.cards) return;

        // Move the animation forward slightly every frame
        this.frameCount += 1.5; 

        gameManager.board.cards.forEach(card => {
            // Only apply the reflection if the card is hidden AND fully resting!
            if (!card.isFlipped && card.animProgress < 0.05) {
                this.drawShimmer(card.x, card.y, card.width, card.height);
            }
        });
    }

    drawShimmer(x, y, width, height) {
        // 1. Grab the raw pixel data of the card (which currently has the logo on it)
        const imageData = this.ctx.getImageData(x, y, width, height);
        const data = imageData.data;

        // 2. Calculate where the "light beam" should be based on the current frame
        // The beam sweeps diagonally across the card and loops
        const shimmerPos = this.frameCount % (width + height + 150);

        // 3. Loop through every single pixel in the card
        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                // The data array is flat [R, G, B, A, R, G, B, A...]
                const index = (row * width + col) * 4;
                
                // Math to check if this specific pixel is near our moving light beam
                const dist = Math.abs((col + row) - shimmerPos);
                
                if (dist < 25) {
                    // If it is near the beam, add a shiny blue/white glare
                    // The closer to the center of the beam, the brighter it gets
                    const intensity = (25 - dist) * 1.8; 
                    
                    data[index] = Math.min(255, data[index] + intensity);           // Red
                    data[index + 1] = Math.min(255, data[index + 1] + intensity);   // Green
                    data[index + 2] = Math.min(255, data[index + 2] + intensity + 30); // Blue (Extra for a glass look)
                }
            }
        }

        // 4. Paint the shiny, modified pixels back onto the canvas
        this.ctx.putImageData(imageData, x, y);
    }
}