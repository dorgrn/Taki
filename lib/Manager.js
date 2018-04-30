var manager = (function () {
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
        history: {}, //TODO: check what needs to be added here
        players: [],
        playZone: [],

        DECK_INITIAL_SIZE: 84,
        VALUE_CARDS: 2,
        SPECIAL_CARDS: 2,
        SUPER_CARDS: 4,

        onPlayerChanged: eventFactory.createEvent(),
        onGameEnded: eventFactory.createEvent(),
        onCardRemovedFromHand: eventFactory.createEvent(),
        onPutCardInPlayZone: eventFactory.createEvent(),
        onPlayerDrawCardFromDeck: eventFactory.createEvent(),

        // TODO: need to change deck size in advanced
        createDeck: function () {
            var cardIdCounter = 1;
            var newCard;
            // value cards
            cardFactory.values.forEach(function (value) {
                for (var i = 0; i < manager.VALUE_CARDS; i++) {
                    cardFactory.colors.forEach(
                        function (color) {
                            newCard = cardFactory.createCard(cardIdCounter++, color, "value", getFilename(value, color), value);
                            manager.deck.push(newCard);
                        }
                    );
                }
            });

            // special cards
            cardFactory.specialTypes.forEach(function (type) {
                for (var i = 0; i < manager.SPECIAL_CARDS; i++) {
                    cardFactory.colors.forEach(
                        function (color) {
                            newCard = cardFactory.createCard(cardIdCounter++, color, type, getFilename(type, color));
                            manager.deck.push(newCard);
                        }
                    );
                }
            });

            // supercards
            cardFactory.superCards.forEach(function (type) {
                for (var i = 0; i < manager.SUPER_CARDS; i++) {
                    newCard = cardFactory.createCard(cardIdCounter++, "colorful", type, getFilename(type, "colorful"));
                    manager.deck.push(newCard);
                }
            });

            shuffleArray(manager.deck);
        },

        drawCard: function () {
            // if the deck is empty, take the cards from playZone
            if (manager.deck.length === 0) {
                if (manager.playZone.length === 0) {
                    console.error("empty playzone in drawcard");
                    return;
                }

                var newDeck = manager.playZone.slice(1); // copy the original deck except for the first card
                manager.deck.push(shuffleArray(newDeck));// insert it shuffled to deck
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
            var firstOnPlayZone = manager.getPlayZoneTop();
            var activePlayer = manager.getActivePlayer();

            if (activePlayer.inTakiMode) {
                return card.color === firstOnPlayZone.color;
            }

            // not in taki mode
            return (card.color === firstOnPlayZone.color ||
                card.value === firstOnPlayZone.value ||
                manager.isSuperCard(card));
        },

        getPlayZoneTop: function () {
            return manager.playZone[manager.playZone.length - 1];
        },

        putCard: function (card) {
            // either way, put card on playZone
            this.playZone.push(card);
            manager.onPutCardInPlayZone.notify({card: card});
            manager.makeNextTurn();
        },

        isGameEnd: function () {
            return manager.getActivePlayer().hand.cards.length === 0;
        },

        swapPlayer: function () {
            var activePlayer = manager.getActivePlayer();

            activePlayer.endTurn();
            manager.statistics.turnAmount++;

            // this will swap player (round robin)
            manager.playerTurn = (manager.playerTurn + 1) % manager.players.length;
            activePlayer = manager.getActivePlayer();
            activePlayer.fillLegalCards();
            manager.onPlayerChanged.notify({activePlayer: activePlayer});

            activePlayer.doTurn();
            return manager.playerTurn;
        },

        getActivePlayer: function () {
            return manager.players[manager.playerTurn];
        },

        makeNextTurn: function () {
            var activePlayer = manager.getActivePlayer();

            // if we're in takiMode and the player has legal cards left,
            // we stay in takiMode and turn doesn't end. otherwise the turn ends
            activePlayer.fillLegalCards();

            if (manager.isGameEnd()) {
                manager.onGameEnded.notify({activePlayer: manager.getActivePlayer()});
                return;
            }

            // if the player is in taki mode and has legal cards, his turn doesn't end
            if (!(activePlayer.inTakiMode && activePlayer.hasLegalCard())) {
                manager.swapPlayer();
            }
        },

        getElapsedTime: function () {
            return manager.gameWatch.getElapsedTime();
        },

        init: function () {
            manager.gameWatch = stopWatchFactory.createStopWatch();
            manager.gameWatch.start();

            manager.createDeck();
            // place first card on the playZone
            manager.playZone.push(manager.drawCard());
            manager.createPlayers();
            manager.getActivePlayer().fillLegalCards();

            //manager.makeNextTurn();
            //manager.onPlayerChanged.notify({playerToPlay: this.players[manager.playerTurn]});
        }


    };
})
();