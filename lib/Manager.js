var manager = (function () {

    return {
        deck: takiDeck,
        history: {}, //TODO: check what needs to be added here
        players: [],
        playZone: playZone,
        playerTurn: 0,
        statistics: {
            turnAmount: 0
        },

        onPlayerChanged: eventFactory.createEvent(),
        onGameEnded: eventFactory.createEvent(),
        onTakiCard: eventFactory.createEvent(), // event represents "Taki" card on playZone
        onChangeColor: eventFactory.createEvent(), // event represents "ChangeColor" card on playZone
        onColorChanged: eventFactory.createEvent(), // event represents that color of "ChangeColor" was changed

        drawCard: function () {
            // if the deck is empty, take the cards from playZone
            if (manager.deck.isEmpty()) {
                if (manager.playZone.isEmpty()) {
                    console.error("empty playzone in drawcard");
                    return;
                }

                var newDeck = manager.playZone.getUsedCards(); // copy the original deck except for the first card
                manager.deck.insertCards(newDeck);// insert it shuffled to deck
            }
            return manager.deck.draw();
        },

        createPlayers: function () {
            manager.players.push(playerFactory.createPlayer("user"));
            manager.players.push(playerFactory.createPlayer("pc"));
        },

        isCardLegal: function (card) {
            var topPlayZone = manager.playZone.getTop();
            var activePlayer = manager.getActivePlayer();

            if (activePlayer.inTakiMode.status) {
                return topPlayZone.compareColor(card);
            }

            // not in taki mode
            return (
                topPlayZone.compareColor(card) ||
                (topPlayZone.isValueCard() && card.isValueCard() && topPlayZone.compareValue(card)) ||
                (topPlayZone.isSpecialCard() && card.isSpecialCard() && topPlayZone.compareType(card)) ||
                card.isSuperCard());
        },

        isGameEnd: function () {
            return manager.getActivePlayer().hand.cards.length === 0;
        },

        swapPlayer: function () {
            if (manager.isGameEnd()) {
                manager.onGameEnded.notify({activePlayer: manager.getActivePlayer()});
                return;
            }

            manager.statistics.turnAmount++;

            // this will swap player (round robin)
            manager.setNextPlayerAsActive();
            activePlayer = manager.getActivePlayer();
            //manager.onPlayerChanged.notify({activePlayer: activePlayer});
            activePlayer.startTurn();
        },

        getActivePlayer: function () {
            return manager.players[manager.playerTurn];
        },

        getNextPlayer: function () {
            return (manager.playerTurn + 1) % manager.players.length;
        },

        setNextPlayerAsActive: function () {
            manager.playerTurn = manager.getNextPlayer();
        },

        getElapsedTime: function () {
            return manager.gameWatch.getElapsedTime();
        },

        create: function () {
            manager.gameWatch = stopWatchFactory.createStopWatch();
            manager.setCardsFunctions();
            manager.deck.createDeck();
            manager.createPlayers();
        },

        init: function () {
            manager.gameWatch.start();
            manager.playZone.putOnTop(manager.drawCard());
            for (var i = 0; i < manager.players.length; i++){
                manager.players[i].dealInitialCardsToHand();
            }

            manager.players[0].startTurn();
        },

        setCardsFunctions: function () {
            cardFactory.funcOpenTaki = function () {
                //BUT - we dont want the pc to infrom about this event
                var activePlayer = manager.getActivePlayer();
                activePlayer.inTakiMode.status = true;
                activePlayer.inTakiMode.takiId = manager.playZone.getTop().cardId;
                activePlayer.fillLegalCards();
                if (activePlayer.playerType === "pc"){
                    activePlayer.doTurn();
                }
                else {
                    manager.onTakiCard.notify();
                }
            };
            cardFactory.funcChangeColor = function () {
                var activePlayer = manager.getActivePlayer();
                if (activePlayer.playerType === "pc") {
                    var randomColor = cardFactory.colors[Math.floor(Math.random() * cardFactory.colors.length)];
                    activePlayer.selectColor(randomColor);
                }
                else {
                    manager.onChangeColor.notify();
                }
            };
            cardFactory.funcStop = function () {
                manager.players[manager.getNextPlayer()].isStopped = true;
                manager.getActivePlayer().endTurn();
                manager.swapPlayer();
            };
            cardFactory.funcPlus = function () {
                var activePlayer = manager.getActivePlayer();
                activePlayer.endTurn();
                activePlayer.startTurn();
            };
        },
    };
})
();