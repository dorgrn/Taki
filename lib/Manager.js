const manager = (function () {
    // from https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
    function shuffleArray(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

    return {
        timeElapsed: 0,
        deck: [],
        history: {}, //TODO: check what's need to be added here
        players: [],
        playZone: [],
        playerTurn: 0,

        DECK_INITIAL_SIZE: 84,
        CARD_MULTIPLES: 2,
        SUPER_CARDS: 4,

        // TODO: need to change deck size in advanced
        createDeck: function () {
            // number cards
            cardFactory.values.forEach(function (value) {
                for (var i = 0; i < manager.CARD_MULTIPLES; i++) {
                    cardFactory.colors.forEach(
                        function (color) {
                            const card = cardFactory.createCard(color, "number", value + "_" + color, value);
                            manager.deck.push(card);
                        }
                    );
                }
            });

            // special cards
            cardFactory.specialTypes.forEach(function (type) {
                for (var i = 0; i < manager.CARD_MULTIPLES; i++) {
                    cardFactory.colors.forEach(
                        function (color) {
                            const card = cardFactory.createCard(color, type, type + "_" + color);
                            manager.deck.push(card);
                        }
                    )
                }
            });

            // supercards
            cardFactory.superCards.forEach(function (type) {
                for (var i = 0; i < manager.SUPER_CARDS; i++) {
                    manager.deck.push(cardFactory.createCard("colorful", type, type));
                }
            });

            shuffleArray(manager.deck);
        },

        drawCard: function () {
            return manager.deck.pop();
        },

        createPlayers: function () {
            manager.players.push(Player("user"));
            manager.players.push(Player("pc"));
        },

        isSuperCard: function (card) {
            return cardFactory.superCards.indexOf(card) !== -1;
        },

        isCardLegal: function (card) {
            const firstOnPlayZone = manager.playZone[0];
            console.log(firstOnPlayZone);
            return (card.color === firstOnPlayZone.color || card.value === firstOnPlayZone.value || manager.isSuperCard(card));
        },

        init: function () {
            manager.createDeck();
            manager.createPlayers();

            // place first card on the playZone
            manager.playZone.push(manager.drawCard());
            manager.players[manager.playerTurn].doTurn();
        }
    };
})();