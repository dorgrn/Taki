const playerFactory = (function () {
    const TYPES = {
        PC: "pc",
        USER: "user"
    };

    const STATE = {
        PLAYING: "playing",
        STOPPED: "stopped"
    };

    function findCardInArray(array, type, color, value) {
        return array.filter(function (card) {
                return ((type ? card.type === type : true) && (color ? card.color === color : true)
                    && (value ? card.value === value : true));
            }
        ).pop();
    }

    return {
        createPlayer: function (type) {
            var player = {
                score: 0,
                state: STATE.PLAYING,
                singleCardCounter: 0,
                turnAverageTime: 0,
                playerType: type,
                hand: {
                    HAND_SIZE: 8,
                    cards: [],
                    legalCards: []
                }
            };

            if (type === TYPES.PC) {
                player.doTurn = doPCTurn.bind(player);
            }
            else if (type === TYPES.USER) {
                player.doTurn = doUserTurn.bind(player);
            }

            //player.doTurn.bind(player);

            (function () {
                for (var i = 0; i < player.hand.HAND_SIZE; i++) {
                    const card = manager.drawCard();
                    player.hand.cards.push(card);
                }
            })();

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
                this.fillLegalCards();
                console.log(this);
            }

            function doPCTurn() {
                this.fillLegalCards();
                console.log(this);
                const top = manager.getPlayZoneTop();
                const legalCards = this.hand.legalCards;
                const TYPES = cardFactory.getTypes();

                if (!top) {
                    console.error("pc turn with no cards in playzone");
                    return;
                }

                // take2
                if (top.type === TYPES.TAKE2 &&
                    this.tryPlayCard(findCardInArray(legalCards, TYPES.TAKE2))) {
                    return;
                }

                // change
                if (this.tryPlayCard(findCardInArray(legalCards, TYPES.PLUS))) {
                    return;
                }

                // stop
                if (this.tryPlayCard(findCardInArray(legalCards, TYPES.STOP, top.color))) {
                    return;
                }

                // plus
                if (this.tryPlayCard(findCardInArray(legalCards, TYPES.PLUS, top.color))) {
                    return;
                }

                // supertaki
                if (this.tryPlayCard(findCardInArray(legalCards, TYPES.SUPER_TAKI))) {
                    return;
                }

                // taki
                if (this.tryPlayCard(findCardInArray(legalCards, TYPES.TAKI, top.color))) {
                    return;
                }

                // same color
                if (this.tryPlayCard(findCardInArray(legalCards, TYPES.VALUE, top.color))) {
                    return;
                }

                // same number
                if (this.tryPlayCard(findCardInArray((legalCards, TYPES.VALUE, undefined, top.value)))) {
                    return;
                }

                console.assert(legalCards.length === 0);
                // no legal card to play
                this.pullFromDeck();
            }


            return player;
        },

        pullFromDeck: function () {

        }
    }
})();