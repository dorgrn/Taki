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
                        card.activate = openTaki;
                        break;
                    case TYPES.CHANGE:
                        card.activate = changeColor;
                        break;
                    case TYPES.TAKE2:
                        card.activate = take2;
                        break;
                    case TYPES.STOP:
                        card.activate = stop;
                        break;
                    case TYPES.PLUS:
                        card.activate = plus;
                        break;
                    case TYPES.SUPER_TAKI:
                        card.activate = superTaki;
                        break;
                }

                function openTaki(player, card) {
                    var takiColor = manager.getPlayZoneTop();
                    var newCard = cardFactory.findCardInArray(this.hand.legalCards, undefined, takiColor);

                    while (newCard) {

                    }
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
            },

            // This function allows sending whichever of the params you'd like.
            // If you don't want to include a parameter in search just make it undefined.
            // like so findCardInArray(array, type, undefined, color);
            findCardInArray: function (array, type, color, value) {
                return array.find(function (card) {
                        return ((type ? card.type === type : true) && (color ? card.color === color : true) &&
                            (value ? card.value === value : true));
                    }
                );
            }
        };
    }
)();