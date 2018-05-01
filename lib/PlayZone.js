var playZone = (function () {
    var cards = [];

    return {
        putOnTop: function (card) {
            cards.push(card);
        },

        popTheTop: function () {
            return cards.pop();
        },

        getTop: function () {
            return cards[cards.length - 1];
        },

        getUsedCards: function () {
            return cards.splice(0, cards.length-1);
        },


        isEmpty: function () {
            return (cards.length === 0);
        }
    };
})();