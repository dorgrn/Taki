const cardFactory = (function () {
    const TYPES = {
        VALUE: "value",
        TAKI: "taki",
        CHANGE: "change",
        STOP: "stop",
        PLUS: "plus",
        TAKE2: "take2",
        SUPER_TAKI: "superTaki"
    };

    return {
        colors: ["blue", "green", "red", "yellow"],
        values: [1, 3, 4, 5, 6, 7, 8, 9],
        specialTypes: ["taki", "stop"],
        superCards: ["change"],

        createCard: function (_color, _type, _sourceImg, value) {
            var card = {
                type: _type,
                color: _color,
                sourceImg: _sourceImg
            };

            switch (_type) {
                case TYPES.VALUE:
                    card.value = value;
                    break;
                case TYPES.TAKI:
                    card.activate = openTaki.bind(this);
                    break;
                case TYPES.CHANGE:
                    card.activate = changeColor.bind(this);
                    break;
                case TYPES.TAKE2:
                    card.activate = take2.bind(this);
                    break;
                case TYPES.STOP:
                    card.activate = stop.bind(this);
                    break;
                case TYPES.PLUS:
                    card.activate = plus.bind(this);
                    break;
                case TYPES.SUPER_TAKI:
                    card.activate = superTaki.bind(this);
                    break;
            }

            function openTaki() {
                console.error("Unimplemented method!");
            }

            function changeColor() {
                console.error("Unimplemented method!");
            }

            function take2() {
                console.error("Unimplemented method!");
            }

            function stop() {
                console.error("Unimplemented method!");
            }

            function plus() {
                console.error("Unimplemented method!");
            }

            function superTaki() {
                console.error("Unimplemented method!");
            }

            return card;
        },

        getTypes: function () {
            return TYPES;
        },

        removeCard: function (cardArray, card) {
            var index = cardArray.indexOf(card);
            if (index > -1) {
                cardArray.splice(index, 1);
            }
        }
    }
})();