const Player = function (_playerType) {
    const HAND_SIZE = 8;

    const hand = {
        cards: []
    };

    var createHand = function () {
        for (var i = 0; i < HAND_SIZE; i++) {
            const card = manager.drawCard();
            hand.cards.push(card);
        }
    };

    createHand();

    return {
        score: 0,
        state: "playing",
        singleCardCounter: 0,
        turnAverageTime: 0,
        playerType: _playerType,

        getHand: function () {
            return hand;
        }
    }
};