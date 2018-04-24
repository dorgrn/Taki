const playerFactory = (function () {

    const TYPES = {
        PC: "pc",
        USER: "user"
    };

    const STATE = {
        PLAYING: "playing",
        STOPPED: "stopped"
    };

    return {
        HAND_INITIAL_SIZE: 8,

        createPlayer: function (type) {
            var player = {
                state: STATE.PLAYING,
                stats: {
                    score: 0,
                    singleCardCounter: 0,
                    turnAmount: 0
                },
                playerType: type,
                hand: {
                    cards: [],
                    legalCards: []
                },
                inTakiMode: false
            };

            if (type === TYPES.PC) {
                player.doTurn = doPCTurn.bind(player);
            }
            else if (type === TYPES.USER) {
                player.doTurn = doUserTurn.bind(player);
            }

            this.createHand.call(player);

            player.fillLegalCards = function () {
                player.hand.legalCards = player.hand.cards.filter(manager.isCardLegal);
            };

            player.playCard = function (card) {
                cardFactory.removeCard(player.hand.cards, card);
                cardFactory.removeCard(player.hand.legalCards, card);
                manager.putCard(card);
            };

            player.tryPlayCard = function (card) {
                // this takes into account card may be undefined
                if (!card) {
                    return false;
                }
                player.playCard(card);

                return true; // succeeded putting
            };


            function doUserTurn() {
                this.startTurn();

                console.log(this);
                // TODO: event that says user had done move
                this.endTurn();
            }

            function doPCTurn() {
                this.startTurn();
                playerFactory.determinePCPlay.call(this);
                this.endTurn();
            }

            player.turnStopWatch = stopWatchFactory.createStopWatch();
            player.startTurn = this.startTurn.bind(player);
            player.endTurn = this.endTurn.bind(player);


            return player;
        },

        // this function is in charge of the pc logic
        determinePCPlay: function () {
            const tryPlayCard = this.tryPlayCard;
            const top = manager.getPlayZoneTop();
            const legalCards = this.hand.legalCards;
            const TYPES = cardFactory.getTypes();
            const findCardInArray = cardFactory.findCardInArray;

            if (!top) {
                console.error("pc turn with no cards in playzone");
                return false;
            }

            const succeededPlay =
                (top.type === TYPES.TAKE2 && tryPlayCard(findCardInArray(legalCards, TYPES.TAKE2))) || // take2
                tryPlayCard(findCardInArray(legalCards, TYPES.CHANGE)) || // change
                tryPlayCard(findCardInArray(legalCards, TYPES.STOP, top.color)) || // stop
                tryPlayCard(findCardInArray(legalCards, TYPES.PLUS, top.color)) || // plus
                tryPlayCard(findCardInArray(legalCards, TYPES.SUPER_TAKI)) || // supertaki
                tryPlayCard(findCardInArray(legalCards, TYPES.TAKI, top.color)) || //taki
                tryPlayCard(findCardInArray(legalCards, TYPES.VALUE, top.color)) || // same color
                tryPlayCard(findCardInArray((legalCards, TYPES.VALUE, undefined, top.value))); // same value

            if (!succeededPlay) {
                console.assert(legalCards.length === 0);
                this.drawFromDeck();
            }
        },

        startTurn: function () {
            this.turnStopWatch.start();
            this.stats.turnAmount++;
            this.fillLegalCards();
            //setHoverOnPlayerCards(this.hand.legalCards);
        },

        endTurn: function () {
            this.turnStopWatch.stop();
        },

        drawFromDeck: function () {
            var card = manager.drawCard();
            this.hand.cards.push(card);
            //moveCardFromDeckToPlayerHand(this, card);
        },

        createHand: function () {
            for (var i = 0; i < playerFactory.HAND_INITIAL_SIZE; i++) {
                playerFactory.drawFromDeck.call(this);
            }
        },

        getSTATE: function () {
            return STATE;
        }

    };
})();