var manager = (function () {

    return {
        deck: takiDeck,
        players: [],
        playerTurn: 0,
        playZone: playZone,
        onPlayerChanged: eventFactory.createEvent(),
        onGameEnded: eventFactory.createEvent(),
        onTakiCard: eventFactory.createEvent(), // event represents "Taki" card on playZone
        onChangeColor: eventFactory.createEvent(), // event represents "ChangeColor" card on playZone
        onColorChanged: eventFactory.createEvent(), // event represents that color of "ChangeColor" was changed
        onDeckRefill: eventFactory.createEvent(),

        drawCard: function () {
            // if the deck is empty, take the cards from playZone
            if (manager.deck.isLastCard()) {
                if (manager.playZone.isEmpty()) {
                    console.error("empty playzone in drawcard");
                    return;
                }

                var newDeck = manager.playZone.getUsedCards(); // copy the original deck except for the first card
                manager.deck.insertCards(newDeck);// insert it shuffled to deck
                manager.onDeckRefill.notify();
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
            var activePlayer = manager.getActivePlayer();
            if (manager.isGameEnd()) {
                stats.gamesAmount++;
                manager.onGameEnded.notify({activePlayer: activePlayer});
                return;
            }

            // this will swap player (round robin)
            manager.setNextPlayerAsActive();
            activePlayer = manager.getActivePlayer();
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

        create: function () {
            manager.setCardsFunctions();
            manager.createPlayers();
        },

        init: function () {
            stats.gameWatch.start();
            manager.deck.createDeck();

            // draw the first card to playZone
            var card = manager.drawCard();
            while (card.isSuperCard()){
                manager.deck.insertCard(card);
                card = manager.drawCard();
            }
            manager.playZone.putOnTop(card);

            // deal the first cards to players
            for (var i = 0; i < manager.players.length; i++) {
                manager.players[i].init();
                manager.players[i].dealInitialCardsToHand();
            }

            manager.playerTurn = 0;
            manager.players[manager.playerTurn].startTurn();
        },

        setCardsFunctions: function () {
            cardFactory.funcOpenTaki = function () {
                //BUT - we dont want the pc to infrom about this event
                var activePlayer = manager.getActivePlayer();
                activePlayer.inTakiMode.status = true;
                activePlayer.inTakiMode.takiId = manager.playZone.getTop().cardId;
                activePlayer.fillLegalCards();
                if (activePlayer.playerType === "pc") {
                    activePlayer.doTurn();
                }
                else {
                    manager.onTakiCard.notify();
                }
            };
            cardFactory.funcChangeColor = function () {
                var activePlayer = manager.getActivePlayer();
                if (activePlayer.playerType === "pc") {
                    //var randomColor = cardFactory.colors[Math.floor(Math.random() * cardFactory.colors.length)];
                    //activePlayer.selectColor(randomColor);
                    activePlayer.selectColor(manager.colorDecision());
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

        colorDecision: function () {
            var activePlayer = manager.getActivePlayer();
            var cards = activePlayer.hand.cards;
            var colorsCount = [];
            var colorSelected;
            var max = 0;

            for (var i = 0;i<cardFactory.colors.length;i++){
                colorsCount[cardFactory.colors[i]] = 0;
            }

            for (var i = 0 ; i<cards.length; i++){
                if (cards[i].color !== "colorful"){
                    colorsCount[cards[i].color]++;
                    if (colorsCount[cards[i].color] > max){
                        max = colorsCount[cards[i].color];
                        colorSelected = cards[i].color;
                    }
                }
            }

            if (max === 0){
                colorSelected = cardFactory.colors[Math.floor(Math.random() * cardFactory.colors.length)];
            }

            return colorSelected;
        }
    };
})
();