var handFactory = (function () {

    return {
        createHand: function () {
            var hand = {
                cards: [],
                legalCards: [],

                removeCard: function (card) {
                    for (var i = 0; i < this.cards.length; i++) {
                        if (card.cardId === this.cards[i].cardId) {
                            this.cards.splice(i, 1);
                            break;
                        }
                    }

                    for (var i = 0; i < this.legalCards.length; i++) {
                        if (card.cardId === this.legalCards[i].cardId) {
                            this.legalCards.splice(i, 1);
                            break;
                        }
                    }
                },

                getCardById: function (cardId) {
                    for (var i = 0; i < this.cards.length; i++) {
                        if (cardId === this.cards[i].cardId) {
                            return this.cards[i];
                        }
                    }
                }
            };

            return hand;
        }
    };
})();