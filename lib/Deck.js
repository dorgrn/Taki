var takiDeck = (function () {
    var cards = [];


    // from https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
    function shuffle() {
        var j, x, i;
        for (i = cards.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = cards[i];
            cards[i] = cards[j];
            cards[j] = x;
        }
    }

    function getFilename(type, color) {
        return type + (color ? "_" + color : "");
    }

    return {
        VALUE_CARDS: 2,
        SPECIAL_CARDS: 2,
        SUPER_CARDS: 4,

        // TODO: need to change deck size in advanced
        createDeck: function () {
            var cardIdCounter = 1;
            var newCard;
            // value cards
            cardFactory.values.forEach(function (value) {
                for (var i = 0; i < takiDeck.VALUE_CARDS; i++) {
                    cardFactory.colors.forEach(
                        function (color) {
                            newCard = cardFactory.createCard(cardIdCounter++, color, "value", getFilename(value, color), value);
                            takiDeck.insertCard(newCard);
                        }
                    );
                }
            });

            // special cards
            cardFactory.specialTypes.forEach(function (type) {
                for (var i = 0; i < takiDeck.SPECIAL_CARDS; i++) {
                    cardFactory.colors.forEach(
                        function (color) {
                            newCard = cardFactory.createCard(cardIdCounter++, color, type, getFilename(type, color));
                            takiDeck.insertCard(newCard);
                        }
                    );
                }
            });

            // supercards
            cardFactory.superCards.forEach(function (type) {
                for (var i = 0; i < takiDeck.SUPER_CARDS; i++) {
                    newCard = cardFactory.createCard(cardIdCounter++, "colorful", type, getFilename(type, "colorful"));
                    takiDeck.insertCard(newCard);
                }
            });

            shuffle();
        },

        insertCard: function (card) {
            cards.push(card);
        },

        insertCards: function (cards) {
            cards.push(cards);
            shuffle();
        },

        draw: function () {
            return cards.pop();
        },

        isEmpty: function () {
            return (cards.length === 0);
        }

    };
})();