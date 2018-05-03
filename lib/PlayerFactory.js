var playerFactory = (function () {
    var TYPES = {
        PC: "pc",
        USER: "user"
    };

    function getAvgTime(turnsAmount, turnsTime){
        return (turnsAmount === 0 ? 0 : stopWatchFactory.millisToMinutesAndSeconds(turnsTime / turnsAmount));
    }

    return {
        HAND_INITIAL_SIZE: 8,

        createPlayer: function (type) {
            var player = {
                onRemovedCardFromHand: eventFactory.createEvent(),
                onPutCardInPlayZone: eventFactory.createEvent(),
                onDrawCardFromDeck: eventFactory.createEvent(),
                onUpdateLegalCards: eventFactory.createEvent(),

                stats: {
                    score: 0,
                    lastCardCounter: 0,
                    turnAmount: 0,
                    turnAmountAllGames: 0,
                    turnsTime: 0,
                    turnsTimeAllGames: 0
                },
                playerType: type,
                inTakiMode: {
                    status: false,
                    takiId: {}
                },
                isStopped: false,
                mustTake: 0,
                hand: handFactory.createHand()
            };

            player.init = function (){
                player.hand.init();

                this.stats.score = 0;
                this.stats.lastCardCounter = 0;
                this.stats.turnAmount = 0;
                this.stats.turnsTime = 0;

                player.isStopped = 0;
                player.mustTake = 0;
            };

            player.dealInitialCardsToHand = function () {
                for (var i = 0; i < playerFactory.HAND_INITIAL_SIZE; i++) {
                    player.drawCardFromDeck();
                }
            };

            player.removedCardFromHand = function (card) {
                player.hand.removeCard(card);
                player.onRemovedCardFromHand.notify({card: card});
            };

            player.putCardOnPlayZone = function (card) {
                manager.playZone.putOnTop(card);
                player.onPutCardInPlayZone.notify({card: card});
            };

            player.drawCardFromDeck = function () {
                var card = manager.drawCard();

                player.hand.cards.push(card);
                player.onDrawCardFromDeck.notify({player: player, card: card});
            };

            player.drawWhenNoLegalCards = function () {
                this.drawCardFromDeck();
                this.endTurn();
                manager.swapPlayer();
            };

            player.selectColor = function (color) {
                var top = manager.playZone.popTheTop();
                top.color = color;
                manager.playZone.putOnTop(top);
                manager.onColorChanged.notify({color: color});
                this.endTurn();
                manager.swapPlayer();
            };

            player.closeTaki = function () {
                var top = manager.playZone.getTop();
                player.inTakiMode.status = false;

                //need to check functionality of the last card in taki.
                if (player.inTakiMode.takiId !== top.cardId) {
                    player.inTakiMode.takiId = {};
                    player.handleCard(top);
                }
                else {
                    player.endTurn();
                    manager.swapPlayer();
                }
            };

            player.fillLegalCards = function () {
                player.hand.legalCards = player.hand.cards.filter(manager.isCardLegal);
                player.onUpdateLegalCards.notify({activePlayer: this});
            };

            player.playCard = function (card) {
                // check card is legal
                if (!manager.isCardLegal(card)) {
                    return;
                }

                player.removedCardFromHand(card);
                player.putCardOnPlayZone(card);
                player.handleCard(card);
            };

            player.handleCard = function (card) {
                //this function is being called after we already know card is legal
                if (player.inTakiMode.status) {
                    player.doTurn();
                }
                else {
                    if (card.isSpecialCard() || card.isSuperCard()) {
                        card.activate();
                    }
                    else {
                        // means this is a value card
                        player.endTurn();
                        manager.swapPlayer();
                    }
                }

            };

            player.hasLegalCard = function () {
                return player.hand.legalCards.length > 0;
            };

            player.hasCard = function () {
                return player.hand.cards.length > 0;
            };

            function doUserTurn() {
                // empty
            }

            function doPCTurn() {
                setTimeout(function () {
                    playerFactory.determinePCPlay.call(player);
                }, 500);

            }

            if (type === TYPES.PC) {
                player.doTurn = doPCTurn.bind(player);
            }
            else if (type === TYPES.USER) {
                player.doTurn = doUserTurn.bind(player);
            }

            player.hasLastCard = function () {
                return player.hand.cards.length === 1;
            };

            player.getAvgTurnTime = function () {
                return getAvgTime(player.stats.turnAmount, player.stats.turnsTime);
            };

            player.getAvgTurnTimeAllGames = function () {
                return getAvgTime(player.stats.turnAmountAllGames, player.stats.turnsTimeAllGames);
            };

            player.getLastCardCounter = function () {
                return player.stats.lastCardCounter;
            };

            player.turnStopWatch = stopWatchFactory.createStopWatch();
            player.startTurn = this.startTurn.bind(player);
            player.endTurn = this.endTurn.bind(player);

            return player;
        },

        // this function is in charge of the pc logic
        determinePCPlay: function () {
            var playCard = this.playCard;
            var top = manager.playZone.getTop();
            var TYPES = cardFactory.getTypes();
            var findCardInArray = cardFactory.findCardInArray;
            var activePlayer = manager.getActivePlayer();
            var legalCards = this.hand.legalCards;

            if (!top) {
                console.error("pc turn with no cards in playzone");
                return false;
            }

            if (top.type === TYPES.TAKE2 && findCardInArray(legalCards, TYPES.TAKE2)) {
                playCard(findCardInArray(legalCards, TYPES.TAKE2));
            }
            else if (findCardInArray(legalCards, TYPES.TAKE2, top.color)) {
                playCard(findCardInArray(legalCards, TYPES.TAKE2, top.color));
            }
            else if (findCardInArray(legalCards, TYPES.STOP, top.color)) {
                playCard(findCardInArray(legalCards, TYPES.STOP, top.color));
            }
            else if (findCardInArray(legalCards, TYPES.PLUS, top.color)) {
                playCard(findCardInArray(legalCards, TYPES.PLUS, top.color));
            }
            else if (findCardInArray(legalCards, TYPES.SUPER_TAKI)) {
                playCard(findCardInArray(legalCards, TYPES.SUPER_TAKI));
            }
            else if (findCardInArray(legalCards, TYPES.TAKI, top.color)) {
                playCard(findCardInArray(legalCards, TYPES.TAKI, top.color));
            }
            else if (findCardInArray(legalCards, TYPES.VALUE, top.color)) {
                playCard(findCardInArray(legalCards, TYPES.VALUE, top.color));
            }
            else if (findCardInArray(legalCards, TYPES.VALUE, undefined, top.value)) {
                playCard(findCardInArray(legalCards, TYPES.VALUE, undefined, top.value));
            }
            else if (findCardInArray(legalCards, TYPES.CHANGE)) {
                playCard(findCardInArray(legalCards, TYPES.CHANGE));
            }
            else if (activePlayer.inTakiMode.status) {
                activePlayer.closeTaki();
            }
            else {
                activePlayer.drawWhenNoLegalCards();
            }
        },

        startTurn: function () {
            this.turnStopWatch.start();

            if (this.hasLastCard()) {
                this.stats.lastCardCounter++;
            }

            if (this.isStopped) {
                this.isStopped = false;
                this.endTurn();
                manager.swapPlayer();
            }
            else {
                this.stats.turnAmount++;
                this.stats.turnAmountAllGames++;
                stats.turnAmount++;

                this.fillLegalCards();
                manager.onPlayerChanged.notify({activePlayer: manager.getActivePlayer()});
                this.doTurn();
            }
        },

        endTurn: function () {
            var elapsed = this.turnStopWatch.stop();
            this.stats.turnsTime += elapsed;
            this.stats.turnsTimeAllGames += elapsed;
        }
    };
})();