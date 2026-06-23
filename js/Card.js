class Card {
    constructor(id, symbol) {
        this.id = id;
        this.symbol = symbol;
        this.isFlipped = false;
        this.isMatched = false;
        
        // Positional data
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        
        // Animation tracking (0 = Hidden, 1 = Fully Flipped)
        this.animProgress = 0; 
    }

    flip() { this.isFlipped = true; }
    unflip() { this.isFlipped = false; }
    match() {
        this.isMatched = true;
        this.isFlipped = true;
    }
}