class CardGrid {
    constructor(pairsNeeded, theme) {
        this.cards = [];
        this.generateGrid(pairsNeeded, theme);
    }

    generateGrid(pairsNeeded, theme) {
        // Define our three sets of symbols using Emojis and Numbers
        const themeSymbols = {
            fruits: ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍍', '🥝'],
            animals: ['🐶', '🐱', '🦊', '🐻', '🐼', '🐨', '🐸', '🐰'],
            numbers: ['1', '2', '3', '4', '5', '6', '7', '8']
        };

        // Select the right array based on the passed theme (fallback to animals if undefined)
        const availableSymbols = themeSymbols[theme] || themeSymbols['animals'];

        let symbolsToUse = availableSymbols.slice(0, pairsNeeded);
        let deck = [...symbolsToUse, ...symbolsToUse];
        
        // Fisher-Yates Shuffle
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        this.cards = deck.map((symbol, index) => new Card(index, symbol));
    }
}