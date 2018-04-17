const playerFactory = (function () {
    const TYPES = {
        PC: "pc",
        USER: "user"
    };

    const STATE = {
        PLAYING: "playing",
        STOPPED: "stopped"
    };

    function doUserTurn() {

    }

    function doPCTurn() {

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
                },
                fillLegalCards: function () {
                    hand.cards.filter(manager.isCardLegal);
                }
            };

            if (type === TYPES.PC) {
                player.doTurn = doPCTurn;
            }
            else if (type === TYPES.USER) {
                player.doTurn = doUserTurn;
            }

            var createHand = (function () {
                for (var i = 0; i < player.hand.HAND_SIZE; i++) {
                    const card = manager.drawCard();
                    player.hand.cards.push(card);
                }
            })();

            return player;
        }
    }
})();