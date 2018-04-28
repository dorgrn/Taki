var playerFactory = (function () {
    var TYPES = {
        PC: "pc",
        USER: "user"
    };

    return {
        HAND_INITIAL_SIZE: 8,

        createPlayer: function (type) {
            var player = {
                stats: {
                    score: 0,
                    singleCardCounter: 0,
                    turnAmount: 0
                },
                playerType: type,
                hand: {
                    cards: [],
                    legalCards: [],
                    removeCard: function (card) {
                        manager.onCardRemovedFromHand.notify({card: card});
                        for (var i = 0; i < this.cards.length; i++) {
                            if (card.cardId === this.cards[i].cardId) {
                                this.cards.splice(i, 1);
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
                },
                inTakiMode: false
            };

            if (type === TYPES.PC) {
                player.doTurn = doPCTurn.bind(player);
            }
            else if (type === TYPES.USER) {
                player.doTurn = doUserTurn.bind(player);
            }

            player.drawFromDeck = function () {
                var card = manager.drawCard();

                manager.onPlayerDrawCardFromDeck.notify({
                        player: player,
                        card: card
                    }
                );

                player.hand.cards.push(card);
            };

            this.createHand.call(player);

            player.fillLegalCards = function () {
                player.hand.legalCards = player.hand.cards.filter(manager.isCardLegal);
            };

            player.playCard = function (card) {
                // check card is legal
                if (!manager.isCardLegal(card)) {
                    // TODO: should we add an event for clicking an illegal card?
                    console.error("illegal card chosen " + card);
                    return;
                }

                player.hand.removeCard(card);
                manager.putCardOnPlayZone(card);
            };

            player.tryPlayCard = function (card) {
                // this takes into account card may be undefined
                if (!card) {
                    return false;
                }
                player.playCard(card);

                return true; // succeeded putting the card
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
                playerFactory.determinePCPlay.call(player);
            }

            player.turnStopWatch = stopWatchFactory.createStopWatch();
            player.startTurn = this.startTurn.bind(player);
            player.endTurn = this.endTurn.bind(player);


            return player;
        },

        // this function is in charge of the pc logic
        determinePCPlay: function () {
            var tryPlayCard = this.tryPlayCard;
            var top = manager.getPlayZoneTop();
            var TYPES = cardFactory.getTypes();
            var findCardInArray = cardFactory.findCardInArray;
            var activePlayer = manager.getActivePlayer();
            activePlayer.fillLegalCards();
            var legalCards = this.hand.legalCards;

            if (!top) {
                console.error("pc turn with no cards in playzone");
                return false;
            }

            if (legalCards.length === 0) {
                activePlayer.drawFromDeck();
                manager.swapPlayer();
                return;
            }

            var succeededPlay =
                (top.type === TYPES.TAKE2 && tryPlayCard(findCardInArray(legalCards, TYPES.TAKE2))) || // take2
                tryPlayCard(findCardInArray(legalCards, TYPES.CHANGE)) || // change
                tryPlayCard(findCardInArray(legalCards, TYPES.STOP, top.color)) || // stop
                tryPlayCard(findCardInArray(legalCards, TYPES.PLUS, top.color)) || // plus
                tryPlayCard(findCardInArray(legalCards, TYPES.SUPER_TAKI)) || // supertaki
                tryPlayCard(findCardInArray(legalCards, TYPES.TAKI, top.color)) || //taki
                tryPlayCard(findCardInArray(legalCards, TYPES.VALUE, top.color)) || // same color
                tryPlayCard(findCardInArray(legalCards, TYPES.VALUE, undefined, top.value)); // same value

            if (!succeededPlay) {
                console.assert(legalCards.length === 0);
                activePlayer.drawFromDeck();
                manager.swapPlayer();
            }
        },

        startTurn: function () {
            this.turnStopWatch.start();
            this.stats.turnAmount++;
            this.fillLegalCards();
            //setHoverOnPlayerCards(this.hand.legalCards);
        },

        endTurn: function () {
            this.inTakiMode = false;
            this.turnStopWatch.stop();
        },

        createHand: function () {
            console.log(this);
            for (var i = 0; i < playerFactory.HAND_INITIAL_SIZE; i++) {
                this.drawFromDeck();
            }
        }
    };
})();