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

    function getFilename(type, color) {
        return type + (color ? "_" + color : "");
    }

    return {
        deck: [],
        history: {}, //TODO: check what's need to be added here
        players: [],
        playZone: [],
        playerTurn: 0,
        statistics: {
            turnAmount: 1
        },

        DECK_INITIAL_SIZE: 84,
        VALUE_CARDS: 2,
        SPECIAL_CARDS: 2,
        SUPER_CARDS: 4,

        // TODO: need to change deck size in advanced
        createDeck: function () {
            // value cards
            cardFactory.values.forEach(function (value) {
                for (var i = 0; i < manager.VALUE_CARDS; i++) {
                    cardFactory.colors.forEach(
                        function (color) {
                            manager.deck.push(cardFactory.createCard(color, "value", getFilename(value, color), value));
                        }
                    );
                }
            });

            // special cards
            cardFactory.specialTypes.forEach(function (type) {
                for (var i = 0; i < manager.SPECIAL_CARDS; i++) {
                    cardFactory.colors.forEach(
                        function (color) {
                            manager.deck.push(cardFactory.createCard(color, type, getFilename(type, color)));
                        }
                    )
                }
            });

            // supercards
            cardFactory.superCards.forEach(function (type) {
                for (var i = 0; i < manager.SUPER_CARDS; i++) {
                    manager.deck.push(cardFactory.createCard("colorful", type, getFilename(type, "colorful")));
                }
            });

            shuffleArray(manager.deck);
        },

        drawCard: function () {
            if (manager.deck.length === 0) {
                if (manager.playZone.length === 0) {
                    console.error("empty playzone in drawcard");
                    return;
                }

                shuffleArray(manager.playZone);
                manager.deck.push(manager.playZone.slice());
                manager.playZone = [];
            }
            return manager.deck.pop();
        },

        createPlayers: function () {
            manager.players.push(playerFactory.createPlayer("user"));
            manager.players.push(playerFactory.createPlayer("pc"));
        },

        isSuperCard: function (card) {
            return cardFactory.superCards.indexOf(card) !== -1;
        },

        isCardLegal: function (card) {
            const firstOnPlayZone = manager.getPlayZoneTop();
            return (card.color === firstOnPlayZone.color || card.value === firstOnPlayZone.value || manager.isSuperCard(card));
        },

        getPlayZoneTop: function () {
            return manager.playZone[manager.playZone.length - 1];
        },

        putCard: function (card) {
            this.playZone.push(card);
        },

        isGameEnd: function () {
            const stoppedPlayers = manager.players.filter(function (player) {
                return player.state === playerFactory.getSTATE().STOPPED
            });

            return stoppedPlayers.length === manager.players.length;
        },

        makeNextTurn: function(){
            if (!manager.isGameEnd()) {
                manager.players[manager.playerTurn].doTurn();
            }
        },

        init: function () {
            manager.stopWatch = stopWatchFactory.createStopWatch();
            manager.stopWatch.start();

            manager.createDeck();
            // place first card on the playZone
            manager.playZone.push(manager.drawCard());
            manager.createPlayers();

            manager.makeNextTurn();
        }
    };
})();